import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBookmarks } from '../context/BookmarkContext';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import BookAudioList from '../pages/BookAudioList';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/books/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch book details');
        }
        const data = await response.json();
        setBook(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const isBookmarked = (bookId) => bookmarks.some((bookmark) => bookmark._id === bookId);

  const handleBookmark = () => {
    if (isBookmarked(book._id)) {
      removeBookmark(book._id);
    } else {
      addBookmark(book);
    }
  };

  if (loading) {
    return <div className="text-center text-xl font-semibold">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-xl font-semibold">Error: {error}</div>;
  }

  if (!book) {
    return <div className="text-center text-xl font-semibold">Book not found</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg max-w-4xl">
      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Book Cover */}
        <div className="h-72 w-48 flex justify-center">
          <img
            src={book.coverImage || 'https://via.placeholder.com/150'}
            alt={book.title}
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Right: Book Info */}
        <div className="flex-1">
          {/* Title and Bookmark Icon */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">{book.title}</h1>
            <button
              onClick={handleBookmark}
              aria-label={isBookmarked(book._id) ? 'Remove Bookmark' : 'Add Bookmark'}
              className={`py-2 px-4 border rounded-full flex items-center gap-2 transition-colors duration-300 ${
                isBookmarked(book._id) ? 'bg-yellow-500 text-white' : 'bg-white text-gray-900'
              }`}
            >
              {isBookmarked(book._id) ? <FaBookmark /> : <FaRegBookmark />}
            </button>
          </div>

          {/* Description */}
          <div className="text-lg italic text-gray-700 mb-6">"{book.description}"</div>

          {/* Author */}
          <p className="text-lg font-medium text-gray-600 mb-4">
            By{' '}
            <Link to={`/writer/${book.user}`} className="text-blue-600 hover:underline">
              {book.author}
            </Link>
          </p>

          {/* Genres */}
          <div className="flex flex-wrap space-x-2 mb-4">
            {book.genres.map((genre, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Audio Section */}
          <div className="bg-gray-50  rounded-lg shadow-inner mb-4">
  
            <div className="h-24 overflow-y-auto">
              <BookAudioList bookId={book._id} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Book Content */}
      <div className="prose max-w-none text-gray-800 leading-relaxed mt-6">
        <h2 className="text-2xl font-semibold mb-4">Read </h2>
        <div dangerouslySetInnerHTML={{ __html: book.content }} />
      </div>
    </div>
  );
};

export default BookDetails;
