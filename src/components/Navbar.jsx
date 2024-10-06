import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../pages/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { FaBookmark, FaBars, FaTimes } from 'react-icons/fa';
import Modal from '../components/Modal';
import SearchBar from './SearchBar';
import axios from 'axios';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [genres, setGenres] = useState(['Genres']);
  const [selectedGenre, setSelectedGenre] = useState('Genres');
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
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/genres`);
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

  return (
    <nav className="text-white p-4 flex flex-col md:flex-row justify-between px-10 items-center shadow-md mx-auto bg-[#F52549]">
      <div className="flex justify-between items-center w-full md:w-auto ">
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
        <SearchBar className=" md:mb-0 my-4" />
        <Link
          to="/"
          onClick={closeMobileMenu}
          className={`text-md mulish-regular ${
            location.pathname === '/'
              ? 'bg-white text-gray-700 rounded-md px-4 py-2 shadow-md'
              : ''
          } md:ml-6`}
        >
          Home
        </Link>
        <Link
          to="/about"
          onClick={closeMobileMenu}
          className={`text-md mulish-regular ${
            location.pathname === '/about'
              ? 'bg-white text-gray-700 rounded-md px-4 py-2 shadow-md'
              : ''
          } md:ml-6`}
        >
          About
        </Link>

        {/* Genres dropdown */}
        <select
          value={selectedGenre}
          onChange={handleGenreChange}
          className="bg-white text-gray-700 rounded-md px-4 py-2 shadow-md"
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
              ? 'bg-white text-gray-700 rounded-md px-4 py-2 shadow-md'
              : ''
          } md:ml-6`}
        >
          Career
        </Link>

        {user ? (
          <div className="flex items-center gap-x-4">
            <Link
              to="/profile"
              onClick={closeMobileMenu}
              className={`text-md mulish-regular ${
                location.pathname === '/profile'
                  ? 'bg-white text-gray-700 rounded-md px-4 py-2 shadow-md'
                  : ''
              } md:ml-2`}
            >
              Profile
            </Link>
            {userRole === 'RJ' && (
              <Link
                to="/audio"
                onClick={closeMobileMenu}
                className={`text-md mulish-regular ${
                  location.pathname === '/audio'
                    ? 'bg-white text-gray-700 rounded-md px-4 py-2 shadow-md'
                    : ''
                } md:ml-6`}
              >
                Audio
              </Link>
            )}
          </div>
        ) : (
          <>
            <Link
              to="/login"
              onClick={closeMobileMenu}
              className={`text-md mulish-regular ${
                location.pathname === '/login'
                  ? 'bg-white text-gray-700 rounded-md px-4 py-2 shadow-md'
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
                  ? 'bg-white text-gray-700 rounded-md px-4 py-2 shadow-md'
                  : ''
              } md:ml-6`}
            >
              Signup
            </Link>
          </>
        )}
        <Link
          to={user ? '/bookmarks' : '/login'}
          onClick={closeMobileMenu}
          className={`text-md mulish-regular flex items-center ${
            location.pathname === '/bookmarks' ? 'bg-white text-gray-700 rounded-md px-4 py-2 shadow-md' : ''
          } md:ml-6`}
        >
          <FaBookmark className="ml-1" />
        </Link>
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
