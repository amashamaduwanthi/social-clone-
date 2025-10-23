import { useState, useEffect } from 'react';
import { ref, push, onValue, off, set } from 'firebase/database';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import '../styles/commentSection.css';

interface Comment {
  id: string;
  userId: string;
  userDisplayName: string;
  userPhotoURL: string;
  text: string;
  timestamp: number;
}

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  // Fetch comments for the post
  useEffect(() => {
    const commentsRef = ref(db, `posts/${postId}/comments`);
    
    const handleCommentsUpdate = (snapshot: any) => {
      const commentsData: Comment[] = [];
      snapshot.forEach((childSnapshot: any) => {
        commentsData.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      
      // Sort comments by timestamp (newest first)
      commentsData.sort((a, b) => b.timestamp - a.timestamp);
      setComments(commentsData);
      setLoading(false);
    };

    onValue(commentsRef, handleCommentsUpdate);

    return () => {
      off(commentsRef, 'value', handleCommentsUpdate);
    };
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be logged in to comment');
      return;
    }
    
    if (!comment.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    
    try {
      const commentsRef = ref(db, `posts/${postId}/comments`);
      const newCommentRef = push(commentsRef);
      
      await set(newCommentRef, {
        userId: currentUser.uid,
        userDisplayName: currentUser.displayName || 'Anonymous',
        userPhotoURL: currentUser.photoURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
        text: comment.trim(),
        timestamp: Date.now(),
      });
      
      setComment('');
      setError(null);
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment. Please try again.');
    }
  };

  if (loading) {
    return <div className="comment-loading">Loading comments...</div>;
  }

  return (
    <div className="comment-section">
      {/* Comment form */}
      <form onSubmit={handleSubmit} className="comment-form">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="comment-input"
          aria-label="Write a comment"
        />
        <button 
          type="submit" 
          className="comment-submit"
          disabled={!comment.trim()}
        >
          Post
        </button>
      </form>
      
      {/* Error message */}
      {error && <div className="comment-error">{error}</div>}
      
      {/* Comments list */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <img 
                src={comment.userPhotoURL} 
                alt={comment.userDisplayName} 
                className="comment-avatar"
              />
              <div className="comment-content">
                <div className="comment-header">
                  <span className="comment-username">{comment.userDisplayName}</span>
                  <span className="comment-timestamp">
                    {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                  </span>
                </div>
                <p className="comment-text">{comment.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
