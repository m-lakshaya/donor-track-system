import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import StatCard from '../components/StatCard';
import { User, Clock, Heart, Calendar, MapPin, CheckCircle2, X } from 'lucide-react';

const DonorDashboard = () => {
    const { user } = useAuth();
    const { requests, handleRequestStatus } = useData();
    const [confirmingReq, setConfirmingReq] = useState(null);
    const [confirmData, setConfirmData] = useState({
        date: '',
        time: '',
        location: ''
    });

    // Calculate previous donations where this user is the donor_id
    const donationCount = requests.filter(r => r.donor_id === user.id && r.status === 'fulfilled').length;

    // Filter requests matching donor's blood group
    const matchingRequests = requests.filter(
        r => r.status === 'pending' && r.blood_group === user.blood_group
    );

    return (
        <div>
            <h1 className="page-title">Welcome, {user.name}</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Blood Group" value={user.blood_group} icon={Heart} color="#ef4444" />
                <StatCard title="Total Donations" value={donationCount} icon={DropletIcon} color="#3b82f6" />
                <StatCard title="Lives Saved" value={donationCount * 3} icon={User} color="#10b981" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Donation Opportunities */}
                <div className="card">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Heart className="text-red-500" /> Donation Opportunities
                    </h2>
                    <p className="text-sm text-gray mb-4">Hospitals needing <strong>{user.blood_group}</strong> blood.</p>

                    {matchingRequests.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded">
                            No urgent requests for your blood group at the moment.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {matchingRequests.map(req => (
                                <div key={req.id} className="p-4 border rounded hover:border-red-200 transition-colors shadow-sm bg-white">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold text-red-600 text-lg">Urgent Request</h3>
                                            <p className="font-medium text-gray-800">{req.hospital_name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-bold">
                                                    {req.units} Unit{req.units > 1 ? 's' : ''}
                                                </span>
                                                <span className="text-xs text-gray-500">Needed</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setConfirmingReq(req)}
                                            className="btn btn-primary text-sm px-4 py-2 shadow hover:shadow-md transition-all whitespace-nowrap ml-2"
                                        >
                                            Donate Now
                                        </button>
                                    </div>

                                    {/* Confirmation Form */}
                                    {confirmingReq?.id === req.id && (
                                        <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-2">
                                            <div className="flex justify-between items-center mb-3">
                                                <h4 className="font-bold text-red-800 flex items-center gap-2">
                                                    <Clock size={16} /> Confirm Appointment
                                                </h4>
                                                <button onClick={() => setConfirmingReq(null)} className="text-gray-400 hover:text-gray-600">
                                                    <X size={18} />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                                <div>
                                                    <label className="text-xs font-bold text-gray-600 uppercase">Date</label>
                                                    <input
                                                        type="date"
                                                        className="input-field bg-white py-1 text-sm"
                                                        value={confirmData.date}
                                                        onChange={e => setConfirmData({ ...confirmData, date: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-gray-600 uppercase">Time</label>
                                                    <input
                                                        type="time"
                                                        className="input-field bg-white py-1 text-sm"
                                                        value={confirmData.time}
                                                        onChange={e => setConfirmData({ ...confirmData, time: e.target.value })}
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="text-xs font-bold text-gray-600 uppercase">Specific Location (Floor/Room)</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. 2nd Floor, Blood Bank Unit"
                                                        className="input-field bg-white py-1 text-sm"
                                                        value={confirmData.location}
                                                        onChange={e => setConfirmData({ ...confirmData, location: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                disabled={!confirmData.date || !confirmData.time || !confirmData.location}
                                                onClick={async () => {
                                                    const { error } = await handleRequestStatus(req.id, 'fulfilled', {
                                                        donor_id: user.id,
                                                        donation_date: confirmData.date,
                                                        donation_time: confirmData.time,
                                                        donation_location: confirmData.location
                                                    });
                                                    if (error) {
                                                        alert("Error: " + error.message);
                                                    } else {
                                                        setConfirmingReq(null);
                                                        setConfirmData({ date: '', time: '', location: '' });
                                                    }
                                                }}
                                                className="btn btn-primary w-full py-2 flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle2 size={18} /> Confirm Donation
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Donation History */}
                <div className="card">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Clock className="text-blue-500" /> Donation History
                    </h2>
                    <div className="flex flex-col gap-0">
                        {requests.filter(r => r.donor_id === user.id && r.status === 'fulfilled').length > 0 ? (
                            requests.filter(r => r.donor_id === user.id && r.status === 'fulfilled').map((item) => (
                                <div key={item.id} className="flex items-center gap-4 py-4 border-b last:border-0">
                                    <div className="bg-blue-50 p-2 rounded text-blue-500">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold">{item.hospital_name}</p>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                            <p className="text-sm text-gray flex items-center gap-1">
                                                <Calendar size={12} /> {item.donation_date || new Date(item.created_at).toLocaleDateString()}
                                            </p>
                                            <p className="text-sm text-gray flex items-center gap-1">
                                                <Clock size={12} /> {item.donation_time || '--:--'}
                                            </p>
                                            <p className="text-sm text-gray flex items-center gap-1">
                                                <MapPin size={12} /> {item.donation_location || 'Hospital'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 italic">No previous donations found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper icon
const DropletIcon = ({ size, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M12 22a7 7 0 0 0 7-7c0-2-2-3-2-3s-5-4-5-9-5 9-5 9s-2 1-2 3a7 7 0 0 0 7 7z" />
    </svg>
);

export default DonorDashboard;
