import React, { useState, useEffect, useContext  } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {userContext} from '../App';
import axios from "axios";


const apiUrl = import.meta.env.DEV
  ? import.meta.env.VITE_LOCAL_API_URL
  : import.meta.env.VITE_PROD_API_URL;

function CompleteProfile() {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePassword, setProfilePassword] = useState("");
  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [profilePasswordError, setProfilePasswordError] = useState("");
  const navigate = useNavigate();
  const { dispatch } = useContext(userContext);


  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const urlEmail = queryParams.get("email");

    if (urlEmail) {
      setEmail(urlEmail);
    } else {
      const token = localStorage.getItem("jwtoken");
      if (token) {
        axios
          .get(`${apiUrl}/user/getData`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true
          })
          .then((res) => {
            const { email, name, isAdmin } = res.data;
            setEmail(email);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  }, [location.search]);

  const validatePassword = (pass) => {
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    return hasUpperCase && hasSpecialChar;
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    
    if (value && !validatePassword(value)) {
      setPasswordError("Password must contain at least one uppercase letter and one special character");
    } else {
      setPasswordError("");
    }
  };

  const handleProfilePasswordChange = (e) => {
    const value = e.target.value;
    setProfilePassword(value);
    
    if (value === password) {
      setProfilePasswordError("Profile password must be different from login password");
    } else if (value && !validatePassword(value)) {
      setProfilePasswordError("Profile password must contain at least one uppercase letter and one special character");
    } else {
      setProfilePasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${apiUrl}/user/complete-profile`, {
        email,
        name,
        password,
        confirmPassword,
        profilePassword,
      });

      if (res.data.status === "200") {
        // Get the token from the response (not localStorage)
        const token = res.data.token;
        
        if (!token) {
          throw new Error("Authentication token not received");
        }

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

        // ✅ Dispatch to context, necessary to update global state here userInfo is handling
        dispatch({ type: 'USER', payload: { isAuthenticated: true, userInfo: userData } });
        window.dispatchEvent(new Event("storage"));
        
        navigate("/english");
      } else {
        setMessage(res.data.message);
      }
    } catch (error) {
      console.error("Complete profile error:", error);
      if (error.response?.status === 401) {
        setMessage("Session expired - please log in again");
        localStorage.removeItem("jwtoken");
      } else {
        setMessage(error.response?.data?.message || "Error completing profile.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-8 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-10 text-center text-2xl font-serif font-medium text-gold-500 tracking-wider">
          Complete Your Profile
        </h2>
        <p className="mt-1 text-center text-xs text-gray-400">
          Please provide your details to continue
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-6 shadow-xl rounded-lg border border-gray-700">
          {message && (
            <div className="mb-4 bg-gray-700 border-l-4 border-gold-500 p-3">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-4 w-4 text-gold-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-2">
                  <p className="text-xs text-gray-300 font-light">{message}</p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-light uppercase tracking-wider text-gray-400"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-xs bg-gray-700 text-gray-200 appearance-none block w-full px-3 py-2 border border-gray-600 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500"
                  readOnly
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-xs font-light uppercase tracking-wider text-gray-400"
              >
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-xs bg-gray-700 text-gray-200 appearance-none block w-full px-3 py-2 border border-gray-600 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-light uppercase tracking-wider text-gray-400"
              >
                Password
                <span className="text-xxs text-gray-500 block font-normal normal-case mt-0.5">
                  (Must contain uppercase and special character)
                </span>
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  className="text-xs bg-gray-700 text-gray-200 appearance-none block w-full px-3 py-2 border border-gray-600 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500"
                />
                {passwordError && (
                  <p className="mt-1 text-xxs text-red-400">{passwordError}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-light uppercase tracking-wider text-gray-400"
              >
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="text-xs bg-gray-700 text-gray-200 appearance-none block w-full px-3 py-2 border border-gray-600 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="profilePassword"
                className="block text-xs font-light uppercase tracking-wider text-gray-400"
              >
                Profile Password
                <span className="text-xxs text-gray-500 block font-normal normal-case mt-0.5">
                  (Different from login password, must contain uppercase and special character)
                </span>
              </label>
              <div className="mt-1">
                <input
                  id="profilePassword"
                  name="profilePassword"
                  type="password"
                  required
                  value={profilePassword}
                  onChange={handleProfilePasswordChange}
                  className="text-xs bg-gray-700 text-gray-200 appearance-none block w-full px-3 py-2 border border-gray-600 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500"
                />
                {profilePasswordError && (
                  <p className="mt-1 text-xxs text-red-400">{profilePasswordError}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-sm shadow-sm text-xs font-medium uppercase tracking-wider text-gray-900 bg-gold-500 hover:bg-gold-600 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gold-400 transition-colors duration-150"
                disabled={passwordError || profilePasswordError}
              >
                Complete Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CompleteProfile;