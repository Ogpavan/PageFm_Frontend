import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import Modal from "../components/Modal";

const Home = () => {
  const [booksByPrimaryGenre, setBooksByPrimaryGenre] = useState({});
  const [topReads, setTopReads] = useState([]);
  const [mostPopular, setMostPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("All");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/books`);
        if (!response.ok) throw new Error("Failed to fetch books");
        const data = await response.json();

        const groupedBooks = data.reduce((acc, book) => {
          const genre = book.primaryGenre;
          if (!acc[genre]) acc[genre] = [];
          acc[genre].push(book);
          return acc;
        }, {});
        setBooksByPrimaryGenre(groupedBooks);

        const topReadsResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/api/top-reads`);
        if (!topReadsResponse.ok) throw new Error("Failed to fetch top reads");
        const topReadsData = await topReadsResponse.json();
        setTopReads(topReadsData);

        const mostPopularResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/api/top-reads`);
        if (!mostPopularResponse.ok) throw new Error("Failed to fetch most popular books");
        const mostPopularData = await mostPopularResponse.json();
        setMostPopular(mostPopularData);
      } catch (error) {
        setError(error.message);
        setIsModalOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleGenreFilter = (genre) => {
    setSelectedGenre(genre);
  };

  const filteredBooks = selectedGenre === "All"
    ? topReads
    : selectedGenre === "Most Popular"
    ? mostPopular
    : booksByPrimaryGenre[selectedGenre] || [];

  if (loading) return <Loader />;

  return (
    <div className="max-w-[1500px] mx-auto">
      {/* Error Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Error"
      >
        <p>{error}</p>
      </Modal>

      {/* Top Reads Section */}
      <div className="px-4 sm:px-8 lg:px-16 py-5">
        <div className="relative rounded overflow-hidden w-full h-[200px] sm:h-[300px] mx-auto">
          <img
            src="https://images.pexels.com/photos/1340588/pexels-photo-1340588.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Reading"
            className="object-cover w-full h-full transform scale-x-[-1] transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col md:p-12 justify-center items-center md:items-start">
            <h1 className="text-lg sm:text-2xl lg:text-3xl text-white ">
              <span className="cinzel-decorative-bold">Read</span> amazing stories.
            </h1>
            <h1 className="text-lg sm:text-2xl lg:text-3xl text-white">
              <span className="cinzel-decorative-bold">Write</span> your own adventure.
            </h1>
            <h1 className="text-lg sm:text-2xl lg:text-3xl text-white ">
              <span className="cinzel-decorative-bold">Listen</span> to captivating tales.
            </h1>
          </div>
        </div>

        {/* Genre Buttons */}
        <div className="flex space-x-2 mt-6 overflow-hidden overflow-x-auto">
          <button
            onClick={() => handleGenreFilter("All")}
            className={`px-4 py-2 text-sm sm:text-base rounded-full border-[1px] border-gray-400 ${selectedGenre === "All" ? "bg-black text-white" : "hover:bg-black hover:text-white"}`}
          >
            All
          </button>
          <button
            onClick={() => handleGenreFilter("Most Popular")}
            className={`px-4 py-2 text-sm sm:text-base rounded-full border-[1px] border-gray-400 ${selectedGenre === "Most Popular" ? "bg-black text-white" : "hover:bg-black hover:text-white"}`}
          >
            Popular
          </button>
          {Object.keys(booksByPrimaryGenre).map((genre) => (
            <button
              key={genre}
              onClick={() => handleGenreFilter(genre)}
              className={`px-4 py-2 text-nowrap text-sm sm:text-base rounded-full border-[1px] border-gray-400 ${selectedGenre === genre ? "bg-black text-white" : "hover:bg-black hover:text-white"}`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Books List */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 mt-5">Books</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-2">
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
      </div>

      {/* Books by Genre Section */}
      <div className="px-4 sm:px-8 lg:px-16 py-5">
        {Object.keys(booksByPrimaryGenre).map((genre) => (
          <div key={genre} className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">{genre}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-2">
              {booksByPrimaryGenre[genre].map((book) => (
                <div key={book._id} className="flex flex-col items-center space-y-2">
                  <Link to={`/book/${book._id}`} className="text-gray-700">
                    <img
                      src={book.coverImage || "https://via.placeholder.com/150"}
                      alt={book.title}
                      className="object-cover rounded w-full h-[200px] sm:h-[270px] transition-transform transform hover:scale-105"
                    />
                    <div className="mt-2 ">
                      <p className="text-sm sm:text-base font-bold">
                        {book.title.length > 20 ? `${book.title.substring(0, 16)}...` : book.title}
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
