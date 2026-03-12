# ChariTree - Charity Management Platform

A full-stack web application for connecting donors with charitable organizations.

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (free tier works)

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file by copying `.env.example`:
   ```bash
   copy .env.example .env
   ```

4. Update the `.env` file with your own values:
   - **MONGO_URI**: Your MongoDB connection string from MongoDB Atlas
   - **JWT_SECRET**: Any random secret string for JWT token generation
   - **PORT**: 5000 (default)

5. Seed the database with sample organizations:
   ```bash
   node seed.js
   ```

6. Start the backend server:
   ```bash
   node server.js
   ```
   The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The frontend will run on `http://localhost:3000`

## 📝 Login Credentials

### Organizations (pre-seeded):
- Email: `helpinghands@gmail.com` | Password: `HelpingHands123`
- Email: `careforanimals@gmail.com` | Password: `CareforAnimals123`
- Email: `seniorsupport@gmail.com` | Password: `SeniorSupport123`

### Donors:
Create a new account through the donor signup page.

## 🛠️ Tech Stack
- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT

## ⚠️ Important Notes
- Each person needs their own MongoDB Atlas database
- Never commit the `.env` file to version control
- The `.gitignore` file protects sensitive files
