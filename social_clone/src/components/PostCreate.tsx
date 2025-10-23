// import { useState, useRef } from 'react';
// import {auth, db, storage} from '../firebase';
// import { ref as dbRef, push, set, serverTimestamp } from 'firebase/database';
// import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { v4 as uuidv4 } from 'uuid';
// import { FaImage, FaSpinner, FaTimes, FaPaperPlane } from 'react-icons/fa';
//
// interface PostCreateProps {
//     onPostCreated?: () => void;
// }
//
// const PostCreate: React.FC<PostCreateProps> = ({ onPostCreated }) => {
//     const [caption, setCaption] = useState('');
//     const [image, setImage] = useState<File | null>(null);
//     const [imagePreview, setImagePreview] = useState<string | null>(null);
//     const [isUploading, setIsUploading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const fileInputRef = useRef<HTMLInputElement>(null);
//
//     const handleImageChange = (file: File) => {
//         setImage(file);
//         setImagePreview(URL.createObjectURL(file));
//         setError(null);
//     };
//
//     const handleRemoveImage = () => {
//         setImage(null);
//         setImagePreview(null);
//         if (fileInputRef.current) {
//             fileInputRef.current.value = '';
//         }
//     };
//
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//
//         const user = auth.currentUser;
//         if (!user) {
//             setError('You must be logged in to create a post');
//             return;
//         }
//
//         if (!image) {
//             setError('Please select an image');
//             return;
//         }
//
//         setIsUploading(true);
//         setError(null);
//
//         try {
//             // 1. Upload image to Firebase Storage
//             const imageId = uuidv4();
//             const imageStorageRef = storageRef(storage, `posts/${user.uid}/${imageId}`);
//             await uploadBytes(imageStorageRef, image);
//             const imageUrl = await getDownloadURL(imageStorageRef);
//
//             // 2. Save post data to Realtime Database
//             const postRef = dbRef(db, 'posts');
//             const newPostRef = push(postRef);
//
//             await set(newPostRef, {
//                 id: newPostRef.key,
//                 userId: user.uid,
//                 userDisplayName: user.displayName || 'Anonymous',
//                 userPhotoURL: user.photoURL || '',
//                 imageUrl,
//                 caption,
//                 timestamp: serverTimestamp(),
//                 likes: 0,
//                 comments: {}
//             });
//
//             // 3. Reset form and call callback
//             setCaption('');
//             setImage(null);
//             setImagePreview(null);
//             onPostCreated?.();
//
//         } catch (err) {
//             console.error('Error creating post:', err);
//             setError('Failed to create post. Please try again.');
//         } finally {
//             setIsUploading(false);
//         }
//     };
//
//     return (
//         <div className="bg-white rounded-lg shadow-md p-4 mb-6">
//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="flex items-start space-x-3">
//                     <img
//                         src={auth.currentUser?.photoURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
//                         alt="Profile"
//                         className="w-10 h-10 rounded-full object-cover"
//                     />
//                     <div className="flex-1">
//             <textarea
//                 className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//                 placeholder="What's on your mind?"
//                 rows={3}
//                 value={caption}
//                 onChange={(e) => setCaption(e.target.value)}
//                 disabled={isUploading}
//             />
//
//                         {imagePreview && (
//                             <div className="mt-3 relative">
//                                 <img
//                                     src={imagePreview}
//                                     alt="Preview"
//                                     className="w-full h-64 object-cover rounded-lg"
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={handleRemoveImage}
//                                     className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1.5 hover:bg-opacity-70"
//                                     disabled={isUploading}
//                                 >
//                                     <FaTimes className="w-4 h-4" />
//                                 </button>
//                             </div>
//                         )}
//
//                         <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
//                             <div className="flex space-x-2">
//                                 <button
//                                     type="button"
//                                     onClick={() => fileInputRef.current?.click()}
//                                     className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
//                                     disabled={isUploading}
//                                 >
//                                     <FaImage className="w-5 h-5" />
//                                     <span className="text-sm">Photo</span>
//                                 </button>
//                                 <input
//                                     type="file"
//                                     ref={fileInputRef}
//                                     onChange={(e) => e.target.files?.[0] && handleImageChange(e.target.files[0])}
//                                     accept="image/*"
//                                     className="hidden"
//                                     disabled={isUploading}
//                                 />
//                             </div>
//
//                             <button
//                                 type="submit"
//                                 className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
//                                 disabled={isUploading || (!image && !caption.trim())}
//                             >
//                                 {isUploading ? (
//                                     <>
//                                         <FaSpinner className="animate-spin" />
//                                         <span>Posting...</span>
//                                     </>
//                                 ) : (
//                                     <>
//                                         <FaPaperPlane />
//                                         <span>Post</span>
//                                     </>
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//
//                 {error && (
//                     <div className="mt-3 text-red-500 text-sm">
//                         {error}
//                     </div>
//                 )}
//             </form>
//         </div>
//     );
// };
//
// export default PostCreate;



