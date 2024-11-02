import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth } from '../pages/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const BookDetailsPage = () => {
  const [uid, setUid] = useState(null);
  const [bookDetails, setBookDetails] = useState({
    title: '',
    description: '',
    coverImage: '',
    primaryGenre: '',
    genres: [],
    author: '',
  });
  const [customGenre, setCustomGenre] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [books, setBooks] = useState([]); // State for existing books
  const [selectedBookId, setSelectedBookId] = useState(''); // State for selected book
  const [episodeTitle, setEpisodeTitle] = useState(''); // State for episode title
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { content } = location.state || { content: '' };

  const predefinedGenres = [
    'Fiction', 'Non-fiction', 'Fantasy', 'Science Fiction', 
    'Mystery', 'Romance', 'Thriller', 'Biography'
  ];

  // Check authentication state and set user ID
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User authenticated: ", user.uid);
        setUid(user.uid);
      } else {
        console.log("No user authenticated");
        setUid(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch books when user ID is available
  useEffect(() => {
    if (uid) {
      console.log("User ID for fetching books:", uid);  // This should log the user ID
      fetchBooks();
    }
  }, [uid]);
  
  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/books/existingbooks`, {
        params: { userId: uid },
      });
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books', error.response?.data || error.message);
    }
  };
  
  
  
  // Redirect if content is not provided
  if (!content) {
    console.warn("No content found. Redirecting to /book-content");
    navigate('/book-content');
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) handleImageUpload(file);
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      console.log("Uploading image...");
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setBookDetails((prev) => ({ ...prev, coverImage: response.data.url }));
      console.log("Image uploaded successfully:", response.data.url);
    } catch (error) {
      console.error('Image upload failed', error);
      alert('Image upload failed. Please try again.');
    }
  };

  const handleGenreToggle = (genre) => {
    setBookDetails((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  const handleAddCustomGenre = () => {
    if (customGenre && !bookDetails.genres.includes(customGenre)) {
      setBookDetails((prev) => ({
        ...prev,
        genres: [...prev.genres, customGenre],
      }));
      setCustomGenre('');
      console.log("Custom genre added:", customGenre);
    }
  };

  const handleSubmit = () => {
    const { title, description, coverImage, primaryGenre, genres, author } = bookDetails;
   
    if (selectedBookId) {
      // If an existing book is selected, check for episode title
      if (episodeTitle ) { // Ensure title is included
        handleConfirmPublish();
      } else {
        alert('Please enter a title for the episode.');
      }
    } else {
      // For new book submission, check all fields
      if (title && description && coverImage && primaryGenre && genres.length && author) {
        handleConfirmPublish();
      } else {
        alert('Please fill all fields.');
      }
    }
  };

  const handleConfirmPublish = async () => {
    setIsPublishing(true);

    if (!uid) {
      alert('User not authenticated. Please log in.');
      return;
    }

    const payload = {
      ...bookDetails,
      uid,
      content, // Include content in the payload
      title: episodeTitle || bookDetails.title, // Add the episode title here
  };

    if (selectedBookId) {
      payload.bookId = selectedBookId; // Set the selected book ID for episode upload
     
    }

    console.log('Payload being sent:', payload); // Debugging payload being sent

    try {
      const response = selectedBookId 
        ? await axios.post(`${import.meta.env.VITE_BASE_URL}/api/books/${selectedBookId}/episodes`, payload) 
        : await axios.post(`${import.meta.env.VITE_BASE_URL}/api/books`, payload); // API call for book or episode

      console.log('Response:', response); // Debugging response
      if (response.status === 201) {
        console.log("Published successfully:", response.data);
        setEpisodeTitle(''); // Clear episode title after publishing
        navigate('/'); // Redirect after successful publish
      } else {
        alert('Failed to publish the book or episode.');
      }
    } catch (error) {
      console.error('Error publishing', error);
      alert(`Failed to publish the book or episode: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="p-8 lg:flex flex-col lg:flex-row justify-center items-start bg-gray-100 min-h-screen">
      <div className="flex flex-col w-full lg:w-3/4 p-6 bg-white rounded-lg shadow-md border border-gray-200">
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
          <div className="flex flex-col lg:flex-row justify-between gap-x-6">
          

            <div className="lg:w-2/3 space-y-4">
              {selectedBookId ? (
                <>
               <input
    type="text"
    placeholder="Episode Title"
    value={episodeTitle}
    onChange={(e) => setEpisodeTitle(e.target.value)}
    className="border p-3 rounded-md w-full"
/>

                </>
              ) : (
                <>
                    <label className="block text-lg font-semibold">Cover Image</label>
            <div className="lg:w-1/3">
              <div
                onClick={() => fileInputRef.current.click()}
                className="border-dashed border-2 p-6 text-center cursor-pointer h-64 flex flex-col justify-center items-center rounded-lg"
              >
                <p>Upload cover image here (less than 100 kb)</p>
                {bookDetails.coverImage && <img src={bookDetails.coverImage} alt="Cover" className="mt-4 h-32 mx-auto rounded-lg object-cover" />}
                <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileSelect} />
              </div>
            </div>
                  <input
                    type="text"
                    placeholder="Book Title"
                    value={bookDetails.title}
                    onChange={(e) => setBookDetails({ ...bookDetails, title: e.target.value })}
                    className="border p-3 rounded-md w-full"
                  />
                  <input
                    type="text"
                    placeholder="Author"
                    value={bookDetails.author}
                    onChange={(e) => setBookDetails({ ...bookDetails, author: e.target.value })}
                    className="border p-3 rounded-md w-full"
                  />
                  <textarea
                    placeholder="Description"
                    value={bookDetails.description}
                    onChange={(e) => setBookDetails({ ...bookDetails, description: e.target.value })}
                    className="border p-3 rounded-md w-full"
                  />
                  <select
                    value={bookDetails.primaryGenre}
                    onChange={(e) => setBookDetails({ ...bookDetails, primaryGenre: e.target.value })}
                    className="border p-3 rounded-md w-full"
                  >
                    <option value="">Select Primary Genre</option>
                    {predefinedGenres.map((genre) => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>

                  <div>
                    <label className="block font-semibold">Select Genres</label>
                    {predefinedGenres.map((genre) => (
                      <div key={genre} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={bookDetails.genres.includes(genre)}
                          onChange={() => handleGenreToggle(genre)}
                        />
                        <span className="ml-2">{genre}</span>
                      </div>
                    ))}
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={customGenre}
                        onChange={(e) => setCustomGenre(e.target.value)}
                        placeholder="Add custom genre"
                        className="border p-2 rounded-md w-full"
                      />
                      <button type="button" onClick={handleAddCustomGenre} className="ml-2 bg-blue-500 text-white p-2 rounded-md">Add</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isPublishing}
            className="w-full bg-green-600 text-white p-3 rounded-md"
          >
            {isPublishing ? 'Publishing...' : 'Publish'}
          </button>
        </form>
      </div>

      <div className="lg:w-1/4 lg:ml-6 mt-6 lg:mt-0">
        <h2 className="text-lg font-semibold mb-4">Existing Books</h2>
        <ul className="bg-white rounded-lg shadow-md border border-gray-200">
          {books.map((book) => (
            <li
              key={book._id}
              className="p-4 border-b cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setSelectedBookId(book._id);
                setBookDetails({ // Reset book details for episode
                  title: '',
                  description: '',
                  coverImage: '',
                  primaryGenre: '',
                  genres: [],
                  author: '',
                });
                setEpisodeTitle(''); // Clear episode title
              }}
            >
              {book.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BookDetailsPage;
