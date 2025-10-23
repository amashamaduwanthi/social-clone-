import { useEffect } from 'react';
import { db } from '../firebase';
import { ref, query, orderByChild, onValue, off } from 'firebase/database';
import { FaComment, FaShare, FaEllipsisH, FaTimes } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import '../styles/feed.css';
import LikeButton from "./LikeButton.tsx";

interface Post {
    id: string;
    userId: string;
    userDisplayName: string;
    userPhotoURL: string;
    imageUrl: string;
    caption: string;
    timestamp: number;
    likes?: Record<string, { userId: string; timestamp: number }>;
    comments: Record<string, any>;
}

const Feed = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openCommentSection, setOpenCommentSection] = useState<string | null>(null);
    
    const toggleCommentSection = (postId: string) => {
        setOpenCommentSection(openCommentSection === postId ? null : postId);
    };

    useEffect(() => {
        // Create a query that orders posts by timestamp in descending order (newest first)
        const postsRef = ref(db, 'posts');
        const postsQuery = query(postsRef, orderByChild('timestamp'));

        // Set up real-time listener
        const unsubscribe = onValue(
            postsQuery,
            (snapshot) => {
                try {
                    const postsData: Post[] = [];
                    snapshot.forEach((childSnapshot) => {
                        const postData = childSnapshot.val();
                        // Ensure likes is an object
                        const likes = postData.likes || {};
                        postsData.push({
                            id: childSnapshot.key!,
                            ...postData,
                            likes: typeof likes === 'number' ? {} : likes // Convert number to empty object if needed
                        });
                    });

                    // Sort by timestamp in descending order (newest first)
                    postsData.sort((a, b) => b.timestamp - a.timestamp);
                    setPosts(postsData);
                    setLoading(false);
                } catch (err) {
                    console.error('Error processing posts:', err);
                    setError('Failed to load posts. Please try again later.');
                    setLoading(false);
                }
            },
            (error) => {
                console.error('Error fetching posts:', error);
                setError('Failed to load feed. Please check your connection and refresh the page.');
                setLoading(false);
            }
        );

        // Clean up listener on unmount
        return () => {
            off(postsRef, 'value', unsubscribe);
        };
    }, []);

    // Like functionality is now handled by the LikeButton component

    if (loading) {
        return (
            <div className="feed-loading">
                <div className="loading-spinner"></div>
                <p>Loading posts...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="feed-error">
                <p>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="retry-button"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="feed-container">
            {posts.length === 0 ? (
                <div className="no-posts">
                    <p>No posts yet. Be the first to share something!</p>
                </div>
            ) : (
                posts.map((post) => (
                    <article key={post.id} className="post-card">
                        <div className="post-header">
                            <div className="post-user">
                                <img
                                    src={post.userPhotoURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                                    alt={post.userDisplayName}
                                    className="post-avatar"
                                />
                                <span className="post-username">{post.userDisplayName}</span>
                            </div>
                            <button className="post-options">
                                <FaEllipsisH />
                            </button>
                        </div>

                        <div className="post-image-container">
                            <img
                                src={post.imageUrl}
                                alt={post.caption || 'Post image'}
                                className="post-image"
                                loading="lazy"
                            />
                        </div>

                        <div className="post-actions">
                            <LikeButton
                                postId={post.id}
                                initialLikes={post.likes || 0}
                            />
                            <button 
                                className={`action-button ${openCommentSection === post.id ? 'active' : ''}`} 
                                aria-label="Comment"
                                onClick={() => toggleCommentSection(post.id)}
                            >
                                <FaComment className="action-icon" />
                            </button>
                            <button className="action-button" aria-label="Share">
                                <FaShare className="action-icon" />
                            </button>
                        </div>


                        {/* Comment Section */}
                        {openCommentSection === post.id && (
                            <div className="comment-section-container">
                                <button 
                                    className="close-comments" 
                                    onClick={() => setOpenCommentSection(null)}
                                    aria-label="Close comments"
                                >
                                    <FaTimes />
                                </button>

                            </div>
                        )}
                        
                        <div className="post-caption">
                            <strong>{post.userDisplayName}</strong> {post.caption}
                        </div>

                        {post.timestamp && (
                            <div className="post-timestamp">
                                {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
                            </div>
                        )}
                    </article>
                ))
            )}
        </div>
    );
};

export default Feed;