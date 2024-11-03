import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import BookDetails from './pages/BookDetails';
import Bookmarks from './pages/BookMarks';
import About from './pages/About';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import { BookmarkProvider } from './context/BookmarkContext';
import Footer from './components/Footer';
import SignUp from './pages/SignUp';
import CareerPage from './pages/CareerPage.jsx';
import WriterDashboard from './pages/Dashboard/WriterDashboard';
import RJDashboard from './pages/Dashboard/RJDashboard';
import { auth, db } from '../src/pages/firebaseConfig';
import { getDoc, doc } from 'firebase/firestore';
import AudioUpload from './components/AudioUpload';
import WhatsApp from './components/WhatsApp';
import WritersProfile from './components/WritersProfile';

import Test from './pages/Test';
import WriterProfileViewer from './components/WritersProfileViewer';
import GenrePage from './pages/GenrePage';
import TermsAndConditions from './pages/TermsAndConditions.jsx';
import BookContentPage from './pages/BookContentPage.jsx';
import BookDetailsPage from './pages/BookDetailsPage.jsx';
import EpisodeDetails from './components/EpisodeDetails.jsx';
import AdminPage from './components/Admin.jsx';
import Creators from './pages/Creators.jsx';
import EditEpisode from './components/EditEpisode.jsx';
import EditingEpisodes from './components/EditingEpisodes.jsx';
import Dashboard from './components/Dashboard.jsx';

const App = () => {
  const [user, setUser] = useState(null); // Store authenticated user
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser); // Set the authenticated user
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <BookmarkProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book/:id" element={<BookDetails />} />
<Route path="/books/:bookId/episodes/:episodeId" element={<EpisodeDetails />} />

          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          <Route path="/writer-dashboard" element={<WriterDashboard />} />
          <Route path="/rj-dashboard" element={<RJDashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path='/career' element={<CareerPage />} />
          <Route path="/genre/:genre" element={<GenrePage />} /> 
          {/* Updated path to include writerId parameter */}
          <Route path="/profile" element={<WritersProfile />} />
          <Route path="/writer/:writerId" element={<WriterProfileViewer />} />
          <Route path='/termsandconditions' element={<TermsAndConditions />} />

          <Route path="/book-content" element={<BookContentPage />} />
          <Route path="/book-details" element={<BookDetailsPage />} />
          
          <Route path="/audio" element={<AudioUpload />} />
          <Route path="/wp-admin" element={<AdminPage />} />

          <Route path="/creators" element={<Creators />} />

        <Route path="/edit-episodes/:bookId" element={<EditEpisode />} />

        <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/books/:bookId/episodes/:episodeId/edit" element={<EditingEpisodes />} />



          <Route path="/test" element={<Test />} />
        </Routes>
        <WhatsApp />
        <Footer />
      </Router>
    </BookmarkProvider>
  );
};

export default App;
