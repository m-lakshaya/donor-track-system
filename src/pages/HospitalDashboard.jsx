import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import StatCard from '../components/StatCard';
import { Activity, Plus, FileText, Droplet } from 'lucide-react';

const HospitalDashboard = () => {
    const { user } = useAuth();
    const { bloodStock, requests, addRequest, donors } = useData();
    const [requestForm, setRequestForm] = useState({
        patient_name: '',
        blood_group: '',
        units: 1
    });

    // Stats
    const myRequests = requests.filter(r => r.requester_id === user.id);
    // Count 'fulfilled' (Donor accepted) as approved for the stats view
    const approvedRequests = myRequests.filter(r => r.status === 'approved' || r.status === 'fulfilled').length;
    const pendingRequests = myRequests.filter(r => r.status === 'pending').length;

    const handleSubmit = (e) => {
        e.preventDefault();
        addRequest({
            requester_id: user.id,
            hospital_name: user.name || 'Hospital',
            ...requestForm
        });
        setRequestForm({ patientName: '', bloodGroup: '', units: 1 });
        alert('Request sent successfully!');
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="page-title mb-0">Hospital Portal</h1>
                <div className="text-right">
                    <p className="font-bold">{user.name}</p>
                    <p className="text-xs text-gray">{user.address || 'City Hospital'}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Requests" value={myRequests.length} icon={FileText} color="#3b82f6" />
                <StatCard title="Fulfilled / Approved" value={approvedRequests} icon={Activity} color="#10b981" />
                <StatCard title="Pending" value={pendingRequests} icon={Activity} color="#f59e0b" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Request Form */}
                <div className="card lg:col-span-1 h-fit">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Plus className="text-red-500" /> New Blood Request
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="text-sm font-medium mb-1 block">Patient Name</label>
                            <input
                                className="input-field"
                                value={requestForm.patient_name}
                                onChange={e => setRequestForm({ ...requestForm, patient_name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="text-sm font-medium mb-1 block">Blood Group Needed</label>
                            <select
                                className="input-field"
                                value={requestForm.blood_group}
                                onChange={e => setRequestForm({ ...requestForm, blood_group: e.target.value })}
                                required
                            >
                                <option value="">Select Group</option>
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
                        <div className="mb-4">
                            <label className="text-sm font-medium mb-1 block">Units Required</label>
                            <input
                                type="number"
                                min="1"
                                className="input-field"
                                value={requestForm.units}
                                onChange={e => setRequestForm({ ...requestForm, units: parseInt(e.target.value) })}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-full">Send Request</button>
                    </form>
                </div>

                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Live Blood Stock (Read Only) */}
                    <div className="card">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Droplet className="text-red-500" /> Available Blood Stock
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {bloodStock.map((stock) => (
                                <div key={stock.group} className="flex flex-col items-center p-3 border rounded bg-gray-50">
                                    <span className="font-bold text-lg text-red-600">{stock.group}</span>
                                    <span className="text-sm text-gray">{stock.quantity} Units</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Requests */}
                    <div className="card">
                        <h2 className="text-xl font-bold mb-4">Your Recent Requests</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-gray-500 border-b">
                                    <tr>
                                        <th className="pb-2">Patient</th>
                                        <th className="pb-2">Group</th>
                                        <th className="pb-2">Units</th>
                                        <th className="pb-2">Appointment</th>
                                        <th className="pb-2">Location</th>
                                        <th className="pb-2">Donor</th>
                                        <th className="pb-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myRequests.map(req => {
                                        const donor = req.donor_id ? donors.find(d => d.id === req.donor_id) : null;
                                        return (
                                            <tr key={req.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                                                <td className="py-3 font-medium">{req.patient_name}</td>
                                                <td className="py-3 font-bold text-red-600">{req.blood_group}</td>
                                                <td className="py-3">{req.units}</td>
                                                <td className="py-3">
                                                    {req.donation_date ? (
                                                        <div className="text-xs">
                                                            <p className="font-bold">{req.donation_date}</p>
                                                            <p className="text-gray-500">{req.donation_time}</p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 italic">Pending donor</span>
                                                    )}
                                                </td>
                                                <td className="py-3 text-xs max-w-[120px] truncate" title={req.donation_location}>
                                                    {req.donation_location || '-'}
                                                </td>
                                                <td className="py-3 text-gray-600">
                                                    {donor ? (
                                                        <div className="flex items-center gap-1">
                                                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700">
                                                                {donor.name?.charAt(0)}
                                                            </div>
                                                            <span className="truncate max-w-[80px]">{donor.name}</span>
                                                        </div>
                                                    ) : '-'}
                                                </td>
                                                <td className="py-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider
                                                    ${req.status === 'fulfilled' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                                            req.status === 'approved' ? 'bg-green-100 text-green-800 border border-green-200' :
                                                                req.status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-200' :
                                                                    'bg-yellow-100 text-yellow-800 border border-yellow-200'}`}>
                                                        {req.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {myRequests.length === 0 && <p className="text-center text-gray-500 mt-4">No requests sent yet.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HospitalDashboard;
