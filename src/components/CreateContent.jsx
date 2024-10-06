// src/pages/CreateContent.js
import React, { useState } from 'react';
import Editor from './Editor';

const CreateContent = () => {
  const [content, setContent] = useState('');

  const handleChange = (value) => {
    setContent(value);
  };

  const handleSave = () => {
    // Save content to your backend or perform other actions
    console.log('Content saved:', content);
  };

  return (
    <div className="create-content">
      <h1>Create New Content</h1>
      <Editor content={content} onChange={handleChange} />
      <button onClick={handleSave} className="save-button">Save</button>
    </div>
  );
};

export default CreateContent;
