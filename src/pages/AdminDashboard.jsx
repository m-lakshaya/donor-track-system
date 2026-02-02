import { useState } from 'react';
import { useData } from '../context/DataContext';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import { Users, Activity, Droplet, Plus, Minus, Check, X } from 'lucide-react';

const AdminDashboard = () => {
    const { bloodStock, requests, donors, updateStock, handleRequestStatus, addDonor } = useData();
    const [newDonor, setNewDonor] = useState({ name: '', email: '', password: 'password', details: { bloodGroup: '', age: '', phone: '' } });
    const [showAddDonor, setShowAddDonor] = useState(false);

    // Stats
    const totalDonors = donors.length;
    const totalStock = bloodStock.reduce((acc, curr) => acc + curr.quantity, 0);
    const pendingRequests = requests.filter(r => r.status === 'pending').length;

    const handleAddDonor = (e) => {
        e.preventDefault();
        addDonor(newDonor);
        setShowAddDonor(false);
        setNewDonor({ name: '', email: '', password: 'password', details: { bloodGroup: '', age: '', phone: '' } });
    };

    return (
        <div>
            <h1 className="page-title">Blood Bank Dashboard</h1>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Donors" value={totalDonors} icon={Users} color="#3b82f6" />
                <StatCard title="Total Units in Stock" value={totalStock} icon={Droplet} color="#ef4444" />
                <StatCard title="Pending Requests" value={pendingRequests} icon={Activity} color="#f59e0b" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Blood Stock Section */}
                <div className="card">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Droplet className="text-red-500" /> Blood Stock
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {bloodStock.map((stock) => (
                            <div key={stock.group_name} className="flex flex-col items-center justify-center p-3 border rounded bg-gray-50">
                                <span className="font-bold text-lg text-red-600 mb-1">{stock.group_name}</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateStock(stock.group_name, 1, 'remove')}
                                        className="p-1 hover:bg-red-100 rounded text-red-600 border border-red-200"
                                        disabled={stock.quantity <= 0}
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="font-bold w-6 text-center text-sm">{stock.quantity}</span>
                                    <button
                                        onClick={() => updateStock(stock.group_name, 1, 'add')}
                                        className="p-1 hover:bg-green-100 rounded text-green-600 border border-green-200"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Requests Queue Table */}
                <div className="card">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Activity className="text-blue-500" /> Requests Queue
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="text-gray-500 border-b bg-gray-50">
                                <tr>
                                    <th className="p-3">Hospital</th>
                                    <th className="p-3">Patient</th>
                                    <th className="p-3">Group</th>
                                    <th className="p-3">Units</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.filter(r => ['pending', 'fulfilled'].includes(r.status)).length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-4 text-center text-gray-500 italic">No active requests.</td>
                                    </tr>
                                ) : (
                                    requests.filter(r => ['pending', 'fulfilled'].includes(r.status)).map(req => (
                                        <tr key={req.id} className="border-b last:border-0 hover:bg-gray-50">
                                            <td className="p-3 font-medium">{req.hospital_name}</td>
                                            <td className="p-3 text-gray-600">{req.patient_name}</td>
                                            <td className="p-3 font-bold text-red-600">{req.blood_group}</td>
                                            <td className="p-3">{req.units}</td>
                                            <td className="p-3">
                                                <span className={`text-xs px-2 py-1 rounded capitalize font-bold
                                                    ${req.status === 'fulfilled' ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {req.status === 'fulfilled' ? 'Donor Found' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex gap-2">
                                                    {req.status === 'fulfilled' ? (
                                                        <button
                                                            onClick={() => handleRequestStatus(req.id, 'approved')}
                                                            className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 shadow-sm transition-colors"
                                                            title="Finalize & Approve"
                                                        >
                                                            <Check size={14} /> Finalize
                                                        </button>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => handleRequestStatus(req.id, 'rejected')}
                                                                className="p-1 border border-red-200 text-red-600 rounded hover:bg-red-50 transition-colors"
                                                                title="Reject Request"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                            <span className="text-xs text-gray-400 italic">Waiting...</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Donor Management Section */}
            <div className="card mt-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Users className="text-blue-500" /> Registered Donors
                    </h2>
                </div>


                <div className="overflow-x-auto">
                    <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '2px solid #e5e7eb', color: '#6b7280' }}>
                                <th style={{ padding: '1rem' }}>Name</th>
                                <th style={{ padding: '1rem' }}>Blood Group</th>
                                <th style={{ padding: '1rem' }}>Age</th>
                                <th style={{ padding: '1rem' }}>Contact</th>
                                <th style={{ padding: '1rem' }}>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donors.map(donor => (
                                <tr key={donor.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '1rem', fontWeight: 500 }}>{donor.name}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span className="font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                                            {donor.blood_group}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{donor.age}</td>
                                    <td style={{ padding: '1rem' }}>{donor.phone}</td>
                                    <td style={{ padding: '1rem' }}>{donor.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
};

export default AdminDashboard;
