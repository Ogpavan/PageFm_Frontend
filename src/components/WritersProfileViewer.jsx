import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { FaFacebook, FaTwitter, FaWhatsapp, FaInstagram, FaTelegram, FaLinkedin } from 'react-icons/fa';

const WritersProfileViewer = () => {
  const { writerId } = useParams();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [writerName, setWriterName] = useState('');
  const [aboutAuthor, setAboutAuthor] = useState('');
  const [socialHandles, setSocialHandles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchBooksAndWriter = async () => {
      try {
        const booksResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/api/writers/${writerId}/books`);
        if (!booksResponse.ok) throw new Error('Failed to load books');
        const booksData = await booksResponse.json();
        setBooks(booksData);

        if (booksData.length > 0) {
          const userId = booksData[0].user;
          const firestore = getFirestore();
          const writerRef = doc(firestore, 'writers', userId);
          const writerSnapshot = await getDoc(writerRef);

          if (writerSnapshot.exists()) {
            const writerData = writerSnapshot.data();
            setWriterName(writerData.name);
            setProfilePic(writerData.profilePic);
            setAboutAuthor(writerData.aboutAuthor || '');
            setSocialHandles(writerData.socialHandles || []);
          } else {
            setError('No writer found in Firestore');
          }
        } else {
          setError('No books found for this writer.');
        }
      } catch (err) {
        setError('An error occurred: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooksAndWriter();
  }, [writerId]);



  const iconMap = {
    facebook: FaFacebook,
    twitter: FaTwitter,
    whatsapp: FaWhatsapp,
    instagram: FaInstagram,
    telegram : FaTelegram,
    linkedin : FaLinkedin
    // Add more platforms as needed
  };

  const handleBookClick = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  if (loading) return <div className="text-center text-2xl font-semibold">Loading...</div>;
  if (error) return <div className="text-center text-2xl font-semibold text-red-500">{error}</div>;

  return (
    <div className="md:p-8 md:bg-gray-100 min-h-screen flex flex-col items-center">
      {/* Profile Section */}
      <div className="bg-white md:shadow-md rounded-lg p-8 text-center w-full max-w-2xl mb-8">
        <img src={profilePic} alt="Profile" className="rounded-full h-32 w-32 object-cover mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800">{writerName || 'Unknown Writer'}</h1>
        <div className="flex justify-center gap-4 mt-4">
              {socialHandles.map(({ platform, url }, index) => (
                url && (
                  <a href={url} target="_blank" rel="noopener noreferrer" key={index}>
                  {iconMap[platform.toLowerCase()] ? (
                    React.createElement(iconMap[platform.toLowerCase()], { className: "h-6 w-6 text-blue-500" })
                  ) : (
                    <span>Icon not available</span>
                  )}
                </a>
                )
              ))}
            </div>
            <div className='text-gray-700 md:px-10 text-justify'>
              <h1 className='text-xl font-bold text-gray-800 mt-4 w-full text-left'>About the Writer</h1>
            <p className="text-gray-600 mt-2">{aboutAuthor || 'No bio available.'}</p>
            </div>
          

      {/* Books Section */}
      <div className="w-full max-w-4xl mt-10 md:px-10">
        <h2 className="text-xl font-bold mb-6 text-gray-800 text-left">Published Books</h2>
        {books.length === 0 ? (
          <p className="text-gray-500 ">No books published yet.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
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
                              
                                <p className="text-xs sm:text-sm text-gray-700">
                                  {book.reads > 0 ? `Reads: ${book.reads}` : "No Reads"}
                                </p>
                              </div>
                            </Link>
            ))}
          </ul>
        )}
      </div>
    </div>
    </div>
  );
};

export default WritersProfileViewer;
