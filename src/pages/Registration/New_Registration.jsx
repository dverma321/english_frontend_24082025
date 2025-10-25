import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {userContext} from '../../App';
import axios from 'axios';
import './New_Registration.css';

const Registration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  
  const navigate = useNavigate();
const { dispatch } = useContext(userContext);
  

  const apiUrl = import.meta.env.DEV
    ? import.meta.env.VITE_LOCAL_API_URL
    : import.meta.env.VITE_PROD_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Check password strength in real-time
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&#]/.test(password);
    const isLongEnough = password.length >= 8;

    if (!password) {
      setPasswordStrength('');
      return;
    }

    if (isLongEnough && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar) {
      setPasswordStrength('strong');
    } else if (password.length >= 6) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('weak');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords don't match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setMessage("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/;
    if (!passwordRegex.test(formData.password)) {
      setMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
        credentials: 'include'
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('Registration successful! Logging you in...');
        
        // Clear form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        setPasswordStrength('');

        // Auto-login after successful registration
        if (data.token) {
          await handleAutoLogin(data.token);
        } else {
          // If no token in response, redirect to login
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      } else {
        setStatus('error');
        setMessage(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoLogin = async (token) => {
    try {
      // Store the new token in localStorage
      localStorage.setItem("jwtoken", token);

      // Get user data with the new token
      const userRes = await axios.get(`${apiUrl}/user/getData`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true
      });

      // Store user data in localStorage
      const userData = userRes.data.user || userRes.data;
      localStorage.setItem("userData", JSON.stringify(userData));

      // ✅ Dispatch to context, necessary to update global state here userInfo is handling
      dispatch({ 
        type: 'USER', 
        payload: { 
          isAuthenticated: true, 
          userInfo: userData 
        } 
      });
      
      // Trigger storage event to update other components
      window.dispatchEvent(new Event("storage"));
      
      // Redirect to dashboard or home page
      setTimeout(() => {
        navigate("/english");
      }, 1000);

    } catch (error) {
      console.error('Auto-login error:', error);
      setStatus('error');
      setMessage('Registration successful but auto-login failed. Please login manually.');
      
      // Redirect to login page if auto-login fails
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return '#ff4444';
      case 'medium': return '#ffaa00';
      case 'strong': return '#00c851';
      default: return '#666';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 'weak': return 'Weak';
      case 'medium': return 'Medium';
      case 'strong': return 'Strong';
      default: return '';
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <div className="registration-header">
          <h1>Create Account</h1>
          <p>Join us today and get started</p>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
            <small className="email-hint">
              Only popular domains allowed (Gmail, Yahoo, QQ, Outlook, etc.)
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              minLength="8"
            />
            {passwordStrength && (
              <div className="password-strength">
                <div 
                  className="strength-bar"
                  style={{
                    width: passwordStrength === 'weak' ? '33%' : 
                           passwordStrength === 'medium' ? '66%' : '100%',
                    backgroundColor: getPasswordStrengthColor()
                  }}
                ></div>
                <span style={{ color: getPasswordStrengthColor() }}>
                  {getPasswordStrengthText()}
                </span>
              </div>
            )}
            <small className="password-hint">
              Must contain: uppercase, lowercase, number, special character (@$!%*?&#)
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              minLength="8"
            />
          </div>

          {message && (
            <div className={`message ${status}`}>
              {message}
            </div>
          )}

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="registration-footer">
          <p>
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;