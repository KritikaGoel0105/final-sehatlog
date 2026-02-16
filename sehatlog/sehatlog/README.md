# 🏥 SehatLog - AI-Powered Patient Documentation System

A comprehensive, production-ready healthcare web application with role-based authentication, AI-powered clinical summaries, and secure patient management.

## ✨ Features

### 🔐 **Secure Authentication & Authorization**
- **Admin**: Create patients, upload documents, manage system
- **Doctor**: Add clinical notes, view AI summaries, monitor patients
- **Patient**: View-only access to personal health records

### 🤖 **AI-Powered Intelligence**
- Automated clinical summary generation
- Missing document detection
- Comprehensive discharge summary creation
- Powered by separate Python AI service

### 📊 **Patient Management**
- Complete digital health records
- Lab results tracking
- Vital signs monitoring
- Document management (insurance, consents, reports)
- Clinical notes and treatment history

### 🎨 **Modern UI/UX**
- Soft, minimal professional healthcare design
- Deep teal primary color (#0E7C7B)
- AI sections with purple accent (#5E60CE)
- Responsive and mobile-friendly
- Smooth animations and transitions

## 🏗️ **Technology Stack**

### Frontend
- HTML5, CSS3, Vanilla JavaScript
- Fetch API for backend communication
- Responsive design with CSS Grid/Flexbox

### Backend
- Node.js + Express.js
- JWT authentication with bcrypt
- Role-based access control middleware
- In-memory database (easily replaceable with MongoDB/PostgreSQL)
- RESTful API architecture

### AI Service
- Python Flask API
- Separate microservice architecture
- Clinical summary generation
- Document analysis
- Discharge planning algorithms

## 📁 **Project Structure**

```
sehatlog/
│
├── frontend/
│   ├── index.html              # Landing page
│   ├── login.html              # Authentication
│   ├── dashboard.html          # Main dashboard
│   ├── css/
│   │   └── styles.css          # Complete styling
│   └── js/
│       ├── api.js              # API utilities
│       ├── auth.js             # Authentication logic
│       └── dashboard.js        # Dashboard functionality
│
├── backend/
│   ├── server.js               # Express server
│   ├── package.json            # Dependencies
│   ├── seed.js                 # Sample data seeder
│   ├── config/
│   │   └── db.js               # Database config
│   ├── models/
│   │   ├── User.js             # User model
│   │   └── Patient.js          # Patient model
│   ├── routes/
│   │   ├── authRoutes.js       # Authentication endpoints
│   │   ├── patientRoutes.js    # Patient management
│   │   └── aiRoutes.js         # AI service integration
│   └── middleware/
│       ├── authMiddleware.js   # JWT validation
│       └── roleMiddleware.js   # Authorization
│
└── ai-service/
    ├── ai_engine.py            # AI Flask service
    └── requirements.txt        # Python dependencies
```

## 🚀 **Installation & Setup**

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- npm or yarn

### Step 1: Clone & Navigate
```bash
cd sehatlog
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Install Python AI Service
```bash
cd ../ai-service
pip install -r requirements.txt
```

### Step 4: Seed Sample Data
```bash
cd ../backend
npm run seed
```

This creates:
- **Admin**: admin@sehatlog.com / Admin123
- **Doctor**: doctor@sehatlog.com / Doctor123
- **Patient**: P1001 / 9999999999

## ▶️ **Running the Application**

### Terminal 1: Start Backend Server
```bash
cd backend
npm start
```
Server runs on: `http://localhost:3000`

### Terminal 2: Start AI Service
```bash
cd ai-service
python ai_engine.py
```
AI Service runs on: `http://localhost:5000`

### Terminal 3 (Optional): Development Mode
```bash
cd backend
npm run dev  # Auto-restarts on file changes
```

### Access Application
Open browser to: `http://localhost:3000`

## 🔑 **Demo Credentials**

### Administrator Access
- **Email**: admin@sehatlog.com
- **Password**: Admin123
- **Permissions**: Create patients, upload documents, full system access

### Doctor Access
- **Email**: doctor@sehatlog.com
- **Password**: Doctor123
- **Permissions**: Clinical notes, view patients, AI tools

### Patient Access
- **Patient ID**: P1001
- **Phone**: 9999999999
- **Permissions**: View-only access to personal records

## 📖 **API Documentation**

### Authentication Endpoints

#### POST `/api/auth/signup`
Create new admin or doctor account
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Dr. John Doe",
  "role": "admin" | "doctor"
}
```

#### POST `/api/auth/login`
Login for admin/doctor
```json
{
  "email": "admin@sehatlog.com",
  "password": "Admin123"
}
```

#### POST `/api/auth/patient-login`
Patient login with ID and phone
```json
{
  "patientId": "P1001",
  "phone": "9999999999"
}
```

### Patient Endpoints

#### GET `/api/patients`
Get all patients (Admin only)

#### POST `/api/patients`
Create new patient (Admin only)
```json
{
  "name": "John Doe",
  "phone": "1234567890",
  "age": 45,
  "gender": "Male",
  "bloodGroup": "B+",
  "diagnosis": "Type 2 Diabetes",
  "assignedDoctor": "Dr. Smith"
}
```

#### GET `/api/patients/:patientId`
Get specific patient details

#### POST `/api/patients/:patientId/documents`
Upload document (Admin only)

#### POST `/api/patients/:patientId/notes`
Add clinical note (Admin/Doctor)

#### POST `/api/patients/:patientId/lab-data`
Add lab results (Admin/Doctor)

### AI Endpoints

#### POST `/api/ai/generate-summary/:patientId`
Generate AI clinical summary

#### GET `/api/ai/check-missing/:patientId`
Check for missing documents

#### POST `/api/ai/generate-discharge/:patientId`
Generate discharge summary

## 🔒 **Security Features**

1. **Password Hashing**: bcrypt with salt rounds
2. **JWT Tokens**: 24-hour expiration
3. **Role-Based Access Control**: Middleware enforcement
4. **Protected Routes**: Authentication required
5. **Input Validation**: Server-side validation
6. **CORS Protection**: Configurable origins

## 🎨 **UI Color Scheme**

- **Primary Teal**: #0E7C7B (Healthcare professional)
- **Secondary Mint**: #A4D4AE (Soft, calming)
- **AI Purple**: #5E60CE (Technology, innovation)
- **Neutral Greys**: #F9FAFB to #111827 (Hierarchy)
- **Success Green**: #10B981
- **Error Red**: #EF4444

## 📊 **Role Permissions Matrix**

| Feature | Admin | Doctor | Patient |
|---------|-------|--------|---------|
| Create Patients | ✅ | ❌ | ❌ |
| View All Patients | ✅ | ✅ | ❌ |
| View Own Records | ✅ | ✅ | ✅ |
| Add Clinical Notes | ✅ | ✅ | ❌ |
| Upload Documents | ✅ | ❌ | ❌ |
| Generate AI Summary | ✅ | ✅ | ❌ |
| Generate Discharge | ✅ | ✅ | ❌ |

## 🔄 **Workflow Example**

1. **Admin** creates patient account
2. **Doctor** adds clinical notes and lab data
3. **Doctor/Admin** generates AI summary
4. **Doctor/Admin** checks for missing documents
5. **Doctor/Admin** generates discharge summary
6. **Patient** logs in to view all records (read-only)

## 🐛 **Troubleshooting**

### Backend won't start
- Check Node.js version: `node --version` (need v16+)
- Ensure port 3000 is available
- Run `npm install` again

### AI Service errors
- Verify Python version: `python --version` (need 3.8+)
- Check port 5000 availability
- Install dependencies: `pip install -r requirements.txt`

### Frontend can't connect
- Ensure backend is running on port 3000
- Check browser console for errors
- Verify CORS settings in backend

### Authentication issues
- Clear browser localStorage
- Check JWT secret in authMiddleware.js
- Verify token in Network tab

## 🚀 **Production Deployment**

### Environment Variables
Create `.env` file in backend:
```
PORT=3000
JWT_SECRET=your-secure-secret-key-here
AI_SERVICE_URL=http://your-ai-service-url:5000
NODE_ENV=production
```

### Database Migration
Replace in-memory DB with:
- **MongoDB**: Install mongoose, update db.js
- **PostgreSQL**: Install pg, create schema
- **MySQL**: Install mysql2, configure connection

### Deployment Platforms
- **Backend**: Heroku, AWS EC2, DigitalOcean, Azure
- **Frontend**: Netlify, Vercel, GitHub Pages
- **AI Service**: AWS Lambda, Google Cloud Functions, Heroku

### Security Checklist
- [ ] Change JWT_SECRET
- [ ] Enable HTTPS
- [ ] Set secure CORS origins
- [ ] Add rate limiting
- [ ] Enable helmet.js
- [ ] Set up logging (Morgan, Winston)
- [ ] Configure database backups
- [ ] Enable API monitoring

## 📝 **Future Enhancements**

- [ ] Real-time notifications (WebSockets)
- [ ] File upload to cloud storage (AWS S3, Cloudinary)
- [ ] Advanced AI models (diagnosis prediction, treatment recommendations)
- [ ] Multi-language support (i18n)
- [ ] Mobile app (React Native)
- [ ] Telemedicine integration
- [ ] Prescription management
- [ ] Appointment scheduling
- [ ] Analytics dashboard
- [ ] HIPAA compliance tools

## 🤝 **Contributing**

This is a production-ready healthcare platform designed for:
- Hospital management systems
- Clinic administration
- Healthcare startups
- Medical education
- Hackathon projects

## 📄 **License**

MIT License - Feel free to use for educational and commercial purposes

## 👨‍💻 **Support**

For issues, questions, or enhancements:
- Open an issue on GitHub
- Contact: support@sehatlog.com
- Documentation: docs.sehatlog.com

---

## 🎉 **Quick Start Summary**

```bash
# Install dependencies
cd backend && npm install
cd ../ai-service && pip install -r requirements.txt

# Seed sample data
cd ../backend && npm run seed

# Start services (3 terminals)
Terminal 1: cd backend && npm start
Terminal 2: cd ai-service && python ai_engine.py
Terminal 3: Open browser to http://localhost:3000

# Login with:
Admin: admin@sehatlog.com / Admin123
Doctor: doctor@sehatlog.com / Doctor123
Patient: P1001 / 9999999999
```

**Built with ❤️ for better healthcare documentation**
