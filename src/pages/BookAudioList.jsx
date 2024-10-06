import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const BookAudioList = ({ bookId }) => {
  const [audios, setAudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAudios = async () => {
      try {
        console.log('Book ID:', bookId); // Check if bookId is correct
        const db = getFirestore();
        const q = query(collection(db, 'audios'), where('bookId', '==', bookId));
        const querySnapshot = await getDocs(q);
  
        if (querySnapshot.empty) {
          console.log('No matching documents.');
        } else {
          console.log('Documents found:', querySnapshot.size);
        }
  
        const audioData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data
          };
        });
  
        setAudios(audioData);
      } catch (error) {
        console.error('Error fetching audios:', error);
      }
    };
  
    if (bookId) {
      fetchAudios();
    }
  }, [bookId]);
  

  

  if (audios.length === 0) {
    return <p className="text-center">No audios available for this book.</p>;
  }

  return (
    <div className="audio-list-container">
      {audios.map((audio) => (
        <div key={audio.id} className="audio-card border p-4 rounded-lg mb-4">
          <div className="audio-details">
            <h4 className="audio-title text-lg font-semibold">{audio.title}</h4>
            <p className="audio-description text-sm text-gray-600">{audio.description}</p>
            {audio.rjName && <p className="audio-rj text-sm text-gray-500">RJ: {audio.rjName}</p>}
          </div>

          {/* Audio player */}
          <audio controls aria-label={`Audio player for ${audio.title}`} className="mt-2 w-full">
            <source src={audio.audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      ))}
    </div>
  );
};

export default BookAudioList;
