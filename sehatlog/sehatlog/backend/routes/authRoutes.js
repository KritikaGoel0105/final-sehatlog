const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { 
  findUserByEmail, 
  findPatientByPhone, 
  addUser 
} = require('../config/db');
const { generateToken } = require('../middleware/authMiddleware');

// Admin/Doctor Signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, role, name } = req.body;

    // Validation
    if (!email || !password || !role || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Patients cannot self-signup
    if (role === 'patient') {
      return res.status(403).json({ 
        error: 'Patients cannot self-signup',
        message: 'Patients must be created by administrators'
      });
    }

    // Check valid roles
    if (!['admin', 'doctor'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Check if user exists
    if (findUserByEmail(email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user
    const user = new User({ email, password, role, name });
    await user.hashPassword();
    
    addUser(user);

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Admin/Doctor Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = findUserByEmail(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Patient Login (via Patient ID + Phone)
router.post('/patient-login', async (req, res) => {
  try {
    const { patientId, phone } = req.body;

    // Validation
    if (!patientId || !phone) {
      return res.status(400).json({ error: 'Patient ID and phone are required' });
    }

    // Find patient
    const patient = findPatientByPhone(phone);
    
    if (!patient || patient.patientId !== patientId) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // For demo purposes, we'll create a temporary token
    // In production, implement proper OTP verification
    const token = generateToken(patient.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: patient.id,
        patientId: patient.patientId,
        name: patient.name,
        role: 'patient'
      }
    });
  } catch (error) {
    console.error('Patient login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
