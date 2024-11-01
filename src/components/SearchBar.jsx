import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const navigate = useNavigate();

  // Fetch all books on component mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/books`);
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  // Filter books based on the search query
  useEffect(() => {
    if (query) {
      const filtered = books.filter((book) =>
        book.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks([]);
    }
  }, [query, books]);

  // Handle book selection
  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
    setQuery(''); // Clear the search input after selecting a book
  };

  return (
    <div className="relative w-full md:max-w-lg mx-auto">
      <input
        type="text"
        placeholder="Search for a book..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 border border-gray-400 rounded-full outline-none "
      />
      {filteredBooks.length > 0 && (
        <div className="absolute left-0 right-0 z-10 mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto md:max-h-80">
          {filteredBooks.map((book) => (
            <div
              key={book._id}
              onClick={() => handleBookClick(book._id)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              {book.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
