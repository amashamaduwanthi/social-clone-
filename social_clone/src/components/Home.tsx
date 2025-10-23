import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';
import { FaPlus } from 'react-icons/fa';
import '../styles/home.css';

const Home = () => {
  // If user is not authenticated, redirect to login
  if (!auth.currentUser) {
    return <Navigate to="/login" replace />;
  }

  const [showPostCreate, setShowPostCreate] = useState(false);

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="home-header-content">
          <h1 className="home-title">Home</h1>
          <button
            onClick={() => setShowPostCreate(true)}
            className="create-post-btn"
            aria-label="Create new post"
          >
            <FaPlus className="w-4 h-4" />
            <span>Create Post</span>
          </button>
        </div>
      </header>
      <main className="home-main">
        {showPostCreate && (
          <div className="post-create-animation">

          </div>
        )}
        <div className="feed-container">

        </div>
      </main>
    </div>
  );
};

export default Home;
