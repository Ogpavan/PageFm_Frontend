// AdminPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPage = () => {
  const [formData, setFormData] = useState({ title: '', description: '', applicationLink: '' });
  const [careers, setCareers] = useState([]);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Fetch all careers
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

  // Handle new career submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/careers/new`, formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      alert('Career posted successfully!');
      setFormData({ title: '', description: '', applicationLink: '' });
      setCareers((prev) => [...prev, response.data]); // Add the new career to the list
    } catch (error) {
      setError('Error posting career');
      console.error(error.response ? error.response.data : error.message);
    }
  };

  // Handle deleting a career
  const handleDelete = async (careerId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/careers/${careerId}`);
      setCareers((prev) => prev.filter((career) => career._id !== careerId));
      alert('Career deleted successfully!');
    } catch (error) {
      alert('Error deleting career');
      console.error(error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8 mb-10">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Admin - Post a New Career</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="title">Job Title</label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Job Title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="description">Job Description</label>
            <textarea
              name="description"
              id="description"
              placeholder="Job Description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="applicationLink">Application Link</label>
            <input
              type="url"
              name="applicationLink"
              id="applicationLink"
              placeholder="https://example.com/apply"
              value={formData.applicationLink}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Post Job
          </button>
        </form>
      </div>

      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Career Listings</h2>
        {careers.length > 0 ? (
          <ul className="space-y-4">
            {careers.map((career) => (
              <li key={career._id} className="border border-gray-300 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900">{career.title}</h3>
                <p className="text-gray-700">{career.description}</p>
                <a 
                  href={career.applicationLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Application Link
                </a>
                <button
                  onClick={() => handleDelete(career._id)}
                  className="mt-2 text-red-600 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No careers available.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
