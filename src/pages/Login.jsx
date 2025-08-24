import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { userContext } from '../App';
import successIcon from '../Images/gif/success.gif';
import './Login.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(userContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const loginUser = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      return window.alert("Please fill all the details...");
    }

    setLoading(true);
    const apiUrl = import.meta.env.DEV ? import.meta.env.VITE_LOCAL_API_URL : import.meta.env.VITE_PROD_API_URL;

    try {
      const res = await fetch(`${apiUrl}/user/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password }),
        credentials: 'include',
      });

      const data = await res.json();

      if (res.status === 200 && data.status === "SUCCESS") {
        localStorage.setItem('jwtoken', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data.user));

        dispatch({ type: 'USER', payload: { isAuthenticated: true, userInfo: data.user } });

        setShowSuccess(true);
        setTimeout(() => navigate('/english'), 1500);
      } else {
        window.alert(data.message || "Invalid Credentials");
      }
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showSuccess ? (
        <div className="overlay">
          <img src={successIcon} alt="Login Successful" className="success-icon" />
        </div>
      ) : (
        <div className="login-container">
          <div className="login-box">
            <h2>Welcome Back</h2>
            <p className="subtitle">Login to continue</p>

            <form onSubmit={loginUser}>
              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "Loading..." : "Login"}
              </button>

              <div className="forgot-password">
                <NavLink to="/forgot-password">Forgot Password?</NavLink>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;
