import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import StatCard from '../components/StatCard';
import { User, Clock, Heart, Calendar, MapPin, CheckCircle2, X, Activity } from 'lucide-react';

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

                {/* Donation Invitations */}
                <div className="glass-panel mb-8" style={{ borderRadius: '1.5rem', padding: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.4)' }}>
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Activity className="text-purple-500" size={22} /> Donation Invitations
                    </h2>

                    {requests.filter(r => r.donor_id === user.id && r.status === 'notified').length === 0 ? (
                        <div className="text-center py-10 text-gray-400 bg-white/20 rounded-2xl border border-dashed border-gray-300">
                            <Heart className="mx-auto mb-2 opacity-20" size={32} />
                            No active invitations at the moment.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {requests.filter(r => r.donor_id === user.id && r.status === 'notified').map(req => (
                                <div key={req.id} className="p-5 rounded-2xl bg-gradient-to-br from-purple-50/80 to-indigo-50/80 border border-purple-100 shadow-sm transition-all hover:shadow-md animate-fade-in-up">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="bg-purple-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">New Invitation</span>
                                            </div>
                                            <h3 className="font-bold text-gray-800 text-lg">{req.hospital_name}</h3>
                                            <p className="text-[11px] text-gray-500 font-medium">Request for patient: <span className="text-purple-700 font-bold">{req.patient_name}</span></p>
                                        </div>
                                        <div className="bg-white/60 p-2 rounded-xl border border-white">
                                            <Calendar className="text-purple-600" size={20} />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleRequestStatus(req.id, 'accepted')}
                                            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold py-2.5 rounded-xl hover:shadow-lg transition-all"
                                        >
                                            Accept Invitation
                                        </button>
                                        <button
                                            onClick={() => handleRequestStatus(req.id, 'cancelled', { donor_id: null, notified_at: null })}
                                            className="px-4 py-2.5 bg-white border border-purple-100 text-purple-600 text-xs font-bold rounded-xl hover:bg-purple-50 transition-all"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Your Appointments */}
                <div className="glass-panel" style={{ borderRadius: '1.5rem', padding: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.4)' }}>
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Clock className="text-blue-500" size={22} /> Your Appointments
                    </h2>
                    <div className="space-y-4">
                        {requests.filter(r => r.donor_id === user.id && (r.status === 'fulfilled' || r.status === 'accepted')).length > 0 ? (
                            requests.filter(r => r.donor_id === user.id && (r.status === 'fulfilled' || r.status === 'accepted')).map((item) => (
                                <div key={item.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-2xl bg-white/30 border border-white/40 transition-all hover:bg-white/50">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.status === 'accepted' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                                        {item.status === 'accepted' ? <Clock size={24} /> : <CheckCircle2 size={24} />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-gray-800">{item.hospital_name}</h4>
                                                <p className="text-[11px] text-gray-500 font-medium uppercase tracking-tight">Patient: {item.patient_name}</p>
                                            </div>
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${item.status === 'accepted' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                                                {item.status === 'accepted' ? 'Action Needed' : 'Appointment Set'}
                                            </span>
                                        </div>

                                        {item.status === 'accepted' ? (
                                            <div className="mt-3 py-2 px-3 bg-white/60 rounded-lg border border-white/80 inline-flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                                                <p className="text-[10px] text-gray-600 font-medium">Waiting for hospital to confirm final venue and time...</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-wrap gap-4 mt-3">
                                                <div className="flex items-center gap-2 text-xs text-gray-700 bg-white/60 px-2.5 py-1.5 rounded-lg border border-white/50">
                                                    <Calendar size={14} className="text-blue-500" /> <span className="font-bold">{item.donation_date}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-700 bg-white/60 px-2.5 py-1.5 rounded-lg border border-white/50">
                                                    <Clock size={14} className="text-blue-500" /> <span className="font-bold">{item.donation_time}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50/50 px-2.5 py-1.5 rounded-lg border border-blue-100">
                                                    <MapPin size={14} /> <span className="font-bold">{item.donation_location}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-400 italic bg-white/10 rounded-2xl border border-dashed border-gray-300">
                                <Clock size={32} className="mx-auto mb-2 opacity-20" />
                                No upcoming appointments found.
                            </div>
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
