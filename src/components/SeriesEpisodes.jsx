// src/components/SeriesEpisodes.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const SeriesEpisodes = () => {
  const { seriesId } = useParams();
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    // Fetch episodes for the given series ID
    axios.get(`/api/series/${seriesId}/books`)
      .then(response => setEpisodes(response.data))
      .catch(error => console.error('Error fetching episodes:', error));
  }, [seriesId]);

  return (
    <div>
      <h2>Episodes</h2>
      <ul>
        {episodes.map(episode => (
          <li key={episode._id}>
            <Link to={`/book/${episode._id}`}>Episode {episode.episodeNumber}: {episode.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SeriesEpisodes;
