import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import Modal from "../components/Modal";

const Home = () => {
  const [booksByPrimaryGenre, setBooksByPrimaryGenre] = useState({});
  const [topReads, setTopReads] = useState([]); // New state for top reads
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Fetch all books grouped by primary genre
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/books`);
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        const data = await response.json();

        // Group books by primary genre
        const groupedBooks = data.reduce((acc, book) => {
          const genre = book.primaryGenre; // Use primary genre
          if (!acc[genre]) {
            acc[genre] = [];
          }
          acc[genre].push(book);
          return acc;
        }, {});

        setBooksByPrimaryGenre(groupedBooks);

        // Fetch top reads
        const topReadsResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/api/top-reads`);
        if (!topReadsResponse.ok) {
          throw new Error("Failed to fetch top reads");
        }
        const topReadsData = await topReadsResponse.json();
        setTopReads(topReadsData);
      } catch (error) {
        setError(error.message);
        setIsModalOpen(true); // Open modal on error
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Error"
      >
        <p>{error}</p>
      </Modal>

      {/* Top Reads Section */}
      <div className="md:px-16 p-5 bg-[#F1F1F2]">
        <h1  className="text-4xl mulish-bold text-gray-800 mt-5 ">Read Write Record</h1>
        <p  className="text-md mulish-light text-gray-600 mb-5">Discover your next great read</p>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Most Popular</h2>
        <div className="flex overflow-auto space-x-4 overflow-x-hidden md:overflow-x-block p-2">
          {topReads.map((book) => (
            <div
              key={book._id}
              className="flex-shrink-0 w-36   flex flex-col space-y-4   rounded"
            >
              <Link to={`/books/${book._id}`} className="text-gray-700">
                <img
                  src={book.coverImage || "https://via.placeholder.com/150"}
                  alt={book.title}
                  className="  object-cover rounded w-[180px] h-[270px]"
                />
                <div className="grid pb-3 pt-1">
                  <p className="pb-1 text-md font-bold text-nowrap">
                    {book.title.length > 20 ? `${book.title.substring(0, 20)}...` : book.title}
                  </p>
                  <p className="text-gray-600 pb-1 text-xs italic">
                    {book.description.length > 28 ? `${book.description.substring(0, 28)}...` : book.description}
                  </p>
                 
                  {/* Display the number of reads */}
                  <p className="text-gray-700 text-xs mulish-regular  items-center gap-x-1">
                    {book.reads === 1 ?   'No Reads ' : 'Reads :'} {book.reads}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Existing books by genre */}
      <div className="md:px-16 p-5 bg-[#F1F1F2]">
        {Object.keys(booksByPrimaryGenre).map((genre) => (
          <div key={genre} className="mb-8" id="genre">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{genre}</h2>
            <div className="flex overflow-auto space-x-4 overflow-x-hidden md:overflow-x-block p-2">
              {booksByPrimaryGenre[genre].map((book) => (
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
                 
                  {/* Display the number of reads */}
                  <p className="text-gray-700 text-xs mulish-regular  items-center gap-x-1">
                    {book.reads === 1 ?   'No Reads ' : 'Reads :'} {book.reads}
                  </p>
                </div>
              </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
