import React, { useState, useEffect } from 'react';
import SearchDocuments from '../Search/SearchDocuments'; // Import the search component
import DownloadButton from '../Display/DownloadButton'; // Import the DownloadButton component
import DeleteButton from '../Display/DeleteButton'; // Import the DeleteButton component
import useFetchUser from '../API/FetchUserInfo';
import Loading from '../Loading'; // Import Loading component
import './Display_Files.css';

const Display_Files = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]); // State for filtered documents
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const [imageSources, setImageSources] = useState({}); // State to hold image sources
  const [loading, setLoading] = useState(true); // State for loading

  const { state } = useFetchUser();

  const VITE_LOCAL_API_URL = import.meta.env.VITE_LOCAL_API_URL;
  const VITE_PROD_API_URL = import.meta.env.VITE_PROD_API_URL;
  const apiUrl = import.meta.env.DEV ? VITE_LOCAL_API_URL : VITE_PROD_API_URL;

  const token = localStorage.getItem('jwtoken');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`, // Add the token in the Authorization header
  };

  // Fetch user's uploaded documents on component mount
  useEffect(() => {
    fetchUserUploads(); // Fetch uploads on mount
  }, []);

  // Function to fetch user uploads
  const fetchUserUploads = async () => {
    setLoading(true); // Set loading to true when fetch starts
    try {
      const response = await fetch(`${apiUrl}/uploadfile/getuploadedfiles`, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        setErrorMessage('No Record Found');
        setDocuments([]);
        setLoading(false); // Set loading to false after the fetch completes
        return;
      }

      const data = await response.json();
      setDocuments(data.uploads);
      setFilteredDocuments(data.uploads); // Initialize filtered documents with all documents
      setErrorMessage('');
      await fetchImages(data.uploads); // Fetch images for document previews
    } catch (error) {
      console.error('Error fetching uploads:', error);
      setErrorMessage('No Record Found');
      setDocuments([]);
    } finally {
      setLoading(false); // Ensure loading is set to false after fetch completes
    }
  };

  // Function to fetch images for each document
  const fetchImages = async (uploads) => {
    const imagePromises = uploads.map(async (doc) => {
      if (doc.fileMimeType === 'image/png' || doc.fileMimeType.startsWith('image/')) {
        try {
          const response = await fetch(`${apiUrl}/uploadfile/download/${doc._id}`, {
            method: 'GET',
            headers: headers,
            credentials: 'include', // Include credentials (cookies, etc.)
          });

          if (!response.ok) {
            throw new Error('Failed to fetch image');
          }

          const blob = await response.blob(); // Convert response to blob
          const objectUrl = URL.createObjectURL(blob); // Create an object URL
          return { id: doc._id, url: objectUrl }; // Return the document ID and the object URL
        } catch (error) {
          console.error('Error fetching image:', error);
          return { id: doc._id, url: null }; // Return null if error occurs
        }
      }
      return { id: doc._id, url: null }; // Return null for non-image files
    });

    const images = await Promise.all(imagePromises);
    const imageSourceMap = images.reduce((acc, { id, url }) => {
      acc[id] = url; // Map document IDs to their image URLs
      return acc;
    }, {});

    setImageSources(imageSourceMap); // Update image sources state
  };

  // Handle search results
  const handleSearchResults = (results) => {
    setFilteredDocuments(results); // Update the filtered documents based on search results
  };

  // Display date format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  // Handle document deletion
  const handleDelete = async (docId) => {
    try {
      const response = await fetch(`${apiUrl}/uploadfile/delete/${docId}`, {
        method: 'DELETE',
        headers: headers,
      });

      if (response.ok) {
        // Filter out the deleted document
        setDocuments(documents.filter((doc) => doc._id !== docId));
        setFilteredDocuments(filteredDocuments.filter((doc) => doc._id !== docId));
        window.alert("File Delete successfully");
      } else {
        console.error('Failed to delete document');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  return (
    <div className="mx-auto p-4 sm:p-6 md:p-8 bg-white bg-opacity-50 rounded-lg shadow-md displayBackgroundImage">
      {/* Display Loading component while data is being fetched */}
      {loading ? (
        <Loading />
      ) : (
        <>
          {/* Display user information */}
          {state.userInfo && (
            <div className="mb-4 uppercase text-center bg-green-300 p-4 text-white">
              <h2>Welcome {state.userInfo.name} !!!</h2>
            </div>
          )}

          {/* Search Bar */}
          <SearchDocuments documents={documents} onSearchResults={handleSearchResults} />

          {/* Uploaded Documents Section */}
          <div className="mt-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">Your Uploaded Documents</h2>
            {errorMessage ? (
              <p className="text-red-600 text-lg font-semibold">{errorMessage}</p>
            ) : filteredDocuments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredDocuments.map((doc) => (
                  <div key={doc._id} className="bg-white bg-opacity-40 p-4 sm:p-5 rounded-lg shadow hover:shadow-lg transition duration-200">
                    {/* Conditionally render preview based on MIME type */}
                    {imageSources[doc._id] ? (
                      <img
                        src={imageSources[doc._id]} // Use the object URL from the state
                        alt={doc.fileDescription}
                        className="mb-4 w-full h-40 sm:h-48 md:h-56 object-cover rounded-md"
                      />
                    ) : (
                      <div className="mb-4 flex justify-center items-center h-40 bg-gray-200 rounded-md">
                        <p className="text-gray-500 text-center">File: {doc.fileDescription}</p>
                      </div>
                    )}

                    <h3 className="font-semibold text-lg sm:text-xl">
                      File Name: <span className="text-blue-gray-400">{doc.fileDescription}</span>
                    </h3>

                    <small className="font-semibold text-sm">
                      Date: <span className="text-green-300">{formatDate(doc.currentDate)}</span>
                    </small>
                    <p className="mb-4">
                      Category: <span className="font-medium text-red-200 uppercase">{doc.category}</span>
                    </p>

                  {/* Conditionally render Next Visit if it exists */}
                  {doc.nextVisit && (
                    <p className="mb-2">
                      Next Visit: <span className="font-medium text-blue-800 uppercase">{formatDate(doc.nextVisit)}</span>
                    </p>
                  )}                    

                    {/* Render the DownloadButton for each document */}
                    <DownloadButton uploadId={doc._id} fileDescription={doc.fileDescription} />
                    <DeleteButton onDelete={() => handleDelete(doc._id)} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-lg">No documents uploaded yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Display_Files;
