import { useState, useRef, useEffect } from 'react';
import { auth, db } from '../firebase';
import { ref as dbRef, push, set, serverTimestamp } from 'firebase/database';
import { FaImage, FaSpinner, FaTimes, FaPaperPlane } from 'react-icons/fa';
import '../styles/home.css';

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY as string | undefined;

interface PostCreateProps {
    onPostCreated?: () => void;
    onCancel?: () => void; // ✅ added to match Home.tsx usage
}

const PostCreate: React.FC<PostCreateProps> = ({ onPostCreated, onCancel }) => {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!IMGBB_API_KEY) {
            setError('Image hosting key is missing. Set VITE_IMGBB_API_KEY in your .env');
        }
    }, []);

    const handleImageChange = (file: File) => {
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
        setError(null);
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // Upload image to ImgBB
    const uploadToImgBB = async (file: File) => {
        if (!IMGBB_API_KEY) {
            throw new Error('Missing VITE_IMGBB_API_KEY');
        }
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (!result?.success) {
            throw new Error('Image upload failed');
        }
        return result.data.url as string; // Return image URL
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const user = auth.currentUser;

        if (!user) {
            setError('You must be logged in to create a post');
            return;
        }
        if (!image) {
            setError('Please select an image');
            return;
        }
        if (!IMGBB_API_KEY) {
            setError('Image hosting key is missing. Set VITE_IMGBB_API_KEY in your .env');
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            // 1) Upload to ImgBB
            const imageUrl = await uploadToImgBB(image);

            // 2) Save to Firebase Realtime Database
            const postRef = dbRef(db, 'posts');
            const newPostRef = push(postRef);

            await set(newPostRef, {
                id: newPostRef.key,
                userId: user.uid,
                userDisplayName: user.displayName || 'Anonymous',
                userPhotoURL: user.photoURL || '',
                imageUrl,
                caption,
                timestamp: serverTimestamp(),
                likes: 0,
                comments: {},
            });

            // 3) Reset UI
            setCaption('');
            setImage(null);
            setImagePreview(null);
            onPostCreated?.();
        } catch (err) {
            console.error('Error creating post:', err);
            setError('Failed to create post. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-start space-x-3">
                    <div className="flex-1">
                        {imagePreview && (
                            <div className="mt-3 relative">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="max-w-[300px] h-auto object-cover rounded-lg shadow-sm mx-auto"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1.5 hover:bg-opacity-70 transition-all"
                                    disabled={isUploading}
                                    aria-label="Remove image"
                                >
                                    <FaTimes className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        <div className="post-actions">
                            <div className="flex space-x-2">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="photo-upload-btn"
                                    disabled={isUploading}
                                >
                                    <FaImage />
                                    <span>Photo</span>
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={(e) => e.target.files?.[0] && handleImageChange(e.target.files[0])}
                                    accept="image/*"
                                    className="hidden"
                                    disabled={isUploading}
                                    aria-label="Upload image"
                                />
                                <textarea
                                    className="post-textarea"
                                    placeholder="What's on your mind?"
                                    rows={3}
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    disabled={isUploading}
                                />
                            </div>

                            <div className="flex items-center gap-2 mt-3">
                                <button
                                    type="button"
                                    className="post-cancel-btn"
                                    onClick={() => onCancel?.()}   // ✅ call cancel
                                    disabled={isUploading}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="post-submit-btn"
                                    disabled={isUploading || (!image && !caption.trim())}
                                >
                                    {isUploading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                                    <span>{isUploading ? 'Posting...' : 'Post'}</span>
                                </button>
                            </div>
                        </div>

                        {error && <div className="mt-3 text-red-500 text-sm">{error}</div>}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PostCreate;
