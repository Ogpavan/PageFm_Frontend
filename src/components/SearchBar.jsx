import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  // Fetch books from the API on component mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/books}`);
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  // Function to handle search query
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = books.filter((book) =>
      book.title.toLowerCase().includes(query)
    );
    setFilteredBooks(filtered);
  };

  // Function to handle book click
  const handleBookClick = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  return (
    <div className="relative  md:min-w-96 my-5 md:my-0   ">
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search for books..."
        className="shadow-lg rounded-full  p-2 text-black px-4 w-full outline-none"
      />

      {/* Dropdown for search results */}
      {searchQuery && (
        <ul className="absolute top-full left-0 right-0 mt-2 border rounded bg-white shadow-lg z-10">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <li
                key={book._id} // Use _id for MongoDB documents
                className="p-2 border-b hover:bg-gray-200 cursor-pointer"
                onClick={() => handleBookClick(book._id)} // Navigate to book detail page
              >
                {book.title}
              </li>
            ))
          ) : (
            <li className="p-2 text-center text-red-500">No books found.</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
