// Dashboard functionality

let currentUser = null;
let currentView = 'overview';
let currentPatientId = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    if (!API.getToken()) {
        window.location.href = 'login.html';
        return;
    }

    // Get current user
    currentUser = API.getUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize UI
    initializeUI();
    
    // Load initial view
    await loadOverview();

    // Setup event listeners
    setupEventListeners();
});

function initializeUI() {
    // Update user info in sidebar
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userRole').textContent = currentUser.role;
    document.getElementById('userAvatar').textContent = currentUser.name.charAt(0).toUpperCase();

    // Configure navigation based on role
    if (currentUser.role === 'patient') {
        // Patients have limited navigation
        document.getElementById('navPatients').style.display = 'none';
        document.getElementById('navAiTools').style.display = 'none';
    } else if (currentUser.role === 'doctor') {
        // Doctors cannot add patients
        const addPatientBtn = document.getElementById('addPatientBtn');
        if (addPatientBtn) {
            addPatientBtn.style.display = 'none';
        }
    }
}

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.dataset.view;
            if (view) switchView(view);
        });
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        API.removeToken();
        API.removeUser();
        window.location.href = 'login.html';
    });

    // Add Patient Modal
    const addPatientBtn = document.getElementById('addPatientBtn');
    if (addPatientBtn) {
        addPatientBtn.addEventListener('click', () => {
            document.getElementById('addPatientModal').classList.add('show');
        });
    }

    document.getElementById('closeModalBtn').addEventListener('click', () => {
        document.getElementById('addPatientModal').classList.remove('show');
    });

    document.getElementById('cancelModalBtn').addEventListener('click', () => {
        document.getElementById('addPatientModal').classList.remove('show');
    });

    document.getElementById('addPatientForm').addEventListener('submit', handleAddPatient);

    // Close patient detail modal
    document.getElementById('closeDetailModalBtn').addEventListener('click', () => {
        document.getElementById('patientDetailModal').classList.remove('show');
    });

    // AI Tools
    document.getElementById('generateSummaryBtn')?.addEventListener('click', () => generateAISummary());
    document.getElementById('checkMissingBtn')?.addEventListener('click', () => checkMissingDocs());
    document.getElementById('generateDischargeBtn')?.addEventListener('click', () => generateDischarge());
}

