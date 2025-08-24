import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EmailList.css"; // Import CSS

const apiUrl = import.meta.env.DEV
  ? import.meta.env.VITE_LOCAL_API_URL
  : import.meta.env.VITE_PROD_API_URL;

const token = localStorage.getItem("jwtoken");

const EmailList = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [selectedEmailId, setSelectedEmailId] = useState(null);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const response = await axios.get(`${apiUrl}/messages/all_messages`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setEmails(response.data);
    } catch (error) {
      console.error("Error fetching emails:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (emailId) => {
    if (!replyText) return alert("Reply message cannot be empty");

    try {
      await axios.post(
        `${apiUrl}/messages/reply/${emailId}`,
        { replyMessage: replyText },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      alert("Reply sent successfully!");
      setReplyText("");
      setSelectedEmailId(null);
      fetchEmails(); // Refresh the email list
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Failed to send reply");
    }
  };

  const handleDelete = async (emailId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      await axios.delete(`${apiUrl}/messages/delete/${emailId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      alert("Email deleted successfully!");
      setEmails(emails.filter((email) => email._id !== emailId));
    } catch (error) {
      console.error("Error deleting email:", error);
      alert("Failed to delete email");
    }
  };

  return (
    <div className="email_main_container">

      {loading ? (
        <p>Loading messages...</p>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead className="thead-dark">
              <tr>
                <th>Email</th>
                <th>Message</th>
                <th>Timestamp</th>
                <th>Replies</th>
                <th>Reply</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {emails.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No emails found
                  </td>
                </tr>
              ) : (
                emails.map((email) => (
                  <tr key={email._id}>
                    <td>{email.email}</td>
                    <td>{email.message}</td>
                    <td>{new Date(email.timestamp).toLocaleString()}</td>
                    <td>
                      {email.replies && email.replies.length > 0 ? (
                        <ul>
                          {email.replies.map((reply, index) => (
                            <li key={index}>
                              {reply.message} ({new Date(reply.timestamp).toLocaleString()})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No replies yet</p>
                      )}
                    </td>

                    <td>
                      {selectedEmailId === email._id ? (
                        <div className="reply-container">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Type your reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                          />
                          <button className="replyButton" onClick={() => handleReply(email._id)}>
                            Send Reply
                          </button>
                        </div>
                      ) : (
                        <button className="btn btn-success" onClick={() => setSelectedEmailId(email._id)}>
                          Reply
                        </button>
                      )}
                    </td>


                    <td>
                      <button
                        className="deleteButton"
                        onClick={() => handleDelete(email._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmailList;
