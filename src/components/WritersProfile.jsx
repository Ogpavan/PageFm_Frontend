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
    <div className="md:px-20 py-5   min-h-screen">
     

      <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-10">
        <div className="flex items-center">
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="rounded-full h-20 w-20 object-cover mr-4" />
          ) : (
            <div className="rounded-full h-20 w-20 bg-gray-200 mr-4"></div>
          )}
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              {writerName}
              <MdOutlineEdit  
                onClick={() => setIsEditing(!isEditing)}
                className="inline cursor-pointer ml-2 text-gray-600 hover:text-gray-800 transition"
              />
            </h2>
            {isEditing && (
              <div className="mt-2">
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
                  className="mt-2 bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600 transition"
                >
                  Update Profile
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex space-x-4">
        <button onClick={()=>navigate('/book-content')} type="button" className=" py-2 px-4 flex justify-center items-center border  border-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 hover:text-white text-red-700 w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
    <svg width="20" height="20" fill="currentColor" className="mr-2" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
        <path d="M1344 1472q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm256 0q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm128-224v320q0 40-28 68t-68 28h-1472q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h427q21 56 70.5 92t110.5 36h256q61 0 110.5-36t70.5-92h427q40 0 68 28t28 68zm-325-648q-17 40-59 40h-256v448q0 26-19 45t-45 19h-256q-26 0-45-19t-19-45v-448h-256q-42 0-59-40-17-39 14-69l448-448q18-19 45-19t45 19l448 448q31 30 14 69z">
        </path>
    </svg>
   <span className='text-nowrap'> Upload Book</span>
</button>
<button onClick={()=>navigate('/audio')} type="button" className=" py-2 px-4 flex justify-center items-center border border-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 hover:text-white text-blue-600 w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
    <svg width="20" height="20" fill="currentColor" className="mr-2" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
        <path d="M1344 1472q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm256 0q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm128-224v320q0 40-28 68t-68 28h-1472q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h427q21 56 70.5 92t110.5 36h256q61 0 110.5-36t70.5-92h427q40 0 68 28t28 68zm-325-648q-17 40-59 40h-256v448q0 26-19 45t-45 19h-256q-26 0-45-19t-19-45v-448h-256q-42 0-59-40-17-39 14-69l448-448q18-19 45-19t45 19l448 448q31 30 14 69z">
        </path>
    </svg>
   <span className='text-nowrap'> Upload Audio</span>
</button>
<button onClick={()=>navigate('/book-content')} type="button" className=" py-2 px-4 flex justify-center items-center  bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
  
  
            <MdLogout className="mr-1" /> Logout
          </button>
        </div>
      </div>
   
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-red-400 via-red-500 to-red-600 p-4 rounded-lg text-center shadow-lg text-white">
            <p className="text-4xl font-semibold">{books.length}</p>
            <p className="text-lg">Total Books</p>
          </div>
          <div className="bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500 p-4 rounded-lg text-center shadow-lg text-white">
            <p className="text-4xl font-semibold">{totalReads}</p>
            <p className="text-lg">Total Reads</p>
          </div>
        </div>

        <table className="w-full  bg-white   rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-4 border-b">S/N</th>
              <th className="p-4 border-b">Book Name</th>
              <th className="p-4 border-b">Total Reads</th>
              <th className="p-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr key={book._id} className="text-center">
                <td className="p-4 border-b">{index + 1}</td>
                <td className="p-4 border-b">{book.title}</td>
                <td className="p-4 border-b">{book.reads}</td>
                <td className="p-4 border-b space-x-2">
                  <button
                    onClick={() => handleViewBook(book._id)}
                    className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteBook(book._id)}
                    className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WriterProfile;
