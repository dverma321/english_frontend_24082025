import React, { useContext, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { userContext } from '../../App';

export const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // State for button loading
  const { state, dispatch } = useContext(userContext);
  const navigation = useNavigate();
  const { id, token } = useParams(); // getting id and token from the URL

  console.log("ID:", id);
  console.log("Token:", token);

  // Validate password strength
  const validatePassword = (password) => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 8 characters long.";
    }
    if (!hasUppercase) {
      return "Password must include at least one uppercase letter.";
    }
    if (!hasNumber) {
      return "Password must include at least one number.";
    }
    if (!hasSpecialChar) {
      return "Password must include at least one special character.";
    }
    return null;
  };

  const updatePassword = async (e) => {
    e.preventDefault();

    const validationError = validatePassword(password);
    if (validationError) {
      return window.alert(validationError);
    }

    setLoading(true); // Set loading state to true before the request

    const VITE_LOCAL_API_URL = import.meta.env.VITE_LOCAL_API_URL;
    const VITE_PROD_API_URL = import.meta.env.VITE_PROD_API_URL;
    const apiUrl = import.meta.env.DEV ? VITE_LOCAL_API_URL : VITE_PROD_API_URL;

    // Decode the token to handle URL encoding issues
    const decodedToken = decodeURIComponent(token);

    try {
      const res = await fetch(`${apiUrl}/forget/reset-password/${id}/${decodedToken}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,                // Send id as part of the body
          token: decodedToken,  // Send token as part of the body
          password,          // Send password as part of the body
        }),
        credentials: 'include',
      });

      const data = await res.json();

      if (res.status === 200 || data.Status === "Password reset successful") {
        navigation('/login');
        window.alert("Password Updated Successfully");
      } else {
        window.alert("Password wasn't updated...");
      }
    } catch (error) {
      console.error("Error during reset password:", error);
    } finally {
      setLoading(false); // Set loading state to false after the request completes
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center'
    style={{
      backgroundImage: `url('../images/white_green_rose.jpg')`,
      backgroundSize: 'cover', // Ensures the image covers the container
      backgroundPosition: 'center', // Centers the image
      backgroundRepeat: 'no-repeat', // Prevents tiling
    }}
    >
      <div className="max-w-lg w-full bg-white bg-opacity-50 shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-8">Update Your Password</h2>

        <form method='POST' id='resetpassword-form'>
          <div className="mb-6">
            <label htmlFor="resetpassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              name='password'
              id="resetpassword1"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder='Enter your new password'
              autoComplete='off'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type='submit'
              className={`bg-indigo-600 text-white px-4 py-2 rounded-lg w-full font-semibold hover:bg-green-700 focus:outline-none ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={updatePassword}
              disabled={loading} // Disable button when loading
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <NavLink to="/login" className="text-indigo-600 hover:text-indigo-800 font-semibold">
            Login Here
          </NavLink>
        </div>
      </div>
    </div>
  );
};
