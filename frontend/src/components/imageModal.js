import React from 'react';
import { FaTimes } from 'react-icons/fa';

function ImageModal({ show, onClose, imageUrl }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white p-2 rounded-lg shadow-lg max-w-3xl w-full">
        <img src={imageUrl} alt="Vehicle" className="w-full h-auto rounded" />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-700 rounded-full p-2 transition-colors duration-200"
          aria-label="Close image"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
}

export default ImageModal;

