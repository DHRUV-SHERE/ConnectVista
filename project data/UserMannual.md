# ConnectVista - User Manual

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Software Requirements](#2-software-requirements)
3. [Installation Steps](#3-installation-steps)
4. [Deployment Steps](#4-deployment-steps)
5. [User Guide](#5-user-guide)
6. [Troubleshooting](#6-troubleshooting)
7. [API Documentation](#7-api-documentation)
8. [FAQs](#8-faqs)

---

## 1. Introduction

ConnectVista is a comprehensive service marketplace platform that connects service seekers with service providers. The platform features:

- **Role-based access**: Service Seekers, Service Providers, and Administrators
- **Real-time communication**: Socket.IO powered chat system
- **Geolocation services**: Find nearby service providers
- **Booking management**: Complete booking lifecycle from request to completion
- **Review system**: Rating and feedback for service providers
- **Wallet system**: Earnings management for providers
- **Subscription plans**: Basic and Pro tiers for providers
- **Admin dashboard**: Complete platform management

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      ConnectVista Architecture               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│   │   Frontend   │  │   Backend    │  │  Admin Panel  │   │
│   │  (Seeker)    │  │   (API)      │  │              │   │
│   │ localhost:   │◄─┤ localhost:   ├─►│ localhost:   │   │
│   │   5173       │  │   5000       │  │   5174       │   │
│   └──────────────┘  └──────┬───────┘  └──────────────┘   │
│                            │                               │
│                     ┌──────▼───────┐                       │
│                     │   MongoDB    │                       │
│                     │   Database   │                       │
│                     └──────────────┘                       │
│                                                              │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│   │  Cloudinary  │  │  Socket.IO   │  │    Email     │   │
│   │  (Images)    │  │   (Chat)     │  │   (EmailJS)  │   │
│   └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Software Requirements

### 2.1 Development Environment

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | v18 or higher | Backend runtime environment |
| npm | v9 or higher | Package manager |
| MongoDB | Latest | Database (local or Atlas cloud) |
| Git | Latest | Version control |

### 2.2 Recommended Tools

| Tool | Purpose |
|------|---------|
| Visual Studio Code | Recommended IDE |
| Postman | API testing and documentation |
| MongoDB Compass | Database GUI (optional) |
| Chrome/Edge/Firefox | Modern web browser for testing |

### 2.3 Service Accounts Required

| Service | Required For | Signup URL |
|---------|-------------|------------|
| MongoDB Atlas | Cloud database | https://cloud.mongodb.com |
| Cloudinary | Image storage | https://cloudinary.com |
| EmailJS | Email service | https://emailjs.com |
| Railway | Backend deployment | https://railway.app |
| Vercel | Frontend deployment | https://vercel.com |

---

## 3. Installation Steps

### 3.1 Clone the Repository

```bash
# Navigate to your workspace
cd /your/workspace/path

# Clone the repository
git clone https://github.com/your-username/ConnectVista.git

# Navigate into the project
cd ConnectVista
```

### 3.2 Backend Setup (Node.js + Express.js)

#### Step 1: Navigate to Backend Directory

```bash
cd ConnectVista_Backend
```

#### Step 2: Install Dependencies

```bash
npm install
```

#### Step 3: Create Environment File

Create a `.env` file in the `ConnectVista_Backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/connectvista
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/connectvista

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
REFRESH_TOKEN_EXPIRE=7d

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URLs (CORS)
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

#### Step 4: Start the Backend Server

```bash
npm start
```

**Expected Output:**
```
🚀 Server running in development mode on port 5000
🔌 Socket.IO enabled
📝 Available routes:
   - Health: http://localhost:5000/api/health
   - Auth Profile: http://localhost:5000/api/auth/profile
```

#### Step 5: Verify Backend is Running

Open your browser and visit:
```
http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "Service Platform API"
}
```

---

### 3.3 Frontend Setup (React + Vite)

#### Step 1: Navigate to Frontend Directory

```bash
cd ConnectVista_Frontend
```

#### Step 2: Install Additional Dependencies

```bash
npm install react-helmet-async
```

#### Step 3: Install All Dependencies

```bash
npm install
```

#### Step 4: Create Environment File

Create a `.env` file in the `ConnectVista_Frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

#### Step 5: Start the Development Server

```bash
npm run dev
```

#### Step 6: Access the Application

Open your browser and visit:
```
http://localhost:5173
```

---

### 3.4 Admin Portal Setup

#### Step 1: Navigate to Admin Directory

```bash
cd ConnectVista_Admin
```

#### Step 2: Install Dependencies

```bash
npm install
```

#### Step 3: Create Environment File

Create a `.env` file in the `ConnectVista_Admin` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

#### Step 4: Start the Admin Server

```bash
npm run dev
```

#### Step 5: Access the Admin Portal

Open your browser and visit:
```
http://localhost:5174
```

---

### 3.5 Initial Admin Account Setup

After starting all servers, create an admin account:

```bash
cd ConnectVista_Backend
node src/scripts/createAdmin.js
```

Or manually create through MongoDB Compass:

```javascript
// In MongoDB Compass, insert into 'users' collection:
{
  "email": "admin@connectvista.com",
  "phone": "9999999999",
  "password": "$2a$10$hashed_password", // bcrypt hash of 'Admin123!'
  "role": "admin",
  "isActive": true,
  "createdAt": new Date()
}
```

**Default Admin Credentials:**
- Email: `admin@connectvista.com`
- Password: `Admin123!`

---

### 3.6 Quick Start Checklist

| Step | Task | Status |
|------|------|--------|
| 1 | Clone repository | ☐ |
| 2 | Install backend dependencies | ☐ |
| 3 | Configure backend .env | ☐ |
| 4 | Start backend server | ☐ |
| 5 | Verify backend health | ☐ |
| 6 | Install frontend dependencies | ☐ |
| 7 | Configure frontend .env | ☐ |
| 8 | Start frontend server | ☐ |
| 9 | Install admin dependencies | ☐ |
| 10 | Configure admin .env | ☐ |
| 11 | Start admin server | ☐ |
| 12 | Create admin account | ☐ |
| 13 | Test login | ☐ |

---

## 4. Deployment Steps

### 4.1 Database Deployment - MongoDB Atlas

#### Step 1: Create MongoDB Atlas Account

1. Visit https://cloud.mongodb.com
2. Sign up for a free account
3. Verify your email address

#### Step 2: Create a Cluster

1. Click "Build a Database"
2. Choose the free tier (M0 Sandbox)
3. Select a region closest to your users (e.g., Mumbai for India)
4. Click "Create"

#### Step 3: Create Database User

1. Go to "Security" → "Database Access"
2. Click "Add New Database User"
3. Set username and password
4. Set privileges: "Read and write to any database"
5. Click "Add User"

#### Step 4: Configure Network Access

1. Go to "Security" → "Network Access"
2. Click "Add IP Address"
3. For development: Add `0.0.0.0/0` (all IPs)
4. For production: Add your specific server IPs

#### Step 5: Get Connection String

1. Go to "Deployment" → "Database"
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password

**Connection String Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/connectvista
```

---

### 4.2 Backend Deployment - Railway

#### Step 1: Prepare Repository

1. Push your code to GitHub
2. Ensure `package.json` has start script:
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

#### Step 2: Create Railway Project

1. Visit https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your ConnectVista repository
6. Select the `ConnectVista_Backend` directory as root

#### Step 3: Configure Environment Variables

1. In Railway dashboard, go to "Variables"
2. Add all required environment variables:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/connectvista
JWT_SECRET=your_production_secret
JWT_EXPIRE=7d
REFRESH_TOKEN_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=https://your-frontend.vercel.app
ADMIN_URL=https://your-admin.vercel.app
```

#### Step 4: Deploy

1. Railway auto-deploys on GitHub push
2. Monitor deployment in "Deployments" tab
3. Copy the generated URL (e.g., `https://backend-xxx.up.railway.app`)

---

### 4.3 Frontend Deployment - Vercel

#### Step 1: Prepare Repository

1. Ensure all code is pushed to GitHub
2. Create `.env.production`:
```env
VITE_API_URL=https://your-backend-url.railway.app/api
VITE_SOCKET_URL=https://your-backend-url.railway.app
```

#### Step 2: Create Vercel Project

1. Visit https://vercel.com
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Import your ConnectVista repository
5. Select `ConnectVista_Frontend` as root
6. Framework: "Vite"
7. Build Command: `npm run build`
8. Output Directory: `dist`

#### Step 3: Configure Environment Variables

1. In Vercel dashboard, go to "Environment Variables"
2. Add:

```env
VITE_API_URL=https://your-backend-url.railway.app/api
VITE_SOCKET_URL=https://your-backend-url.railway.app
```

#### Step 4: Deploy

1. Click "Deploy"
2. Wait for build completion
3. Your site is live at: `https://your-project.vercel.app`

---

### 4.4 Admin Portal Deployment - Vercel

#### Step 1: Create New Vercel Project

1. Follow same steps as frontend
2. Select `ConnectVista_Admin` as root

#### Step 2: Configure Environment Variables

```env
VITE_API_URL=https://your-backend-url.railway.app/api
VITE_SOCKET_URL=https://your-backend-url.railway.app
```

#### Step 3: Deploy

1. Click "Deploy"
2. Admin portal is live at: `https://your-admin.vercel.app`

---

### 4.5 Deployment Checklist

| Item | Status | Notes |
|------|--------|-------|
| MongoDB Atlas Cluster | ☐ | |
| Database User Created | ☐ | |
| IP Whitelist Configured | ☐ | |
| Railway Backend Deployed | ☐ | |
| Backend .env Configured | ☐ | |
| Backend Health Check | ☐ | |
| Vercel Frontend Deployed | ☐ | |
| Vercel Admin Deployed | ☐ | |
| Frontend .env Updated | ☐ | |
| Admin .env Updated | ☐ | |
| End-to-End Test | ☐ | |

---

## 5. User Guide

### 5.1 User Roles Overview

| Role | Description | Access Level |
|------|-------------|---------------|
| Service Seeker | Customers looking for services | Frontend application |
| Service Provider | Businesses offering services | Frontend application |
| Admin | Platform administrator | Admin portal |

---

### 5.2 Service Seeker Guide

#### 5.2.1 Registration & Login

**Registration Steps:**

1. Visit the application at `http://localhost:5173`
2. Click "Sign Up" button
3. Select "Service Seeker" as role
4. Fill in the registration form:
   - Full Name
   - Email Address
   - Phone Number
   - Password (min 8 characters)
   - Confirm Password
5. Click "Create Account"
6. Verify email (if enabled)
7. Complete profile setup

**Login Steps:**

1. Visit `http://localhost:5173`
2. Click "Login"
3. Enter email and password
4. Select "Seeker" role
5. Click "Sign In"
6. Dashboard loads upon successful authentication

#### 5.2.2 Profile Setup

After first login, complete your profile:

1. Navigate to "Profile" section
2. Update the following:
   - Profile Picture
   - Gender
   - Full Address (for service delivery)
   - Location coordinates (auto-detected)
3. Click "Save Changes"

**Address Format:**
```
Street: 123 Main Street
City: Mumbai
State: Maharashtra
Pin Code: 400001
```

#### 5.2.3 Service Discovery

**Browse Categories:**

1. From dashboard, click "Find Services"
2. View all service categories:
   - Home Services
   - Professional Services
   - Health & Wellness
   - Education
   - Events
   - And more...

**Search Providers:**

1. Select a category
2. View sub-services within category
3. See providers list with:
   - Name and rating
   - Starting price
   - Distance from your location
4. Use filters:
   - Sort by: Rating, Distance, Price
   - Filter by: Price range, Availability

**View Provider Details:**

1. Click on any provider card
2. View full profile including:
   - Business description
   - Experience years
   - Portfolio images
   - Customer reviews
   - Weekly schedule
   - Service pricing

#### 5.2.4 Booking a Service

**Create New Booking:**

1. View provider details page
2. Click "Book Now" button
3. Select booking details:
   - Service Date (must be future date)
   - Preferred Time Slot
   - Priority: Normal / Urgent
4. Enter Service Address:
   - Use my address
   - Or enter new address
5. Add Additional Notes (optional)
6. Contact Phone Number
7. Review pricing breakdown:
   - Base Price
   - Visiting Charge
   - Platform Fee
   - Total Amount
8. Click "Confirm Booking"
9. Payment gateway opens (if applicable)
10. Booking confirmed with notification

**Booking Statuses:**

| Status | Description |
|--------|-------------|
| Pending | Awaiting provider response |
| Accepted | Provider confirmed, awaiting service |
| In Progress | Service being delivered |
| Completed | Service finished, awaiting payment |
| Cancelled | Booking cancelled by seeker/provider |
| Rejected | Provider declined the booking |

#### 5.2.5 Manage Bookings

**View My Bookings:**

1. Navigate to "My Bookings"
2. Filter by status:
   - All
   - Pending
   - Active
   - Completed
   - Cancelled
3. Click on any booking to view details

**Cancel Booking:**

1. Open the booking details
2. Click "Cancel Booking"
3. Provide cancellation reason
4. Confirm cancellation

**Track Booking:**

1. View real-time status updates
2. Receive push notifications for:
   - Booking accepted
   - Provider en route
   - Service completed

#### 5.2.6 Real-time Chat

**Start Chat:**

1. Open any active booking
2. Click "Chat with Provider"
3. Real-time messaging interface opens

**Chat Features:**

- Text messages
- Timestamps
- Read receipts
- Message history per booking
- Offline message queuing

**Send Message:**

1. Type message in input box
2. Press Enter or click Send
3. Message delivered instantly

#### 5.2.7 Reviews & Ratings

**Submit Review:**

1. After service completion
2. Go to "My Bookings" → "Completed"
3. Find the booking
4. Click "Leave Review"
5. Rate service (1-5 stars)
6. Write comment (optional)
7. Submit review

**Review Display:**

- Reviews visible on provider profile
- Average rating calculated automatically
- Provider can reply to reviews

#### 5.2.8 Favourites Management

**Add to Favourites:**

1. View provider profile or card
2. Click heart icon (❤️)
3. Provider added to favorites

**View Favorites:**

1. Navigate to "Favorites"
2. See all saved providers
3. Quick-book from favorites

**Remove from Favorites:**

1. In Favorites list
2. Click heart icon again
3. Provider removed

---

### 5.3 Service Provider Guide

#### 5.3.1 Registration & Verification

**Registration Steps:**

1. Visit `http://localhost:5173`
2. Click "Sign Up"
3. Select "Service Provider" as role
4. Fill registration form:
   - Full Name
   - Business Name
   - Email Address
   - Phone Number
   - Password
5. Click "Create Account"

**Complete Business Profile:**

1. Navigate to "My Profile"
2. Fill business details:
   - Business Name
   - Business Description
   - Service Categories
   - Sub-services Offered
   - Starting Price
   - Experience Years
   - Languages Spoken
   - Business Address
3. Upload Business Images
4. Save Profile

#### 5.3.2 KYC Verification

**Upload Documents:**

1. Go to "Verification" section
2. Upload required documents:
   - Government ID (Aadhaar/PAN/Passport)
   - Address Proof
   - Business Proof (optional)
3. Submit for review
4. Wait for admin approval

**Verification Status:**

| Status | Description |
|--------|-------------|
| Not Submitted | KYC not uploaded |
| Pending | Under admin review |
| Approved | Verified, can receive bookings |
| Rejected | Documents rejected, resubmit required |

#### 5.3.3 Service Management

**Add Services:**

1. Go to "My Services"
2. Click "Add Service"
3. Select category from list
4. Add sub-services with prices
5. Set availability status
6. Save services

**Update Services:**

1. Edit existing services
2. Modify prices
3. Toggle availability
4. Add/remove sub-services

**Set Working Schedule:**

1. Go to "Schedule"
2. Set weekly availability:
   - Monday: 9:00 AM - 6:00 PM
   - Tuesday: 9:00 AM - 6:00 PM
   - etc.
3. Mark days as off if needed
4. Save schedule

#### 5.3.4 Booking Management

**View Booking Requests:**

1. Go to "My Bookings"
2. See incoming requests with:
   - Customer name
   - Service required
   - Date and time
   - Priority level
   - Service address
   - Estimated price

**Accept Booking:**

1. Open pending booking
2. Review details
3. Click "Accept"
4. Booking confirmed
5. Customer notified

**Reject Booking:**

1. Open pending booking
2. Click "Reject"
3. Provide rejection reason
4. Customer notified with reason

**Complete Booking:**

1. After service delivery
2. Open accepted booking
3. Click "Mark Complete"
4. Add service notes (optional)
5. Customer notified to leave review

#### 5.3.5 Subscription Plans

**View Plans:**

1. Go to "Subscription"
2. See available plans:
   - **Basic (Free)**: Limited features
   - **Pro**: Full features

**Subscribe:**

1. Select plan
2. Complete payment
3. Features activated immediately

**Plan Features:**

| Feature | Basic | Pro |
|---------|-------|-----|
| Max Services | 3 | Unlimited |
| Booking Limit | 20/month | Unlimited |
| Analytics | Basic | Advanced |
| Priority Support | No | Yes |
| Featured Listing | No | Yes |

#### 5.3.6 Wallet & Earnings

**View Earnings:**

1. Go to "Wallet"
2. See dashboard:
   - Current Balance
   - Total Earnings
   - Pending Payouts
   - Transaction History

**Transaction Types:**

| Type | Description |
|------|-------------|
| Credit | Earnings from completed bookings |
| Debit | Platform fee deduction |
| Payout | Withdrawal to bank account |

**Request Payout:**

1. Ensure balance ≥ minimum amount
2. Click "Request Payout"
3. Enter amount
4. Confirm bank details
5. Submit request

#### 5.3.7 Invoices

**Generate Invoice:**

1. Open completed booking
2. Click "Generate Invoice"
3. Invoice created with:
   - Invoice number
   - Service details
   - Pricing breakdown
   - PDF download option

**View Invoice History:**

1. Go to "Invoices"
2. See all generated invoices
3. Download as PDF
4. Filter by date

---

### 5.4 Admin Portal Guide

#### 5.4.1 Admin Login

1. Visit `http://localhost:5174`
2. Enter admin credentials:
   - Email: `admin@connectvista.com`
   - Password: `Admin123!`
3. Dashboard loads

#### 5.4.2 Dashboard Overview

View platform statistics:
- Total Users (Seekers + Providers)
- Total Bookings
- Total Revenue
- Pending Verifications
- Recent Activity

#### 5.4.3 User Management

**View All Users:**

1. Go to "Users" section
2. See all registered users
3. Filter by role (Seeker/Provider)
4. Search by name/email

**Manage User Status:**

1. Open user profile
2. Actions available:
   - Activate/Deactivate account
   - View activity history
   - Delete user (with confirmation)

#### 5.4.4 Provider Verification

**Review Pending:**

1. Go to "Verifications"
2. See list of pending KYC submissions
3. Click to view documents
4. Verify document authenticity

**Approve Verification:**

1. Open verification request
2. Review uploaded documents
3. Click "Approve"
4. Provider notified, status updated

**Reject Verification:**

1. Open verification request
2. Click "Reject"
3. Enter rejection reason
4. Provider notified to resubmit

#### 5.4.5 Booking Management

**View All Bookings:**

1. Go to "Bookings"
2. See complete booking history
3. Filter by:
   - Status
   - Date range
   - Provider
   - Seeker

**Booking Details:**

1. Click on any booking
2. View complete details:
   - Customer info
   - Provider info
   - Service details
   - Payment status
   - Chat history

#### 5.4.6 Revenue Analytics

**View Revenue Data:**

1. Go to "Analytics"
2. See revenue charts:
   - Daily/Weekly/Monthly revenue
   - Revenue by category
   - Top providers by earnings

**Export Reports:**

1. Select date range
2. Click "Export"
3. Download CSV/PDF report

#### 5.4.7 Contact Submissions

**View Contacts:**

1. Go to "Contacts"
2. See all inquiry submissions
3. Filter by status:
   - New
   - In Progress
   - Resolved

**Manage Contacts:**

1. Open contact
2. Add notes
3. Update status
4. Mark as resolved

#### 5.4.8 Support Tickets

**View Tickets:**

1. Go to "Support"
2. See provider support requests
3. Filter by priority/status

**Respond to Tickets:**

1. Open ticket
2. Read provider's issue
3. Add internal notes
4. Send response to provider
5. Update ticket status

#### 5.4.9 Platform Settings

**Configure Settings:**

1. Go to "Settings"
2. Modify platform parameters:
   - Platform fee percentage
   - Minimum payout amount
   - Maintenance mode toggle

---

## 6. Troubleshooting

### 6.1 Common Installation Issues

#### Issue: Frontend not starting (npm run dev fails)

| Possible Cause | Solution |
|----------------|----------|
| Missing dependencies | Run `npm install` |
| Wrong Node.js version | Ensure Node.js v18+ is installed |
| Port already in use | Change port in vite.config.js |
| Corrupted node_modules | Delete node_modules and run `npm install` |

**Commands to try:**
```bash
# Check Node.js version
node -v

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try starting again
npm run dev
```

#### Issue: Backend crash on startup

| Possible Cause | Solution |
|----------------|----------|
| Invalid .env values | Verify all required environment variables |
| MongoDB not running | Start MongoDB or check Atlas connection |
| Port already in use | Change PORT in .env |

**Commands to try:**
```bash
# Verify MongoDB is running
mongosh

# Check .env file
cat .env

# Start backend
npm start
```

#### Issue: MongoDB Connection Failed

| Possible Cause | Solution |
|----------------|----------|
| Wrong connection string | Check MONGODB_URI format |
| IP not whitelisted | Add IP to Atlas whitelist |
| Wrong credentials | Verify username and password |
| Network issues | Check internet connection |

**Connection String Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/database
```

#### Issue: Cloudinary Upload Fails

| Possible Cause | Solution |
|----------------|----------|
| Invalid API credentials | Verify CLOUDINARY_* values in .env |
| Cloud name typo | Check spelling in Cloudinary dashboard |
| API key expired | Regenerate keys in Cloudinary |

**Verify credentials at:** https://cloudinary.com/console

---

### 6.2 Common Runtime Issues

#### Issue: API returns 401 Unauthorized

| Possible Cause | Solution |
|----------------|----------|
| JWT token expired | Re-login to get fresh token |
| Token missing | Add Authorization header |
| Invalid token | Clear cookies and re-login |

**Fix Steps:**
1. Log out completely
2. Clear browser cookies
3. Log in again
4. Copy new token

#### Issue: Socket.IO not connecting

| Possible Cause | Solution |
|----------------|----------|
| CORS origin mismatch | Verify FRONTEND_URL and ADMIN_URL |
| Backend not running | Start backend server |
| Wrong socket URL | Check VITE_SOCKET_URL in frontend |

**CORS Configuration:**
```env
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

#### Issue: Map not loading (providers)

| Possible Cause | Solution |
|----------------|----------|
| Missing geocoordinates | Update provider address |
| Invalid address | Enter complete address |
| Geocoding API limit | Wait and retry |

**Fix Steps:**
1. Ensure provider has complete address
2. Address must include: Street, City, State, Pin Code
3. Provider coordinates auto-calculate

#### Issue: Cron job not running

| Possible Cause | Solution |
|----------------|----------|
| node-cron not installed | Run `npm install node-cron` |
| Cron syntax error | Check cron expression |

**Commands:**
```bash
cd ConnectVista_Backend
npm install node-cron
npm start
```

#### Issue: Email not sending

| Possible Cause | Solution |
|----------------|----------|
| EmailJS not configured | Set up EmailJS credentials |
| Wrong template ID | Verify template in EmailJS dashboard |
| Service not active | Check EmailJS service status |

---

### 6.3 Database Issues

#### Issue: Cannot connect to MongoDB Atlas

**Checklist:**
- [ ] Internet connection working
- [ ] Username/password correct in connection string
- [ ] IP address whitelisted in Atlas
- [ ] Cluster status is "Available"

**Connection String Example:**
```
mongodb+srv://myuser:mypassword@cluster0.mongodb.net/connectvista?retryWrites=true&w=majority
```

#### Issue: Data not persisting

| Possible Cause | Solution |
|----------------|----------|
| MongoDB Atlas free tier limits | Check cluster status |
| Wrong database name | Verify database in connection string |
| Connection timeout | Check network stability |

---

### 6.4 Deployment Issues

#### Issue: Build failed on Vercel

| Possible Cause | Solution |
|----------------|----------|
| Build command wrong | Set to `npm run build` |
| Output directory wrong | Set to `dist` |
| Missing environment variables | Add all VITE_* variables |

**Vercel Configuration:**
```
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

#### Issue: Backend not accessible

| Possible Cause | Solution |
|----------------|----------|
| Railway build failed | Check build logs |
| Environment variables missing | Add all vars in Railway |
| Port configuration wrong | Set PORT=5000 |

---

### 6.5 Troubleshooting Quick Reference

| Error Code | Meaning | Quick Fix |
|------------|---------|-----------|
| 401 | Unauthorized | Re-login |
| 403 | Forbidden | Check role permissions |
| 404 | Not Found | Verify URL |
| 500 | Server Error | Check server logs |
| ECONNREFUSED | Connection refused | Start server |
| ENOENT | File not found | Check paths |

---

## 7. API Documentation

### 7.1 API Overview

**Base URL (Development):**
```
http://localhost:5000/api
```

**Base URL (Production):**
```
https://your-backend-url.railway.app/api
```

### 7.2 Authentication

All protected endpoints require:
```
Authorization: Bearer <access_token>
```

### 7.3 Common Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "error": { ... }
}
```

### 7.4 Key Endpoints Summary

| Category | Endpoint | Method | Auth |
|----------|----------|--------|------|
| Auth | /auth/login | POST | No |
| Auth | /auth/signup | POST | No |
| Auth | /auth/profile | GET | Yes |
| Booking | /bookings | POST | Seeker |
| Booking | /bookings/:id/accept | PATCH | Provider |
| Review | /reviews | POST | Seeker |
| Wallet | /wallet/details | GET | Provider |

**For complete API documentation, see:** `project data/postmanAPITesting.md`

---

## 8. FAQs

### General

**Q: What is ConnectVista?**
A: ConnectVista is a service marketplace platform connecting service seekers with service providers, featuring real-time chat, booking management, and reviews.

**Q: How many user roles are there?**
A: Three roles: Service Seeker, Service Provider, and Admin.

**Q: Is ConnectVista free to use?**
A: Yes, seekers can use it for free. Providers have free Basic and paid Pro plans.

### Installation

**Q: Can I run ConnectVista on Windows?**
A: Yes, all steps work on Windows with Git Bash or WSL.

**Q: Do I need MongoDB installed locally?**
A: No, you can use MongoDB Atlas cloud database.

**Q: Can I skip the admin portal?**
A: Yes, but admin functions won't be accessible.

### Features

**Q: How does real-time chat work?**
A: Socket.IO enables instant messaging between seekers and providers.

**Q: Can providers set their own prices?**
A: Yes, providers set starting prices and can quote per booking.

**Q: Is there a mobile app?**
A: Currently web-only, but responsive design works on mobile browsers.

### Billing & Payments

**Q: How do providers receive payments?**
A: Through the wallet system with payout to bank account.

**Q: What is the platform fee?**
A: Configurable by admin, typically 2% of transaction value.

### Support

**Q: How do I report bugs?**
A: Submit through the contact form or support ticket system.

**Q: Where can I get help?**
A: Contact admin through the platform or check documentation.

---

## Appendix A: File Structure

```
ConnectVista/
├── ConnectVista_Backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── scripts/
│   │   ├── config/
│   │   └── utils/
│   ├── server.js
│   └── package.json
│
├── ConnectVista_Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
│
├── ConnectVista_Admin/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   ├── package.json
│   └── vite.config.js
│
└── project data/
    ├── testcases.md
    ├── postmanAPITesting.md
    ├── UserMannual.md
    └── ProjectDocument.md
```

---

## Appendix B: Environment Variables Reference

### Backend (.env)

| Variable | Required | Description |
|----------|----------|-------------|
| PORT | Yes | Server port (default: 5000) |
| MONGODB_URI | Yes | Database connection string |
| JWT_SECRET | Yes | Secret for JWT signing |
| JWT_EXPIRE | Yes | Token expiry (e.g., 7d) |
| CLOUDINARY_* | Yes | Image storage credentials |
| FRONTEND_URL | Yes | Frontend URL for CORS |
| ADMIN_URL | Yes | Admin portal URL for CORS |

### Frontend (.env)

| Variable | Required | Description |
|----------|----------|-------------|
| VITE_API_URL | Yes | Backend API URL |
| VITE_SOCKET_URL | Yes | Socket.IO server URL |

### Admin (.env)

| Variable | Required | Description |
|----------|----------|-------------|
| VITE_API_URL | Yes | Backend API URL |
| VITE_SOCKET_URL | Yes | Socket.IO server URL |

---

## Appendix C: Default Credentials

**Admin Account:**
- Email: `admin@connectvista.com`
- Password: `Admin123!`

**Important:** Change these credentials in production!

---

## Appendix D: Support Contact

For additional support:
- Email: support@connectvista.com
- Documentation: See `project data/` folder
- API Docs: See `project data/postmanAPITesting.md`

---

*Document Version: 1.0*
*Last Updated: 2024*
*ConnectVista - User Manual*
