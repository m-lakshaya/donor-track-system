import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [bloodStock, setBloodStock] = useState([]);
    const [requests, setRequests] = useState([]);
    const [donors, setDonors] = useState([]);

    // Fetch initial data
    const refreshData = async () => {
        const { data: stock } = await supabase.from('blood_stock').select('*').order('group_name');
        if (stock) setBloodStock(stock);

        const { data: reqs } = await supabase.from('donation_requests').select('*').order('created_at', { ascending: false });
        if (reqs) setRequests(reqs);

        const { data: donorList } = await supabase.from('profiles').select('*').eq('role', 'donor');
        if (donorList) setDonors(donorList);
    };

    useEffect(() => {
        refreshData();

        // Realtime Subscription
        const channel = supabase
            .channel('db-changes')
            .on('postgres_changes', { event: '*', schema: 'public' }, () => {
                refreshData();
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, []);

    // Admin Actions
    const updateStock = async (group, quantity, operation = 'add') => {
        // Find current quantity
        const currentItem = bloodStock.find(i => i.group_name === group);
        if (!currentItem) return;

        const newQuantity = operation === 'add'
            ? currentItem.quantity + parseInt(quantity)
            : Math.max(0, currentItem.quantity - parseInt(quantity));

        const { error } = await supabase
            .from('blood_stock')
            .update({ quantity: newQuantity })
            .eq('group_name', group);

        if (error) console.error("Update stock error:", error);
        else refreshData();
    };

    const addDonor = async (donorDetails) => {
        // Donors are added via Registration, this might be unused or for Admin adding users manually
        // If needed, we'd use supabase admin api or just instructions
        console.log("Donors should register via the sign up page.");
    };

    const handleRequestStatus = async (id, status, extraUpdates = {}) => {
        const { error } = await supabase
            .from('donation_requests')
            .update({ status, ...extraUpdates })
            .eq('id', id);

        if (error) console.error("Update request error:", error);
        else refreshData();
        return { error };
    };

    // Hospital Actions
    const addRequest = async (requestData) => {
        const { error } = await supabase
            .from('donation_requests')
            .insert([{
                ...requestData,
                status: 'pending'
            }]);

        if (error) console.error("Add request error:", error);
        else refreshData(); // Refresh immediately
    };

    return (
        <DataContext.Provider value={{
            bloodStock,
            requests,
            donors,
            updateStock,
            handleRequestStatus,
            addRequest,
            addDonor
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
