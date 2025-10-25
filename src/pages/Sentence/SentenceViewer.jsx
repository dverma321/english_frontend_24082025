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

  const [activeTab, setActiveTab] = useState("sentences");
  const [filterHeading, setFilterHeading] = useState("");
  const { heading } = useParams();

  const apiUrl = import.meta.env.DEV
    ? import.meta.env.VITE_LOCAL_API_URL
    : import.meta.env.VITE_PROD_API_URL;

  const token = localStorage.getItem("jwtoken");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

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
        res = await fetch(`${apiUrl}/sentences/sentences/${effectiveHeading}`);
        json = await res.json();
        setData([json]);
        setTotalPages(1);
      } else {
        res = await fetch(`${apiUrl}/sentences/sentences`, {
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
      await fetch(`${apiUrl}/sentences/update-translation`, {
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
    <div className="sentence-viewer-container">
      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === "sentences" ? "active" : ""}`}
          onClick={() => setActiveTab("sentences")}
        >
          <span className="tab-icon">📖</span>
          <span className="tab-text">Sentences</span>
        </button>
        <button 
          className={`tab-button ${activeTab === "vocab" ? "active" : ""}`}
          onClick={() => setActiveTab("vocab")}
        >
          <span className="tab-icon">📝</span>
          <span className="tab-text">Vocabulary</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="tab-content">
        {activeTab === "sentences" && (
          <div className="sentences-tab">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading sentences...</p>
              </div>
            ) : (
              <>
                {isLoggedIn && (
                  <div className="filter-container">
                    <label htmlFor="headingFilter">Filter by Heading: </label>
                    <select
                      id="headingFilter"
                      value={filterHeading}
                      onChange={(e) => setFilterHeading(e.target.value)}
                      className="heading-filter"
                    >
                      <option value="">All</option>
                      {allHeadings.map((heading, idx) => (
                        <option key={idx} value={heading}>{heading}</option>
                      ))}
                    </select>
                  </div>
                )}

                {filteredData.length === 0 ? (
                  <div className="empty-state">
                    <p>No sentences found{filterHeading ? ` for "${filterHeading}"` : ""}.</p>
                  </div>
                ) : (
                  <div className="cards-grid">
                    {filteredData.map((group, index) => (
                      <div className="group-card" key={index}>
                        {/* Card Header with Media */}
                        <div className="card-header">
                          {group.VideoUrl ? (
                            <div className="media-container">
                              <video
                                src={group.VideoUrl}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="media-element"
                              />
                              <div className="media-overlay"></div>
                            </div>
                          ) : group.ImageUrl ? (
                            <div className="media-container">
                              <img src={group.ImageUrl} alt="Group" className="media-element" />
                              <div className="media-overlay"></div>
                            </div>
                          ) : (
                            <div className="media-placeholder">
                              <span>📚</span>
                            </div>
                          )}
                          
                          <div className="group-heading-section">
                            <h3 className="group-heading">{group.heading || group.Heading}</h3>
                            <div className="sentence-count">
                              {group.translations?.length || 0} sentences
                            </div>
                          </div>
                        </div>

                        {/* Sentences List */}
                        <div className="sentences-container">
                          {group.translations?.map((t, idx) => (
                            <div className="sentence-card" key={idx}>
                              <div className="sentence-content">
                                <div className="language-badge english-badge">EN</div>
                                <div className="sentence-original">
                                  {t.original}
                                </div>
                                <div className="language-badge hindi-badge">HI</div>
                                <div className="sentence-hindi hindi-font">
                                  {t.hindi}
                                </div>
                              </div>
                              
                              {isAdmin && (
                                <div className="sentence-actions">
                                  <button 
                                    className="edit-btn"
                                    onClick={() => handleEdit(t)}
                                    aria-label="Edit sentence"
                                  >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {!heading && !filterHeading && (
                  <div className="pagination-container">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="pagination-btn prev"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Previous
                    </button>

                    <span className="page-indicator">
                      Page {page} of {totalPages}
                    </span>

                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="pagination-btn next"
                    >
                      Next
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                )}

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
          </div>
        )}

        {activeTab === "vocab" && (
          <div className="vocab-tab">
            {data.length > 0 ? (
              <VocabList vocab={data.flatMap(group => group.vocab)} />
            ) : (
              <div className="empty-state">
                <p>No vocabulary available. View sentences first to see vocabulary.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SentenceViewer;
