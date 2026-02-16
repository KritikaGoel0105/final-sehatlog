const { v4: uuidv4 } = require('uuid');

class Patient {
  constructor({ 
    name, 
    phone, 
    age, 
    gender, 
    bloodGroup,
    address,
    emergencyContact,
    diagnosis,
    admissionDate,
    assignedDoctor 
  }) {
    this.id = uuidv4();
    this.patientId = this.generatePatientId();
    this.name = name;
    this.phone = phone;
    this.age = age;
    this.gender = gender;
    this.bloodGroup = bloodGroup;
    this.address = address;
    this.emergencyContact = emergencyContact;
    this.diagnosis = diagnosis;
    this.admissionDate = admissionDate || new Date();
    this.assignedDoctor = assignedDoctor;
    this.status = 'admitted'; // admitted, discharged
    this.labData = [];
    this.vitalSigns = [];
    this.aiSummary = null;
    this.dischargeSummary = null;
    this.createdAt = new Date();
    this.createdBy = null; // Will be set to admin ID
  }

  generatePatientId() {
    // Generate format: P1001, P1002, etc.
    const timestamp = Date.now().toString().slice(-4);
    return `P${timestamp}`;
  }

  addLabData(data) {
    this.labData.push({
      id: uuidv4(),
      ...data,
      timestamp: new Date()
    });
  }

  addVitalSigns(vitals) {
    this.vitalSigns.push({
      id: uuidv4(),
      ...vitals,
      timestamp: new Date()
    });
  }

  updateAISummary(summary) {
    this.aiSummary = {
      content: summary,
      generatedAt: new Date()
    };
  }

  updateDischargeSummary(summary) {
    this.dischargeSummary = {
      content: summary,
      generatedAt: new Date()
    };
    this.status = 'discharged';
  }
}

module.exports = Patient;
