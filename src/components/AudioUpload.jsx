import React, { useEffect, useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getFirestore, collection, addDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { auth } from '../pages/firebaseConfig'; // Import the auth from your firebase.js
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import Modal from '../components/Modal';

const AudioUpload = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [books, setBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [audios, setAudios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('');
  const [selectedAudioId, setSelectedAudioId] = useState(''); // Track selected audio ID for deletion
  const [userId, setUserId] = useState(null); // State to store user ID

  useEffect(() => {
    // Get the current user
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // Set the user ID
      } else {
        setUserId(null); // No user is signed in
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      if (!userId) return; // Only fetch books if user is logged in
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/books?userId=${userId}`); // Fetch books for the user
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, [userId]);

  useEffect(() => {
    const fetchAudios = async () => {
      if (!userId) return; // Only fetch audios if user is logged in
      try {
        const db = getFirestore();
        const q = query(collection(db, 'audios'), where('userId', '==', userId)); // Fetch from new 'audios' collection
        const querySnapshot = await getDocs(q);
        const audiosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAudios(audiosList);
      } catch (error) {
        console.error('Error fetching audios:', error);
      }
    };

    fetchAudios();
  }, [userId]);

  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!audioFile || !title || !selectedBookId || !userId) {
      setModalTitle('Upload Error');
      setModalMessage('Please select a book, provide a title, and upload a file.');
      setModalType('error');
      setShowModal(true);
      return;
    }
  
    setUploading(true);
  
    try {
      const storage = getStorage();
      const audioRef = ref(storage, `audio/${selectedBookId}/${audioFile.name}`); // Define the file path in Firebase Storage
      
      // Upload the audio file
      await uploadBytes(audioRef, audioFile);
  
      // Get the URL of the uploaded file
      const audioUrl = await getDownloadURL(audioRef);
  
      // Save the metadata (audio URL, file name, book ID, etc.) to Firestore
      await saveAudioMetadata(selectedBookId, audioFile.name, audioUrl);
  
      // Update the UI with success message
      setModalTitle('Upload Successful');
      setModalMessage('Your audio has been uploaded successfully.');
      setModalType('success');
      setShowModal(true);
  
      // Clear the form after successful upload
      setAudioFile(null);
      setTitle('');
      setSelectedBookId('');
    } catch (error) {
      console.error('Error uploading file:', error);
      setModalTitle('Upload Error');
      setModalMessage('There was an error uploading the audio file. Please try again.');
      setModalType('error');
      setShowModal(true);
    } finally {
      setUploading(false); // Stop showing the uploading state
    }
  };
  

  const handleDelete = (audioId) => {
    setSelectedAudioId(audioId);
    setModalTitle('Confirm Delete');
    setModalMessage('Are you sure you want to delete this audio?');
    setModalType('confirmation');
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (modalType === 'confirmation' && selectedAudioId) {
      try {
        const db = getFirestore();
        const audioData = audios.find(audio => audio.id === selectedAudioId);
        const audioRef = ref(getStorage(), `audio/${audioData.bookId}/${audioData.audioName}`); // Get the reference to the audio file
        await deleteObject(audioRef); // Delete the audio file from Firebase Storage

        await deleteDoc(doc(db, 'audios', selectedAudioId)); // Delete the metadata from the new 'audios' collection

        setAudios(audios.filter(audio => audio.id !== selectedAudioId)); // Remove the audio from the UI

        setModalTitle('Delete Successful');
        setModalMessage('Audio and metadata deleted successfully.');
        setModalType('success');
      } catch (error) {
        setModalTitle('Delete Error');
        setModalMessage('Error deleting audio and metadata.');
        setModalType('error');
      }
    }
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const saveAudioMetadata = async (bookId, audioName, audioUrl) => {
    const db = getFirestore();
    try {
      // Save the metadata to the Firestore collection
      await addDoc(collection(db, 'audios'), {
        userId, // User ID of the current user
        audioName, // Name of the uploaded audio file
        bookId, // The ID of the book the audio is associated with
        audioUrl, // URL of the uploaded audio
        createdAt: new Date(), // Timestamp for when the audio was uploaded
      });
  
      // After saving metadata, refresh the list of audios
      const q = query(collection(db, 'audios'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const audiosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAudios(audiosList); // Update the UI with the latest audios
    } catch (error) {
      console.error('Error saving audio metadata:', error);
    }
  };

  const getBookTitleById = (bookId) => {
    const book = books.find((b) => b._id === bookId);
    return book ? book.title : 'Unknown Book'; // Fallback if the book is not found
  };

  return (
    <div className="flex justify-center items-center bg-white">
      <div className="flex md:flex-row flex-col justify-center gap-y-5 bg-white rounded-lg shadow-md p-8 w-full">
        <div className="md:w-1/3 justify-between gap-y-5 md:grid">
          <h3 className="text-3xl font-bold text-center p-5">Upload Audio</h3>

          <select
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
            value={selectedBookId}
            onChange={(e) => setSelectedBookId(e.target.value)}
          >
            <option value="">Select a Book</option>
            {books.map((book) => (
              <option key={book._id} value={book._id}>
                {book.title}
              </option>
            ))}
          </select>

          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
          />

          <input
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button
            className="mb-5 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-lg px-5 py-3 w-full hover:from-blue-600 hover:to-blue-800 focus:ring-2 focus:ring-blue-500"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>

        <div className="md:w-1/2">
          <div className="">
            <h3 className="text-2xl font-bold text-center mb-4">Manage Audios</h3>
            <ul className="space-y-4">
              {audios.map((audio) => (
                <li key={audio.id} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow">
                  <div>
                  <span className="font-bold">{audio.audioName}</span> - <span>{getBookTitleById(audio.bookId)}</span>
                  {/* Audio player */}
                    <audio controls className="block mt-2">
                      <source src={audio.audioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                  <button
                    onClick={() => handleDelete(audio.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Modal
        show={showModal}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
      />
    </div>
  );
};

export default AudioUpload;
