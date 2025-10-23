import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, set, onValue, off } from 'firebase/database';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import '../styles/likeButton.css';
import { toast } from 'react-toastify';

interface LikeButtonProps {
  postId: string;
  initialLikes: number | Record<string, any>;
}

const LikeButton: React.FC<LikeButtonProps> = ({ postId, initialLikes }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(
    typeof initialLikes === 'number' ? initialLikes : Object.keys(initialLikes || {}).length
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  // Check if current user has liked the post
  useEffect(() => {
    if (!currentUser) return;

    const likeRef = ref(db, `posts/${postId}/likes/${currentUser.uid}`);
    
    const handleLikeStatus = (snapshot: any) => {
      setIsLiked(snapshot.exists());
    };

    onValue(likeRef, handleLikeStatus);

    return () => {
      off(likeRef, 'value', handleLikeStatus);
    };
  }, [postId, currentUser]);

  // Listen for like count changes
  useEffect(() => {
    const likesRef = ref(db, `posts/${postId}/likes`);
    
    const handleLikesUpdate = (snapshot: any) => {
      const likesData = snapshot.val() || {};
      setLikeCount(Object.keys(likesData).length);
    };

    onValue(likesRef, handleLikesUpdate);

    return () => {
      off(likesRef, 'value', handleLikesUpdate);
    };
  }, [postId]);

  const handleLike = async () => {
    if (!currentUser) {
      toast.error('You must be logged in to like posts');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const likeRef = ref(db, `posts/${postId}/likes/${currentUser.uid}`);
      
      if (isLiked) {
        // Unlike the post
        await set(likeRef, null);
      } else {
        // Like the post
        await set(likeRef, {
          userId: currentUser.uid,
          timestamp: Date.now(),
        });
      }
    } catch (err) {
      console.error('Error updating like:', err);
      toast.error('Failed to update like. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="like-container">
      <button
        className={`like-button ${isLiked ? 'liked' : ''}`}
        onClick={handleLike}
        disabled={isLoading}
        aria-label={isLiked ? 'Unlike this post' : 'Like this post'}
      >
        {isLiked ? (
          <FaHeart className="like-icon" />
        ) : (
          <FaRegHeart className="like-icon" />
        )}
        <span className="like-count">{likeCount}</span>
      </button>
      {error && <div className="like-error">{error}</div>}
    </div>
  );
};

export default LikeButton;
