import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const enrichUser = async (sessionUser) => {
        if (!sessionUser) return null;

        // Fetch extra profile data (role, name, etc.) from 'profiles' table
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', sessionUser.id)
            .single();

        if (error || !profile) {
            console.warn("Profile fetch failed or missing. Using metadata/default.", error);
            // Fallback: Try to use metadata from the auth user if available, or default to donor
            return {
                ...sessionUser,
                role: sessionUser.user_metadata?.role || 'donor',
                name: sessionUser.user_metadata?.name || 'User',
                // Add any other essential defaults to prevent crashes
                blood_group: sessionUser.user_metadata?.blood_group || 'Unknown'
            };
        }

        return { ...sessionUser, ...profile }; // Merge auth user with profile data
    };

    useEffect(() => {
        const initSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const enriched = await enrichUser(session?.user);
            setUser(enriched);
            setLoading(false);
        };

        initSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const enriched = await enrichUser(session?.user);
            setUser(enriched);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) return { success: false, message: error.message };
        return { success: true };
    };

    const register = async (newUser) => {
        const { email, password, name, role, details } = newUser;

        // Sign up with Supabase Auth
        // Metadata is passed so the Trigger in SQL can create the 'profile' row automatically
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    role,
                    blood_group: details.bloodGroup,
                    age: details.age,
                    phone: details.phone
                }
            }
        });

        if (error) return { success: false, message: error.message };
        return { success: true };
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {loading ? (
                <div className="flex items-center justify-center p-10 h-screen">
                    <div className="text-xl font-bold text-gray-500">Loading Blood Bank...</div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
