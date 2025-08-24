import React from 'react';

const DeleteButton = ({ onDelete }) => {
  return (
    <button
      className="mt-4 bg-red-200 hover:bg-red-700 text-white py-2 px-4 ml-4 mr-4 rounded transition duration-200"
      onClick={onDelete}
    >
      Delete
    </button>
  );
};

export default DeleteButton;
