// BookContentPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const BookContentPage = () => {
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleNext = () => {
    if (content.trim()) {
      navigate('/book-details', { state: { content } });
    } else {
      alert("Please enter the book content.");
    }
  };

  return (
    <div className="md:p-8 lg:flex flex-col lg:flex-row justify-center items-start  min-h-screen">
      <div className="flex flex-col w-full lg:w-3/4 md:p-6 p-2 bg-white rounded-lg ">
      
        <div>
         
          <ReactQuill
            value={content}
            onChange={setContent}
            modules={BookContentPage.modules}
            formats={BookContentPage.formats}
            className="h-screen rounded-md border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            onClick={handleNext} 
            className="p-2 mt-10 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Next: Add Details
          </button>
        </div>
      </div>
    </div>
  );
};

BookContentPage.modules = {
  toolbar: [
    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['bold', 'italic', 'underline'],
    ['link'],
    [{ 'align': [] }],
    ['clean']
  ],
};

BookContentPage.formats = [
  'header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline', 'link', 'align'
];

export default BookContentPage;
