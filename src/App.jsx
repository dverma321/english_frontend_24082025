import { useReducer, useEffect, createContext, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import Navbar from './components/Navbar';
import { initialState, reducer } from '../src/Reducer/Reducer.js';

import Logout from './pages/Logout';
import NotFound from './pages/NotFound.jsx';

import { ForgotPassword } from './pages/ForgetPassword/ForgotPassword.jsx';
import { ResetPassword } from './pages/ForgetPassword/ResetPassword.jsx';
import Loading from './pages/Loading.jsx';

// below under testing

import ReportedIssues from './pages/Report/ReportIssue.jsx';
import GemCoins from './pages/Gems/Gems.jsx';
import HomePage from './pages/Home/HomePage.jsx';
import SentenceViewer from './pages/Sentence/SentenceViewer.jsx';
import Registration from './pages/Registration.jsx';
import CompleteProfile from './pages/CompleteProfile.jsx';

export const userContext = createContext();

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwtoken');
    if (token) {
      dispatch({ type: 'USER', payload: true }); // Set isAuthenticated to true if token exists
    }
    setAuthInitialized(true); // Mark auth as initialized (after token check)
  }, []);  // Empty dependency array ensures this effect runs only once
 


  if (!authInitialized) {
    return <Loading />;
  }

  return (
    <userContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar /> 
        <Routes>

          <Route
            path="/"
            element={
              !authInitialized ? ( // Wait until authentication is initialized
                <Loading />
              ) : state.isAuthenticated ? ( // Show welcome message if authenticated
                <SentenceViewer />
              ) : ( // Otherwise, show the Main component
                <HomePage />
              )
            }
          />

          <Route
            path="/login"
            element={state.isAuthenticated ? <SentenceViewer /> : <LoginPage />}
          />

          <Route path="/registration" element={state.isAuthenticated ? <SentenceViewer /> : <Registration />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/forgot-password"  element={state.isAuthenticated ? <SentenceViewer /> : <ForgotPassword />} />
          <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
          <Route path="/logout" element={<Logout />} />         
          <Route path="*" element={<NotFound />} />

          
          <Route path="/report-issue" element={state.isAuthenticated && state.userInfo?.isAdmin ? <ReportedIssues /> : <SentenceViewer />} />

          {/* For English  */}
          <Route path="/english" element={<SentenceViewer />} />




        </Routes>
      </BrowserRouter>
    </userContext.Provider>
  );
}

export default App;
