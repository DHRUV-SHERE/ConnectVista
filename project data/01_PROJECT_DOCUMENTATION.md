# 📚 ConnectVista - Complete Project Documentation

## 🎯 Project Overview

**ConnectVista** is a comprehensive service marketplace platform connecting service seekers with service providers. It enables users to discover, book, and manage local services while providing providers with tools to manage their business, bookings, subscriptions, and earnings.

---

## 🏗️ Architecture Overview

### **Three-Tier Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                              │
├─────────────────────────────────────────────────────────────┤
│  ConnectVista_Frontend (React)  │  ConnectVista_Admin (React)│
│  Port: 5173                     │  Port: 5174                 │
│  - User Interface (Seekers)     │  - Admin Dashboard          │
│  - Provider Dashboard           │  - Platform Management      │
│  - Real-time Chat UI            │  - Analytics & Reports      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    SERVER LAYER                              │
├─────────────────────────────────────────────────────────────┤
│  ConnectVista_Backend (Node.js + Express)                    │
│  Port: 5000                                                  │
│  - RESTful APIs                                              │
│  - Socket.IO for Real-time Communication                     │
│  - Authentication & Authorization (JWT)                      │
│  - Business Logic & Validation                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                            │
├─────────────────────────────────────────────────────────────┤
│  MongoDB (NoSQL Database)                                    │
│  - User Data                                                 │
│  - Service Catalog                                           │
│  - Bookings & Transactions                                   │
│  - Chat Messages                                             │
│  - Reviews & Ratings                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
ConnectVista/
│
├── ConnectVista_Frontend/          # Seeker & Provider Web App
│   ├── src/
│   │   ├── api/                    # API client setup
│   │   ├── components/             # Reusable UI components
│   │   │   ├── Common/            # Shared components
│   │   │   ├── User/              # Seeker-specific components
│   │   │   └── Provider/          # Provider-specific components
│   │   ├── contexts/              # React Context (Auth, Socket)
│   │   ├── pages/                 # Page components
│   │   │   ├── User/              # Seeker pages
│   │   │   ├── Provider/          # Provider pages
│   │   │   └── Auth/              # Login/Register pages
│   │   ├── services/              # API service functions
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── utils/                 # Helper functions
│   │   └── routes/                # Routing configuration
│   └── package.json
│
├── ConnectVista_Admin/             # Admin Dashboard
│   ├── src/
│   │   ├── components/            # Admin UI components
│   │   ├── pages/                 # Admin pages
│   │   └── services/              # Admin API services
│   └── package.json
│
├── ConnectVista_Backend/           # API Server
│   ├── src/
│   │   ├── config/                # Configuration files
│   │   │   └── db.js              # MongoDB connection
│   │   ├── controllers/           # Request handlers
│   │   ├── middleware/            # Express middleware
│   │   │   └── auth.js            # JWT authentication
│   │   ├── models/                # MongoDB schemas
│   │   ├── routes/                # API route definitions
│   │   ├── services/              # Business logic
│   │   └── utils/                 # Utility functions
│   ├── uploads/                   # File uploads storage
│   ├── server.js                  # Entry point
│   └── package.json
│
├── project data/                   # Documentation folder
├── UIUX Designs/                   # Design assets
├── ARCHITECTURE.md                 # Architecture documentation
├── README.md                       # Project readme
└── idea.md                         # Feature roadmap
```

---

## 🔑 Key Technologies

### **Frontend**
- **React 18** - UI library
- **React Router 6** - Client-side routing
- **TailwindCSS** - Utility-first CSS
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time communication
- **Lucide React** - Icon library
- **React Hot Toast** - Notifications

### **Backend**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Socket.IO** - WebSocket library
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Nodemailer** - Email sending
- **Express Validator** - Input validation

### **Additional Services**
- **EmailJS** - Email templates (limited)
- **Geolocation API** - Location services
- **MapLibre GL** - Map rendering

---

## 🗄️ Database Schema

### **Core Collections**

#### 1. **User**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: ['seeker', 'provider', 'admin'],
  isVerified: Boolean,
  profileImage: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. **ServiceSeeker**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  name: String,
  gender: String,
  address: {
    street: String,
    city: String,
    state: String,
    pinCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  profileImage: String,
  preferences: {
    notifications: Boolean,
    emailUpdates: Boolean
  }
}
```

