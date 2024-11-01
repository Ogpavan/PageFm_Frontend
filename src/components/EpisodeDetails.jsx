import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EpisodeDetails = ({ setShowNavbar, setShowFooter }) => {
  const { episodeId, bookId } = useParams();
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [book, setBook] = useState(null);

  // Hide Navbar and Footer when this component is mounted
 

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

  if (loading) {
    return <div className="text-center text-xl font-semibold">Loading episode...</div>;
  }

  if (error) {
    return <div className="text-center text-xl font-semibold">Error: {error}</div>;
  }

  if (!episode) {
    return <div className="text-center text-xl font-semibold">Episode not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 bg-gray-50 text-gray-800 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-lg">
      <h1 className="text-4xl font-bold text-center mb-6"><p> Chapter {episode.episodeNumber}</p><p className='text-xl mt-3'>{episode.title}</p></h1>
      <div className="mt-4 prose lg:prose-lg leading-relaxed text-justify" dangerouslySetInnerHTML={{ __html: episode.content }} />
    </div>
  );
};

export default EpisodeDetails;
