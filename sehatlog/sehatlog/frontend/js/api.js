// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Get auth token from localStorage
const getToken = () => localStorage.getItem('token');

// Set auth token
const setToken = (token) => localStorage.setItem('token', token);

// Remove auth token
const removeToken = () => localStorage.removeItem('token');

// Get user data
const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

// Set user data
const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));

// Remove user data
const removeUser = () => localStorage.removeItem('user');

// Generic API call function
async function apiCall(endpoint, options = {}) {
    const token = getToken();
    
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Auth API
const authAPI = {
    signup: (userData) => apiCall('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData)
    }),

    login: (credentials) => apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    }),

    patientLogin: (credentials) => apiCall('/auth/patient-login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    })
};

// Patient API
const patientAPI = {
    getAll: () => apiCall('/patients'),

    getById: (patientId) => apiCall(`/patients/${patientId}`),

    create: (patientData) => apiCall('/patients', {
        method: 'POST',
        body: JSON.stringify(patientData)
    }),

    addDocument: (patientId, documentData) => apiCall(`/patients/${patientId}/documents`, {
        method: 'POST',
        body: JSON.stringify(documentData)
    }),

    addNote: (patientId, noteData) => apiCall(`/patients/${patientId}/notes`, {
        method: 'POST',
        body: JSON.stringify(noteData)
    }),

    addLabData: (patientId, labData) => apiCall(`/patients/${patientId}/lab-data`, {
        method: 'POST',
        body: JSON.stringify(labData)
    }),

    addVitals: (patientId, vitalsData) => apiCall(`/patients/${patientId}/vitals`, {
        method: 'POST',
        body: JSON.stringify(vitalsData)
    })
};

// AI API
const aiAPI = {
    generateSummary: (patientId) => apiCall(`/ai/generate-summary/${patientId}`, {
        method: 'POST'
    }),

    checkMissing: (patientId) => apiCall(`/ai/check-missing/${patientId}`),

    generateDischarge: (patientId) => apiCall(`/ai/generate-discharge/${patientId}`, {
        method: 'POST'
    })
};

// Export functions
window.API = {
    auth: authAPI,
    patient: patientAPI,
    ai: aiAPI,
    getToken,
    setToken,
    removeToken,
    getUser,
    setUser,
    removeUser
};
