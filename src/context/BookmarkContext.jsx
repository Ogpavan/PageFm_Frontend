import React, { createContext, useContext, useState, useMemo } from 'react';

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
    if (!bookmarks.some(b => b._id === book._id)) { // Prevent duplicates
      const updatedBookmarks = [...bookmarks, book];
      setBookmarks(updatedBookmarks);
      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
    }
  };

  // Remove bookmark and update local storage
  const removeBookmark = (bookId) => {
    const updatedBookmarks = bookmarks.filter(book => book._id !== bookId);
    setBookmarks(updatedBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
  };

  // Memoize the values to avoid re-renders
  const value = useMemo(() => ({ bookmarks, addBookmark, removeBookmark }), [bookmarks]);

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
};
