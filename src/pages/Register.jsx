import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        bloodGroup: '',
        age: '',
        phone: ''
    });
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await register({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role || 'donor', // Pass selected role
            details: {
                bloodGroup: formData.bloodGroup,
                age: formData.age,
                phone: formData.phone
            }
        });

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="flex items-center justify-center p-4">
            <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
                <div className="flex flex-col items-center mb-6">
                    <Heart size={40} color="#ef4444" />
                    <h1 className="text-xl font-bold mt-2">Join as a Donor</h1>
                    <p className="text-gray text-sm">Help save lives today</p>
                </div>

                {error && (
                    <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '0.25rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="mb-2">
                            <label className="text-sm font-bold text-gray-700">Full Name</label>
                            <input name="name" type="text" className="input-field" onChange={handleChange} required />
                        </div>
                        <div className="mb-2">
                            <label className="text-sm font-bold text-gray-700">Blood Group</label>
                            <select name="bloodGroup" className="input-field" onChange={handleChange} required>
                                <option value="">Select</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="text-sm font-bold text-gray-700">I am a...</label>
                        <select name="role" className="input-field" onChange={handleChange} value={formData.role || 'donor'} required>
                            <option value="donor">Donor</option>
                            <option value="hospital">Hospital</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="mb-2">
                            <label className="text-sm font-bold text-gray-700">Age</label>
                            <input name="age" type="number" className="input-field" onChange={handleChange} required />
                        </div>
                        <div className="mb-2">
                            <label className="text-sm font-bold text-gray-700">Phone</label>
                            <input name="phone" type="tel" className="input-field" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="text-sm font-bold text-gray-700">Email</label>
                        <input name="email" type="email" className="input-field" onChange={handleChange} required />
                    </div>
                    <div className="mb-6">
                        <label className="text-sm font-bold text-gray-700">Password</label>
                        <input name="password" type="password" className="input-field" onChange={handleChange} required />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register</button>
                </form>
                <div className="mt-4 text-center text-sm">
                    <p>Already have an account? <Link to="/login" style={{ color: '#3b82f6' }}>Login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
