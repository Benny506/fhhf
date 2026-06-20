import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

/**
 * Reusable Rich Text Editor wrapper.
 * Centralizes the Quill dependency so it can be easily swapped or styled globally.
 */
export default function RichTextEditor({ value, onChange, placeholder = 'Write something amazing...', readOnly = false }) {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'blockquote', 'code-block'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'blockquote', 'code-block'
  ];

  return (
    <div className="rich-text-editor-container">
      <ReactQuill 
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={readOnly}
        className="bg-white rounded"
      />
    </div>
  );
}
