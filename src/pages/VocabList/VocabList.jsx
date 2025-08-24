import React, { useEffect, useState } from "react";
import './VocabList.css';

const WordList = () => {
  const apiUrl = import.meta.env.DEV
    ? import.meta.env.VITE_LOCAL_API_URL
    : import.meta.env.VITE_PROD_API_URL;

  const token = localStorage.getItem("jwtoken");
  const isAdmin = localStorage.getItem("isAdmin") === "true";


  const [words, setWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [editingWord, setEditingWord] = useState(null);
  const [newMeaning, setNewMeaning] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch words
  const fetchWords = async () => {
    try {
      const res = await fetch(`${apiUrl}/vocab/words`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setWords(data);
      setFilteredWords(data); // initialize filter
    } catch (err) {
      console.error("Error fetching words:", err);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  // ✅ Search filter
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredWords(words);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredWords(
        words.filter((w) =>
          w.word.toLowerCase().includes(term) ||
          w.synonyms.some((s) => s.toLowerCase().includes(term)) ||
          w.antonyms.some((a) => a.toLowerCase().includes(term)) ||
          (w.hindiMeaning && w.hindiMeaning.toLowerCase().includes(term))
        )
      );
    }
  }, [searchTerm, words]);

  // ✅ Save Hindi meaning
  const handleSave = async (word) => {
    try {
      const res = await fetch(`${apiUrl}/vocab/words/${word}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ hindiMeaning: newMeaning }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Hindi meaning saved!");
        setEditingWord(null);
        setNewMeaning("");
        fetchWords();
      } else {
        alert(data.error || "Failed to save");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving meaning");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">📘 Vocabulary Manager</h2>

      {/* 🔍 Search Box */}
      <div className="mb-3 search-box">
        <input
          type="text"
          className="form-control"
          placeholder="Search word, synonym, antonym ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Word</th>
            <th>Synonyms</th>
            <th>Antonyms</th>
            <th>Hindi</th>
            {isAdmin && <th>Actions</th>}

          </tr>
        </thead>
        <tbody>
          {filteredWords.map((w, i) => (
            <tr key={i}>
              <td>{w.word}</td>
              <td>{w.synonyms.join(", ")}</td>
              <td>{w.antonyms.join(", ")}</td>
              
              <td className="vocab-hindi-font">
                {editingWord === w.word ? (
                  <input
                    type="text"
                    className="form-control"
                    value={newMeaning}
                    onChange={(e) => setNewMeaning(e.target.value)}
                  />
                ) : (
                  w.hindiMeaning || ""
                )}
              </td>

                {isAdmin && (  // ✅ buttons only for admin
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
                      }}
                    >
                      {w.hindiMeaning ? "Edit" : "Add"}
                    </button>
                  )}
                </td>
              )}


            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WordList;
