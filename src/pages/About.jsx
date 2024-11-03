import React from 'react';
import { FaBook, FaMicrophone, FaMusic, FaUserFriends, FaThumbtack } from 'react-icons/fa';
import { Link } from 'react-router-dom';


const About = () => {
  return (
    <div className="p-10 md:p-20 font-mulish overflow-hidden bg-gray-50">
      <div className="max-w-6xl mx-auto text-center mb-40  ">
        <h1 className="text-3xl md:text-4xl font-bold p-6 rounded-md inline-block text-gray-800">
         About Us
        </h1>
        <p className="text-md md:text-lg mt-6 leading-relaxed max-w-2xl mx-auto text-gray-700">
          At PageFM, we’ve built something truly special—a platform where creativity takes center stage. Whether you're a writer, voiceover artist, poet, or musician, this is the space where your art comes alive, reaches eager audiences, and most importantly, gets the recognition it deserves.
        </p>

<Link to="/creators" >
        <button  className="border-yellow-500 border text-yellow-500 hover:bg-yellow-600 hover:text-white font-bold py-2 px-4 rounded mt-6">
          Learn More about Creators
        </button>
        </Link>
      </div>

      <h1 className="text-center w-full text-3xl md:text-4xl font-bold mb-10 text-gray-800">
        What makes us different?
      </h1>

      <div className="relative mb-20 w-full flex flex-wrap justify-center gap-10 px-4">
        {/* Writers Section */}
        <div className="bg-white p-10 rounded-md shadow-lg border-l-8 border-yellow-500 max-w-[320px] transform rotate-[-2deg] relative text-gray-700">
          <FaThumbtack className="absolute left-4 top-4 text-yellow-500 text-3xl rotate-[30deg]" />
          <FaBook className="text-yellow-600 text-5xl mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-center text-yellow-600">For Writers</h2>
          <p className="mt-4 text-center">
            Share stories, poems, and articles in Hindi or English with a broad audience. Collaborate with voiceover artists to bring your stories to life.
          </p>
        </div>

        {/* Voiceover Artists Section */}
        <div className="bg-white p-10 rounded-md shadow-lg border-l-8 border-green-500 max-w-[320px] transform rotate-[1deg] relative text-gray-700">
          <FaThumbtack className="absolute left-4 top-4 text-green-500 text-3xl rotate-[30deg]" />
          <FaMicrophone className="text-green-500 text-5xl mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-center text-green-600">For Voiceover Artists</h2>
          <p className="mt-4 text-center">
            Transform stories into audio experiences and share earnings 50/50 with writers! Build your voice’s presence on our platform.
          </p>
        </div>

        {/* Revenue Sharing Section */}
        <div className="bg-white p-10 rounded-md shadow-lg border-l-8 border-purple-500 max-w-[320px] transform rotate-[-3deg] relative text-gray-700">
          <FaThumbtack className="absolute left-4 top-4 text-purple-500 text-3xl rotate-[30deg]" />
          <FaUserFriends className="text-purple-500 text-5xl mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-center text-purple-600">Generous Revenue Sharing</h2>
          <p className="mt-4 text-center">
            Unlike traditional platforms, we share 50% of all revenue generated from your content, ensuring your creativity is rewarded.
          </p>
        </div>

        {/* Community Support Section */}
        <div className="bg-white p-10 rounded-md shadow-lg border-l-8 border-yellow-500 max-w-[320px] transform rotate-[2deg] relative text-gray-700">
          <FaThumbtack className="absolute left-4 top-4 text-yellow-500 text-3xl rotate-[30deg]" />
          <FaUserFriends className="text-yellow-500 text-5xl mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-center text-yellow-600">Support for Creators</h2>
          <p className="mt-4 text-center">
            Join a community that supports you at every step, from recording tips to publishing advice. PageFM is here to help you grow.
          </p>
        </div>

        {/* Songwriters and Poets Section */}
        <div className="bg-white p-10 rounded-md shadow-lg border-l-8 border-pink-500 max-w-[320px] transform rotate-[-1deg] relative text-gray-700">
          <FaThumbtack className="absolute left-4 top-4 text-pink-500 text-3xl rotate-[30deg]" />
          <FaMusic className="text-pink-500 text-5xl mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-center text-pink-600">Songwriters & Poets</h2>
          <p className="mt-4 text-center">
            If you're a songwriter, poet, or ghazal writer, PageFM offers a dedicated space to record, publish, and earn from your creations.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto text-center flex flex-col items-center mb-16 px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-10 text-gray-800">Why PageFM?</h1>
        <p className="text-md md:text-lg max-w-3xl leading-relaxed text-gray-700">
          Unlike other platforms that keep most of the earnings for themselves, we’re committed to fairly sharing 50% of all revenue generated from your content. Your creativity deserves real rewards, and we’re here to make that happen.
          <br />
          <br />
          But we’re more than just a platform. We’re a community of creators, supporting one another to grow and succeed. Need help with recording equipment? Looking for advice on how to reach more listeners? We’re here for you. If you're a songwriter, poet, or ghazal writer, we even have a dedicated space to record and publish your creations.
        </p>
      </div>

      <div className="max-w-6xl mx-auto text-center mb-20 px-4">
        <p className="text-lg md:text-xl leading-relaxed text-gray-700">
          At PageFM, you are at the heart of everything we do. Your creativity, your passion, your hard work—it all matters here. We’ve created this platform to empower creators and help them reach new heights.
        </p>
      </div>

      <div className="relative text-center">
        <div className="inline-block bg-gray-900 text-white p-10 rounded-lg shadow-xl mb-4 mx-auto max-w-md">
          <h3 className="text-3xl font-semibold">Ready to Begin?</h3>
          <p className="mt-4 text-gray-100">
            Turn your passion into something more. Join today and start sharing stories, recording narrations, and connecting with a community that values your creativity.
          </p>
          <Link to="/profile" >
          <button className="mt-8 px-8 py-3 border border-yellow-500 text-yellow-500 rounded-md text-lg hover:bg-yellow-600 hover:text-white transition duration-200 transform hover:-translate-y-1">
            Join PageFM
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
