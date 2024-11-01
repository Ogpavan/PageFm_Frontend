import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="  text-gray-800 py-16 px-8 md:px-20 lg:px-36 space-y-16">
      
      {/* Header Section */}
      <div className="text-center space-y-8 md:space-y-4">
        <h2 className="text-4xl md:text-4xl font-bold tracking-wide text-gray-800 mb-4">
          About Us
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mulish-regular">
          At our platform, we bring together the magic of storytelling, the art of narration, and the joy of reading. Here, writers, RJs, and readers come together to share, listen, and explore stories in a dynamic new way.
        </p>
      </div>

      {/* Mission Statement Section */}
      <div className="flex flex-col md:flex-row md:space-x-8 items-center md:items-start space-y-8 md:space-y-0">
        <div className="md:w-1/2 lg:w-1/3">
          <img
            src="https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Our Mission"
            className="w-full h-full rounded-lg object-cover shadow-lg transition-transform transform hover:scale-105"
          />
        </div>
        <div className="md:w-1/2 lg:w-2/3 text-center md:text-left">
          <h3 className="text-3xl font-semibold mb-4">Our Mission</h3>
          <p className="text-gray-600 mulish-regular text-lg">
            We empower storytellers, writers, and narrators to share their creativity and connect with audiences worldwide. Through seamless publishing and immersive audio, we make it possible to bridge the gap between words and voice.
          </p>
        </div>
      </div>

      {/* Roles Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
        
        {/* Writers Section */}
        <div className="bg-white p-8 rounded-lg shadow-lg transform transition-transform hover:-translate-y-2">
          <h4 className="text-2xl font-semibold mb-3 text-gray-900">For Writers</h4>
          <p className="text-gray-600 mulish-regular">
            Step into the spotlight by publishing your stories effortlessly. Connect with readers who are eager to explore new worlds and ideas crafted by you. Share your voice, inspire imaginations, and leave a lasting impact.
          </p>
        </div>

        {/* RJs Section */}
        <div className="bg-white p-8 rounded-lg shadow-lg transform transition-transform hover:-translate-y-2">
          <h4 className="text-2xl font-semibold mb-3 text-gray-900">For RJs</h4>
          <p className="text-gray-600 mulish-regular">
            Bring words to life with your unique voice. Record  audio versions of stories, enriching each tale with tone, emotion, and passion. Your narration connects listeners deeply to the narrative, making each story unforgettable.
          </p>
        </div>

        {/* Readers Section */}
        <div className="bg-white p-8 rounded-lg shadow-lg transform transition-transform hover:-translate-y-2">
          <h4 className="text-2xl font-semibold mb-3 text-gray-900">For Readers</h4>
          <p className="text-gray-600 mulish-regular">
            Discover captivating stories in both written and narrated formats. Whether you prefer the immersive experience of reading or listening to stories come to life, our platform offers something for everyone.
          </p>
        </div>
      </div>

      {/* Closing Section */}
      <div className="text-center space-y-4 ">
        <h3 className="text-3xl font-semibold text-gray-900 mulish-regular">Join Us in the World of Stories</h3>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mulish-regular">
          We believe stories have the power to inspire, entertain, and connect people across the globe. Whether you’re here to write, narrate, or read, you’re part of a growing community that values the art of storytelling.
        </p>
        <Link to="/profile" >
        <button  className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold mt-6 hover:bg-blue-700 transition">
          Start Your Journey
        </button>
        </Link>
      </div>
    </div>
  );
};

export default About;