//
// import { useState, useRef } from 'react';
// import { auth, db, storage } from '../firebase';
// import { ref as dbRef, push, set, serverTimestamp } from 'firebase/database';
// import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { v4 as uuidv4 } from 'uuid';
// import { FaImage, FaSpinner, FaTimes, FaPaperPlane } from 'react-icons/fa';
// import '../styles/home.css';
//
// interface PostCreateProps {
//     onPostCreated?: () => void;
// }
//
// const PostCreate: React.FC<PostCreateProps> = ({ onPostCreated }) => {
//     const [caption, setCaption] = useState('');
//     const [image, setImage] = useState<File | null>(null);
//     const [imagePreview, setImagePreview] = useState<string | null>(null);
//     const [isUploading, setIsUploading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const fileInputRef = useRef<HTMLInputElement>(null);
//
//     const handleImageChange = (file: File) => {
//         setImage(file);
//         setImagePreview(URL.createObjectURL(file));
//         setError(null);
//     };
//
//     const handleRemoveImage = () => {
//         setImage(null);
//         setImagePreview(null);
//         if (fileInputRef.current) {
//             fileInputRef.current.value = '';
//         }
//     };
//
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         const user = auth.currentUser;
//
//         if (!user) {
//             setError('You must be logged in to create a post');
//             return;
//         }
//
//         if (!image) {
//             setError('Please select an image');
//             return;
//         }
//
//         setIsUploading(true);
//         setError(null);
//
//         try {
//             const imageId = uuidv4();
//             const imageStorageRef = storageRef(storage, `posts/${user.uid}/${imageId}`);
//             await uploadBytes(imageStorageRef, image);
//             const imageUrl = await getDownloadURL(imageStorageRef);
//
//             const postRef = dbRef(db, 'posts');
//             const newPostRef = push(postRef);
//
//             await set(newPostRef, {
//                 id: newPostRef.key,
//                 userId: user.uid,
//                 userDisplayName: user.displayName || 'Anonymous',
//                 userPhotoURL: user.photoURL || '',
//                 imageUrl,
//                 caption,
//                 timestamp: serverTimestamp(),
//                 likes: 0,
//                 comments: {}
//             });
//
//             setCaption('');
//             setImage(null);
//             setImagePreview(null);
//             onPostCreated?.();
//         } catch (err) {
//             console.error('Error creating post:', err);
//             setError('Failed to create post. Please try again.');
//         } finally {
//             setIsUploading(false);
//         }
//     };
//
//     return (
//         <div className="bg-white rounded-lg shadow-md p-4 mb-6">
//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="flex items-start space-x-3">
//                     {/*<img*/}
//                     {/*    src={auth.currentUser?.photoURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}*/}
//                     {/*    alt="Profile"*/}
//                     {/*    className="w-10 h-10 rounded-full object-cover"*/}
//                     {/*/>*/}
//                     <div className="flex-1">
//
//                         {imagePreview && (
//                             <div className="mt-3 relative">
//                                 <img
//                                     src={imagePreview}
//                                     alt="Preview"
//                                     className="w-full h-64 object-cover rounded-lg shadow-sm"
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={handleRemoveImage}
//                                     className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1.5 hover:bg-opacity-70 transition-all"
//                                     disabled={isUploading}
//                                     aria-label="Remove image"
//                                 >
//                                     <FaTimes className="w-4 h-4" />
//                                 </button>
//                             </div>
//                         )}
//
//                         <div className="post-actions">
//                             <div className="flex space-x-2">
//                                 <button
//                                     type="button"
//                                     onClick={() => fileInputRef.current?.click()}
//                                     className="photo-upload-btn"
//                                     disabled={isUploading}
//                                 >
//                                     <FaImage />
//                                     <span>Photo</span>
//                                 </button>
//                                 <input
//                                     type="file"
//                                     ref={fileInputRef}
//                                     onChange={(e) => e.target.files?.[0] && handleImageChange(e.target.files[0])}
//                                     accept="image/*"
//                                     className="hidden"
//                                     disabled={isUploading}
//                                     aria-label="Upload image"
//                                 />
//                                 <textarea
//                                     className="post-textarea"
//                                     placeholder="What's on your mind?"
//                                     rows={3}
//                                     value={caption}
//                                     onChange={(e) => setCaption(e.target.value)}
//                                     disabled={isUploading}
//                                 />
//                             </div>
//
//
//                             <button
//                                 type="submit"
//                                 className="post-submit-btn"
//                                 disabled={isUploading || (!image && !caption.trim())}
//                             >
//                                 {isUploading ? (
//                                     <FaSpinner className="animate-spin" />
//                                 ) : (
//                                     <FaPaperPlane />
//                                 )}
//                                 <span>{isUploading ? 'Posting...' : 'Post'}</span>
//                             </button>
//                         </div>
//
//                         {error && (
//                             <div className="mt-3 text-red-500 text-sm">
//                                 {error}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </form>
//         </div>
//     );
// };
//
// export default PostCreate;

import { useState, useRef } from 'react';
import { auth, db } from '../firebase';
import { ref as dbRef, push, set, serverTimestamp } from 'firebase/database';

import { FaImage, FaSpinner, FaTimes, FaPaperPlane } from 'react-icons/fa';
import '../styles/home.css';

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

interface PostCreateProps {
    onPostCreated?: () => void;
}

const PostCreate: React.FC<PostCreateProps> = ({ onPostCreated }) => {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (file: File) => {
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
        setError(null);
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Upload image to ImgBB
    const uploadToImgBB = async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error('Image upload failed');
        }

        return result.data.url; // Return image URL
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

        setIsUploading(true);
        setError(null);

        try {
            // 1️⃣ Upload to ImgBB
            const imageUrl = await uploadToImgBB(image);

            // 2️⃣ Save to Firebase Realtime Database
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

            // 3️⃣ Reset UI
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

                            <button
                                type="submit"
                                className="post-submit-btn"
                                disabled={isUploading || (!image && !caption.trim())}
                            >
                                {isUploading ? (
                                    <FaSpinner className="animate-spin" />
                                ) : (
                                    <FaPaperPlane />
                                )}
                                <span>{isUploading ? 'Posting...' : 'Post'}</span>
                            </button>
                        </div>

                        {error && (
                            <div className="mt-3 text-red-500 text-sm">{error}</div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PostCreate;
