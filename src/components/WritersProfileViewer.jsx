import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const WritersProfileViewer = () => {
  const { writerId } = useParams();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [writerName, setWriterName] = useState('');

  useEffect(() => {
    const fetchBooksAndWriter = async () => {
      try {
        const booksResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/api/writers/${writerId}/books`);
        console.log(`Fetching books from: ${import.meta.env.VITE_BASE_URL}/api/writers/${writerId}/books`);

        if (!booksResponse.ok) {
          throw new Error('Failed to load books');
        }

        const booksData = await booksResponse.json();
        setBooks(booksData);

        if (booksData.length > 0) {
          const userId = booksData[0].user;
          const firestore = getFirestore();
          const writerRef = doc(firestore, 'writers', userId);
          const writerSnapshot = await getDoc(writerRef);

          if (writerSnapshot.exists()) {
            const writerData = writerSnapshot.data();
            console.log('writerData', writerData);
            setWriterName(writerData.name);
            setProfilePic(writerData.profilePic);
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

  const handleBookClick = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  if (loading) return <div className="text-center text-2xl font-semibold">Loading...</div>;
  if (error) return <div className="text-center text-2xl font-semibold text-red-500">{error}</div>;

  const totalBooks = books.length;
  const totalReads = books.reduce((acc, book) => acc + book.reads, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-gray-100 min-h-screen">
      {/* Left Side - Profile Section */}
      <aside className="bg-white shadow-md rounded-lg p-8 flex flex-col items-center text-center col-span-1">
        {profilePic ? (
          <img src={profilePic} alt="Profile" className="rounded-full h-32 w-32 object-cover mb-4" />
        ) : (
          <img
            src="https://via.placeholder.com/150"
            alt="Default Profile"
            className="rounded-full h-32 w-32 object-cover mb-4"
          />
        )}
        <h1 className="text-3xl font-bold text-gray-800">{writerName || 'Unknown Writer'}</h1>
        <p className="text-gray-600 mt-4">Total Books: {totalBooks}</p>
        <p className="text-gray-600">Total Reads: {totalReads}</p>
      </aside>

      {/* Right Side - Books Section */}
      <main className="col-span-2 flex flex-col items-start bg-white shadow-md p-8 rounded-md">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Published Books</h2>
        {books.length === 0 ? (
          <p className="text-gray-500 text-center">No books published yet.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {books.map((book) => (
              <li
                key={book._id}
                className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
                onClick={() => handleBookClick(book._id)}
              >
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="h-56 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {book.title.length > 20 ? `${book.title.substring(0, 20)}...` : book.title}
                  </h3>
                  <p className="text-gray-500">Reads: {book.reads}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default WritersProfileViewer;