#### 3. **ServiceProvider**
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  businessName: String,
  businessDescription: String,
  serviceCategory: String,
  subServices: [{
    id: String,
    name: String,
    basePrice: Number
  }],
  location: {
    street: String,
    city: String,
    state: String,
    pinCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  businessHours: {
    monday: { open: String, close: String },
    // ... other days
  },
  rating: Number,
  totalReviews: Number,
  experience: Number,
  portfolio: [String],
  isVerified: Boolean,
  subscription: {
    plan: String,
    expiresAt: Date,
    autoRenew: Boolean
  }
}
```

#### 4. **Booking**
```javascript
{
  _id: ObjectId,
  seeker: ObjectId (ref: ServiceSeeker),
  provider: ObjectId (ref: ServiceProvider),
  serviceId: ObjectId (ref: Service),
  bookingDate: Date,
  bookingTime: String,
  status: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
  priority: ['normal', 'urgent'],
  serviceAddress: {
    street: String,
    city: String,
    state: String,
    pinCode: String
  },
  contactPhone: String,
  additionalNote: String,
  estimatedPrice: Number,
  finalPrice: Number,
  providerNotes: String,
  rejectionReason: String,
  cancellationReason: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### 5. **Review**
```javascript
{
  _id: ObjectId,
  booking: ObjectId (ref: Booking),
  provider: ObjectId (ref: ServiceProvider),
  seeker: ObjectId (ref: ServiceSeeker),
  rating: Number (1-5),
  reviewText: String,
  providerReply: String,
  images: [String],
  isVerified: Boolean,
  createdAt: Date
}
```

#### 6. **FavoriteServiceProvider**
```javascript
{
  _id: ObjectId,
  seekerId: ObjectId (ref: ServiceSeeker),
  providerId: ObjectId (ref: ServiceProvider),
  createdAt: Date
}
```

#### 7. **Message** (Chat)
```javascript
{
  _id: ObjectId,
  sender: ObjectId (ref: User),
  receiver: ObjectId (ref: User),
  content: String,
  attachments: [{
    type: String,
    url: String,
    name: String
  }],
  isRead: Boolean,
  readAt: Date,
  createdAt: Date
}
```

#### 8. **Notification**
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  title: String,
  message: String,
  type: ['booking', 'payment', 'system', 'message'],
  category: String,
  relatedId: ObjectId,
  isRead: Boolean,
  actionUrl: String,
  createdAt: Date
}
```

#### 9. **Wallet**
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  balance: Number,
  transactions: [{
    type: ['credit', 'debit'],
    amount: Number,
    description: String,
    relatedBooking: ObjectId,
    timestamp: Date
  }],
  pendingBalance: Number,
  totalEarnings: Number,
  totalWithdrawals: Number
}
```

#### 10. **Subscription**
```javascript
{
  _id: ObjectId,
  provider: ObjectId (ref: ServiceProvider),
  plan: ['basic', 'standard', 'premium'],
  startDate: Date,
  endDate: Date,
  amount: Number,
  status: ['active', 'expired', 'cancelled'],
  autoRenew: Boolean,
  paymentMethod: String
}
```

#### 11. **Settings** (Platform-wide)
```javascript
{
  _id: ObjectId,
  platformFeePercentage: Number,
  minimumPayoutAmount: Number,
  subscriptionPlans: [{
    name: String,
    price: Number,
    features: [String]
  }],
  updatedBy: ObjectId (ref: User),
  updatedAt: Date
}
```

---

## 🔐 Authentication & Authorization

### **JWT-based Authentication**

#### Flow:
1. User logs in with email/password
2. Backend validates credentials
3. JWT token generated with user ID and role
4. Token stored in frontend (localStorage)
5. Token sent in Authorization header for protected routes
6. Backend middleware validates token and attaches user info

