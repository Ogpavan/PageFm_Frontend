import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import Slider from "react-slick"; // Importing a carousel library like react-slick

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const [booksByPrimaryGenre, setBooksByPrimaryGenre] = useState({});
  const [mostPopular, setMostPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("All");

  // Carousel items with images and text from external links
  const [carouselItems, setCarouselItems] = useState([
    {
      image: "https://images.pexels.com/photos/1229183/pexels-photo-1229183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      text: "Welcome to PageFM ",
    },
    {
      image: "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      text: " READ WRITE LISTEN ",
    },
    {
      image: "https://images.pexels.com/photos/129492/pexels-photo-129492.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      text: "Earn money joining with us.",
    },
  ]);

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

  const filteredBooks =
    selectedGenre === "All"
      ? mostPopular
      : booksByPrimaryGenre[selectedGenre] || [];

  if (loading) return <Loader />;

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

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

      {/* Carousel with External Content */}
      <div className="md:px-4 px-2 sm:px-8 lg:px-16 py-5  ">
        <Slider {...carouselSettings}>
          {carouselItems.map((item, index) => (
            <div key={index} className="shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] relative w-full md:h-[300px] h-[150px] rounded overflow-hidden ">
              <img
                src={item.image}
                alt="Carousel Item"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
                <p className="text-xl sm:text-2xl lg:text-4xl text-white text-center mulish-bold">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Genre Buttons */}
      <div className="flex space-x-2 mt-6 overflow-hidden overflow-x-auto px-4 sm:px-8 lg:px-16">
        <button
          onClick={() => handleGenreFilter("All")}
          className={`px-4 py-2 text-sm sm:text-base rounded-full border-[1px] border-gray-400 ${
            selectedGenre === "All" ? "bg-black text-white" : "hover:bg-black hover:text-white "
          }`}
        >
          All
        </button>
        <button
          onClick={() => handleGenreFilter("Most Popular")}
          className={`px-4 py-2 text-sm sm:text-base rounded-full border-[1px] border-gray-400 ${
            selectedGenre === "Most Popular" ? "bg-black text-white" : "hover:bg-black hover:text-white"
          }`}
        >
          Popular
        </button>
        {Object.keys(booksByPrimaryGenre).map((genre) => (
          <button
            key={genre}
            onClick={() => handleGenreFilter(genre)}
            className={`px-4 py-2 text-nowrap text-sm sm:text-base rounded-full border-[1px] border-gray-400 ${
              selectedGenre === genre ? "bg-black text-white" : "hover:bg-black hover:text-white"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Books List */}
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 mt-5 px-4 sm:px-8 lg:px-16">Books</h2>
      <div className="flex overflow-x-auto space-x-4 px-4 sm:px-8 lg:px-16">
        {filteredBooks.map((book) => (
          <div key={book._id} className="flex-shrink-0 w-40 sm:w-32 md:w-36">
            <Link to={`/book/${book._id}`} className="text-gray-700">
              <img
                src={book.coverImage || "https://via.placeholder.com/150"}
                alt={book.title}
                className="object-cover rounded w-full h-[200px] sm:h-[270px] transition-transform transform hover:scale-105"
              />
              <div className="mt-2">
                <p className="text-sm sm:text-base font-bold">
                  {book.title.length > 16 ? `${book.title.substring(0, 16)}...` : book.title}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 italic">
                  {book.description.length > 25 ? `${book.description.substring(0, 20)}...` : book.description}
                </p>
                <p className="text-xs sm:text-sm text-gray-700">
                  {book.reads > 0 ? `Reads: ${book.reads}` : "No Reads"}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="px-4 sm:px-8 lg:px-16 py-5">
        {Object.keys(booksByPrimaryGenre).map((genre) => (
          <div key={genre} className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">{genre}</h2>
            <div className="flex overflow-x-auto space-x-4">
              {booksByPrimaryGenre[genre].map((book) => (
                <div key={book._id} className="flex-shrink-0 w-40 sm:w-32 md:w-36">
                  <Link to={`/book/${book._id}`} className="text-gray-700">
                    <img
                      src={book.coverImage || "https://via.placeholder.com/150"}
                      alt={book.title}
                      className="object-cover rounded w-full h-[200px] sm:h-[270px] transition-transform transform hover:scale-105"
                    />
                    <div className="mt-2">
                      <p className="text-sm sm:text-base font-bold">
                        {book.title.length > 20 ? `${book.title.substring(0, 16)}...` : book.title}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 italic">
                        {book.description.length > 20 ? `${book.description.substring(0, 20)}...` : book.description}
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
