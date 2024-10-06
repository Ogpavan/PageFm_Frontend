import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const GenrePage = () => {
  const { genre } = useParams(); // Get the genre from the URL params
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]); // To store filtered books
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/books`); // Fetch all books
        setBooks(response.data); // Assuming the response returns an array of books
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
    // Filter books based on the selected genre whenever books are fetched or genre changes
    if (books.length > 0) {
      const filtered = books.filter(book => book.primaryGenre === genre);
      setFilteredBooks(filtered);
    }
  }, [books, genre]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{genre} Books</h1>
      {filteredBooks.length === 0 ? (
        <p>No books found for this genre.
             <Link to="/"> <span className='text-blue-500'>Browse all books</span></Link>
      
        </p>
       ) : (
        <div className="flex flex-wrap gap-6">
          {filteredBooks.map((book) => (
              <div
              key={book._id}
              className="flex-shrink-0    flex flex-col space-y-4    rounded"
            >
                          <Link to={`/books/${book._id}`} className="text-gray-700">
            <img
              src={book.coverImage || "https://via.placeholder.com/150"}
              alt={book.title}
              className="  object-cover rounded w-[180px] h-[270px]"
            />
            <div className="grid pb-3 pt-1">
              <p className="pb-1 text-md font-bold">
                {book.title.length > 20 ? `${book.title.substring(0, 20)}...` : book.title}
              </p>
              <p className="text-gray-600 pb-1 text-xs italic">
                {book.description.length > 28 ? `${book.description.substring(0, 28)}...` : book.description}
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
