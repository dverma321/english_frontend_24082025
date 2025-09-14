import React, { useEffect, useState, useRef } from "react";
import './VocabList.css';

const WordList = () => {
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

  const [editingWord, setEditingWord] = useState(null);
  const [newMeaning, setNewMeaning] = useState("");
  const [newPronunciation, setNewPronunciation] = useState("");

  const [highlight, setHighlight] = useState(false);
  const meaningRef = useRef(null);
  const pronunciationRef = useRef(null);

  // ✅ Fetch words with pagination
  const fetchWords = async (currentPage = 1) => {
    try {
      const res = await fetch(`${apiUrl}/vocab/words?page=${currentPage}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setWords(data.words);
      setFilteredWords(data.words);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Error fetching words:", err);
    }
  };

  useEffect(() => {
    fetchWords(page);
  }, [page]);

  // ✅ Search vocab from backend
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm.trim() === "") {
        setFilteredWords(words); // fallback to current page
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
        alert("Word updated!");
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
    <div className="container mt-4 vocab-app">

      {/* Sticky Header */}
      <div className="sticky-header">
        <div className="image-container">
          <img
            src="https://raw.githubusercontent.com/dverma321/english/main/photos/english.png"
            alt="English"
          />
        </div>

        {token ? (
          <div className="mb-3 search-box">
            <input
              type="text"
              className="form-control"
              placeholder="Search word, synonym or antonym"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        ) : (
          <p className="text-center text-red-600 font-medium my-4">
            🔑 Login to filter and More Vocabs...
          </p>
        )}
      </div>

      {/* 📌 Table Wrapper */}
      <div className="table-wrapper">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Word</th>
              <th>Hindi</th>
              <th>Pronounciation</th>
              <th>Synonyms</th>
              <th>Antonyms</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredWords.map((w, i) => (
              <tr key={i}>
                <td className="word">{w.word}</td>
                <td className="vocab-hindi-font">
                  {editingWord === w.word ? (
                    <input
                      type="text"
                      ref={meaningRef}
                      className={`form-control ${highlight ? "input-blue-focus" : ""}`}
                      value={newMeaning}
                      onChange={(e) => setNewMeaning(e.target.value)}
                    />
                  ) : (
                    w.hindiMeaning || ""
                  )}
                </td>

                <td className="pronounciation-hindi-font">
                  {editingWord === w.word ? (
                    <input
                      type="text"
                      ref={pronunciationRef}
                      className={`form-control ${highlight ? "input-red-focus" : ""}`}
                      value={newPronunciation}
                      onChange={(e) => setNewPronunciation(e.target.value)}
                    />
                  ) : (
                    w.pronounciation || ""
                  )}
                </td>

                <td className="synonyms">{w.synonyms.join(", ")}</td>
                <td className="antonyms">{w.antonyms.join(", ")}</td>

                {isAdmin && (
                  <td>
                    {editingWord === w.word ? (
                      <>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleSave(w.word)}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditingWord(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setEditingWord(w.word);
                          setNewMeaning(w.hindiMeaning || "");
                          setNewPronunciation(w.pronounciation || "");
                          setHighlight(true);
                          setTimeout(() => {
                            if (meaningRef.current) meaningRef.current.focus();
                          }, 0);
                        }}
                      >
                        {w.hindiMeaning || w.pronounciation ? "Edit" : "Add"}
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination completely OUTSIDE the scrollable table */}
      {token && (
        <div className="pagination-container">
          <button
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition
            ${page === 1
                ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                : "bg-white text-blue-600 border-blue-500 hover:bg-blue-50 active:bg-blue-100"
              }`}
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>

          <span className="mx-3 text-gray-700 font-semibold">
            Page {page} of {totalPages}
          </span>

          <button
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition
            ${page === totalPages
                ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                : "bg-white text-blue-600 border-blue-500 hover:bg-blue-50 active:bg-blue-100"
              }`}
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default WordList;
