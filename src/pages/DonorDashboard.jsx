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

                                    {/* Confirmation Modal */}
                                    {confirmingReq?.id === req.id && (
                                        <div className="modal-overlay">
                                            <div className="modal-content">
                                                <div className="flex justify-between items-start mb-8">
                                                    <div>
                                                        <h4 className="text-xl font-black text-slate-900 tracking-tight leading-tight mb-1">Confirm Donation</h4>
                                                        <div className="px-2 py-0.5 bg-rose-50 rounded-md inline-block">
                                                            <p className="text-[9px] text-rose-600 font-black uppercase tracking-widest">{req.hospital_name}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => setConfirmingReq(null)}
                                                        className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-rose-500"
                                                    >
                                                        <X size={20} />
                                                    </button>
                                                </div>

                                                <div className="flex flex-col gap-4 mb-8">
                                                    <div className="detail-card">
                                                        <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center shrink-0">
                                                            <Calendar size={20} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <span className="label-mini">Scheduled For</span>
                                                            <p className="value-bold">{req.preferred_date || 'TBD'} • {req.preferred_time || 'TBD'}</p>
                                                        </div>
                                                    </div>

                                                    <div className="detail-card">
                                                        <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                                                            <MapPin size={20} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <span className="label-mini">Hospital Venue</span>
                                                            <p className="value-bold">{req.venue || 'Hospital Location'}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={async (e) => {
                                                        const btn = e.currentTarget;
                                                        btn.disabled = true;
                                                        const originalText = btn.innerHTML;
                                                        btn.innerHTML = '<span class="animate-pulse">Processing...</span>';

                                                        const { error } = await handleRequestStatus(req.id, 'fulfilled', {
                                                            donor_id: user.id,
                                                            donation_date: req.preferred_date,
                                                            donation_time: req.preferred_time,
                                                            donation_location: req.venue,
                                                            notified_at: new Date().toISOString()
                                                        });

                                                        if (error) {
                                                            alert("Error: " + error.message);
                                                            btn.disabled = false;
                                                            btn.innerHTML = originalText;
                                                        } else {
                                                            setConfirmingReq(null);
                                                            alert('Success! Your appointment is confirmed.');
                                                        }
                                                    }}
                                                    className="modal-btn-confirm"
                                                >
                                                    <Heart size={18} className="text-rose-500 fill-rose-500" /> Confirm & Commit
                                                </button>

                                                <p className="text-center mt-6 text-[9px] text-slate-400 font-bold uppercase tracking-widest px-2 leading-relaxed">
                                                    Note: You are committing to arrive at the specified time.
                                                </p>
                                            </div>
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
                        <div className="text-center py-12 text-slate-400 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                            <Heart className="mx-auto mb-4 opacity-20 text-rose-500" size={48} />
                            <p className="font-black uppercase tracking-widest text-xs">No active invitations</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {requests.filter(r => r.donor_id === user.id && r.status === 'notified').map(req => (
                                <div key={req.id} className="group p-6 rounded-3xl bg-white border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 animate-fade-in-up">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest animate-pulse">Urgent Match</span>
                                            </div>
                                            <h3 className="font-black text-slate-900 text-xl mb-1">{req.hospital_name}</h3>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">Request for <span className="text-slate-800">{req.patient_name}</span></p>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 group-hover:bg-rose-50 group-hover:border-rose-100 transition-colors">
                                            <Calendar className="text-rose-500" size={24} />
                                        </div>
                                    </div>

                                    <div className="bg-slate-50/50 rounded-2xl p-4 mb-6 border border-slate-100/50">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">When</span>
                                                <span className="text-xs font-bold text-slate-800">{req.preferred_date || 'TBD'} • {req.preferred_time || 'TBD'}</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Where</span>
                                                <span className="text-xs font-bold text-slate-800">{req.venue || 'Hospital Location'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setConfirmingReq(req)}
                                            className="flex-1 bg-gradient-to-r from-rose-500 to-rose-600 text-white text-[10px] font-black py-4 rounded-2xl shadow-lg hover:shadow-rose-100 transition-all uppercase tracking-widest active:scale-95"
                                        >
                                            Review & Accept
                                        </button>
                                        <button
                                            onClick={() => handleRequestStatus(req.id, 'cancelled', { donor_id: null, notified_at: null })}
                                            className="px-6 py-4 bg-white border border-slate-200 text-slate-500 text-[10px] font-black rounded-2xl hover:bg-slate-50 transition-all uppercase tracking-widest active:scale-95"
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
                    <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                        <Clock className="text-blue-500" size={24} /> Donation Appointments
                    </h2>
                    <div className="space-y-4">
                        {requests.filter(r => r.donor_id === user.id && r.status === 'fulfilled').length > 0 ? (
                            requests.filter(r => r.donor_id === user.id && r.status === 'fulfilled').map((item) => (
                                <div key={item.id} className="group flex flex-col md:flex-row md:items-center gap-4 p-5 rounded-2xl bg-white/40 border border-white/60 transition-all hover:bg-white/70 hover:shadow-lg">
                                    <div className="w-14 h-14 rounded-2xl bg-green-100/50 text-green-600 flex items-center justify-center shrink-0 border border-green-200/50 group-hover:scale-105 transition-transform">
                                        <CheckCircle2 size={28} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="font-black text-slate-900 text-lg leading-tight">{item.hospital_name}</h4>
                                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">Patient: {item.patient_name}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="text-[10px] font-black px-3 py-1 bg-green-500 text-white rounded-full uppercase tracking-widest shadow-sm">Confirmed</span>
                                                <span className="text-[10px] font-black text-rose-500">{item.blood_group} Needed</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-3">
                                            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700 bg-white/80 px-3 py-2 rounded-xl border border-slate-100 shadow-sm">
                                                <Calendar size={14} className="text-blue-500" /> {item.donation_date}
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700 bg-white/80 px-3 py-2 rounded-xl border border-slate-100 shadow-sm">
                                                <Clock size={14} className="text-blue-500" /> {item.donation_time}
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px] font-bold text-blue-700 bg-blue-50/50 px-3 py-2 rounded-xl border border-blue-100 shadow-sm">
                                                <MapPin size={14} /> {item.donation_location || item.venue}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-16 text-slate-400 italic bg-white/10 rounded-3xl border border-dashed border-slate-300">
                                <Clock size={40} className="mx-auto mb-4 opacity-10" />
                                <p className="font-black uppercase tracking-widest text-xs">No upcoming appointments</p>
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