async function switchView(view) {
    currentView = view;

    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        if (item.dataset.view === view) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Update content
    document.querySelectorAll('.view-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${view}View`).classList.add('active');

    // Update page title
    const titles = {
        'overview': 'Dashboard',
        'patients': 'Patients',
        'documents': 'Documents',
        'ai-tools': 'AI Tools'
    };
    document.getElementById('pageTitle').textContent = titles[view] || 'Dashboard';

    // Load view-specific data
    switch(view) {
        case 'overview':
            await loadOverview();
            break;
        case 'patients':
            await loadPatients();
            break;
        case 'documents':
            await loadDocuments();
            break;
    }
}

async function loadOverview() {
    const statsGrid = document.getElementById('statsGrid');
    const quickActions = document.getElementById('quickActions');
    const recentActivity = document.getElementById('recentActivity');

    if (currentUser.role === 'patient') {
        // Patient overview
        try {
            const data = await API.patient.getById(currentUser.id);
            const patient = data.patient;

            statsGrid.innerHTML = `
                <div class="stat-card">
                    <h3>Patient ID</h3>
                    <div class="stat-value">${patient.patientId}</div>
                </div>
                <div class="stat-card">
                    <h3>Status</h3>
                    <div class="stat-value">${patient.status}</div>
                </div>
                <div class="stat-card">
                    <h3>Documents</h3>
                    <div class="stat-value">${data.documents?.length || 0}</div>
                </div>
                <div class="stat-card">
                    <h3>Notes</h3>
                    <div class="stat-value">${data.notes?.length || 0}</div>
                </div>
            `;

            quickActions.innerHTML = `
                <h3>Your Health Summary</h3>
                <p><strong>Diagnosis:</strong> ${patient.diagnosis}</p>
                <p><strong>Admission Date:</strong> ${new Date(patient.admissionDate).toLocaleDateString()}</p>
                <p><strong>Assigned Doctor:</strong> ${patient.assignedDoctor}</p>
            `;

            recentActivity.innerHTML = '<p>View your complete medical records in the navigation menu.</p>';
        } catch (error) {
            console.error('Error loading patient overview:', error);
        }
    } else {
        // Admin/Doctor overview
        try {
            const data = await API.patient.getAll();
            const patients = data.patients || [];

            statsGrid.innerHTML = `
                <div class="stat-card">
                    <h3>Total Patients</h3>
                    <div class="stat-value">${patients.length}</div>
                </div>
                <div class="stat-card">
                    <h3>Admitted</h3>
                    <div class="stat-value">${patients.filter(p => p.status === 'admitted').length}</div>
                </div>
                <div class="stat-card">
                    <h3>Discharged</h3>
                    <div class="stat-value">${patients.filter(p => p.status === 'discharged').length}</div>
                </div>
                <div class="stat-card">
                    <h3>Today</h3>
                    <div class="stat-value">${patients.filter(p => 
                        new Date(p.createdAt).toDateString() === new Date().toDateString()
                    ).length}</div>
                </div>
            `;

            quickActions.innerHTML = `
                <h3>Quick Actions</h3>
                <div class="action-buttons">
                    ${currentUser.role === 'admin' ? '<button class="btn-primary" onclick="document.getElementById(\'addPatientBtn\').click()">➕ Add Patient</button>' : ''}
                    <button class="btn-secondary" onclick="switchView('patients')">👥 View Patients</button>
                    <button class="btn-secondary" onclick="switchView('ai-tools')">🤖 AI Tools</button>
                </div>
            `;

            const recentPatients = patients.slice(0, 5);
            recentActivity.innerHTML = recentPatients.length > 0 
                ? recentPatients.map(p => `
                    <div class="activity-item">
                        <strong>${p.name}</strong> (${p.patientId}) - ${p.diagnosis}
                    </div>
                `).join('')
                : '<p>No recent activity</p>';
        } catch (error) {
            console.error('Error loading overview:', error);
            statsGrid.innerHTML = '<p>Error loading statistics</p>';
        }
    }
}

async function loadPatients() {
    const patientsList = document.getElementById('patientsList');

    try {
        if (currentUser.role === 'patient') {
            // Show only current patient's data
            const data = await API.patient.getById(currentUser.id);
            displayPatientDetail(data.patient, data.documents, data.notes);
        } else {
            // Show all patients for admin/doctor
            const data = await API.patient.getAll();
            const patients = data.patients || [];

            if (patients.length === 0) {
                patientsList.innerHTML = '<p>No patients found</p>';
                return;
            }

            patientsList.innerHTML = patients.map(patient => `
                <div class="patient-card" onclick="viewPatientDetail('${patient.patientId}')">
                    <div class="patient-card-info">
                        <div class="avatar">${patient.name.charAt(0).toUpperCase()}</div>
                        <div class="patient-card-details">
                            <h4>${patient.name}</h4>
                            <p>${patient.patientId} • ${patient.age} yrs • ${patient.gender}</p>
                            <p>${patient.diagnosis}</p>
                        </div>
                    </div>
                    <div>
                        <span class="status-badge ${patient.status === 'admitted' ? 'active' : ''}">${patient.status}</span>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading patients:', error);
        patientsList.innerHTML = '<p>Error loading patients</p>';
    }
}

async function viewPatientDetail(patientId) {
    try {
        const data = await API.patient.getById(patientId);
        displayPatientDetail(data.patient, data.documents, data.notes);
    } catch (error) {
        console.error('Error loading patient detail:', error);
        alert('Error loading patient details');
    }
}

function displayPatientDetail(patient, documents, notes) {
    currentPatientId = patient.patientId;
    const modal = document.getElementById('patientDetailModal');
    const content = document.getElementById('patientDetailContent');

    document.getElementById('patientDetailTitle').textContent = `${patient.name} (${patient.patientId})`;

    content.innerHTML = `
        <div style="padding: 2rem;">
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 2rem;">
                <div>
                    <strong>Age:</strong> ${patient.age} years
                </div>
                <div>
                    <strong>Gender:</strong> ${patient.gender}
                </div>
                <div>
                    <strong>Blood Group:</strong> ${patient.bloodGroup || 'N/A'}
                </div>
                <div>
                    <strong>Phone:</strong> ${patient.phone}
                </div>
                <div>
                    <strong>Diagnosis:</strong> ${patient.diagnosis}
                </div>
                <div>
                    <strong>Status:</strong> <span class="status-badge ${patient.status === 'admitted' ? 'active' : ''}">${patient.status}</span>
                </div>
            </div>

            ${patient.aiSummary ? `
                <div style="background: var(--ai-purple-light); padding: 1rem; border-radius: var(--radius-md); border: 2px solid var(--ai-purple); margin-bottom: 2rem;">
                    <h4 style="display: flex; align-items: center; gap: 0.5rem;">
                        <span>🤖</span> AI Clinical Summary
                    </h4>
                    <p><strong>Overview:</strong> ${patient.aiSummary.content.overview}</p>
                    <p><strong>Clinical Notes:</strong> ${patient.aiSummary.content.clinicalNotes}</p>
                    <p><strong>Lab Findings:</strong> ${patient.aiSummary.content.labFindings}</p>
                </div>
            ` : ''}

            <h4 style="margin-bottom: 1rem;">📋 Clinical Notes (${notes?.length || 0})</h4>
            ${notes && notes.length > 0 ? notes.map(note => `
                <div style="background: var(--grey-50); padding: 1rem; border-radius: var(--radius); margin-bottom: 1rem;">
                    <p><strong>${note.createdBy}</strong> - ${new Date(note.createdAt).toLocaleString()}</p>
                    <p>${note.content}</p>
                </div>
            `).join('') : '<p>No clinical notes</p>'}

            <h4 style="margin-bottom: 1rem; margin-top: 2rem;">📄 Documents (${documents?.length || 0})</h4>
            ${documents && documents.length > 0 ? documents.map(doc => `
                <div style="background: var(--grey-50); padding: 1rem; border-radius: var(--radius); margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${doc.type}</strong> - ${doc.fileName}<br>
                        <small>Uploaded by ${doc.uploadedBy} on ${new Date(doc.uploadedAt).toLocaleDateString()}</small>
                    </div>
                    <button class="btn-secondary">📥 Download</button>
                </div>
            `).join('') : '<p>No documents</p>'}

            ${patient.labData && patient.labData.length > 0 ? `
                <h4 style="margin-bottom: 1rem; margin-top: 2rem;">🔬 Lab Results</h4>
                ${patient.labData.map(lab => `
                    <div style="background: var(--grey-50); padding: 1rem; border-radius: var(--radius); margin-bottom: 1rem;">
                        <strong>${lab.testName}:</strong> ${lab.value} ${lab.unit} (Normal: ${lab.normalRange})
                    </div>
                `).join('')}
            ` : ''}
        </div>
    `;

    modal.classList.add('show');
}

async function loadDocuments() {
    const documentsList = document.getElementById('documentsList');
    
    try {
        if (currentUser.role === 'patient') {
            const data = await API.patient.getById(currentUser.id);
            const documents = data.documents || [];

            documentsList.innerHTML = documents.length > 0 
                ? documents.map(doc => `
                    <div class="document-card">
                        <div class="document-card-header">
                            <h4>${doc.type}</h4>
                            <button class="btn-secondary">📥 Download</button>
                        </div>
                        <p>${doc.fileName}</p>
                        <p style="color: var(--grey-500); font-size: 0.9rem;">
                            Uploaded by ${doc.uploadedBy} on ${new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                    </div>
                `).join('')
                : '<p>No documents available</p>';
        } else {
            documentsList.innerHTML = '<p>Select a patient to view their documents</p>';
        }
    } catch (error) {
        console.error('Error loading documents:', error);
        documentsList.innerHTML = '<p>Error loading documents</p>';
    }
}

async function handleAddPatient(e) {
    e.preventDefault();

    const patientData = {
        name: document.getElementById('patientName').value,
        phone: document.getElementById('patientPhone').value,
        age: parseInt(document.getElementById('patientAge').value),
        gender: document.getElementById('patientGender').value,
        bloodGroup: document.getElementById('patientBloodGroup').value,
        assignedDoctor: document.getElementById('patientDoctor').value,
        address: document.getElementById('patientAddress').value,
        emergencyContact: document.getElementById('patientEmergency').value,
        diagnosis: document.getElementById('patientDiagnosis').value
    };

    try {
        await API.patient.create(patientData);
        document.getElementById('addPatientModal').classList.remove('show');
        document.getElementById('addPatientForm').reset();
        alert('Patient created successfully!');
        await loadPatients();
        await loadOverview();
    } catch (error) {
        console.error('Error creating patient:', error);
        alert('Error creating patient: ' + error.message);
    }
}

async function generateAISummary() {
    if (!currentPatientId) {
        alert('Please select a patient first');
        return;
    }

    const resultsContainer = document.getElementById('aiResultsContainer');
    resultsContainer.innerHTML = '<div style="text-align: center; padding: 2rem;">🤖 Generating AI summary...</div>';
    resultsContainer.classList.add('show');

    try {
        const response = await API.ai.generateSummary(currentPatientId);
        const summary = response.summary;

        resultsContainer.innerHTML = `
            <div class="ai-result-header">
                <span style="font-size: 2rem;">🤖</span>
                <h3>AI Clinical Summary</h3>
            </div>
            <div class="ai-result-content">
                <h4>Overview</h4>
                <p>${summary.overview}</p>
                
                <h4>Clinical Notes Analysis</h4>
                <p>${summary.clinicalNotes}</p>
                
                <h4>Laboratory Findings</h4>
                <p>${summary.labFindings}</p>
                
                <h4>Vital Signs Status</h4>
                <p>${summary.vitalStatus}</p>
                
                ${summary.recommendations ? `
                    <h4>Recommendations</h4>
                    <ul>
                        ${summary.recommendations.map(r => `<li>${r}</li>`).join('')}
                    </ul>
                ` : ''}
            </div>
        `;
    } catch (error) {
        console.error('Error generating summary:', error);
        resultsContainer.innerHTML = '<p style="color: var(--error);">Error generating summary. Please try again.</p>';
    }
}

async function checkMissingDocs() {
    if (!currentPatientId) {
        alert('Please select a patient first');
        return;
    }

    const resultsContainer = document.getElementById('aiResultsContainer');
    resultsContainer.innerHTML = '<div style="text-align: center; padding: 2rem;">🤖 Checking documents...</div>';
    resultsContainer.classList.add('show');

    try {
        const response = await API.ai.checkMissing(currentPatientId);
        const missing = response.missingDocuments;

        resultsContainer.innerHTML = `
            <div class="ai-result-header">
                <span style="font-size: 2rem;">📋</span>
                <h3>Missing Documents Check</h3>
            </div>
            <div class="ai-result-content">
                ${missing.length === 0 ? 
                    '<p style="color: var(--success);">✓ All required documents are present!</p>' :
                    `
                    <p style="color: var(--error);">The following documents are missing:</p>
                    <ul>
                        ${missing.map(doc => `<li>${doc}</li>`).join('')}
                    </ul>
                    `
                }
            </div>
        `;
    } catch (error) {
        console.error('Error checking documents:', error);
        resultsContainer.innerHTML = '<p style="color: var(--error);">Error checking documents. Please try again.</p>';
    }
}

async function generateDischarge() {
    if (!currentPatientId) {
        alert('Please select a patient first');
        return;
    }

    const resultsContainer = document.getElementById('aiResultsContainer');
    resultsContainer.innerHTML = '<div style="text-align: center; padding: 2rem;">🤖 Generating discharge summary...</div>';
    resultsContainer.classList.add('show');

    try {
        const response = await API.ai.generateDischarge(currentPatientId);
        const discharge = response.dischargeSummary;

        resultsContainer.innerHTML = `
            <div class="ai-result-header">
                <span style="font-size: 2rem;">🏥</span>
                <h3>Discharge Summary</h3>
            </div>
            <div class="ai-result-content">
                <h4>Patient Information</h4>
                <p>Name: ${discharge.patientInfo?.patientName || discharge.patientName}</p>
                <p>Patient ID: ${discharge.patientInfo?.patientId || discharge.patientId}</p>
                
                <h4>Admission Details</h4>
                <p>Admission Date: ${new Date(discharge.admissionInfo?.admissionDate || discharge.admissionDate).toLocaleDateString()}</p>
                <p>Discharge Date: ${new Date(discharge.admissionInfo?.dischargeDate || discharge.dischargeDate).toLocaleDateString()}</p>
                <p>Diagnosis: ${discharge.admissionInfo?.diagnosis || discharge.diagnosis}</p>
                
                <h4>Treatment Summary</h4>
                <p>${discharge.treatmentProvided || discharge.treatmentSummary}</p>
                
                <h4>Medications</h4>
                <ul>
                    ${(discharge.medications || []).map(med => `<li>${med}</li>`).join('')}
                </ul>
                
                <h4>Follow-up Instructions</h4>
                <p>${discharge.followUp?.instructions || discharge.followUp}</p>
                
                <h4>Special Instructions</h4>
                <ul>
                    ${(discharge.specialInstructions || []).map(inst => `<li>${inst}</li>`).join('')}
                </ul>
            </div>
        `;
    } catch (error) {
        console.error('Error generating discharge:', error);
        resultsContainer.innerHTML = '<p style="color: var(--error);">Error generating discharge summary. Please try again.</p>';
    }
}

// Make functions globally accessible
window.switchView = switchView;
window.viewPatientDetail = viewPatientDetail;
window.generateAISummary = generateAISummary;
window.checkMissingDocs = checkMissingDocs;
window.generateDischarge = generateDischarge;
