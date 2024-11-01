// CareerPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CareerPage = () => {
  const [careers, setCareers] = useState([]);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/careers`);
        setCareers(response.data);
      } catch (error) {
        console.error('Error fetching careers:', error);
      }
    };
    fetchCareers();
  }, []);

  return (
    <div className="bg-white min-h-screen p-8 md:px-20 px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Career Opportunities</h1>
        
      </div>

      <div className="mt-10 space-y-8 w-full md:w-1/2 md:mx-auto">
        {careers.map((career) => (
          <div key={career._id} className="border border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{career.title}</h2>
            <p className="text-gray-700 mb-6">{career.description}</p>
            <a 
              href={career.applicationLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline border border-blue-600 rounded-full px-4 py-2"
            >
              Apply Here
            </a>
          </div>
        ))}
        {careers.length === 0 && (
          <p className="text-center text-gray-600">No current openings. Check back later!</p>
        )}
      </div>
    </div>
  );
};

export default CareerPage;
