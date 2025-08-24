import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../App';

const Logout = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(userContext); // Ensure this is coming from the correct context

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const apiUrl = import.meta.env.DEV ? import.meta.env.VITE_LOCAL_API_URL : import.meta.env.VITE_PROD_API_URL;

        const token = localStorage.getItem('jwtoken');
        
        // Call the backend to log the user out
        const response = await fetch(`${apiUrl}/user/logout`, {
          method: 'POST',
          credentials: 'include',
           headers: {
                      Authorization: `Bearer ${token}`
                    }
        });

        const data = await response.json();

        if (response.status === 200 && data.status === 'SUCCESS') {
          // Clear localStorage and cookies
          document.cookie = 'jwtoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          localStorage.removeItem('jwtoken');
          localStorage.removeItem('userInfo');          
          localStorage.removeItem('isAdmin');          
          localStorage.removeItem('userData'); // Remove stored user details          
          // Dispatch action to update the state (logged out)
          dispatch({ type: 'USER', payload: false });

          // Redirect to the login page after successful logout
          navigate('/login');
        } else {
          console.error('Logout failed:', data.message);
        }
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };

    logoutUser();
  }, [dispatch, navigate]);

  return <div>Logging you out...</div>;
};

export default Logout;
