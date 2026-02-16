// In-memory database for demo purposes
// In production, replace with MongoDB/PostgreSQL

const db = {
  users: [],
  patients: [],
  documents: [],
  notes: []
};

// Helper functions
const findUserByEmail = (email) => {
  return db.users.find(user => user.email === email);
};

const findUserById = (id) => {
  return db.users.find(user => user.id === id);
};

const findPatientById = (patientId) => {
  return db.patients.find(patient => patient.patientId === patientId);
};

const findPatientByPhone = (phone) => {
  return db.patients.find(patient => patient.phone === phone);
};

const addUser = (user) => {
  db.users.push(user);
  return user;
};

const addPatient = (patient) => {
  db.patients.push(patient);
  return patient;
};

const addDocument = (document) => {
  db.documents.push(document);
  return document;
};

const addNote = (note) => {
  db.notes.push(note);
  return note;
};

const getDocumentsByPatientId = (patientId) => {
  return db.documents.filter(doc => doc.patientId === patientId);
};

const getNotesByPatientId = (patientId) => {
  return db.notes.filter(note => note.patientId === patientId);
};

const getAllPatients = () => {
  return db.patients;
};

const updatePatient = (patientId, updates) => {
  const index = db.patients.findIndex(p => p.patientId === patientId);
  if (index !== -1) {
    db.patients[index] = { ...db.patients[index], ...updates };
    return db.patients[index];
  }
  return null;
};

module.exports = {
  db,
  findUserByEmail,
  findUserById,
  findPatientById,
  findPatientByPhone,
  addUser,
  addPatient,
  addDocument,
  addNote,
  getDocumentsByPatientId,
  getNotesByPatientId,
  getAllPatients,
  updatePatient
};
