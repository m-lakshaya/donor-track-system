import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, LogOut, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 999, padding: '1rem 0', borderLeft: 'none', borderRight: 'none', borderTop: 'none', borderRadius: 0, backdropFilter: 'blur(24px)' }}>
            <div className="container mx-auto flex items-center justify-between px-4">
                <Link to="/" className="flex items-center gap-2" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ef4444' }}>
                    <Heart fill="#ef4444" size={24} />
                    <span>DonorTrack</span>
                </Link>

                <div className="flex items-center gap-4">
                    {!user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Link to="/login" style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', textDecoration: 'none' }} className="hover:text-red-500 transition-colors">Login</Link>
                            <Link to="/register" className="btn btn-primary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>Register</Link>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-2 text-gray text-sm">
                                <User size={16} />
                                <span>{user.name} ({user.role})</span>
                            </div>
                            <button onClick={handleLogout} className="btn btn-outline flex items-center gap-2 text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
                                <LogOut size={16} />
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
