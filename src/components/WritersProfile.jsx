import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, updateProfile, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { useNavigate, useParams } from 'react-router-dom';
import firebaseConfig from '../pages/firebaseConfig';
import { MdOutlineEdit, MdLogout } from "react-icons/md";
import { getFirestore, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
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
  const [role, setRole] = useState('Writer');
  const [totalReads, setTotalReads] = useState(0);
  const [newName, setNewName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('User logged in:', user.uid);
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
      console.error('Error fetching writer profile:', err);
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

  const handleUploadBook = () => {
    navigate('/admin');
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
      // Update the profile image if one is selected
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
            
            // Use setDoc to create or update the document
            await setDoc(writerDocRef, { name: newName, profilePic: downloadURL }, { merge: true });
            
            setProfilePic(downloadURL); // Update state with the new image URL
            console.log('Profile image uploaded successfully:', downloadURL); // Check URL
          }
        );
      } else {
        // If no new image is selected, use setDoc to update or create the document
        await setDoc(writerDocRef, { name: newName }, { merge: true });
      }
  
      setWriterName(newName);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating name:', error);
    }
  };
  
  

const handleUploadAudios = () => {
  navigate('/audio');
};


  const handleLogout = async () => {
    const auth = getAuth(app);
    await signOut(auth);
    navigate('/login'); // Redirect to login page after logout
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="flex flex-col md:flex-row">
      <aside className="w-full md:w-1/4 p-4 bg-[#f8f9fa] shadow-lg mb-4 md:mb-0">
        {profilePic ? (
          <img src={profilePic} alt="Profile" className="rounded-full h-32 w-32 object-cover mx-auto mb-4" />
        ) : (
          <img src={profilePic} alt="Default Profile" className="rounded-full h-32 w-32 mx-auto mb-4" />
        )}
        <h2 className="text-xl font-bold text-center flex items-center justify-center">
          {writerName}
          <MdOutlineEdit  
            onClick={() => setIsEditing(!isEditing)}
            className="inline cursor-pointer ml-2 text-gray-600 hover:text-gray-800"
          />
        </h2>
        {isEditing && (
          <div>
            <input 
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="mt-2 border border-gray-300 p-2 w-full rounded"
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
       
        <button
          onClick={handleUploadBook}
          className="mt-4 w-full border-gray-800 border text-gray-800 py-2 rounded hover:text-red-600 hover:border-red-600 transition"
        >
          Upload Books
        </button>
        <button
          onClick={handleUploadAudios}
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
      <main className="flex-grow p-6">
        <h1 className="text-4xl font-bold mb-6">Published Books</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="border-gray-800 border p-4 rounded-lg text-center">
            <p className="text-2xl font-bold">Total Books</p>
            <p className="text-4xl font-semibold text-red-600">{books.length}</p>
          </div>
          <div className="border-gray-800 border p-4 rounded-lg text-center">
            <p className="text-2xl font-bold">Total Reads</p>
            <p className="text-4xl font-semibold text-red-600">{totalReads}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          {books.map((book) => (
            <div key={book._id} className="border border-gray-300 rounded-lg p-4 hover:shadow-lg transition">
              <img src={book.coverImage} alt={book.title} className="w-full h-48 object-cover mb-1" />
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
