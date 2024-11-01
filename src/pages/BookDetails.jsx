import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBookmarks } from '../context/BookmarkContext';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import BookAudioList from '../pages/BookAudioList';
import axios from 'axios';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/books/${id}`);
        setBook(response.data);
        setEpisodes(response.data.episodes || []);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
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
    <div className="container mx-auto p-6 bg-white shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-lg max-w-4xl border border-gray-200">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="h-72 w-52 flex justify-center">
          <img
            src={book.coverImage || 'https://via.placeholder.com/150'}
            alt={book.title}
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">{book.title}</h1>
            <button
              onClick={handleBookmark}
              aria-label={isBookmarked(book._id) ? 'Remove Bookmark' : 'Add Bookmark'}
              className={`py-2 px-4 border rounded-full flex items-center gap-2 transition-colors duration-300 ${
                isBookmarked(book._id) ? 'bg-yellow-500 text-white' : 'bg-white text-gray-900 border-gray-300'
              }`}
            >
              {isBookmarked(book._id) ? <FaBookmark /> : <FaRegBookmark />}
            </button>
          </div>

          <p className="text-lg font-medium text-gray-500 my-4">
            By{' '}
            <Link to={`/writer/${book.user}`} className="text-blue-600 hover:underline">
              {book.author}
            </Link>
          </p>

          <div className="flex flex-wrap space-x-2 my-4">
            {book.genres.map((genre, index) => (
              <span
                key={index}
                className="px-3 py-1 border border-gray-700 text-gray-600  rounded-full text-sm font-medium"
              >
                {genre}
              </span>
            ))}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow-inner mt-8">
            <BookAudioList bookId={book._id} />
          </div>
        </div>
      </div>

      <div className="text-center text-lg italic text-gray-700 my-8 w-full">
        "{book.description}"
      </div>

      {/* Episodes Section */}
      {episodes.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Chapters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {episodes.map((episode) => (
              <Link
                to={`/books/${book._id}/episodes/${episode._id}`}
                key={episode._id}
                className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 hover:border-gray-400"
              >
                <div className=" font-medium flex flex-col">
                  <span>
                   Chapter {episode.episodeNumber}
                   </span>
                   <span className='text-sm text-gray-500'>{episode.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetails;
