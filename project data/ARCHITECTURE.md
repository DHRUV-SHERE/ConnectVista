# 🏗️ Admin Panel Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     ConnectVista Platform                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  User Frontend   │    │  Admin Panel     │    │  Backend Server  │
│  (Port 5173)     │    │  (Port 5174)     │    │  (Port 5000)     │
└──────────────────┘    └──────────────────┘    └──────────────────┘
         │                       │                        │
         │                       │                        │
         └───────────────────────┴────────────────────────┘
                                 │
                          ┌──────▼──────┐
                          │   MongoDB   │
                          │  Database   │
                          └─────────────┘
```

## Admin Panel Authentication Flow

```
┌─────────────┐
│ Admin Login │
│    Page     │
└──────┬──────┘
       │
       │ 1. Enter credentials
       │    (admin@example.com / 123)
       ▼
┌─────────────────────────────────────────┐
│  POST /api/auth/login                   │
│  Body: {                                │
│    email: "admin@example.com",          │
│    password: "123",                     │
│    role: "admin"                        │
│  }                                      │
└──────┬──────────────────────────────────┘
       │
       │ 2. Backend validates
       ▼
┌─────────────────────────────────────────┐
│  authController.login()                 │
│  - Find user by email                   │
│  - Compare password (bcrypt)            │
│  - Verify role === 'admin'              │
│  - Generate JWT token                   │
└──────┬──────────────────────────────────┘
       │
       │ 3. Return token
       ▼
┌─────────────────────────────────────────┐
│  Response: {                            │
│    success: true,                       │
│    data: {                              │
│      accessToken: "eyJhbGc...",         │
│      user: { id, email, role },         │
│      role: "admin"                      │
│    }                                    │
│  }                                      │
└──────┬──────────────────────────────────┘
       │
       │ 4. Store token
       ▼
┌─────────────────────────────────────────┐
│  AuthContext.login(token)               │
│  - localStorage.setItem('adminToken')   │
│  - setIsAuthenticated(true)             │
│  - navigate('/admin')                   │
└──────┬──────────────────────────────────┘
       │
       │ 5. Redirect to dashboard
       ▼
┌─────────────────────────────────────────┐
│  Admin Dashboard                        │
│  - Protected by ProtectedRoute          │
│  - Loads with authentication            │
└─────────────────────────────────────────┘
```

## API Request Flow (After Login)

```
┌─────────────────┐
│ Admin Dashboard │
│   Component     │
└────────┬────────┘
         │
         │ 1. Component mounts
         │    useEffect(() => fetchStats())
         ▼
┌──────────────────────────────────────────┐
│  getDashboardStats()                     │
│  - From services/api.js                  │
└────────┬─────────────────────────────────┘
         │
         │ 2. Axios interceptor adds token
         ▼
┌──────────────────────────────────────────┐
│  API.interceptors.request.use()          │
│  - Get token from localStorage           │
│  - Add to headers:                       │
│    Authorization: "Bearer <token>"       │
└────────┬─────────────────────────────────┘
         │
         │ 3. Send request
         ▼
┌──────────────────────────────────────────┐
│  GET /api/admin/dashboard/stats          │
│  Headers: {                              │
│    Authorization: "Bearer eyJhbGc..."    │
│  }                                       │
└────────┬─────────────────────────────────┘
         │
         │ 4. Backend auth middleware
         ▼
┌──────────────────────────────────────────┐
│  auth(['admin']) middleware              │
│  - Extract token from header             │
│  - Verify JWT signature                  │
│  - Check user exists                     │
│  - Verify role === 'admin'               │
│  - Attach user to req.user               │
└────────┬─────────────────────────────────┘
         │
         │ 5. Execute controller
         ▼
┌──────────────────────────────────────────┐
│  adminController.getDashboardStats()     │
│  - Query database                        │
│  - Count users, providers, bookings      │
│  - Calculate revenue                     │
│  - Return statistics                     │
└────────┬─────────────────────────────────┘
         │
         │ 6. Return response
         ▼
┌──────────────────────────────────────────┐
│  Response: {                             │
│    success: true,                        │
│    data: {                               │
│      totalUsers: 290,                    │
│      totalProviders: 50,                 │
│      totalBookings: 510,                 │
│      totalRevenue: 28900                 │
│    }                                     │
│  }                                       │
└────────┬─────────────────────────────────┘
         │
         │ 7. Update component state
         ▼
