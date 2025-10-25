import React, { useEffect, useState, useRef } from "react";
import './VocabList.css';

const VocabList = () => {
  const apiUrl = import.meta.env.DEV
    ? import.meta.env.VITE_LOCAL_API_URL
    : import.meta.env.VITE_PROD_API_URL;

  const token = localStorage.getItem("jwtoken");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const [words, setWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [editingWord, setEditingWord] = useState(null);
  const [newMeaning, setNewMeaning] = useState("");
  const [newPronunciation, setNewPronunciation] = useState("");

  const [highlight, setHighlight] = useState(false);
  const meaningRef = useRef(null);
  const pronunciationRef = useRef(null);

  // ✅ Fetch words with pagination
  const fetchWords = async (currentPage = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/vocab/words?page=${currentPage}&limit=6`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setWords(data.words);
      setFilteredWords(data.words);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Error fetching words:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWords(page);
  }, [page]);

  // ✅ Search vocab from backend
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm.trim() === "") {
        setFilteredWords(words);
        return;
      }
      try {
        const res = await fetch(`${apiUrl}/vocab/search?q=${searchTerm}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setFilteredWords(data);
      } catch (err) {
        console.error("Error searching words:", err);
      }
    };

    fetchSearchResults();
  }, [searchTerm, words]);

  // ✅ Save Hindi + Pronunciation
  const handleSave = async (word) => {
    try {
      const res = await fetch(`${apiUrl}/vocab/words/${word}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hindiMeaning: newMeaning,
          pronounciation: newPronunciation,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Word updated successfully!");
        setEditingWord(null);
        setNewMeaning("");
        setNewPronunciation("");
        fetchWords(page);
      } else {
        alert(data.error || "Failed to save");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving word");
    }
  };

  return (
    <div className="vocab-viewer-container">
      {/* Modern Header */}
      <div className="modern-header">
        <div className="header-content">
          <h1 className="header-title">
            <span className="title-icon">📚</span>
            Vocabulary Builder
          </h1>
          <p className="header-subtitle">Expand your vocabulary with words, synonyms, and antonyms</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Search and Filter Section */}
        {token ? (
          <div className="modern-search-container">
            <div className="search-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <span>Search Vocabulary</span>
            </div>
            <input
              type="text"
              className="modern-search-input"
              placeholder="Search for words, synonyms, or antonyms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        ) : (
          <div className="modern-login-prompt-small">
            <div className="login-prompt-icon">🔑</div>
            <p>Login to access advanced vocabulary features and search</p>
            <a href="/login" className="login-cta-small">Sign In</a>
          </div>
        )}

        {/* Vocabulary Cards Grid */}
        {loading ? (
          <div className="modern-loading-container">
            <div className="modern-spinner">
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
            </div>
            <p>Loading vocabulary...</p>
          </div>
        ) : (
          <div className="vocab-cards-grid">
            {filteredWords.length === 0 ? (
              <div className="modern-empty-state">
                <div className="empty-state-icon">📖</div>
                <h3>No words found</h3>
                <p>{searchTerm ? `No results for "${searchTerm}"` : "Start building your vocabulary"}</p>
              </div>
            ) : (
              filteredWords.map((word, index) => (
                <div className="vocab-card" key={index}>
                  {/* Word Header */}
                  <div className="vocab-card-header">
                    <h3 className="word-title">{word.word}</h3>
                    <div className="word-badge">Word</div>
                  </div>

                  {/* Word Details */}
                  <div className="vocab-details">
                    {/* Hindi Meaning */}
                    <div className="detail-row">
                      <div className="detail-label">
                        <span className="label-icon">🇮🇳</span>
                        Hindi Meaning
                      </div>
                      <div className="detail-content">
                        {editingWord === word.word ? (
                          <input
                            type="text"
                            ref={meaningRef}
                            className={`modern-input ${highlight ? "input-blue-focus" : ""}`}
                            value={newMeaning}
                            onChange={(e) => setNewMeaning(e.target.value)}
                            placeholder="Enter Hindi meaning"
                          />
                        ) : (
                          <span className="hindi-text vocab-hindi-font">
                            {word.hindiMeaning || "Not added"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Pronunciation */}
                    <div className="detail-row">
                      <div className="detail-label">
                        <span className="label-icon">🔊</span>
                        Pronunciation
                      </div>
                      <div className="detail-content">
                        {editingWord === word.word ? (
                          <input
                            type="text"
                            ref={pronunciationRef}
                            className={`modern-input ${highlight ? "input-red-focus" : ""}`}
                            value={newPronunciation}
                            onChange={(e) => setNewPronunciation(e.target.value)}
                            placeholder="Enter pronunciation"
                          />
                        ) : (
                          <span className="pronunciation-text vocab-hindi-font">
                            {word.pronounciation || "Not added"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Synonyms */}
                    <div className="detail-row">
                      <div className="detail-label">
                        <span className="label-icon">🔄</span>
                        Synonyms
                      </div>
                      <div className="detail-content">
                        <div className="tags-container">
                          {word.synonyms && word.synonyms.length > 0 ? (
                            word.synonyms.map((synonym, idx) => (
                              <span key={idx} className="tag synonym-tag">
                                {synonym}
                              </span>
                            ))
                          ) : (
                            <span className="no-data">No synonyms</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Antonyms */}
                    <div className="detail-row">
                      <div className="detail-label">
                        <span className="label-icon">⚡</span>
                        Antonyms
                      </div>
                      <div className="detail-content">
                        <div className="tags-container">
                          {word.antonyms && word.antonyms.length > 0 ? (
                            word.antonyms.map((antonym, idx) => (
                              <span key={idx} className="tag antonym-tag">
                                {antonym}
                              </span>
                            ))
                          ) : (
                            <span className="no-data">No antonyms</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isAdmin && (
                    <div className="vocab-actions">
                      {editingWord === word.word ? (
                        <div className="edit-actions">
                          <button
                            className="modern-btn save-btn"
                            onClick={() => handleSave(word.word)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                              <polyline points="17 21 17 13 7 13 7 21"/>
                              <polyline points="7 3 7 8 15 8"/>
                            </svg>
                            Save
                          </button>
                          <button
                            className="modern-btn cancel-btn"
                            onClick={() => setEditingWord(null)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <line x1="18" y1="6" x2="6" y2="18"/>
                              <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          className="modern-btn edit-btn"
                          onClick={() => {
                            setEditingWord(word.word);
                            setNewMeaning(word.hindiMeaning || "");
                            setNewPronunciation(word.pronounciation || "");
                            setHighlight(true);
                            setTimeout(() => {
                              if (meaningRef.current) meaningRef.current.focus();
                            }, 0);
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                          {word.hindiMeaning || word.pronounciation ? "Edit" : "Add Meaning"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {token && filteredWords.length > 0 && (
          <div className="modern-pagination">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="pagination-arrow prev"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </button>
            
            <div className="pagination-info">
              Page <span className="current-page">{page}</span> of {totalPages}
            </div>
            
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="pagination-arrow next"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default VocabList;
=======
export default VocabList;
>>>>>>> d784ac2d866d74585e791f7d9ab1e83080012392
