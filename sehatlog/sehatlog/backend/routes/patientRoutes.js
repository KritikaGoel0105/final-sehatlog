const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const { v4: uuidv4 } = require('uuid');
const {
  getAllPatients,
  findPatientById,
  addPatient,
  addDocument,
  addNote,
  getDocumentsByPatientId,
  getNotesByPatientId,
  updatePatient
} = require('../config/db');
const { authMiddleware } = require('../middleware/authMiddleware');
const { requireAdmin, requireAdminOrDoctor } = require('../middleware/roleMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Get all patients (Admin only)
router.get('/', requireAdmin, (req, res) => {
  try {
    const patients = getAllPatients();
    res.json({ patients });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

// Create patient (Admin only)
router.post('/', requireAdmin, (req, res) => {
  try {
    const {
      name,
      phone,
      age,
      gender,
      bloodGroup,
      address,
      emergencyContact,
      diagnosis,
      assignedDoctor
    } = req.body;

    // Validation
    if (!name || !phone || !age || !gender) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    // Create patient
    const patient = new Patient({
      name,
      phone,
      age,
      gender,
      bloodGroup,
      address,
      emergencyContact,
      diagnosis,
      assignedDoctor
    });

    patient.createdBy = req.user.id;
    addPatient(patient);

    res.status(201).json({
      message: 'Patient created successfully',
      patient
    });
  } catch (error) {
    console.error('Create patient error:', error);
    res.status(500).json({ error: 'Failed to create patient' });
  }
});

// Get specific patient details
router.get('/:patientId', (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = findPatientById(patientId);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Authorization check
    if (req.user.role === 'patient') {
      // Patients can only view their own data
      if (patient.id !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    // Get related data
    const documents = getDocumentsByPatientId(patientId);
    const notes = getNotesByPatientId(patientId);

    res.json({
      patient,
      documents,
      notes
    });
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
});

// Upload document (Admin only)
router.post('/:patientId/documents', requireAdmin, (req, res) => {
  try {
    const { patientId } = req.params;
    const { type, fileName, fileUrl } = req.body;

    const patient = findPatientById(patientId);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const document = {
      id: uuidv4(),
      patientId,
      type,
      fileName,
      fileUrl: fileUrl || '#', // In production, handle actual file upload
      uploadedBy: req.user.name,
      uploadedAt: new Date()
    };

    addDocument(document);

    res.status(201).json({
      message: 'Document uploaded successfully',
      document
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

// Add clinical note (Doctor or Admin)
router.post('/:patientId/notes', requireAdminOrDoctor, (req, res) => {
  try {
    const { patientId } = req.params;
    const { content, category } = req.body;

    const patient = findPatientById(patientId);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const note = {
      id: uuidv4(),
      patientId,
      content,
      category: category || 'general',
      createdBy: req.user.name,
      createdAt: new Date()
    };

    addNote(note);

    res.status(201).json({
      message: 'Note added successfully',
      note
    });
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({ error: 'Failed to add note' });
  }
});

// Add lab data (Admin or Doctor)
router.post('/:patientId/lab-data', requireAdminOrDoctor, (req, res) => {
  try {
    const { patientId } = req.params;
    const { testName, value, unit, normalRange } = req.body;

    const patient = findPatientById(patientId);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    patient.addLabData({
      testName,
      value,
      unit,
      normalRange,
      orderedBy: req.user.name
    });

    updatePatient(patientId, patient);

    res.status(201).json({
      message: 'Lab data added successfully',
      labData: patient.labData
    });
  } catch (error) {
    console.error('Add lab data error:', error);
    res.status(500).json({ error: 'Failed to add lab data' });
  }
});

// Add vital signs (Admin or Doctor)
router.post('/:patientId/vitals', requireAdminOrDoctor, (req, res) => {
  try {
    const { patientId } = req.params;
    const { bloodPressure, heartRate, temperature, respiratoryRate, oxygenSaturation } = req.body;

    const patient = findPatientById(patientId);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    patient.addVitalSigns({
      bloodPressure,
      heartRate,
      temperature,
      respiratoryRate,
      oxygenSaturation,
      recordedBy: req.user.name
    });

    updatePatient(patientId, patient);

    res.status(201).json({
      message: 'Vital signs added successfully',
      vitalSigns: patient.vitalSigns
    });
  } catch (error) {
    console.error('Add vitals error:', error);
    res.status(500).json({ error: 'Failed to add vital signs' });
  }
});

module.exports = router;
