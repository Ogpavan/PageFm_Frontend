import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the BookmarkContext
const BookmarkContext = createContext();

// Custom hook to use bookmarks context
export const useBookmarks = () => {
  return useContext(BookmarkContext);
};

// BookmarkProvider component
export const BookmarkProvider = ({ children }) => {
  // Initialize bookmarks from local storage or set an empty array
  const [bookmarks, setBookmarks] = useState(() => {
    const storedBookmarks = localStorage.getItem('bookmarks');
    return storedBookmarks ? JSON.parse(storedBookmarks) : [];
  });

  // Add bookmark and update local storage
  const addBookmark = (book) => {
    const updatedBookmarks = [...bookmarks, book];
    setBookmarks(updatedBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
  };

  // Remove bookmark and update local storage
  const removeBookmark = (bookId) => {
    const updatedBookmarks = bookmarks.filter(book => book._id !== bookId);
    setBookmarks(updatedBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
  };

  // Use an effect to initialize bookmarks from local storage if available
  useEffect(() => {
    const storedBookmarks = localStorage.getItem('bookmarks');
    if (storedBookmarks) {
      setBookmarks(JSON.parse(storedBookmarks));
    }
  }, []);

  return (
    <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark }}>
      {children}
    </BookmarkContext.Provider>
  );
};
