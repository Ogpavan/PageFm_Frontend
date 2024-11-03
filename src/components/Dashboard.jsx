import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, updateProfile, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { Link, useNavigate, useParams } from 'react-router-dom';
import firebaseConfig from '../pages/firebaseConfig';
import { MdOutlineEdit, MdLogout } from "react-icons/md";
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Modal from './Modal';
import Loader from './Loader';





const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const Dashboard = () => {
  const { id } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [writerName, setWriterName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [totalReads, setTotalReads] = useState(0);
  const [newName, setNewName] = useState('');

  const [aboutAuthor, setAboutAuthor] = useState(''); // New state for About Author
  const [socialHandles, setSocialHandles] = useState({ twitter: '', linkedin: '' }); // New state for Social Handles
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
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
        setAboutAuthor(userData.aboutAuthor || ''); // Load About Author
        setSocialHandles(userData.socialHandles || {}); // Load Social Handles
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

  
  const openDeleteModal = (bookId) => {
    setSelectedBookId(bookId);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBookId) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/books/${selectedBookId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setBooks(books.filter((book) => book._id !== selectedBookId));
      } else {
        console.error('Failed to delete the book');
      }
    } catch (err) {
      console.error('Error deleting the book:', err);
    } finally {
      setShowModal(false);
    }
  };



  const handleViewBook = (bookId) => {
    navigate(`/book/${bookId}`);
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

 

  if (loading) return <Loader />;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="md:px-20 py-5   min-h-screen ">
     

      <div className="bg-white shadow rounded-lg p-3 md:p-6">
      <div className="flex flex-col md:flew-row justify-between gap-y-4 md:flex-row-reverse">
  {/* Left Side: Buttons */}
  <div className="space-y-4">
    <button
      onClick={() => navigate('/book-content')}
      type="button"
      className="py-2 px-4 flex justify-center items-center border border-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 hover:text-white text-red-700 w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
    >
      <svg
        width="20"
        height="20"
        fill="currentColor"
        className="mr-2"
        viewBox="0 0 1792 1792"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M1344 1472q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm256 0q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm128-224v320q0 40-28 68t-68 28h-1472q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h427q21 56 70.5 92t110.5 36h256q61 0 110.5-36t70.5-92h427q40 0 68 28t28 68zm-325-648q-17 40-59 40h-256v448q0 26-19 45t-45 19h-256q-26 0-45-19t-19-45v-448h-256q-42 0-59-40-17-39 14-69l448-448q18-19 45-19t45 19l448 448q31 30 14 69z" />
      </svg>
      <span className='text-nowrap'>Upload Book/Chapters</span>
    </button>
    <button
      onClick={() => navigate('/audio')}
      type="button"
      className="py-2 px-4 flex justify-center items-center border border-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 hover:text-white text-blue-600 w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
    >
      <svg
        width="20"
        height="20"
        fill="currentColor"
        className="mr-2"
        viewBox="0 0 1792 1792"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M1344 1472q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm256 0q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm128-224v320q0 40-28 68t-68 28h-1472q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h427q21 56 70.5 92t110.5 36h256q61 0 110.5-36t70.5-92h427q40 0 68 28t28 68zm-325-648q-17 40-59 40h-256v448q0 26-19 45t-45 19h-256q-26 0-45-19t-19-45v-448h-256q-42 0-59-40-17-39 14-69l448-448q18-19 45-19t45 19l448 448q31 30 14 69z" />
      </svg>
      <span className='text-nowrap'>Upload Audio</span>
    </button>
 
  </div>

  {/* Right Side: Total Books and Total Reads */}
  <div className="flex  space-x-4">
    <div className="bg-gradient-to-br from-red-400 via-red-500 to-red-600 p-4 rounded-lg text-center shadow-lg text-white">
      <p className="text-4xl font-semibold">{books.length}</p>
      <p className="text-lg">Total Books</p>
    </div>
    <div className="bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500 p-4 rounded-lg text-center shadow-lg text-white">
      <p className="text-4xl font-semibold">{totalReads}</p>
      <p className="text-lg">Total Reads</p>
    </div>
  </div>
</div>

   
     

        <table className="w-full  bg-white   rounded-lg overflow-hidden mt-10">
          <thead className="bg-gray-200">
            <tr>
              
              <th className="p-4 border-b">Book Name</th>
              <th className="p-4 border-b">Total Reads</th>
              <th className="p-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
          {books.map((book, index) => (
  <tr key={book._id} className="text-center">
   
    <td className="p-4 border-b text-blue-600 cursor-pointer" onClick={() => handleViewBook(book._id)}>{book.title}</td>
    <td className="p-4 border-b">{book.reads}</td>
    <td className="p-4 border-b md:space-x-5 space-x-2">
      {/* Replace this with a valid episode ID */}
      <Link to={`/edit-episodes/${book._id}`}>
 
        <button className="text-black text-2xl">
        <CiEdit />
        </button>
      </Link>
      <button
                  onClick={() => openDeleteModal(book._id)}
                  className="text-red-500 text-2xl"
                >
                  <MdDelete />
                </button>
    </td>
  </tr>
))}

          </tbody>
        </table>
        <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this book? This action cannot be undone."
      />
    
      </div>
    </div>
  );
};

export default Dashboard;
