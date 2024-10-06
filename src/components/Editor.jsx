// src/components/Editor.js
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import styles

const Editor = ({ content, onChange }) => {
  return (
    <div className="editor-container">
      <ReactQuill
        value={content}
        onChange={onChange}
        modules={Editor.modules}
        formats={Editor.formats}
      />
    </div>
  );
};

Editor.modules = {
  toolbar: [
    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['bold', 'italic', 'underline'],
    ['link', 'image'],
    [{ 'align': [] }],
    ['clean']                                         // Remove formatting button
  ],
};

Editor.formats = [
  'header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline', 'link', 'image', 'align'
];

export default Editor;
