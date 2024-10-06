// src/pages/About.jsx

import React from 'react';
import { BsArrowsMove, BsCloudHaze2Fill, BsFillCupHotFill } from 'react-icons/bs';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gray-800 text-white h-[50vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center p-6">
          <h1 className="text-5xl font-bold mb-4">About Bookify</h1>
          <p className="text-lg text-wrap ">
            Discover your next great read with Bookify.  Our platform offers a seamless reading experience with a diverse selection of books.
          </p>
        </div>
      </section>

      {/* Information Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex flex-col justify-center  p-6">
              <h2 className="text-4xl font-bold mb-4 ">Our Mission</h2>
              <p className="text-lg mb-4">
                At Bookify, we aim to provide an extensive library of books accessible to everyone. Our mission is to connect readers with their next favorite book through an easy-to-use platform.
              </p>
              <p className="text-lg">
                We are dedicated to offering a wide range of genres, from classic literature to modern bestsellers, ensuring that every reader finds something they love.
              </p>
            </div>
            <div className="flex flex-col justify-center p-6">
              <h2 className="text-4xl font-bold mb-4">Our Team</h2>
              <p className="text-lg mb-4">
                Our team is composed of passionate book lovers and tech enthusiasts who are committed to enhancing the reading experience. With a blend of creativity and technical expertise, we strive to deliver the best service possible.
              </p>
              <p className="text-lg">
                Meet our team of dedicated individuals who work tirelessly to bring Bookify to life and provide an exceptional platform for readers and book enthusiasts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 bg-gray-200">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center p-6">
            <div className="bg-white p-6 rounded-lg shadow-lg ">
              <div className='text-4xl w-full flex justify-center p-2'>
            <BsArrowsMove />

              </div>
              <h3 className="text-2xl font-bold mb-4">Wide Selection</h3>
              <p className="text-lg">
                Browse through a diverse collection of books across various genres and find your next favorite read.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className='text-4xl w-full flex justify-center p-2'>
              <BsCloudHaze2Fill />
              </div>
              <h3 className="text-2xl font-bold mb-4">Seamless Experience</h3>
              <p className="text-lg">
                Enjoy a smooth and intuitive interface designed for easy navigation and reading.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className='text-4xl w-full flex justify-center p-2'>
              <BsFillCupHotFill />
              </div>
              <h3 className="text-2xl font-bold mb-4">Personalized Recommendations</h3>
              <p className="text-lg">
                Receive book suggestions tailored to your preferences and reading history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-800 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
        <p className="text-lg mb-8 text-wrap">
          Have any questions or feedback? We’d love to hear from you! Reach out to us through our contact page or follow us on social media.
        </p>
        <a className="group relative inline-flex border border-red-500 focus:outline-none   w-auto" href="/docs">
              <span className="md:w-full w-auto inline-flex items-center justify-center self-stretch px-4 py-2 text-sm text-white text-center uppercase bg-red-500 ring-1 ring-red-500 ring-offset-1 ring-offset-red-500 transform transition-transform group-hover:-translate-y-1 group-hover:-translate-x-1 group-focus:-translate-y-1 group-focus:-translate-x-1 mulish-regular">
                Contact Us
              </span>
            </a>
      </section>
    </div>
  );
};

export default About;
