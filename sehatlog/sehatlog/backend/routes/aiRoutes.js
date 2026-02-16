const express = require('express');
const router = express.Router();
const axios = require('axios');
const {
  findPatientById,
  getNotesByPatientId,
  getDocumentsByPatientId,
  updatePatient
} = require('../config/db');
const { authMiddleware } = require('../middleware/authMiddleware');
const { requireAdminOrDoctor } = require('../middleware/roleMiddleware');

// AI Service URL (Python Flask service)
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5000';

// All routes require authentication
router.use(authMiddleware);

// Generate AI clinical summary
router.post('/generate-summary/:patientId', requireAdminOrDoctor, async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = findPatientById(patientId);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Gather patient data
    const notes = getNotesByPatientId(patientId);
    const documents = getDocumentsByPatientId(patientId);

    // Prepare data for AI service
    const aiRequestData = {
      patient: {
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        diagnosis: patient.diagnosis
      },
      notes: notes.map(n => n.content),
      labData: patient.labData,
      vitalSigns: patient.vitalSigns
    };

    try {
      // Call Python AI service
      const aiResponse = await axios.post(
        `${AI_SERVICE_URL}/generate-summary`,
        aiRequestData,
        { timeout: 10000 }
      );

      const summary = aiResponse.data.summary;

      // Update patient with AI summary
      patient.updateAISummary(summary);
      updatePatient(patientId, patient);

      res.json({
        message: 'AI summary generated successfully',
        summary
      });
    } catch (aiError) {
      console.error('AI Service error:', aiError.message);
      
      // Fallback: Generate mock summary if AI service is unavailable
      const mockSummary = generateMockSummary(patient, notes);
      patient.updateAISummary(mockSummary);
      updatePatient(patientId, patient);

      res.json({
        message: 'Summary generated (AI service offline - using fallback)',
        summary: mockSummary,
        warning: 'AI service unavailable'
      });
    }
  } catch (error) {
    console.error('Generate summary error:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

// Check missing documents
router.get('/check-missing/:patientId', requireAdminOrDoctor, async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = findPatientById(patientId);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const documents = getDocumentsByPatientId(patientId);

    const aiRequestData = {
      patientId,
      diagnosis: patient.diagnosis,
      existingDocuments: documents.map(d => d.type)
    };

    try {
      // Call Python AI service
      const aiResponse = await axios.post(
        `${AI_SERVICE_URL}/check-missing-docs`,
        aiRequestData,
        { timeout: 5000 }
      );

      res.json({
        missingDocuments: aiResponse.data.missing_documents
      });
    } catch (aiError) {
      console.error('AI Service error:', aiError.message);
      
      // Fallback
      const mockMissing = checkMissingDocsMock(documents);
      res.json({
        missingDocuments: mockMissing,
        warning: 'AI service unavailable'
      });
    }
  } catch (error) {
    console.error('Check missing docs error:', error);
    res.status(500).json({ error: 'Failed to check documents' });
  }
});

// Generate discharge summary
router.post('/generate-discharge/:patientId', requireAdminOrDoctor, async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = findPatientById(patientId);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const notes = getNotesByPatientId(patientId);
    const documents = getDocumentsByPatientId(patientId);

    const aiRequestData = {
      patient: {
        patientId: patient.patientId,
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        diagnosis: patient.diagnosis,
        admissionDate: patient.admissionDate
      },
      notes: notes,
      labData: patient.labData,
      vitalSigns: patient.vitalSigns,
      documents: documents
    };

    try {
      // Call Python AI service
      const aiResponse = await axios.post(
        `${AI_SERVICE_URL}/generate-discharge`,
        aiRequestData,
        { timeout: 15000 }
      );

      const dischargeSummary = aiResponse.data.discharge_summary;

      // Update patient
      patient.updateDischargeSummary(dischargeSummary);
      updatePatient(patientId, patient);

      res.json({
        message: 'Discharge summary generated successfully',
        dischargeSummary
      });
    } catch (aiError) {
      console.error('AI Service error:', aiError.message);
      
      // Fallback
      const mockDischarge = generateMockDischarge(patient, notes);
      patient.updateDischargeSummary(mockDischarge);
      updatePatient(patientId, patient);

      res.json({
        message: 'Discharge summary generated (AI service offline)',
        dischargeSummary: mockDischarge,
        warning: 'AI service unavailable'
      });
    }
  } catch (error) {
    console.error('Generate discharge error:', error);
    res.status(500).json({ error: 'Failed to generate discharge summary' });
  }
});

// Fallback functions (used when AI service is unavailable)
function generateMockSummary(patient, notes) {
  return {
    overview: `Patient ${patient.name}, ${patient.age} years old, ${patient.gender}, admitted with ${patient.diagnosis}.`,
    clinicalNotes: notes.length > 0 ? notes.map(n => n.content).join(' ') : 'No clinical notes available.',
    labFindings: patient.labData.length > 0 
      ? patient.labData.map(lab => `${lab.testName}: ${lab.value} ${lab.unit}`).join(', ')
      : 'No lab data recorded.',
    vitalStatus: patient.vitalSigns.length > 0
      ? 'Vital signs monitored regularly'
      : 'No vital signs recorded',
    aiGenerated: true
  };
}

function checkMissingDocsMock(documents) {
  const required = ['Insurance', 'Consent Form', 'Lab Reports', 'Referral Letter'];
  const existing = documents.map(d => d.type);
  return required.filter(doc => !existing.includes(doc));
}

function generateMockDischarge(patient, notes) {
  const dischargeDate = new Date();
  return {
    patientId: patient.patientId,
    patientName: patient.name,
    admissionDate: patient.admissionDate,
    dischargeDate: dischargeDate,
    diagnosis: patient.diagnosis,
    treatmentSummary: notes.length > 0 
      ? notes.map(n => n.content).join(' ')
      : 'Standard treatment protocol followed.',
    medications: 'As prescribed by attending physician',
    followUp: 'Follow-up appointment recommended in 2 weeks',
    specialInstructions: 'Rest and medication compliance advised',
    aiGenerated: true
  };
}

module.exports = router;