┌──────────────────────────────────────────┐
│  setStats(response.data.data)            │
│  - Component re-renders                  │
│  - Display statistics                    │
└──────────────────────────────────────────┘
```

## Component Hierarchy

```
App.jsx
├── BrowserRouter
    └── AuthProvider (Context)
        └── Routes
            ├── /admin/login → Login.jsx
            └── /admin/* → ProtectedRoute
                └── AdminRoutes
                    └── AdminLayout
                        ├── Sidebar
                        ├── Header (with logout)
                        └── Outlet (renders child routes)
                            ├── / → Dashboard.jsx
                            ├── /users → Users.jsx
                            ├── /bookings → Bookings.jsx
                            ├── /revenue → Revenue.jsx
                            ├── /verification → Verification.jsx
                            └── /settings → Settings.jsx
```

## File Structure

```
ConnectVista/
│
├── ConnectVista_Admin/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx (with logout)
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   └── ProtectedRoute.jsx ✨ NEW
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx ✨ NEW
│   │   │
│   │   ├── layout/
│   │   │   └── AdminLayout.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx (updated)
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Users.jsx
│   │   │   ├── Bookings.jsx
│   │   │   ├── Revenue.jsx
│   │   │   ├── Verification.jsx
│   │   │   └── Settings.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js (axios config)
│   │   │
│   │   └── App.jsx (updated)
│   │
│   └── .env
│       └── VITE_API_URL=http://localhost:5000/api
│
└── ConnectVIsta_Backend/
    ├── src/
    │   ├── controllers/
    │   │   ├── authController.js (updated)
    │   │   └── admin_controller.js
    │   │
    │   ├── routes/
    │   │   ├── authRoutes.js
    │   │   └── admin_routes.js
    │   │
    │   ├── middleware/
    │   │   └── auth.js (role validation)
    │   │
    │   ├── models/
    │   │   └── User.js (with admin role)
    │   │
    │   └── scripts/
    │       └── createAdmin.js ✨ NEW
    │
    ├── server.js (CORS configured)
    └── .env
        ├── MONGODB_URI=...
        ├── JWT_SECRET=...
        └── ADMIN_URL=http://localhost:5174
```

## Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Security Layers                       │
└─────────────────────────────────────────────────────────┘

Layer 1: Frontend Route Protection
├── ProtectedRoute component
├── Checks isAuthenticated from AuthContext
└── Redirects to login if not authenticated

Layer 2: Token Storage
├── JWT token in localStorage
├── Sent with every API request
└── Cleared on logout

Layer 3: Backend Authentication Middleware
├── Validates JWT signature
├── Checks token expiration
├── Verifies user exists in database
└── Checks user.isActive status

Layer 4: Role-Based Access Control
├── Validates user.role === 'admin'
├── Returns 403 if role mismatch
└── Only admin users can access admin endpoints

Layer 5: Password Security
├── Passwords hashed with bcrypt (10 rounds)
├── Never stored in plain text
└── Compared using bcrypt.compare()

Layer 6: CORS Protection
├── Only allows specific origins
├── Credentials enabled
└── Prevents unauthorized cross-origin requests
```

## Data Flow Example: View Users

```
1. Admin clicks "Users" in sidebar
   └─> Navigate to /admin/users

2. Users.jsx component mounts
   └─> useEffect(() => fetchUsers())

3. Call API: getUsers()
   └─> GET /api/admin/users

4. Axios interceptor adds token
   └─> Authorization: Bearer <token>

5. Backend receives request
   └─> auth(['admin']) middleware validates

6. adminController.getAllUsers()
   ├─> Query User collection
   ├─> Query ServiceProvider collection
   ├─> Query ServiceSeeker collection
   └─> Join data and return

7. Response sent to frontend
   └─> { success: true, data: [...users] }

8. Component updates state
   └─> setUsers(response.data.data)

9. UI re-renders with user list
   └─> Display in table/cards
```

## Key Concepts

### JWT Token Structure
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9  ← Header
.
eyJpZCI6IjY3OGFiYzEyMyIsInJvbGUiOiJhZG1pbiJ9  ← Payload (user data)
.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c  ← Signature
```

### AuthContext State
```javascript
{
  isAuthenticated: boolean,  // true if token exists
  loading: boolean,          // true during initial check
  login: (token) => void,    // stores token, sets auth
  logout: () => void         // clears token, redirects
}
```

### Protected Route Logic
```javascript
if (loading) return <LoadingSpinner />
if (!isAuthenticated) return <Navigate to="/admin/login" />
return children  // Render protected component
```

---

## Summary

✅ **Frontend**: React app with authentication context
✅ **Backend**: Express API with JWT authentication
✅ **Database**: MongoDB with admin user
✅ **Security**: Multi-layer protection with role validation
✅ **Communication**: RESTful API with Bearer token authentication

All components work together to provide a secure, functional admin panel! 🎉
