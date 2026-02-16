const User = require('./models/User');
const Patient = require('./models/Patient');
const { addUser, addPatient, addDocument, addNote } = require('./config/db');
const { v4: uuidv4 } = require('uuid');

async function seedDatabase() {
  console.log('🌱 Seeding database with sample data...');

  try {
    // Create Admin User
    const admin = new User({
      email: 'admin@sehatlog.com',
      password: 'Admin123',
      role: 'admin',
      name: 'Dr. Sarah Admin'
    });
    await admin.hashPassword();
    addUser(admin);
    console.log('✅ Admin user created');

    // Create Doctor User
    const doctor = new User({
      email: 'doctor@sehatlog.com',
      password: 'Doctor123',
      role: 'doctor',
      name: 'Dr. Rajesh Kumar'
    });
    await doctor.hashPassword();
    addUser(doctor);
    console.log('✅ Doctor user created');

    // Create Sample Patient
    const patient1 = new Patient({
      name: 'Amit Sharma',
      phone: '9999999999',
      age: 45,
      gender: 'Male',
      bloodGroup: 'B+',
      address: '123 MG Road, Delhi, India',
      emergencyContact: '9876543210',
      diagnosis: 'Type 2 Diabetes Mellitus',
      assignedDoctor: 'Dr. Rajesh Kumar'
    });
    
    // Manually set Patient ID for demo
    patient1.patientId = 'P1001';
    patient1.createdBy = admin.id;

    // Add lab data
    patient1.addLabData({
      testName: 'Fasting Blood Sugar',
      value: 142,
      unit: 'mg/dL',
      normalRange: '70-100',
      orderedBy: 'Dr. Rajesh Kumar'
    });

    patient1.addLabData({
      testName: 'HbA1c',
      value: 7.8,
      unit: '%',
      normalRange: '<5.7',
      orderedBy: 'Dr. Rajesh Kumar'
    });

    // Add vital signs
    patient1.addVitalSigns({
      bloodPressure: '140/90',
      heartRate: 78,
      temperature: 98.2,
      respiratoryRate: 16,
      oxygenSaturation: 98,
      recordedBy: 'Nurse Mary'
    });

    addPatient(patient1);
    console.log('✅ Sample patient created: P1001');

    // Add clinical notes
    addNote({
      id: uuidv4(),
      patientId: patient1.patientId,
      content: 'Patient admitted with uncontrolled blood sugar levels. Started on insulin therapy. Patient education provided regarding diet and lifestyle modifications.',
      category: 'admission',
      createdBy: 'Dr. Rajesh Kumar',
      createdAt: new Date()
    });

    addNote({
      id: uuidv4(),
      patientId: patient1.patientId,
      content: 'Blood sugar levels showing improvement. Patient tolerating medication well. Continue current treatment plan.',
      category: 'progress',
      createdBy: 'Dr. Rajesh Kumar',
      createdAt: new Date()
    });

    console.log('✅ Clinical notes added');

    // Add documents
    addDocument({
      id: uuidv4(),
      patientId: patient1.patientId,
      type: 'Insurance',
      fileName: 'health-insurance-card.pdf',
      fileUrl: '#',
      uploadedBy: 'Dr. Sarah Admin',
      uploadedAt: new Date()
    });

    addDocument({
      id: uuidv4(),
      patientId: patient1.patientId,
      type: 'Consent Form',
      fileName: 'treatment-consent.pdf',
      fileUrl: '#',
      uploadedBy: 'Dr. Sarah Admin',
      uploadedAt: new Date()
    });

    addDocument({
      id: uuidv4(),
      patientId: patient1.patientId,
      type: 'Lab Reports',
      fileName: 'blood-test-results.pdf',
      fileUrl: '#',
      uploadedBy: 'Dr. Sarah Admin',
      uploadedAt: new Date()
    });

    console.log('✅ Documents added');

    // Create another patient
    const patient2 = new Patient({
      name: 'Priya Verma',
      phone: '9888888888',
      age: 32,
      gender: 'Female',
      bloodGroup: 'A+',
      address: '456 Park Street, Mumbai, India',
      emergencyContact: '9765432109',
      diagnosis: 'Pneumonia',
      assignedDoctor: 'Dr. Rajesh Kumar'
    });
    
    patient2.patientId = 'P1002';
    patient2.createdBy = admin.id;

    patient2.addVitalSigns({
      bloodPressure: '120/80',
      heartRate: 85,
      temperature: 101.3,
      respiratoryRate: 22,
      oxygenSaturation: 94,
      recordedBy: 'Nurse John'
    });

    addPatient(patient2);
    console.log('✅ Sample patient created: P1002');

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('📋 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👨‍💼 Admin:');
    console.log('   Email: admin@sehatlog.com');
    console.log('   Password: Admin123');
    console.log('');
    console.log('👨‍⚕️  Doctor:');
    console.log('   Email: doctor@sehatlog.com');
    console.log('   Password: Doctor123');
    console.log('');
    console.log('🤒 Patient:');
    console.log('   Patient ID: P1001');
    console.log('   Phone: 9999999999');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
