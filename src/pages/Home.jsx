import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const [booksByPrimaryGenre, setBooksByPrimaryGenre] = useState({});
  const [mostPopular, setMostPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("All");

  const [carouselItems, setCarouselItems] = useState([
    {
      image: "https://images.pexels.com/photos/1229183/pexels-photo-1229183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      text: "Welcome to PageFM ",
    },
    {
      image: "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      text: "READ WRITE LISTEN",
    },
    {
      image: "https://images.pexels.com/photos/129492/pexels-photo-129492.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      text: "Earn money joining with us.",
    },
  ]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/book-home`);
        if (!response.ok) throw new Error("Failed to fetch books");
        const data = await response.json();

        const groupedBooks = data.reduce((acc, book) => {
          const genre = book.primaryGenre;
          if (!acc[genre]) acc[genre] = [];
          acc[genre].push(book);
          return acc;
        }, {});
        setBooksByPrimaryGenre(groupedBooks);

        // Use the fetched data directly for mostPopular
        setMostPopular(data);
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

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // Faster speed for carousel autoplay
  };

  return (
    <div className="max-w-[1500px] mx-auto">
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Error"
      >
        <p>{error}</p>
      </Modal>

      {/* Carousel Section */}
      <div className="md:px-4 px-2 sm:px-8 lg:px-16 py-5">
        <Slider {...carouselSettings}>
          {carouselItems.map((item, index) => (
            <div key={index} className="shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] relative w-full md:h-[300px] h-[150px] rounded overflow-hidden">
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

      {/* Genre Filter Section */}
      <div className="flex space-x-2 mt-6 overflow-hidden overflow-x-auto px-4 sm:px-8 lg:px-16">
        <button
          onClick={() => handleGenreFilter("All")}
          className={`px-4 py-2 text-sm sm:text-base rounded-full border-[1px] border-gray-400 ${
            selectedGenre === "All" ? "bg-black text-white" : "hover:bg-black hover:text-white"
          }`}
        >
          All
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

      {/* Books Section */}
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 mt-5 px-4 sm:px-8 lg:px-16">Books</h2>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex overflow-x-auto space-x-4 px-4 sm:px-8 lg:px-16">
          {filteredBooks.map((book) => (
            <div key={book._id} className="flex-shrink-0 w-40 sm:w-32 md:w-36">
              <Link to={`/book/${book.book}`} className="text-gray-700">
                <img
                  src={book.coverImage || "https://via.placeholder.com/150"}
                  alt={book.title}
                  loading="lazy"
                  className="object-cover rounded w-full h-[200px] sm:h-[270px] transition-transform transform hover:scale-105"
                />
                <div className="mt-2">
                  <p className="text-xs  font-bold">
                    {book.name.length > 20 ? `${book.name.substring(0, 20)}...` : book.name}
                  </p>
                  <p className="text-xs  text-gray-600 italic">
                    {book.description.length > 25 ? `${book.description.substring(0, 22)}...` : book.description}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-700 mt-1">
                    {book.readsCount > 0 ? `Reads: ${book.readsCount}` : "No Reads"}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Books by Genre Section */}
      <div className="px-4 sm:px-8 lg:px-16 py-5">
        {Object.keys(booksByPrimaryGenre).map((genre) => (
          <div key={genre} className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">{genre}</h2>
            <div className="flex overflow-x-auto space-x-4">
              {booksByPrimaryGenre[genre].map((book) => (
                <div key={book._id} className="flex-shrink-0 w-40 sm:w-32 md:w-36">
                   <Link to={`/book/${book.book}`} className="text-gray-700">
                <img
                  src={book.coverImage || "https://via.placeholder.com/150"}
                  alt={book.title}
                  loading="lazy"
                  className="object-cover rounded w-full h-[200px] sm:h-[270px] transition-transform transform hover:scale-105"
                />
                <div className="mt-2">
                  <p className="text-xs  font-bold">
                    {book.name.length > 20 ? `${book.name.substring(0, 20)}...` : book.name}
                  </p>
                  <p className="text-xs  text-gray-600 italic">
                    {book.description.length > 25 ? `${book.description.substring(0, 22)}...` : book.description}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-700 mt-1">
                    {book.readsCount > 0 ? `Reads: ${book.readsCount}` : "No Reads"}
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
