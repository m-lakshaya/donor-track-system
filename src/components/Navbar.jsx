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

    if (!user) return null; // Don't show navbar on login/register

    return (
        <nav style={{ backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb', padding: '1rem 0' }}>
            <div className="container flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ef4444' }}>
                    <Heart fill="#ef4444" size={24} />
                    <span>DonorTrack</span>
                </Link>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray text-sm">
                        <User size={16} />
                        <span>{user.name} ({user.role})</span>
                    </div>
                    <button onClick={handleLogout} className="btn btn-outline flex items-center gap-2 text-sm">
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
