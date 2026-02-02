import { MOCK_USERS, MOCK_STOCK, MOCK_REQUESTS } from '../data/mockData';

const DB_KEYS = {
    USERS: 'donor_users',
    STOCK: 'donor_stock',
    REQUESTS: 'donor_requests'
};

// Initialize DB with mock data if empty
export const initDB = () => {
    if (!localStorage.getItem(DB_KEYS.USERS)) {
        localStorage.setItem(DB_KEYS.USERS, JSON.stringify(MOCK_USERS));
    }
    if (!localStorage.getItem(DB_KEYS.STOCK)) {
        localStorage.setItem(DB_KEYS.STOCK, JSON.stringify(MOCK_STOCK));
    }
    if (!localStorage.getItem(DB_KEYS.REQUESTS)) {
        localStorage.setItem(DB_KEYS.REQUESTS, JSON.stringify(MOCK_REQUESTS));
    }
};

// --- USERS ---
export const getUsers = () => {
    return JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
};

export const addUser = (user) => {
    const users = getUsers();
    users.push(user);
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    return user;
};

export const findUser = (email, password) => {
    const users = getUsers();
    return users.find(u => u.email === email && u.password === password);
};

// --- STOCK ---
export const getStock = () => {
    return JSON.parse(localStorage.getItem(DB_KEYS.STOCK) || '[]');
};

export const updateStockItem = (updatedStock) => {
    localStorage.setItem(DB_KEYS.STOCK, JSON.stringify(updatedStock));
};

// --- REQUESTS ---
export const getRequests = () => {
    return JSON.parse(localStorage.getItem(DB_KEYS.REQUESTS) || '[]');
};

export const addRequest = (request) => {
    const requests = getRequests();
    const newRequest = { ...request, id: Date.now() };
    requests.unshift(newRequest);
    localStorage.setItem(DB_KEYS.REQUESTS, JSON.stringify(requests));
    return newRequest;
};

export const updateRequest = (updatedRequests) => {
    localStorage.setItem(DB_KEYS.REQUESTS, JSON.stringify(updatedRequests));
};
