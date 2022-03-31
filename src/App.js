import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from "./components/pages/LoginPage";
import SignupPage from "./components/pages/SignupPage";
import HomePage from './components/pages/HomePage';
import PostPage from './components/pages/PostPage';
import Navbar from './components/Navbar';
import { useAuthContext } from './context/useAuthContext';
import { PostContextProvider } from './context/usePostContext';
import { CommentsContextProvider } from "./context/useCommentsContext";
import { FeedContextProvider } from './context/useFeedContext';
import LoadingScreen from './components/LoadingScreen';
import NotFoundPage from './components/pages/NotFoundPage';

function App() {

  const {authStatus} = useAuthContext()

  return (
      <Router>
        {/* No authentication */}
        {authStatus === "none" && (
          <Routes>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/signup" element={<SignupPage/>}/>
            <Route path="*" element={<LoginPage/>}/>
          </Routes>
        )}

        {/* User info is loading */}
        {authStatus === "loading" && <LoadingScreen/>}

        {/* Authenticated */}
        {authStatus === "ready" && (
          <>
            <Navbar/>
            <Routes>
              <Route path="/" element={
                <FeedContextProvider>
                  <HomePage/>
                </FeedContextProvider>
              }/>
              <Route path="/posts/:id" element={
                <PostContextProvider>
                  <CommentsContextProvider>
                    <PostPage/>
                  </CommentsContextProvider>
                </PostContextProvider>
              }/>
              <Route path="*" element={<NotFoundPage/>}/>
            </Routes>
          </>)}
      </Router>
  );
}

export default App;
