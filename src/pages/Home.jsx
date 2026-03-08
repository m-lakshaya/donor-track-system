import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Activity, ShieldCheck, MapPin, ArrowRight, Droplet } from 'lucide-react';
import { useEffect } from 'react';

const Home = () => {
    const { user } = useAuth();

    // Scroll to top on mount for a fresh feel
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="home-container bg-mesh relative overflow-hidden" style={{ minHeight: '100vh', margin: '-2rem 0', paddingBottom: '7rem', zIndex: 1 }}>

            {/* Background Decorative Blur Orbs */}
            <div className="bg-blur-circle" style={{ top: '-10%', left: '-5%', width: '400px', height: '400px', background: '#ffcdd2' }}></div>
            <div className="bg-blur-circle" style={{ top: '40%', right: '-10%', width: '500px', height: '500px', background: '#bbdefb' }}></div>

            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 1rem 2rem 1rem' }}>

                {/* Hero Section */}
                <header className="animate-fade-in-up" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 5rem auto' }}>
                    <div className="glass-panel floating-fast" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '600', color: '#ef4444', marginBottom: '2rem' }}>
                        <Droplet fill="#ef4444" size={16} />
                        <span>Smart Blood Tracking System</span>
                    </div>

                    <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: '800', letterSpacing: '-0.025em', color: '#111827', marginBottom: '1.5rem', lineHeight: '1.1' }}>
                        Life flows where <br /> <span className="text-gradient">compassion goes.</span>
                    </h1>

                    <p style={{ fontSize: 'clamp(1.125rem, 2vw, 1.25rem)', color: '#4b5563', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem auto', lineHeight: '1.6' }}>
                        A seamless, modern platform connecting willing donors directly to the hospitals that need them most. Zero delays. Maximum impact.
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                        {!user ? (
                            <>
                                <Link to="/register" className="btn btn-primary btn-pill" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.4)' }}>
                                    Become a Donor
                                    <ArrowRight size={18} />
                                </Link>
                                <Link to="/login" className="btn btn-outline btn-pill glass-panel" style={{ color: '#1f2937' }}>
                                    Sign In
                                </Link>
                            </>
                        ) : (
                            <Link to={`/${user.role}`} className="btn btn-primary btn-pill" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.4)' }}>
                                Access Dashboard <ArrowRight size={18} />
                            </Link>
                        )}
                    </div>
                </header>

                {/* Bento Grid Features */}
                <div className="bento-grid">

                    {/* Big Highlight Feature */}
                    <div className="bento-item glass-panel span-12 md-span-8 animate-fade-in-up delay-100" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2.5rem', minHeight: '300px', background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 100%)' }}>
                        <div style={{ position: 'relative', zIndex: 10 }}>
                            <div style={{ width: '4rem', height: '4rem', borderRadius: '1rem', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                <Activity size={32} color="#ef4444" />
                            </div>
                            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#111827', marginBottom: '1rem' }}>Real-time Matching</h2>
                            <p style={{ fontSize: '1.125rem', color: '#4b5563', maxWidth: '30rem', lineHeight: '1.6' }}>
                                Our intelligent algorithm instantly notifies the closest compatible donors when an emergency request is raised. Efficiency saves lives.
                            </p>
                        </div>
                        {/* Abstract visual within card */}
                        <div style={{ position: 'absolute', right: 0, bottom: 0, opacity: 0.05, pointerEvents: 'none', transform: 'translate(20%, 20%)' }}>
                            <Activity size={250} />
                        </div>
                    </div>

                    {/* Small Feature 1 */}
                    <div className="bento-item glass-panel span-12 md-span-4 animate-fade-in-up delay-200" style={{ padding: '2.5rem', background: '#ffffff', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '1rem', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <ShieldCheck size={28} color="#3b82f6" />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#111827', marginBottom: '0.75rem' }}>Enterprise Security</h3>
                        <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
                            End-to-end encryption ensures that donor and patient data remain strictly confidential.
                        </p>
                    </div>

                    {/* Small Feature 2 */}
                    <div className="bento-item glass-panel span-12 md-span-4 animate-fade-in-up delay-300" style={{ padding: '2.5rem', background: '#111827', color: '#ffffff', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '1rem', background: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <Heart size={28} color="#f87171" fill="#f87171" />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.75rem' }}>Community Hub</h3>
                        <p style={{ color: '#d1d5db', lineHeight: '1.6' }}>
                            Join over 10,000+ verified active donors in your region. Your contribution matters.
                        </p>
                    </div>

                    {/* Medium Feature */}
                    <div className="bento-item glass-panel span-12 md-span-8 animate-fade-in-up delay-400" style={{ padding: '2.5rem', background: '#fffcfc', border: '1px solid #fee2e2' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
                            <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '1rem', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                <MapPin size={28} color="#f97316" />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827', marginBottom: '0.75rem' }}>Hospital Integration</h3>
                            <p style={{ color: '#4b5563', fontSize: '1.05rem', lineHeight: '1.6', maxWidth: '35rem' }}>
                                Hospitals have a dedicated portal to broadcast urgent requirements to specific geo-fenced locations, reducing transport times drastically.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Home;
