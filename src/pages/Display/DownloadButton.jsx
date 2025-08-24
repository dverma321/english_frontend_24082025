import React from 'react';

const DownloadButton = ({ uploadId, fileDescription }) => {
  const handleDownload = async () => {
    try {
      const VITE_LOCAL_API_URL = import.meta.env.VITE_LOCAL_API_URL;
      const VITE_PROD_API_URL = import.meta.env.VITE_PROD_API_URL;
      const apiUrl = import.meta.env.DEV ? VITE_LOCAL_API_URL : VITE_PROD_API_URL;

      const response = await fetch(`${apiUrl}/uploadfile/download/${uploadId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtoken')}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;

      // Use fileDescription as the file name, or provide a default if not available
      const fileName = fileDescription ? `${fileDescription}` : `file_${uploadId}`;
      link.setAttribute('download', fileName);

      document.body.appendChild(link);
      link.click();

      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <button 
      onClick={handleDownload} 
      className="bg-green-400 text-white p-2 rounded hover:bg-green-800"
      aria-label="Download File"
    >
      Download File
    </button>
  );
};

export default DownloadButton;
