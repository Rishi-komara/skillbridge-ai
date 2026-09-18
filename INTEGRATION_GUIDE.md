# SkillBridge AI - Frontend & Backend Integration Guide

## ✅ Setup Complete

The frontend has been fully integrated with the backend using Firebase Authentication and Axios for API communication.

## Frontend Structure

```
src/
├── config/
│   ├── firebase.js          # Firebase initialization
│   └── api.js               # Axios client with interceptors
├── context/
│   └── AuthContext.jsx      # Global auth state management
├── hooks/
│   └── useAuth.js           # Auth hook for components
├── services/                # API service functions
│   ├── authService.js
│   ├── profileService.js
│   ├── resumeService.js
│   ├── skillGapService.js
│   ├── roadmapService.js
│   ├── interviewService.js
│   ├── aiService.js
│   ├── dashboardService.js
│   └── analyticsService.js
├── pages/
│   ├── Login.jsx            # Updated with Firebase auth
│   └── Signup.jsx           # Updated with Firebase auth
└── components/
    └── ProtectedRoute.jsx   # Updated with Firebase auth
```

## Key Features

### 1. Firebase Authentication
- Client-side authentication using Firebase Auth
- Automatic ID token generation and refresh
- Protected routes that check auth state

### 2. API Integration
- Axios client with automatic token injection
- Request/response interceptors
- Automatic logout on 401 errors
- Environment-based API URL configuration

### 3. Service Layer
- Separated API calls into service modules
- Each module handles one feature (auth, resume, roadmap, etc.)
- Consistent error handling

## How to Use

### Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Frontend runs on http://localhost:5173 (default Vite port)

### Authentication Flow

1. **Signup**: User creates account with email and password
   - Firebase creates user account
   - ID token is automatically generated
   
2. **Login**: User logs in
   - Firebase verifies credentials
   - ID token is automatically managed
   
3. **Protected Routes**: Components check if user is authenticated
   - Uses `useAuth()` hook to check `currentUser`
   - Redirects to /login if not authenticated

### Making API Calls

Import the appropriate service and use it:

```jsx
import { getDashboardStats } from '../services/dashboardService';

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboardStats()
      .then((response) => setStats(response.data.stats))
      .catch((error) => console.error('Error:', error));
  }, []);

  return <div>{/* render stats */}</div>;
};
```

### Using Auth Hook

```jsx
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div>
      <p>Welcome, {currentUser?.email}</p>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};
```

## Environment Variables

Frontend (.env.local):
```
VITE_API_BASE_URL=http://localhost:5000/api
```

Backend (.env):
```
PORT=5000
GEMINI_API_KEY=<your-gemini-key>
FIREBASE_PROJECT_ID=skillbridge-ai-b3654
```

## Available APIs

All APIs require authentication (Bearer token in Authorization header).

### Authentication
- POST /api/auth/signup - Create new user
- POST /api/auth/login - Login user
- POST /api/auth/logout - Logout
- GET /api/auth/profile - Get auth profile

### Profile
- GET /api/profile - Get user profile
- PUT /api/profile/update - Update profile

### Resume
- POST /api/resume/upload - Upload resume
- POST /api/resume/analyze - Analyze resume
- GET /api/resume/history - Get resume history

### Skill Gap
- POST /api/skill-gap/analyze - Analyze skill gap
- GET /api/skill-gap/report - Get latest report

### Roadmap
- POST /api/roadmap/generate - Generate roadmap
- GET /api/roadmap - Get user's roadmap
- PUT /api/roadmap/task/:id - Update task
- DELETE /api/roadmap/task/:id - Delete task

### Interview
- GET /api/interview/questions - Get questions
- POST /api/interview/submit - Submit answer
- POST /api/interview/voice-answer - Voice answer
- GET /api/interview/history - Get history

### AI Chat
- POST /api/ai/chat - Chat with AI

### Dashboard
- GET /api/dashboard/stats - Get dashboard stats

### Analytics
- GET /api/analytics/progress - Get progress analytics

## Token Management

The Axios client automatically:
1. Intercepts all requests
2. Gets the current user's ID token from Firebase
3. Adds it to the Authorization header
4. Handles 401 responses by logging out

## Firestore Setup

Make sure to set up Firestore collections in your Firebase console:
- users
- profiles
- resumes
- skillGaps
- roadmaps
- interviews
- chatHistory
- analytics

## Next Steps

1. ✅ Backend API is running
2. ✅ Frontend services are configured
3. ⏳ Test the auth flow (signup/login)
4. ⏳ Integrate each page with its corresponding API
5. ⏳ Add error handling and loading states
6. ⏳ Deploy to production

## Troubleshooting

### CORS Errors
- Make sure backend is running with CORS enabled
- Check `VITE_API_BASE_URL` matches backend URL

### 401 Unauthorized
- User may not be logged in
- Check Auth context is wrapping the app
- Verify Firebase credentials are correct

### Firebase Errors
- Check Firebase credentials in config/firebase.js
- Make sure Firestore is enabled in Firebase console
- Verify security rules allow reads/writes

## Notes

- All API calls use the authenticated user's UID from Firebase
- Environment variables are loaded from .env.local
- The API client uses interceptors for automatic token injection
- Protected routes prevent unauthorized access
