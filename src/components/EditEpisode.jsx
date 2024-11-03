import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CiEdit } from 'react-icons/ci';

export default function EditEpisode() {
  const { bookId } = useParams(); // Use useParams to get the bookId from the URL
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/books/${bookId}`);
        setBook(response.data);
      } catch (error) {
        console.error('Error fetching book:', error);
      } finally {
        setLoading(false);
      }
    };

    if (bookId) fetchBook();
  }, [bookId]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (!book) return <p className="text-center text-red-500">Book not found.</p>;

  return (
    <div className="container max-w-xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{book.title}</h2>
      
      <div className="bg-white shadow-md rounded-lg p-4">
        <h4 className="text-xl font-semibold text-gray-700 mb-4">Episodes:</h4>
        <ul className="space-y-3">
          {book.episodes.map((episode) => (
            <li key={episode._id} className="flex justify-between items-center p-3 bg-gray-100 rounded-md">
              <span className="text-gray-800 font-medium">{episode.title}</span>
              <Link to={`/books/${book._id}/episodes/${episode._id}/edit`}>
               
        <button className="text-black text-2xl">
        <CiEdit />
        </button>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
