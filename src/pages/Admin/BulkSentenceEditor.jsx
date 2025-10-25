import React, { useEffect, useState } from "react";
import "./BulkSentenceEditor.css";

export const BulkSentenceEditor = () => {
  const [sentences, setSentences] = useState([]);
  const [filteredSentences, setFilteredSentences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const apiUrl = import.meta.env.DEV
    ? import.meta.env.VITE_LOCAL_API_URL
    : import.meta.env.VITE_PROD_API_URL;

  const token = localStorage.getItem("jwtoken");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // Calculate sentences per screen
  const sentencesPerScreen = Math.ceil(filteredSentences.length / 3);
  const totalScreens = Math.max(1, Math.ceil(filteredSentences.length / sentencesPerScreen));

  // Get current screen sentences
  const getCurrentScreenSentences = () => {
    const startIndex = currentScreen * sentencesPerScreen;
    const endIndex = startIndex + sentencesPerScreen;
    return filteredSentences.slice(startIndex, endIndex);
  };

  // ✅ Fetch all sentences (flat list, no heading filter)
  const fetchAllSentences = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/language/all-sentences`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });

      const json = await res.json();
      if (json?.data) {
        setSentences(json.data);
        setFilteredSentences(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch sentences:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSentences();
  }, []);

  // ✅ Search functionality
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSentences(sentences);
      setCurrentScreen(0);
    } else {
      const filtered = sentences.filter(sentence =>
        sentence.original.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sentence.hindi?.value?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSentences(filtered);
      setCurrentScreen(0);
    }
  }, [searchTerm, sentences]);

  // ✅ Handle inline edit
  const handleSentenceChange = (index, newValue) => {
    const globalIndex = sentences.findIndex(s => s.original === filteredSentences[index].original);
    
    setSentences((prev) =>
      prev.map((s, i) =>
        i === globalIndex ? { ...s, hindi: { ...s.hindi, value: newValue } } : s
      )
    );

    setFilteredSentences((prev) =>
      prev.map((s, i) =>
        i === index ? { ...s, hindi: { ...s.hindi, value: newValue } } : s
      )
    );
  };

  // ✅ Bulk update all sentences
  const handleBulkUpdate = async () => {
    try {
      const updates = sentences.map((s) => ({
        original: s.original,
        lang: "hi",
        newValue: s.hindi?.value || "",
      }));

      const res = await fetch(`${apiUrl}/language/bulk-update-translations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ updates }),
      });

      const result = await res.json();
      alert(result.message || "✅ All sentences updated successfully!");
    } catch (err) {
      console.error("Bulk update failed:", err.message);
      alert("❌ Failed to update sentences.");
    }
  };

  // Navigation handlers
  const handleNextScreen = () => {
    if (currentScreen < totalScreens - 1) {
      setCurrentScreen(currentScreen + 1);
    }
  };

  const handlePrevScreen = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="bulk-sentence-editor">
      {loading ? (
        <div className="loading">
          <p>Loading all sentences...</p>
        </div>
      ) : (
        <>
          {/* Search and Update section */}
          <div className="controls-section">
            {/* Search functionality */}
            <div className="search-container">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Search in English or Hindi sentences..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                {searchTerm && (
                  <button className="clear-search-btn" onClick={handleClearSearch}>
                    ✕
                  </button>
                )}
              </div>
              <div className="search-results-info">
                Showing {filteredSentences.length} of {sentences.length} sentences
                {searchTerm && (
                  <span className="search-term">
                    for "{searchTerm}"
                  </span>
                )}
              </div>
            </div>

            {/* Update button */}
            {isAdmin && (
              <div className="update-container top-update-container">
                <button className="update-btn" onClick={handleBulkUpdate}>
                  💾 Update All Sentences
                </button>
              </div>
            )}
          </div>

          {/* Screen navigation */}
          {filteredSentences.length > 0 && (
            <>
              <div className="screen-navigation">
                <button
                  className="nav-btn"
                  onClick={handlePrevScreen}
                  disabled={currentScreen === 0}
                >
                  ◀ Previous
                </button>

                <span className="screen-indicator">
                  Screen {currentScreen + 1} of {totalScreens}
                  {searchTerm && ` (${filteredSentences.length} results)`}
                </span>

                <button
                  className="nav-btn"
                  onClick={handleNextScreen}
                  disabled={currentScreen === totalScreens - 1}
                >
                  Next ▶
                </button>
              </div>

              {/* Current screen sentences */}
              <div className="sentence-list">
                {getCurrentScreenSentences().map((s, idx) => {
                  const displayIndex = currentScreen * sentencesPerScreen + idx;
                  return (
                    <div key={displayIndex} className="sentence-row">
                      <div className="original">
                        <span className="lang-badge">EN</span> 
                        <span 
                          dangerouslySetInnerHTML={{
                            __html: searchTerm ? 
                              s.original.replace(
                                new RegExp(searchTerm, 'gi'),
                                match => `<mark class="highlight">${match}</mark>`
                              ) : s.original
                          }}
                        />
                      </div>
                      <div className="translation">
                        <span className="lang-badge hi">HI</span>
                        <input
                          type="text"
                          value={s.hindi?.value || ""}
                          onChange={(e) => handleSentenceChange(displayIndex, e.target.value)}
                          className="translation-input hindi-font"
                          placeholder=";gk ij fy[ks"
                        />
                        {searchTerm && s.hindi?.value && (
                          <div className="hindi-preview">
                            <span 
                              dangerouslySetInnerHTML={{
                                __html: s.hindi.value.replace(
                                  new RegExp(searchTerm, 'gi'),
                                  match => `<mark class="highlight">${match}</mark>`
                                )
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom navigation for convenience */}
              <div className="screen-navigation bottom-navigation">
                <button
                  className="nav-btn"
                  onClick={handlePrevScreen}
                  disabled={currentScreen === 0}
                >
                  ◀ Previous
                </button>

                <span className="screen-indicator">
                  Screen {currentScreen + 1} of {totalScreens}
                </span>

                <button
                  className="nav-btn"
                  onClick={handleNextScreen}
                  disabled={currentScreen === totalScreens - 1}
                >
                  Next ▶
                </button>
              </div>
            </>
          )}

          {/* No results message */}
          {filteredSentences.length === 0 && !loading && (
            <div className="no-results">
              <p>No sentences found matching "{searchTerm}"</p>
              <button className="clear-search-btn large" onClick={handleClearSearch}>
                Clear Search
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BulkSentenceEditor;