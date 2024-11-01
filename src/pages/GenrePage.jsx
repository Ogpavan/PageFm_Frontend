import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const GenrePage = () => {
  const { genre } = useParams();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/books`);
        setBooks(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching books:', error);
        setError('Failed to fetch books');
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    if (books.length > 0) {
      const filtered = books.filter((book) => book.primaryGenre === genre);
      setFilteredBooks(filtered);
    }
  }, [books, genre]);

  if (loading) return <div className="text-center text-gray-600 py-8">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="  py-16 px-8 md:px-20 lg:px-36">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{genre} Books</h1>
        <p className="text-gray-600 text-lg mt-2">Explore the best books in {genre} genre curated just for you.</p>
      </div>
      {filteredBooks.length === 0 ? (
        <div className="text-center text-gray-600 mt-8">
        
          <Link to="/" className="text-blue-500 underline">
            Browse all books
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredBooks.map((book) => (
             <div key={book._id} className="flex flex-col items-center space-y-2">
             <Link to={`/book/${book._id}`} className="text-gray-700">
               <img
                 src={book.coverImage || "https://via.placeholder.com/150"}
                 alt={book.title}
                 className="object-cover rounded w-full h-[200px] sm:h-[270px] transition-transform transform hover:scale-105"
               />
               <div className="mt-2 ">
                 <p className="text-sm sm:text-base font-bold">
                   {book.title.length > 16 ? `${book.title.substring(0, 16)}...` : book.title}
                 </p>
                 <p className="text-xs sm:text-sm text-gray-600 italic">
                   {book.description.length > 28 ? `${book.description.substring(0, 25)}...` : book.description}
                 </p>
                 <p className="text-xs sm:text-sm text-gray-700">
                   {book.reads > 0 ? `Reads: ${book.reads}` : "No Reads"}
                 </p>
               </div>
             </Link>
           </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenrePage;
