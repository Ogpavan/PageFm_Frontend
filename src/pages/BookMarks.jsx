import React from 'react';
import { Link } from 'react-router-dom';
import { useBookmarks } from '../context/BookmarkContext';
import { FaRegBookmark } from 'react-icons/fa';

const Bookmarks = () => {
  const { bookmarks, removeBookmark } = useBookmarks();

  // If bookmarks are still loading (i.e., empty), show a loading message or check if it's truly empty.
  if (bookmarks === null) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">Bookmarked Books</h2>
      <ul className="space-y-4">
        {bookmarks.length === 0 ? (
          <p>No bookmarks yet. Start adding your favorite books!</p>
        ) : (
          bookmarks.map((book) => (
            <li key={book._id} className="border-b pb-2 flex items-center md:flex-row flex-col space-x-4">
              <img
                src={book.coverImage || 'https://via.placeholder.com/150x225?text=No+Image'}
                alt={book.title}
                className="w-24 h-36 object-cover"
              />
              <div className="flex-1">
                <Link to={`/books/${book._id}`} className="text-xl text-blue-600 hover:underline">
                  {book.title}
                </Link>
                <p className="text-gray-700">{book.description || 'No description available.'}</p>
              </div>
              {/* Remove bookmark button */}
              <button
                onClick={() => removeBookmark(book._id)}
                className=" flex justify-center items-center gap-x-1 w-full md:w-auto bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
              >
                <FaRegBookmark /> Unmark
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Bookmarks;
