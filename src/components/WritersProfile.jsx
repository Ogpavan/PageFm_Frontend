import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, updateProfile, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { useNavigate, useParams } from 'react-router-dom';
import firebaseConfig from '../pages/firebaseConfig';
import { MdOutlineEdit, MdLogout } from "react-icons/md";
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const WriterProfile = () => {
  const { id } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [writerName, setWriterName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [totalReads, setTotalReads] = useState(0);
  const [newName, setNewName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setWriterName(user.displayName);
        setNewName(user.displayName);
        await fetchWriterProfile(user.uid);
        await fetchWriterBooks(user.uid);
      } else {
        setError('User not logged in');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [id]);

  const fetchWriterProfile = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'writers', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setWriterName(userData.name);
        setProfilePic(userData.profilePic);
      }
    } catch (err) {
      setError('Failed to load writer profile');
    }
  };

  const fetchWriterBooks = async (userId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/writers/${userId}/books`);
      const data = await response.json();
      if (response.ok) {
        setBooks(data);
        const total = data.reduce((sum, book) => sum + book.reads, 0);
        setTotalReads(total);
      } else {
        setError('Failed to load books');
      }
    } catch (err) {
      setError('An error occurred while fetching books');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/books/${bookId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setBooks(books.filter((book) => book._id !== bookId));
      } else {
        console.error('Failed to delete the book');
      }
    } catch (err) {
      console.error('Error deleting the book:', err);
    }
  };

  const handleViewBook = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  const handleProfileImageChange = (e) => {
    if (e.target.files[0]) {
      setProfileImageFile(e.target.files[0]);
    }
  };

  const handleChangeName = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) return;
  
    const writerId = user.uid;
    const writerDocRef = doc(db, 'writers', writerId);
  
    try {
      if (profileImageFile) {
        const storageRef = ref(storage, `profileImages/${writerId}`);
        const uploadTask = uploadBytesResumable(storageRef, profileImageFile);
  
        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            console.error('Error uploading image:', error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await setDoc(writerDocRef, { name: newName, profilePic: downloadURL }, { merge: true });
            setProfilePic(downloadURL);
          }
        );
      } else {
        await setDoc(writerDocRef, { name: newName }, { merge: true });
      }
  
      setWriterName(newName);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating name:', error);
    }
  };

  const handleLogout = async () => {
    const auth = getAuth(app);
    await signOut(auth);
    navigate('/login');
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
      <aside className="w-full md:w-1/4 p-6 bg-white shadow-lg rounded-lg mb-4 md:mb-0">
        <div className="flex flex-col items-center">
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="rounded-full h-32 w-32 object-cover mb-4 border-2 border-gray-300" />
          ) : (
            <div className="rounded-full h-32 w-32 bg-gray-200 mb-4"></div>
          )}
          <h2 className="text-xl font-bold text-center flex items-center justify-center">
            {writerName}
            <MdOutlineEdit  
              onClick={() => setIsEditing(!isEditing)}
              className="inline cursor-pointer ml-2 text-gray-600 hover:text-gray-800 transition"
            />
          </h2>
          {isEditing && (
            <div className="mt-4 w-full">
              <input 
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded"
                placeholder="Change your name"
              />
              <input 
                type="file"
                onChange={handleProfileImageChange}
                className="mt-2 w-full"
              />
              <button
                onClick={handleChangeName}
                className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
              >
                Update Profile
              </button>
            </div>
          )}
        </div>
        
        <button
          onClick={() => navigate('/book-content')}
          className="mt-4 w-full border-gray-800 border text-gray-800 py-2 rounded hover:text-red-600 hover:border-red-600 transition"
        >
          Upload Books
        </button>
        
        <button
          onClick={() => navigate('/audio')}
          className="mt-4 w-full border-gray-800 border text-gray-800 py-2 rounded hover:text-red-600 hover:border-red-600 transition"
        >
          Upload Audios
        </button>
        
        <button
          onClick={handleLogout}
          className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
        >
          <MdLogout className="inline mr-1" /> Logout
        </button>
      </aside>

      <main className="flex-grow p-6  shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold mb-6">Published Books</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
  <div className="bg-gradient-to-br from-red-400 via-red-500 to-red-600 p-4 rounded-lg text-center shadow-lg relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-white opacity-25 rounded-lg animate-pulse"></div>
    <p className="text-4xl font-semibold text-white relative z-10 mb-3">{books.length}</p>
    <p className="text-2xl text-white font-bold relative z-10">Total Books</p>
  </div>
  <div className="bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500 p-4 rounded-lg text-center shadow-lg relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-white opacity-25 rounded-lg animate-pulse"></div>
    <p className="text-4xl font-semibold text-white relative z-10 mb-3">{totalReads}</p>
    <p className="text-2xl text-white font-bold relative z-10">Total Reads</p>
  </div>
</div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
            <div key={book._id} className="border border-gray-300 rounded-lg p-4 hover:shadow-lg transition bg-white">
              <img src={book.coverImage} alt={book.title} className="w-full h-48 object-cover mb-1 rounded" />
              <h2 className="text-lg font-bold">{book.title}</h2>
              <button
                onClick={() => handleViewBook(book._id)}
                className="mt-2 w-full text-blue-500 border border-blue-500 py-2 rounded hover:border-blue-600 transition"
              >
                View Book
              </button>
              <button
                onClick={() => handleDeleteBook(book._id)}
                className="mt-2 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
              >
                Delete Book
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default WriterProfile;
