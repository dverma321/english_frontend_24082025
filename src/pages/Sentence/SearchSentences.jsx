import React, { useState } from "react";
import "./SearchSentences.css";

const SearchSentences = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.DEV
    ? import.meta.env.VITE_LOCAL_API_URL
    : import.meta.env.VITE_PROD_API_URL;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResults([]);
    try {
      const res = await fetch(`${apiUrl}/language/search-sentences?q=${encodeURIComponent(query)}`);
      const json = await res.json();
      if (json.success) {
        setResults(json.data);
      }
    } catch (err) {
      console.error("Search failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-sentences-container">
      <h2 className="search-heading">🔍 Search Sentences</h2>

      {/* Search Box */}
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Type a word or phrase (English or Hindi)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-btn">Search</button>
      </form>

      {/* Loading State */}
      {loading && (
        <div className="loading-box">
          <div className="spinner"></div>
          <p>Searching...</p>
        </div>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div className="results-list">
          {results.map((item, idx) => (
            <div key={idx} className="result-card">
              <div className="result-header">
                <span className="heading-label">{item.heading}</span>
              </div>

              <div className="sentence-row">
                <div className="lang-box en">
                  <span className="lang-label">EN</span>
                  <p className="sentence-text">{item.original}</p>
                </div>

                <div className="lang-box hi">
                  <span className="lang-label">HI</span>
                  <p className="sentence-text hindi-font">
                    {item.hindi || <span className="no-translation">No Hindi translation yet</span>}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && query && results.length === 0 && (
        <div className="no-results">
          <p>No results found for "<b>{query}</b>"</p>
        </div>
      )}
    </div>
  );
};

export default SearchSentences;
