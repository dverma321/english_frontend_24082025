// UpdateButton.jsx
import React from 'react';

const UpdateButton = ({ onUpdate }) => {
  return (
    <button
      className="mt-4 bg-blue-200 hover:bg-blue-700 text-white py-2 px-4 ml-4 mr-4 rounded transition duration-200"
      onClick={onUpdate}
    >
      Update
    </button>
  );
};

export default UpdateButton;
