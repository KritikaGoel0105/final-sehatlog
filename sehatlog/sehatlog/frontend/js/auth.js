// Auth page functionality

document.addEventListener('DOMContentLoaded', () => {
    // Get elements
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const patientLoginForm = document.getElementById('patientLoginForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    // Check if already logged in
    if (API.getToken()) {
        window.location.href = 'dashboard.html';
        return;
    }

    // Check URL params for signup
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('signup') === 'true') {
        switchTab('signup');
    }

    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchTab(tabName);
        });
    });

    function switchTab(tabName) {
        // Update tabs
        tabs.forEach(t => {
            if (t.dataset.tab === tabName) {
                t.classList.add('active');
            } else {
                t.classList.remove('active');
            }
        });

        // Update forms
        forms.forEach(f => {
            if (f.id === `${tabName}Form`) {
                f.classList.add('active');
            } else {
                f.classList.remove('active');
            }
        });

        hideMessages();
    }

    // Login form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideMessages();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await API.auth.login({ email, password });
            
            // Store token and user data
            API.setToken(response.token);
            API.setUser(response.user);

            showSuccess('Login successful! Redirecting...');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } catch (error) {
            showError(error.message || 'Login failed');
        }
    });

    // Signup form submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideMessages();

        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const role = document.getElementById('signupRole').value;

        if (!role) {
            showError('Please select a role');
            return;
        }

        try {
            const response = await API.auth.signup({ name, email, password, role });
            
            // Store token and user data
            API.setToken(response.token);
            API.setUser(response.user);

            showSuccess('Account created successfully! Redirecting...');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } catch (error) {
            showError(error.message || 'Signup failed');
        }
    });

    // Patient login form submission
    patientLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideMessages();

        const patientId = document.getElementById('patientId').value;
        const phone = document.getElementById('patientPhone').value;

        try {
            const response = await API.auth.patientLogin({ patientId, phone });
            
            // Store token and user data
            API.setToken(response.token);
            API.setUser(response.user);

            showSuccess('Login successful! Redirecting...');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } catch (error) {
            showError(error.message || 'Login failed');
        }
    });

    // Helper functions
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
    }

    function showSuccess(message) {
        successMessage.textContent = message;
        successMessage.classList.add('show');
    }

    function hideMessages() {
        errorMessage.classList.remove('show');
        successMessage.classList.remove('show');
    }
});
