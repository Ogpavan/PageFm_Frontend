import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../pages/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { FaBookmark, FaBars, FaTimes, FaUserCircle, FaHome, FaInfoCircle, FaPowerOff } from 'react-icons/fa'; // Import relevant icons
import Modal from '../components/Modal';
import SearchBar from './SearchBar';
import axios from 'axios';
import { TfiPowerOff } from "react-icons/tfi";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [genres, setGenres] = useState(['Genres']);
  const [selectedGenre, setSelectedGenre] = useState('Genres');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.firstName);
          setUserRole(userData.role);
        } else {
          console.error('No user data found in Firestore.');
        }
      } else {
        setUser(null);
        setUserName('');
        setUserRole('');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/books/genres`);
        console.log('Genres fetched:', response.data);
        setGenres(['All Genres', ...response.data]);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
  
    fetchGenres();
  }, []);
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      closeLogoutModal();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleGenreChange = (e) => {
    const genre = e.target.value;
    setSelectedGenre(genre);
    setIsMobileMenuOpen(false);
    navigate(`/genre/${encodeURIComponent(genre)}`);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const openLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const closeProfileDropdown = () => {
    setShowProfileDropdown(false);
  };

  return (
    <nav className="p-5 flex flex-col md:flex-row justify-between md:px-10 items-center md:mx-auto  max-w-[1450px]">
      <div className="flex justify-between items-center w-full md:w-auto py-2">
        <Link to="/" className="text-xl font-bold cinzel-decorative-bold">
          PageFM
        </Link>
        <button
          className="text-2xl md:hidden focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      <div
        className={`grid gap-y-3 md:flex md:flex-row items-center w-full md:w-auto ${
          isMobileMenuOpen ? 'block' : 'hidden'
        } md:flex md:items-center md:space-x-6`}
      >
        <div>
          <SearchBar className="md:mb-0 my-4" />
        </div>
        <Link
          to="/"
          onClick={closeMobileMenu}
          className={`text-md mulish-regular ${
            location.pathname === '/'
              ? 'border-b-2 border-gray-700'
              : ''
          } md:ml-6`}
        > Home
        </Link>
        <Link
          to="/about"
          onClick={closeMobileMenu}
          className={`text-md mulish-regular ${
            location.pathname === '/about'
              ? 'border-b-2 border-gray-700'
              : ''
          } md:ml-6`}
        >
         About
        </Link>

        {/* Genres dropdown */}
        <select
          value={selectedGenre}
          onChange={handleGenreChange}
          className="outline-none text-md mulish-regular md:ml-6"
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>

        <Link
          to="/career"
          onClick={closeMobileMenu}
          className={`text-md mulish-regular ${
            location.pathname === '/career'
              ? 'border-b-2 border-gray-700'
              : ''
          } md:ml-6`}
        >
          Career
        </Link>

        {user ? (
          <div className="relative">
            <button
              onClick={toggleProfileDropdown}
              className="flex items-center text-md mulish-regular md:ml-0 focus:outline-none"
            >
              <FaUserCircle className="text-2xl" />
              <span className="ml-2">{userName}</span>
            </button>
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg z-10">
                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-100"
                >
                  <FaUserCircle className="inline-block mr-1" /> Profile
                </Link>
                {userRole === 'RJ' && (
                  <Link
                    to="/audio"
                    onClick={closeMobileMenu}
                    className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-100"
                  >
                    <FaBookmark className="inline-block mr-1" /> Audio
                  </Link>
                )}
                <Link
                  to="/bookmarks"
                  onClick={closeMobileMenu}
                  className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-100"
                >
                  <FaBookmark className="inline-block mr-1" /> Bookmarks
                </Link>
                <button
                  onClick={openLogoutModal}
                  className=" text-red-500 block w-full text-left px-4 py-2 text-md  hover:bg-gray-100"
                >
                <TfiPowerOff  className="inline-block mr-1" />  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              to="/login"
              onClick={closeMobileMenu}
              className={`text-md mulish-regular ${
                location.pathname === '/login'
                  ? 'border-b-2 border-gray-700'
                  : ''
              } md:ml-6`}
            >
              Login
            </Link>
            <Link
              to="/signup"
              onClick={closeMobileMenu}
              className={`text-md mulish-regular ${
                location.pathname === '/signup'
                  ? 'border-b-2 border-gray-700'
                  : ''
              } md:ml-6`}
            >
              Signup
            </Link>
          </>
        )}
      </div>

      <Modal
        show={showLogoutModal}
        onClose={closeLogoutModal}
        title="Logout Confirmation"
        message="Are you sure you want to log out?"
        onConfirm={handleLogout}
      />
    </nav>
  );
};

export default Navbar;
