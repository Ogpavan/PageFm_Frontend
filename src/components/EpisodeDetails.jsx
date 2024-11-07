import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from './Loader';
import { GoArrowRight } from "react-icons/go";

const EpisodeDetails = ({ setShowNavbar, setShowFooter }) => {
  const { episodeId, bookId } = useParams();
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [book, setBook] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookAndEpisode = async () => {
      try {
        const bookResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/books/${bookId}`);
        setBook(bookResponse.data);

        const foundEpisode = bookResponse.data.episodes.find(ep => ep._id === episodeId);
        if (foundEpisode) {
          setEpisode(foundEpisode);
        } else {
          setError('Episode not found');
        }
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookAndEpisode();
  }, [episodeId, bookId]);

  const handleNextChapter = () => {
    if (book && episode) {
      const currentIndex = book.episodes.findIndex(ep => ep._id === episodeId);
      if (currentIndex >= 0 && currentIndex < book.episodes.length - 1) {
        const nextEpisodeId = book.episodes[currentIndex + 1]._id;
        navigate(`/books/${bookId}/episodes/${nextEpisodeId}`);
      } else {
        alert('This is the last chapter.');
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-center text-xl font-semibold">Error: {error}</div>;
  }

  if (!episode) {
    return <div className="text-center text-xl font-semibold">Episode not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 bg-gray-50 text-gray-800 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-lg">
      <h1 className="text-4xl font-bold text-center mb-6">
        <p>Chapter {episode.episodeNumber}</p>
        <p className="text-xl mt-3">{episode.title}</p>
      </h1>
      <div className="mt-4 prose lg:prose-lg leading-relaxed text-justify" dangerouslySetInnerHTML={{ __html: episode.content }} />
      <div className='w-full flex justify-end items-center'>
      <button
        onClick={handleNextChapter}
        className="mt-8  border   py-3 px-6  font-semibold text-right
         rounded-lg  transition duration-300 flex items-center justify-end"
      >
        <span className='text-sm'>
        Next Chapter</span><span className='ml-2'><GoArrowRight /></span>
      </button>
    </div>
    </div>
  );
};

export default EpisodeDetails;
