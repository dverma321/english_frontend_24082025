import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { userContext } from '../../App';
import 'material-design-iconic-font/dist/css/material-design-iconic-font.min.css';
import whatsappicon from '../../Images/gif/whatsapp.gif';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); // State to manage loading
  const { dispatch } = useContext(userContext);
  const navigation = useNavigate();

  const resetPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      return window.alert("Please Enter the Email Address...");
    }

    const VITE_LOCAL_API_URL = import.meta.env.VITE_LOCAL_API_URL;
    const VITE_PROD_API_URL = import.meta.env.VITE_PROD_API_URL;
    const apiUrl = import.meta.env.DEV ? VITE_LOCAL_API_URL : VITE_PROD_API_URL;

    console.log("Server is running on: ", apiUrl);
    
    setLoading(true); // Set loading to true when the request starts

    try {
      const res = await fetch(`${apiUrl}/forget/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });

      const data = await res.json();

      if(res.status === 404) {
        window.alert('Email is not present...');
        setLoading(false); // Set loading to false if there's an error
        return;
      }

      if (res.status === 200 || data.status === "Success") {
        const { token } = data;
        localStorage.setItem('jwtoken', token);
        dispatch({ type: "USER", payload: true });
        navigation('/login');
        window.alert("Email sent Successfully");
      } else {
        window.alert("Invalid Email Credentials...");
      }
    } catch (error) {
      console.error("Error during reset password:", error);
    } finally {
      setLoading(false); // Ensure loading is set to false after the request completes
    }
  };

  return (
    <div className="flex items-center justify-center h-screen"
    style={{
      backgroundImage: `url('../images/white_green_rose.jpg')`,
      backgroundSize: 'cover', // Ensures the image covers the container
      backgroundPosition: 'center', // Centers the image
      backgroundRepeat: 'no-repeat', // Prevents tiling
    }}
    >
      <div className="bg-white bg-opacity-50 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Forgot Password</h2>

        <form method='POST' id='forgotpassword-form' className="space-y-6">
          <div className="relative">
            <label htmlFor="signinformyouremail" className="block text-sm font-medium text-gray-700 mb-2">
              <i className="zmdi zmdi-email mr-2"></i> Email
            </label>
            <input
              type="email"
              name="email"
              id="signinformyouremail"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className={`w-full py-3 ${loading ? 'bg-gray-400' : 'bg-green-600'} text-white font-semibold rounded-md hover:bg-green-700 transition duration-300`}
              onClick={resetPassword}
              disabled={loading} // Disable button when loading
            >
              {loading ? 'Sending...' : 'Get Password'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <NavLink to="/login" className="text-green-300 uppercase hover:text-green-700 inline-flex items-center">
          <img
              src={whatsappicon}
              alt="Forgot Password Icon"
              className="inline-block w-6 h-6 mr-2" 
            /> Login here
          </NavLink>
        </div>
      </div>
    </div>
  );
};
