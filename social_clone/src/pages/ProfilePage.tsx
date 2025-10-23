import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { updateProfile } from 'firebase/auth';
import ImageUpload from '../components/ImageUpload';
import { FaUser, FaEnvelope, FaCalendarAlt, FaSpinner } from 'react-icons/fa';
import '../styles/profile.css';

const ProfilePage = () => {
    const [user, setUser] = useState<null | any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
            setLoading(false);
        }, (error) => {
            console.error('Auth state error:', error);
            setError('Failed to load user data');
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleUploadComplete = async (imageUrl: string) => {
        if (!user) return;

        try {
            const currentUser = auth.currentUser;
            if (currentUser) {
                // Use the updateProfile function from firebase/auth
                await updateProfile(currentUser, {
                    photoURL: imageUrl
                });
                // Force a re-render with the updated user
                setUser({ ...user, photoURL: imageUrl });
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update profile picture');
        }
    };

    if (loading) {
        return (
            <div className="loading-spinner">
                <FaSpinner className="animate-spin text-blue-500 text-2xl" />
            </div>
        );
    }

    if (!user) {
        return <div className="error-message">User not found. Please login.</div>;
    }

    const getJoinDate = () => {
        if (!user.metadata?.creationTime) return 'Recently';
        return new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="flex justify-center mb-4">
                    <img
                        src={user.photoURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                        alt="Profile"
                        className="profile-avatar"
                    />
                </div>
                <h1 className="profile-name">{user.displayName || 'User'}</h1>
                <p className="profile-email">{user.email}</p>
                
                <div className="image-upload-container">
                    <ImageUpload
                        onUploadComplete={handleUploadComplete}
                        onError={(err) => setError(err)}
                        maxFileSizeMB={2}
                        allowedFileTypes={['image/jpeg', 'image/png']}
                        buttonText="Change Profile Picture"
                    />
                </div>
                
                {error && <div className="error-message mt-4">{error}</div>}
            </div>

            <div className="profile-content">
                <div className="profile-card">
                    <h2>About</h2>
                    <div className="profile-info">
                        <div className="info-item">
                            <FaUser />
                            <span>{user.displayName || 'No name provided'}</span>
                        </div>
                        <div className="info-item">
                            <FaEnvelope />
                            <span>{user.email || 'No email provided'}</span>
                        </div>
                        <div className="info-item">
                            <FaCalendarAlt />
                            <span>Joined {getJoinDate()}</span>
                        </div>
                    </div>
                </div>
                
                <div className="profile-card">
                    <h2>Activity</h2>
                    <p className="text-gray-500">Your recent activity will appear here.</p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