#### Token Structure:
```javascript
{
  id: userId,
  email: userEmail,
  role: userRole,
  iat: issuedAtTimestamp,
  exp: expirationTimestamp
}
```

#### Middleware Protection:
```javascript
// auth.js middleware
auth(['seeker']) // Only seekers
auth(['provider']) // Only providers
auth(['admin']) // Only admins
auth(['seeker', 'provider']) // Seekers or providers
auth() // Any authenticated user
```

---

## 🌐 API Endpoints

### **Base URL**: `http://localhost:5000/api`

### **Authentication Routes** (`/auth`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | ❌ | Register new user |
| POST | `/auth/login` | ❌ | Login user |
| POST | `/auth/logout` | ✅ | Logout user |
| GET | `/auth/profile` | ✅ | Get user profile |
| POST | `/auth/forgot-password` | ❌ | Request password reset |
| POST | `/auth/reset-password` | ❌ | Reset password with token |

### **Seeker Routes** (`/seeker`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/seeker/profile` | ✅ | Get seeker profile |
| PUT | `/seeker/profile` | ✅ | Update seeker profile |
| POST | `/seeker/location` | ✅ | Update location |
| GET | `/seeker/services` | ✅ | Get all services with prices |
| GET | `/seeker/services/:categoryId/providers` | ✅ | Get providers by category |
| GET | `/seeker/providers/:providerId` | ✅ | Get provider details |

### **Provider Routes** (`/profile`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/profile/provider` | ✅ | Get provider profile |
| POST | `/profile/provider` | ✅ | Create provider profile |
| PUT | `/profile/provider` | ✅ | Update provider profile |
| DELETE | `/profile/provider` | ✅ | Delete provider profile |
| GET | `/profile/dashboard/stats` | ✅ | Get dashboard stats |

### **Booking Routes** (`/bookings`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/bookings` | ✅ | Create booking |
| GET | `/bookings/seeker` | ✅ | Get seeker bookings |
| GET | `/bookings/provider` | ✅ | Get provider bookings |
| GET | `/bookings/:id` | ✅ | Get booking details |
| PATCH | `/bookings/:id/accept` | ✅ | Accept booking (provider) |
| PATCH | `/bookings/:id/reject` | ✅ | Reject booking (provider) |
| PATCH | `/bookings/:id/complete` | ✅ | Complete booking (provider) |
| PATCH | `/bookings/:id/cancel` | ✅ | Cancel booking |

### **Favorites Routes** (`/favorites`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/favorites` | ✅ | Get favorite providers |
| POST | `/favorites` | ✅ | Add to favorites |
| DELETE | `/favorites/:providerId` | ✅ | Remove from favorites |
| GET | `/favorites/check/:providerId` | ✅ | Check if favorited |
| POST | `/favorites/check-bulk` | ✅ | Bulk check favorites |

### **Review Routes** (`/reviews`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/reviews` | ✅ | Submit review |
| GET | `/reviews/provider/:providerId` | ❌ | Get provider reviews |
| GET | `/reviews/booking/:bookingId` | ✅ | Get review by booking |
| PATCH | `/reviews/:id/reply` | ✅ | Reply to review (provider) |

### **Chat Routes** (`/chat`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/chat/send` | ✅ | Send message |
| GET | `/chat/conversations` | ✅ | Get conversations |
| GET | `/chat/messages/:userId` | ✅ | Get messages with user |
| PATCH | `/chat/read/:messageId` | ✅ | Mark as read |

### **Notification Routes** (`/notifications`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/notifications` | ✅ | Get notifications |
| GET | `/notifications/unread-count` | ✅ | Get unread count |
| PATCH | `/notifications/:id/read` | ✅ | Mark as read |
| PATCH | `/notifications/read-all` | ✅ | Mark all as read |
| DELETE | `/notifications/:id` | ✅ | Delete notification |

### **Wallet Routes** (`/wallet`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/wallet` | ✅ | Get wallet details |
| POST | `/wallet/add-money` | ✅ | Add money to wallet |
| POST | `/wallet/withdraw` | ✅ | Request withdrawal |
| GET | `/wallet/transactions` | ✅ | Get transaction history |

