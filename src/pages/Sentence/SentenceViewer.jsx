import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

import './SentenceViewer.css';
import EditModal from '../EditModal';
import VocabList from '../VocabList/VocabList';

const SentenceViewer = () => {
  const [data, setData] = useState([]);
  const [allHeadings, setAllHeadings] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedSentence, setSelectedSentence] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [resetModal, setResetModal] = useState(false);

  const [viewMode, setViewMode] = useState("sentences"); // ✅ default for mobile
  const [isMobile, setIsMobile] = useState(false);

  const [filterHeading, setFilterHeading] = useState("");
  const { heading } = useParams();

  const apiUrl = import.meta.env.DEV
    ? import.meta.env.VITE_LOCAL_API_URL
    : import.meta.env.VITE_PROD_API_URL;

  const token = localStorage.getItem("jwtoken");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // ✅ detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("jwtoken");
    setIsLoggedIn(!!token);
  }, []);

  const fetchSentences = async () => {
    setLoading(true);
    try {
      let res, json;
      if (heading || filterHeading) {
        const effectiveHeading = heading || filterHeading;
        res = await fetch(`${apiUrl}/language/sentences/${effectiveHeading}`);
        json = await res.json();
        setData([json]);
        setTotalPages(1);
      } else {
        res = await fetch(`${apiUrl}/language/sentences`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ clientLang: "en", page }),
        });
        json = await res.json();
        setData(json.data);
        setTotalPages(isLoggedIn ? json.totalPages : Math.min(5, json.totalPages));
      }
    } catch (err) {
      console.error("Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllHeadings = async () => {
    try {
      const res = await fetch(`${apiUrl}/language/all-sentence-data`);
      const json = await res.json();
      const headings = json.map(g => g.Heading);
      setAllHeadings(headings);
    } catch (err) {
      console.error("Failed to fetch headings:", err.message);
    }
  };

  useEffect(() => {
    fetchSentences();
  }, [page, isLoggedIn, heading, filterHeading]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchAllHeadings();
    }
  }, [isLoggedIn]);

  const handleEdit = (sentence) => {
    setSelectedSentence(sentence);
    setModalOpen(true);
  };

  const handleUpdate = async (newValue) => {
    try {
      await fetch(`${apiUrl}/language/update-translation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          original: selectedSentence.original,
          lang: 'hi',
          newValue,
        }),
      });
      setModalOpen(false);
      fetchSentences();
    } catch (err) {
      console.error("Update failed:", err.message);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('jwtoken');
        const response = await fetch(`${apiUrl}/user/getData`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data && data.isAdmin !== undefined) {
          localStorage.setItem('isAdmin', data.isAdmin);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const filteredData = filterHeading
    ? data.filter(group => group.heading === filterHeading || group.Heading === filterHeading)
    : data;

  return (
    <div className="page-container">
      {/* ✅ Mobile toggle buttons */}
      {isMobile && (
        <div className="mobile-toggle">
          <button
            className={viewMode === "sentences" ? "active" : ""}
            onClick={() => setViewMode("sentences")}
          >
            📖 Sentences
          </button>
          <button
            className={viewMode === "vocab" ? "active" : ""}
            onClick={() => setViewMode("vocab")}
          >
            📝 Vocab
          </button>
        </div>
      )}

      {/* Sidebar (only show if not mobile OR vocab mode) */}
      {!isMobile || viewMode === "vocab" ? (
        <aside className="sidebar">
          {data.length > 0 && (
            <VocabList vocab={data.flatMap(group => group.vocab)} />
          )}
        </aside>
      ) : null}

      {/* Main Content (only show if not mobile OR sentences mode) */}
      {!isMobile || viewMode === "sentences" ? (
        <main className="main-content">
          {loading ? (
            <p className="loading-text">Loading...</p>
          ) : (
            <>
              {isLoggedIn && (
                <div className="filter-container">
                  <label htmlFor="headingFilter">Filter by Heading: </label>
                  <select
                    id="headingFilter"
                    value={filterHeading}
                    onChange={(e) => setFilterHeading(e.target.value)}
                  >
                    <option value="">All</option>
                    {allHeadings.map((heading, idx) => (
                      <option key={idx} value={heading}>{heading}</option>
                    ))}
                  </select>
                </div>
              )}

              {filteredData.map((group, index) => (
                <div className="sentence-card" key={index}>
                  {group.VideoUrl ? (
                    <div className="video-container">
                      <video
                        src={group.VideoUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    </div>
                  ) : group.ImageUrl ? (
                    <div className="image-container">
                      <img src={group.ImageUrl} alt="Group" />
                    </div>
                  ) : null}

                  <h3 className="group-heading">{group.heading}</h3>
                  <table className="sentence-table">
                    <thead>
                      <tr>
                        <th>Original</th>
                        <th>Hindi</th>
                        {isAdmin && <th>Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {group.translations.map((t, idx) => (
                        <tr key={idx}>
                          <td>{t.original}</td>
                          <td className="hindi-font">{t.hindi}</td>
                          {isAdmin && (
                            <td className="action-buttons">
                              <button onClick={() => handleEdit(t)}>Edit</button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}

              {/* Pagination */}
              <div className="flex items-center justify-center space-x-4 mt-6">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition
                    ${page === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"}`}
                >
                  ⬅️ Previous
                </button>

                <span className="text-gray-700 font-medium">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition
                    ${page === totalPages
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"}`}
                >
                  Next ➡️
                </button>
              </div>

              {!isLoggedIn && totalPages >= 5 && (
                <div className="login-prompt">
                  <p>
                    Want to see more sentences? <a href="/login">Login</a> to access all content.
                  </p>
                </div>
              )}
            </>
          )}

          <EditModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSubmit={handleUpdate}
            sentence={selectedSentence}
            reset={resetModal}
          />
        </main>
      ) : null}
    </div>
  );
};

export default SentenceViewer;
