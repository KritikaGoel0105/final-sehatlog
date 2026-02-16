# 🚀 QUICK START GUIDE - SehatLog

## ⚡ Fastest Way to Run

### Option 1: Automatic Startup (Recommended)
```bash
cd sehatlog
chmod +x start.sh
./start.sh
```

This automatically:
- Installs all dependencies
- Seeds sample data
- Starts both backend and AI service
- Opens application on http://localhost:3000

### Option 2: Manual Startup

**Terminal 1 - Backend:**
```bash
cd sehatlog/backend
npm install
npm run seed    # First time only
npm start
```

**Terminal 2 - AI Service:**
```bash
cd sehatlog/ai-service
pip install -r requirements.txt
python ai_engine.py
```

**Terminal 3 - Browser:**
```
Open: http://localhost:3000
```

## 🔑 Demo Accounts

### Admin (Full Access)
- Email: `admin@sehatlog.com`
- Password: `Admin123`
- Can: Create patients, upload docs, use AI tools

### Doctor (Clinical Access)
- Email: `doctor@sehatlog.com`
- Password: `Doctor123`
- Can: Add notes, view patients, use AI tools

### Patient (View Only)
- Patient ID: `P1001`
- Phone: `9999999999`
- Can: View own records only

## ✨ Key Features to Test

1. **Login** as Admin/Doctor/Patient
2. **View Dashboard** - See stats and overview
3. **Create Patient** (Admin only) - Add new patient
4. **View Patient Details** - Click any patient card
5. **AI Summary** - Generate clinical summary
6. **AI Document Check** - Find missing documents
7. **AI Discharge** - Generate discharge summary

## 🎯 Typical Workflow

1. Admin creates patient → Adds documents
2. Doctor adds clinical notes → Records vitals
3. Doctor generates AI summary
4. Admin checks missing documents
5. Doctor generates discharge summary
6. Patient logs in to view all records

## 📱 Pages Overview

- **/** - Landing page with features
- **/login.html** - Authentication page
- **/dashboard.html** - Main application (requires login)

## 🔧 Troubleshooting

**Port already in use?**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

**Dependencies not installing?**
```bash
# Update npm
npm install -g npm@latest

# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Python errors?**
```bash
# Use pip3 instead
pip3 install -r requirements.txt

# Or create virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 📞 Need Help?

- Check README.md for detailed documentation
- All API endpoints documented in README
- Sample data in backend/seed.js
- UI styles in frontend/css/styles.css

## 🎉 You're Ready!

The application is production-ready with:
- ✅ Secure authentication
- ✅ Role-based access control  
- ✅ AI-powered features
- ✅ Professional UI
- ✅ Complete API
- ✅ Sample data

**Happy Healthcare Management! 🏥**