### **Subscription Routes** (`/subscriptions`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/subscriptions/plans` | ❌ | Get all plans |
| POST | `/subscriptions/subscribe` | ✅ | Subscribe to plan |
| GET | `/subscriptions/current` | ✅ | Get current subscription |
| POST | `/subscriptions/cancel` | ✅ | Cancel subscription |

### **Admin Routes** (`/admin`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/dashboard` | 🔒 | Admin dashboard stats |
| GET | `/admin/users` | 🔒 | Get all users |
| PATCH | `/admin/users/:id/verify` | 🔒 | Verify user |
| DELETE | `/admin/users/:id` | 🔒 | Delete user |
| GET | `/admin/bookings` | 🔒 | Get all bookings |
| GET | `/admin/revenue` | 🔒 | Get revenue stats |

### **Settings Routes** (`/settings`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/settings` | 🔒 | Get platform settings |
| PUT | `/settings` | 🔒 | Update settings |

---

## 🔌 Real-time Features (Socket.IO)

### **Events**

#### Client → Server:
- `send_message` - Send chat message
- `join_room` - Join chat room
- `leave_room` - Leave chat room
- `typing` - User is typing

#### Server → Client:
- `receive_message` - New message received
- `message_read` - Message read notification
- `new_notification` - New notification
- `booking_update` - Booking status changed
- `typing_indicator` - Show typing indicator

---

## 🎨 UI/UX Design System

### **Color Palette**
- **Primary (Accent)**: Sky Blue (`#0ea5e9`)
- **Accent Dark**: `#0284c7`
- **Accent Fade**: `rgba(14, 165, 233, 0.1)`
- **Background**: White (`#ffffff`)
- **Card Background**: White with shadow
- **Text Color**: Dark Gray (`#1f2937`)
- **Border Color**: Light Gray (`#e5e7eb`)

### **Typography**
- **Font Family**: System font stack (sans-serif)
- **Headings**: Bold, various sizes
- **Body Text**: Regular weight
- **Small Text**: 0.875rem

### **Components**
- **Buttons**: Rounded-xl, shadow on hover
- **Cards**: Rounded-2xl, border + shadow
- **Inputs**: Rounded-xl, border focus state
- **Modals**: Full-screen overlay, centered content
- **Toast**: Top-right, auto-dismiss

---

## 🚀 Setup Instructions

### **Prerequisites**
- Node.js v16+ installed
- MongoDB installed and running
- Git installed

### **1. Clone Repository**
```bash
git clone <repository-url>
cd ConnectVista
```

### **2. Backend Setup**
```bash
cd ConnectVista_Backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/connectvista
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
NODE_ENV=development
```

Start backend:
```bash
npm start
```

### **3. Frontend Setup**
```bash
cd ConnectVista_Frontend
npm install
npm run dev
```

### **4. Admin Setup**
```bash
cd ConnectVista_Admin
npm install
npm run dev
```

### **5. Access Application**
- **Frontend**: http://localhost:5173
- **Admin**: http://localhost:5174
- **Backend API**: http://localhost:5000/api

---

## 🧪 Testing

### **Manual Testing**
1. Register as seeker/provider
2. Login and test authentication
3. Browse services and providers
4. Create bookings
5. Test chat functionality
6. Test notifications
7. Test wallet operations

### **API Testing**
Use Postman or Thunder Client:
1. Import API collection
2. Set environment variables
3. Test each endpoint
4. Verify responses

---

## 📦 Deployment

### **Backend Deployment** (Railway/Heroku/DigitalOcean)
1. Set environment variables
2. Build: `npm install --production`
3. Start: `npm start`

### **Frontend Deployment** (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy `dist` folder
3. Set environment variables

### **Database** (MongoDB Atlas)
1. Create cluster
2. Whitelist IP addresses
3. Update MONGODB_URI

---

## 📞 Support & Contact

For issues or questions, contact the development team.

---

**Last Updated**: March 2026
**Version**: 1.0.0
