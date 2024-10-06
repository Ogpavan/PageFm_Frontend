import React, { useState, useRef, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import Modal from '../components/Modal'; // Import the Modal

const AdminPanel = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [content, setContent] = useState('');
  const [primaryGenre, setPrimaryGenre] = useState('');
  const [genres, setGenres] = useState([]);
  const [author, setAuthor] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [uid, setUid] = useState(''); // State to store UID
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Handle user authentication and store UID
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userUid = user.uid;
        setUid(userUid); // Store the UID in state
      } else {
        console.log("No user is signed in.");
      }
    });
    return () => unsubscribe();
  }, []);

  // Image upload function
  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCoverImage(response.data.url);
    } catch (error) {
      console.error('Image upload failed', error);
    }
  };

  // Handle file selection for cover image
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  // Toggle genre selection
  const handleGenreToggle = (genre) => {
    setGenres((prevGenres) =>
      prevGenres.includes(genre)
        ? prevGenres.filter(g => g !== genre)
        : [...prevGenres, genre]
    );
  };

  // Handle form submission
  const handleSubmit = () => {
    if (title && description && coverImage && content && primaryGenre && genres.length > 0 && author) {
      setModalMessage('Do you want to publish this book?');
      setShowModal(true);
    } else {
      setModalMessage('Please fill all fields.');
      setShowModal(true);
    }
  };

  // Confirm publishing the book
  const handleConfirmPublish = async () => {
    setShowModal(false);
    setIsPublishing(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, coverImage, content, primaryGenre, genres, author, uid }),
      });

      if (response.ok) {
        navigate('/'); // Navigate to the home page after publishing
      } else {
        alert('Failed to publish the book.');
      }
    } catch (error) {
      console.error('Error publishing book', error);
      alert('Failed to publish the book.');
    } finally {
      setIsPublishing(false);
    }
  };

  const closeModal = () => setShowModal(false);

  return (
    <div className="p-8 lg:flex flex-col lg:flex-row justify-center items-start bg-gray-100 min-h-screen">
      <div className="flex flex-col w-full lg:w-3/4 p-6 bg-white rounded-lg shadow-md border border-gray-200">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-red-600">Publish a New Book</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
          <div className="flex flex-col lg:flex-row justify-between gap-x-6">
            <div className="lg:w-1/3">
              <label htmlFor="coverImage" className="block text-lg font-semibold text-gray-700">Cover Image</label>
              <div
                onDrop={(e) => {
                  e.preventDefault();
                  handleImageUpload(e.dataTransfer.files[0]);
                }}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current.click()}
                className="border-dashed border-2 p-6 text-center cursor-pointer h-64 flex flex-col justify-center items-center   rounded-lg"
              >
                <p className="text-gray-600">Drag and drop an image, or click to select</p>
                {coverImage && (
                  <img src={coverImage} alt="Cover" className="mt-4 h-32 mx-auto rounded-lg object-cover" />
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </div>
            </div>

            <div className="lg:w-2/3 space-y-4">
              <div>
                <label htmlFor="title" className="block text-lg font-semibold text-gray-700">Book Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border border-gray-300 rounded-md p-3 w-full focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                  placeholder="e.g. 'The Great Gatsby'"
                />
              </div>
              <div>
                <label htmlFor="author" className="block text-lg font-semibold text-gray-700">Author</label>
                <input
                  type="text"
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="border border-gray-300 rounded-md p-3 w-full focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                  placeholder="e.g. 'F. Scott Fitzgerald'"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-lg font-semibold text-gray-700">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border border-gray-300 rounded-md p-3 w-full focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                  placeholder="A short summary of the book"
                />
              </div>
              <div>
                <label htmlFor="primaryGenre" className="block text-lg font-semibold text-gray-700">Primary Genre</label>
                <select
                  id="primaryGenre"
                  value={primaryGenre}
                  onChange={(e) => setPrimaryGenre(e.target.value)}
                  className="border border-gray-300 rounded-md p-3 w-full focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                >
                  <option value="">Select Primary Genre</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Science">Science</option>
                </select>
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-700">Select Genres</label>
                <div className="flex flex-wrap gap-3">
                  {['Fiction', 'Non-Fiction', 'Fantasy', 'Science'].map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => handleGenreToggle(genre)}
                      className={`px-4 py-2 rounded-md ${genres.includes(genre) ? 'bg-indigo-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-indigo-100'}`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="content" className="block text-lg font-semibold text-center text-gray-700">Book Content</label>
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={AdminPanel.modules}
              formats={AdminPanel.formats}
              className="h-60 rounded-md border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div className="mt-6 flex justify-end">

            <button type="submit" className="p-2 mt-10 bg-red-500 text-white rounded hover:bg-red-600 transition-colors" disabled={isPublishing}>
              {isPublishing ? 'Publishing...' : 'Publish Your Book'}
            </button>
          </div>
        </form>
      </div>

      {/* Modal Component */}
      <Modal
        show={showModal}
        onClose={closeModal}
        title="Confirmation"
        message={modalMessage}
        onConfirm={handleConfirmPublish}
      />
    </div>
  );
};

// Quill editor modules and formats
AdminPanel.modules = {
  toolbar: [
    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['bold', 'italic', 'underline'],
    ['link'],
    [{ 'align': [] }],
    ['clean']
  ],
};

AdminPanel.formats = [
  'header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline', 'link', 'align'
];

export default AdminPanel;
