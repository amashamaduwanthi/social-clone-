import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Home from './components/Home';
import './styles/forms.css';
import './styles/layout.css';
import './styles/auth.css';
import ProfilePage from "./pages/ProfilePage.tsx";
import {useEffect, useState} from "react";
import Feed from "./components/Feed.tsx";


// Protected Route component
// In App.tsx, update the PrivateRoute component
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsAuthenticated(!!user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Or a loading spinner
    }

    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};


// Layout component for authenticated routes
const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const handleLogout = async () => {
        try {
            const { signOut } = await import('firebase/auth');
            await signOut(auth);
            // Optional: Redirect to login page after logout
            window.location.href = '/login';
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };
    return (
        <div className="app-container">
            <header className="header">
                <div className="header-container">
                    <a href="/" className="logo">
                        <span>PetPicShare</span>
                    </a>
                    <nav className="nav-links">
                        <a href="/" className="nav-link active">
                            <i className="fas fa-home"></i>
                            <span>Home</span>
                        </a>
                        <a href="#" className="nav-link">
                            <i className="fas fa-user-friends"></i>
                            <span>Friends</span>
                        </a>
                        <a href="#" className="nav-link">
                            <i className="fas fa-bell"></i>
                            <span>Notifications</span>
                        </a>
                        <a href="/profile" className="nav-link">
                            <i className="fas fa-user"></i>
                            <span>Profile</span>
                        </a>
                    </nav>
                    <div className="user-menu">
                        <button className="btn btn-outline" onClick={handleLogout}>
                            <i className="fas fa-sign-out-alt"></i>
                            <span>Logout</span>
                        </button>
                        <img
                            src={auth.currentUser?.photoURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                            alt="Profile"
                            className="avatar"
                        />
                    </div>
                </div>
            </header>
            <main className="main-content">
                <aside className="sidebar">
                    <div className="sidebar-section">
                        <h3 className="sidebar-title">Shortcuts</h3>
                        <ul className="sidebar-menu">
                            <li className="sidebar-item">
                                <a href="#" className="sidebar-link">
                                    <i className="fas fa-users sidebar-icon"></i>
                                    <span>Groups</span>
                                </a>
                            </li>
                            <li className="sidebar-item">
                                <a href="#" className="sidebar-link">
                                    <i className="fas fa-calendar-alt sidebar-icon"></i>
                                    <span>Events</span>
                                </a>
                            </li>
                            <li className="sidebar-item">
                                <a href="#" className="sidebar-link">
                                    <i className="fas fa-bookmark sidebar-icon"></i>
                                    <span>Saved</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </aside>
                <div className="feed">
                    {children}
                </div>
                <aside className="right-sidebar">
                    <div className="sidebar-section">
                        <div className="contacts-header">
                            <h3 className="contacts-title">Contacts</h3>
                            <div className="contacts-actions">
                                <button className="contacts-action">
                                    <i className="fas fa-video"></i>
                                </button>
                                <button className="contacts-action">
                                    <i className="fas fa-search"></i>
                                </button>
                                <button className="contacts-action">
                                    <i className="fas fa-ellipsis-h"></i>
                                </button>
                            </div>
                        </div>
                        <div className="contacts-list">
                            {/* Contacts will be populated dynamically */}
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={
                    <PrivateRoute>
                        <MainLayout>
                            <Home />
                        </MainLayout>
                    </PrivateRoute>
                } />
                <Route path="/login" element={
                    auth.currentUser ? <Navigate to="/" replace /> : <Login />
                } />
                <Route path="/signup" element={
                    auth.currentUser ? <Navigate to="/" replace /> : <Signup />
                } />
                <Route path="*" element={
                    <div className="min-h-screen flex items-center justify-center">
                        <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
                    </div>
                } />
                <Route
                    path="/profile"
                    element={
                        <PrivateRoute>
                            <MainLayout>
                                <ProfilePage />
                            </MainLayout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/feed"
                    element={
                        <PrivateRoute>
                            <MainLayout>
                                <Feed />
                            </MainLayout>
                        </PrivateRoute>
                    }
                />

            </Routes>
        </Router>
    );
}

export default App;