import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import StatCard from '../components/StatCard';
import { Activity, Plus, FileText, Droplet, Heart, User } from 'lucide-react';

const HospitalDashboard = () => {
    const { user } = useAuth();
    const { bloodStock, requests, addRequest, donors, handleRequestStatus } = useData();
    const [requestForm, setRequestForm] = useState({
        patient_name: '',
        blood_group: '',
        units: 1,
        preferred_date: '',
        preferred_time: '',
        venue: ''
    });

    // Stats
    const myRequests = requests.filter(r => r.requester_id === user.id);
    const approvedRequests = myRequests.filter(r => r.status === 'approved' || r.status === 'fulfilled').length;
    const pendingRequests = myRequests.filter(r => r.status === 'pending').length;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { error } = await addRequest({
                requester_id: user.id,
                hospital_name: user.name || 'Hospital',
                ...requestForm
            });

            if (error) {
                alert('Failed to send request: ' + error.message);
                return;
            }

            setRequestForm({
                patient_name: '',
                blood_group: '',
                units: 1,
                preferred_date: '',
                preferred_time: '',
                venue: ''
            });
            alert('Request sent successfully!');
        } catch (err) {
            console.error(err);
            alert('An unexpected error occurred.');
        }
    };

    return (
        <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="page-title mb-1 text-2xl font-black">Hospital Portal</h1>
                    <p className="text-slate-400 text-sm font-medium">Manage your blood requests and donor notifications</p>
                </div>
                <div className="text-right">
                    <p className="font-black text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{user.address || 'City Hospital'}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard title="Total Requests" value={myRequests.length} icon={FileText} color="#6366f1" />
                <StatCard title="Fulfilled" value={approvedRequests} icon={Activity} color="#10b981" />
                <StatCard title="Pending" value={pendingRequests} icon={Activity} color="#f43f5e" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Request Form */}
                <div className="card lg:col-span-1 h-fit shadow-lg border-none" style={{ background: 'white' }}>
                    <h2 className="text-xl font-black mb-6 flex items-center gap-3 text-slate-800">
                        <Plus className="text-rose-500" /> New Request
                    </h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Patient Name</label>
                            <input
                                className="input-field mb-0"
                                placeholder="Enter patient name"
                                value={requestForm.patient_name}
                                onChange={e => setRequestForm({ ...requestForm, patient_name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Blood Group</label>
                                <select
                                    className="input-field mb-0"
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
                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Units Needed</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="input-field mb-0"
                                    value={requestForm.units}
                                    onChange={e => setRequestForm({ ...requestForm, units: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 mt-2">
                            <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-4">Donation Schedule</p>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Preferred Date</label>
                                    <input
                                        type="date"
                                        className="input-field mb-0"
                                        value={requestForm.preferred_date}
                                        onChange={e => setRequestForm({ ...requestForm, preferred_date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Preferred Time</label>
                                    <input
                                        type="time"
                                        className="input-field mb-0"
                                        value={requestForm.preferred_time}
                                        onChange={e => setRequestForm({ ...requestForm, preferred_time: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Venue / Location</label>
                                <input
                                    className="input-field mb-0"
                                    placeholder="e.g. 2nd Floor, Blood Bank"
                                    value={requestForm.venue}
                                    onChange={e => setRequestForm({ ...requestForm, venue: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-full mt-4 font-black uppercase tracking-widest shadow-lg py-4">Send Request</button>
                    </form>
                </div>

                <div className="lg:col-span-2 flex flex-col gap-8">
                    {/* Live Blood Stock (Read Only) */}
                    <div className="card shadow-lg border-none" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}>
                        <h2 className="text-xl font-black mb-6 flex items-center gap-3 text-slate-800">
                            <Droplet className="text-rose-500" /> Live Blood Stock
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {bloodStock.map((stock) => (
                                <div key={stock.group_name} className="flex flex-col items-center p-4 border border-slate-100 rounded-2xl bg-white shadow-sm transition-all hover:shadow-md">
                                    <span className="font-black text-2xl text-rose-600 mb-1">{stock.group_name}</span>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stock.quantity} Units</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Request Management */}
                    <div className="glass-panel" style={{ borderRadius: '2rem', padding: '2rem' }}>
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black flex items-center gap-3 text-slate-900">
                                <Activity className="text-rose-500" size={24} /> Request Management
                            </h2>
                            <span className="px-3 py-1 bg-rose-100 text-rose-600 text-xs font-black uppercase tracking-widest rounded-full">Live Monitor</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: '0 1rem' }}>
                                <thead>
                                    <tr className="text-slate-400 uppercase tracking-widest font-black" style={{ fontSize: '10px' }}>
                                        <th className="pb-2 text-left px-4">Patient Profile</th>
                                        <th className="pb-2 text-center">Status</th>
                                        <th className="pb-2 text-right px-4">Action Required</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myRequests.map(req => {
                                        const donor = req.donor_id ? donors.find(d => d.id === req.donor_id) : null;
                                        const canCancel = req.status === 'notified' && req.notified_at && (new Date() - new Date(req.notified_at) > 3600000);

                                        return (
                                            <tr key={req.id} className="transition-all" style={{ backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', borderRadius: '1.25rem' }}>
                                                <td className="py-5 px-4" style={{ borderTopLeftRadius: '1.25rem', borderBottomLeftRadius: '1.25rem' }}>
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center justify-center font-black text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-lg" style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                                                            {req.blood_group}
                                                        </div>
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="font-bold text-slate-800 text-base truncate">{req.patient_name}</span>
                                                            {donor && (
                                                                <span className="text-xs text-indigo-600 font-bold mt-0.5 flex items-center gap-1">
                                                                    <User size={10} /> Matched: {donor.name}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-5 text-center">
                                                    <span className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border inline-block
                                                    ${req.status === 'fulfilled' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                            req.status === 'notified' ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse' :
                                                                req.status === 'accepted' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                                                    req.status === 'cancelled' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                                                                        'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                                        {req.status}
                                                    </span>
                                                </td>
                                                <td className="py-5 px-4 text-right" style={{ borderTopRightRadius: '1.25rem', borderBottomRightRadius: '1.25rem' }}>
                                                    <div className="flex flex-col items-end gap-2">
                                                        {req.status === 'pending' && (
                                                            <>
                                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">Notify Available Donor:</p>
                                                                <div className="flex flex-wrap justify-end gap-2" style={{ maxWidth: '300px' }}>
                                                                    {donors.filter(d => d.blood_group === req.blood_group).length === 0 ? (
                                                                        <span className="text-xs text-slate-400 italic">No matching donors</span>
                                                                    ) : (
                                                                        donors.filter(d => d.blood_group === req.blood_group).map(d => (
                                                                            <button
                                                                                key={d.id}
                                                                                onClick={() => handleRequestStatus(req.id, 'notified', { donor_id: d.id, notified_at: new Date().toISOString() })}
                                                                                className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold hover:bg-rose-500 hover:border-rose-500 hover:text-white transition-all shadow-sm"
                                                                            >
                                                                                {d.name}
                                                                            </button>
                                                                        ))
                                                                    )}
                                                                </div>
                                                            </>
                                                        )}

                                                        {req.status === 'notified' && (
                                                            <div className="flex items-center gap-3">
                                                                <div className="text-right">
                                                                    <p className="text-xs font-black text-rose-600">Awaiting...</p>
                                                                    <p className="text-xs text-slate-400 font-medium">{new Date(req.notified_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                                </div>
                                                                <button
                                                                    disabled={!canCancel}
                                                                    onClick={() => handleRequestStatus(req.id, 'cancelled', { donor_id: null, notified_at: null })}
                                                                    className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                                                                    ${canCancel ? 'bg-rose-500 text-white shadow-md hover:bg-rose-600' : 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed'}`}
                                                                >
                                                                    {canCancel ? 'Re-list' : '1h Wait'}
                                                                </button>
                                                            </div>
                                                        )}

                                                        {req.status === 'accepted' && (
                                                            <div className="text-right bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100/50">
                                                                <div className="text-xs font-black text-indigo-700 mb-0.5">Assigned: {req.venue}</div>
                                                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">{req.preferred_date} • {req.preferred_time}</div>
                                                            </div>
                                                        )}

                                                        {req.status === 'fulfilled' && (
                                                            <div className="text-right bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/50">
                                                                <div className="text-xs font-black text-emerald-700">{req.donation_location}</div>
                                                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">{req.donation_date} • {req.donation_time}</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {myRequests.length === 0 && (
                                <div className="text-center py-24 bg-slate-50/30 rounded-3xl border border-dashed border-slate-200 mt-4">
                                    <Heart className="mx-auto mb-4 text-slate-200" size={48} />
                                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No active life-saving requests</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HospitalDashboard;
