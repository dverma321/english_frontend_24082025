import React, { useState } from 'react';

const SearchDocuments = ({ documents, onSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Handle search input change and filter documents
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    // Filter documents based on file description, category, or date
    const filteredDocuments = documents.filter((doc) =>
      doc.fileDescription.toLowerCase().includes(term) ||
      doc.category.toLowerCase().includes(term) ||
      formatDate(doc.currentDate).includes(term) // Ensure the date is formatted correctly before searching
    );

    onSearchResults(filteredDocuments); // Pass the filtered results to parent component
  };

  return (
    <div className="mb-6">
      <label className="block text-gray-800 text-lg font-semibold mb-2" htmlFor="search">
        Search Documents
      </label>
      <input
        id="search"
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search by file name, category, or date..."
        className="shadow-lg appearance-none border border-gray-300 rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-300 transition duration-150 ease-in-out"
      />
    </div>
  );
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export default SearchDocuments;
