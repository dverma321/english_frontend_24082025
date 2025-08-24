import { useContext, useEffect, useState } from 'react';
import { userContext } from '../../App';

const useFetchUser = () => {
  const { state, dispatch } = useContext(userContext); // Access user context
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('jwtoken');
      const apiUrl = import.meta.env.DEV ? import.meta.env.VITE_LOCAL_API_URL : import.meta.env.VITE_PROD_API_URL;

      if (token) {
        const response = await fetch(`${apiUrl}/user/getData`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Error fetching user data: ${response.statusText}`);
        }

        const data = await response.json();

        // Dispatch the user data and authentication status to the global state
        dispatch({ type: 'USER', payload: { isAuthenticated: true, userInfo: data } });
      } else {
        // No token, update isAuthenticated to false
        dispatch({ type: 'USER', payload: { isAuthenticated: false, userInfo: null } });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      dispatch({ type: 'USER', payload: { isAuthenticated: false, userInfo: null } });
    } finally {
      setLoading(false); // End loading state
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return { state, loading }; // Return loading state and user state
};

export default useFetchUser;
