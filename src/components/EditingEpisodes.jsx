import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function EditingEpisode() {
  const { bookId, episodeId } = useParams(); // Get bookId and episodeId from URL params
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch episode data on component mount
  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/books/${bookId}`);
        const book = response.data;
        
        // Check if the book and its episodes array exist before accessing them
        if (book && book.episodes) {
          const episode = book.episodes.find(ep => ep._id === episodeId);
          if (episode) {
            setTitle(episode.title);
            setContent(episode.content);
          } else {
            console.error('Episode not found');
          }
        } else {
          console.error('Book or episodes not found');
        }
      } catch (error) {
        console.error('Error fetching episode:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEpisode();
  }, [bookId, episodeId]);

  const handleSave = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_BASE_URL}/api/books/${bookId}/episodes/${episodeId}`, {
        title,
        content,
      });
      alert('Episode updated successfully');
    } catch (error) {
      console.error('Error updating episode:', error);
      alert('Failed to update episode');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-6 bg-white rounded-lg shadow-lg max-w-2xl">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Edit Episode</h2>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Episode Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Episode Content:</label>
        <ReactQuill
          value={content}
          onChange={setContent}
          theme="snow"
          className="bg-white rounded-md"
        />
      </div>
      <button
        onClick={handleSave}
        className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
      >
        Save Changes
      </button>
    </div>
  );
}
