# ConnectVista - Postman API Testing Guide

## Overview
This document contains all API endpoints for ConnectVista platform testing using Postman. All APIs use the base URL: `http://localhost:5000/api`

---

## Base URL
```
http://localhost:5000/api
```

---

## Postman Setup Instructions

### 1. Environment Setup
Create a new Postman environment with the following variables:

| Variable | Initial Value | Description |
|----------|--------------|-------------|
| `baseUrl` | `http://localhost:5000/api` | API base URL |
| `accessToken` | (leave empty) | JWT access token |
| `refreshToken` | (leave empty) | Refresh token (cookie-based) |
| `userEmail` | `test@email.com` | Test user email |
| `userId` | (leave empty) | User ID |
| `providerId` | (leave empty) | Provider ID |
| `seekerId` | (leave empty) | Seeker ID |
| `bookingId` | (leave empty) | Booking ID |

### 2. Authentication Header
For protected routes, add to Headers:
```
Authorization: Bearer {{accessToken}}
```

---

## API Endpoints Summary

| Category | Total Endpoints |
|----------|----------------|
| Authentication | 11 |
| Admin | 11 |
| Booking | 8 |
| Chat | 3 |
| Contact | 5 |
| Favourites | 5 |
| Invoice | 4 |
| Notification | 7 |
| Profile (Provider) | 6 |
| Profile (Seeker) | 4 |
| Reviews | 5 |
| Service Catalog | 3 |
| Settings | 2 |
| Subscription | 4 |
| Support | 6 |
| Verification | 4 |
| **TOTAL** | **88** |

---

## 1. Authentication APIs

### 1.1 User Login
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/login` | No | Login user with email and password |

**Request Body:**
```json
{
  "email": "user@email.com",
  "password": "Password123",
  "role": "seeker"
}
```

---

### 1.2 User Signup
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/signup` | No | Register new user (seeker/provider) |

**Request Body (Seeker):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "Password123!",
  "role": "seeker",
  "gender": "male",
  "address": "123 Main Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pinCode": "400001"
}
```

**Request Body (Provider):**
```json
{
  "name": "Jane Provider",
  "email": "jane@provider.com",
  "phone": "9876543211",
  "password": "Password123!",
  "role": "provider",
  "businessName": "JD Services",
  "description": "Professional cleaning services",
  "street": "456 Business Ave",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pinCode": "400002",
  "service": {
    "name": "Cleaning",
    "category": "home-services"
  }
}
```

---

### 1.3 Forgot Password
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/forgot-password` | No | Request password reset token |

**Request Body:**
```json
{
  "email": "user@email.com"
}
```

---

### 1.4 Reset Password
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/reset-password` | No | Reset password with token |

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "password": "NewPassword123!"
}
```

---

### 1.5 Refresh Token
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/refresh-token` | No | Refresh access token |

**Note:** Requires valid refresh token in cookie.

---

### 1.6 Logout
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/logout` | No | Logout user and clear tokens |

**Note:** Requires valid refresh token in cookie.

---

### 1.7 Get Profile
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/auth/profile` | Yes | Get current user profile |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 1.8 Update Profile
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PUT | `/auth/profile` | Yes | Update user profile |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "phone": "9876543219"
}
```

---

### 1.9 Change Password
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PUT | `/auth/change-password` | Yes | Change current password |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Request Body:**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

---

### 1.10 Admin Users List
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/auth/admin/users` | Admin | Get all users (admin only) |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 1.11 Health Check
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | No | API health check |

**Full URL:** `http://localhost:5000/api/health`

---

## 2. Admin APIs

### 2.1 Dashboard Stats
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/dashboard/stats` | Admin | Get dashboard statistics |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Response Sample:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalProviders": 45,
    "totalSeekers": 100,
    "totalBookings": 320,
    "pendingVerifications": 5,
    "totalRevenue": 150000
  }
}
```

---

### 2.2 Get All Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/users` | Admin | Get all platform users |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Results per page

---

### 2.3 Get All Providers
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/providers` | Admin | Get all service providers |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 2.4 Get All Seekers
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/seekers` | Admin | Get all service seekers |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 2.5 Update User Status
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PATCH | `/admin/users/:id/status` | Admin | Activate/deactivate user |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Request Body:**
```json
{
  "isActive": false
}
```

---

### 2.6 Get All Bookings (Admin)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/bookings` | Admin | Get all bookings across platform |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Query Parameters:**
- `status` (optional): pending, accepted, completed, cancelled
- `page` (optional): Page number
- `limit` (optional): Results per page

---

### 2.7 Get Revenue Data
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/revenue` | Admin | Get revenue statistics |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Query Parameters:**
- `period` (optional): daily, weekly, monthly, yearly

---

### 2.8 Get Verifications
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/verifications` | Admin | Get pending verification requests |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 2.9 Update Verification
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PATCH | `/admin/verifications/:id` | Admin | Approve/reject verification |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Request Body:**
```json
{
  "status": "approved",
  "reason": "All documents verified"
}
```

---

## 3. Booking APIs

### 3.1 Create Booking
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/bookings` | Seeker | Create new booking request |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Request Body:**
```json
{
  "providerId": "provider-object-id",
  "serviceId": "service-object-id",
  "bookingDate": "2024-12-20",
  "bookingTime": "10:00",
  "priority": "normal",
  "serviceAddress": {
    "street": "123 Customer Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pinCode": "400001"
  },
  "additionalNote": "Please ring doorbell",
  "contactPhone": "9876543210"
}
```

**Priority Options:** `normal`, `urgent`

---

### 3.2 Get Seeker Bookings
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/bookings/seeker` | Seeker | Get all bookings for current seeker |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Query Parameters:**
- `status` (optional): pending, accepted, completed, cancelled
- `page` (optional): Page number
- `limit` (optional): Results per page

---

### 3.3 Get Provider Bookings
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/bookings/provider` | Provider | Get all bookings for current provider |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Query Parameters:**
- `status` (optional): pending, accepted, completed, cancelled
- `page` (optional): Page number
- `limit` (optional): Results per page

---

### 3.4 Get Booking by ID
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/bookings/:id` | Both | Get single booking details |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 3.5 Accept Booking
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PATCH | `/bookings/:id/accept` | Provider | Accept pending booking |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 3.6 Reject Booking
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PATCH | `/bookings/:id/reject` | Provider | Reject pending booking |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Request Body:**
```json
{
  "reason": "Schedule conflict"
}
```

---

### 3.7 Cancel Booking
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PATCH | `/bookings/:id/cancel` | Both | Cancel booking |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Request Body:**
```json
{
  "reason": "Emergency"
}
```

---

### 3.8 Complete Booking
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PATCH | `/bookings/:id/complete` | Provider | Mark booking as completed |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Request Body:**
```json
{
  "providerNotes": "Service completed successfully"
}
```

---

## 4. Chat APIs

### 4.1 Get Conversations
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/chat/conversations` | Both | Get all chat conversations |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 4.2 Get Messages
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/chat/:bookingId` | Both | Get messages for a booking |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 4.3 Send Message
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/chat/send` | Both | Send message in chat |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Request Body:**
```json
{
  "bookingId": "booking-object-id",
  "message": "Hello, I'll be there at 10 AM"
}
```

---

## 5. Contact APIs

### 5.1 Submit Contact Form
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/contact` | No | Submit public contact form |

**Request Body:**
```json
{
  "name": "Customer Name",
  "email": "customer@email.com",
  "phone": "9876543210",
  "subject": "Inquiry about services",
  "message": "I need cleaning services for my home"
}
```

---

### 5.2 Get Contact Stats (Admin)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/contact/stats` | Admin | Get contact submission statistics |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 5.3 Get All Contacts (Admin)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/contact` | Admin | Get all contact submissions |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 5.4 Update Contact (Admin)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PATCH | `/contact/:id` | Admin | Update contact status |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Request Body:**
```json
{
  "status": "resolved",
  "notes": "Contacted customer"
}
```

---

### 5.5 Delete Contact (Admin)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| DELETE | `/contact/:id` | Admin | Delete contact submission |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

## 6. Favourite APIs

### 6.1 Get Favourites
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/favorites` | Seeker | Get all favorite providers |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 6.2 Add Favourite
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/favorites` | Seeker | Add provider to favorites |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Request Body:**
```json
{
  "providerId": "provider-object-id"
}
```

---

### 6.3 Remove Favourite
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| DELETE | `/favorites/:providerId` | Seeker | Remove provider from favorites |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 6.4 Check Favorite Status
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/favorites/check/:providerId` | Seeker | Check if provider is favorited |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 6.5 Bulk Check Favorites
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/favorites/check-bulk` | Seeker | Check multiple providers |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Request Body:**
```json
{
  "providerIds": ["id1", "id2", "id3"]
}
```

---

## 7. Invoice APIs

### 7.1 Generate Invoice
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/invoices/generate` | Provider | Generate invoice for booking |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Request Body:**
```json
{
  "bookingId": "booking-object-id"
}
```

---

### 7.2 Get Provider Invoices
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/invoices/provider` | Provider | Get all provider invoices |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 7.3 Get Seeker Invoices
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/invoices/seeker` | Seeker | Get all seeker invoices |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 7.4 Complete Online Payment
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/invoices/complete-payment/:invoiceId` | Provider | Complete payment for invoice |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Request Body:**
```json
{
  "paymentDetails": {
    "transactionId": "TXN123456",
    "paymentMethod": "online",
    "amount": 500
  }
}
```

---

## 8. Notification APIs

### 8.1 Get Notifications
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/notifications` | Both | Get user notifications |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Results per page
- `category` (optional): booking, payment, verification, system
- `isRead` (optional): true, false

---

### 8.2 Get Unread Count
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/notifications/unread-count` | Both | Get unread notification count |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 8.3 Get Category Counts
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/notifications/category-counts` | Both | Get counts by category |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 8.4 Mark as Read (Single)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PATCH | `/notifications/:id/read` | Both | Mark single notification read |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 8.5 Mark Category as Read
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PATCH | `/notifications/read-category/:category` | Both | Mark all in category read |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 8.6 Mark All as Read
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PATCH | `/notifications/read-all` | Both | Mark all notifications read |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 8.7 Delete Notification
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| DELETE | `/notifications/:id` | Both | Delete notification |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

## 9. Provider Profile APIs

### 9.1 Get Provider Profile
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/profile/provider` | Provider | Get own profile |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 9.2 Update Provider Profile
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PUT | `/profile/provider` | Provider | Update own profile |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Request Body:**
```json
{
  "name": "Updated Business Name",
  "description": "Updated description",
  "languages": ["English", "Hindi"],
  "startingPrice": 500,
  "emergencyCharge": 200
}
```

---

### 9.3 Update Provider Services
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PUT | `/profile/provider/services` | Provider | Update services offered |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 9.4 Upload Business Images
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/profile/provider/images` | Provider | Upload business images |

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: multipart/form-data
```

**Form Data:**
- `images`: Select multiple image files (max 10)

---

### 9.5 Delete Business Image
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| DELETE | `/profile/provider/images/:imageIndex` | Provider | Delete business image |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 9.6 Get Nearby Providers
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/profile/nearby` | Seeker | Get nearby providers |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Query Parameters:**
- `lat` (required): Latitude
- `lng` (required): Longitude
- `radius` (optional): Search radius in km
- `sortBy` (optional): distance, rating, price-low, price-high

---

### 9.7 Get Dashboard Stats
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/profile/dashboard/stats` | Provider | Get provider dashboard stats |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 9.8 Get Recent Services
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/profile/dashboard/recent-services` | Provider | Get recent service history |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

## 10. Seeker Profile APIs

### 10.1 Get Seeker Profile
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/seeker/profile` | Seeker | Get own profile |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 10.2 Update Seeker Profile
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PUT | `/seeker/profile` | Seeker | Update own profile |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "gender": "female",
  "address": {
    "street": "456 New Street",
    "city": "Pune",
    "state": "Maharashtra",
    "pinCode": "411001"
  }
}
```

---

### 10.3 Update Location
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/seeker/location` | Seeker | Update live location |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Request Body:**
```json
{
  "coordinates": {
    "latitude": 19.0760,
    "longitude": 72.8777
  }
}
```

---

### 10.4 Get Services with Price Range
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/seeker/services` | Seeker | Get all categories with price ranges |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 10.5 Get Providers by Category
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/seeker/services/:categoryId/providers` | Seeker | Get providers for category |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 10.6 Get Provider Details
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/seeker/providers/:providerId` | Seeker | Get detailed provider profile |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

## 11. Review APIs

### 11.1 Create Review
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/reviews` | Seeker | Create review for booking |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Request Body:**
```json
{
  "bookingId": "booking-object-id",
  "rating": 5,
  "comment": "Excellent service! Very professional."
}
```

---

### 11.2 Get Provider Reviews
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/reviews/provider/:providerId` | No | Get all reviews for provider |

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Results per page

---

### 11.3 Get Review by Booking
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/reviews/booking/:bookingId` | Both | Get review for specific booking |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 11.4 Reply to Review
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PATCH | `/reviews/:id/reply` | Provider | Reply to review |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Request Body:**
```json
{
  "reply": "Thank you for your feedback!"
}
```

---

### 11.5 Set Review Reminder
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PATCH | `/reviews/reminder/:bookingId` | Seeker | Set reminder to review |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

## 12. Service Catalog APIs

### 12.1 Get All Categories
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/service-catalog/categories` | No | Get all service categories |

---

### 12.2 Get Sub-Services
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/service-catalog/categories/:categoryId/sub-services` | No | Get sub-services for category |

---

### 12.3 Get Provider Service
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/service-catalog/provider/service` | Provider | Get provider's service |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 12.4 Save Provider Service
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/service-catalog/provider/service` | Provider | Save provider's service |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 12.5 Delete Provider Service
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| DELETE | `/service-catalog/provider/service` | Provider | Delete provider's service |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

## 13. Settings APIs

### 13.1 Get Settings
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/settings` | Yes | Get platform settings |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 13.2 Update Settings
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PATCH | `/settings` | Admin | Update platform settings |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Request Body:**
```json
{
  "platformFee": 5,
  "minPayoutAmount": 500
}
```

---

## 14. Subscription APIs

### 14.1 Subscribe
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/subscriptions/subscribe` | Provider | Subscribe to a plan |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Request Body:**
```json
{
  "planId": "plan-object-id",
  "paymentDetails": {
    "transactionId": "TXN123"
  }
}
```

---

### 14.2 Get My Subscription
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/subscriptions/my-subscription` | Provider | Get current subscription |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 14.3 Cancel Subscription
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/subscriptions/cancel` | Provider | Cancel subscription |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 14.4 Get All Subscriptions
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/subscriptions/all` | Admin | Get all subscriptions |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

## 15. Support APIs

### 15.1 Create Support Request
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/support` | Provider | Create support ticket |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Request Body:**
```json
{
  "subject": "Payment issue",
  "description": "I haven't received my payout",
  "priority": "high"
}
```

---

### 15.2 Get My Support Requests
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/support/my-requests` | Provider | Get own support tickets |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 15.3 Get Support Request Details
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/support/my-requests/:id` | Provider | Get specific support ticket |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 15.4 Get All Support Requests (Admin)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/support` | Admin | Get all support requests |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 15.5 Update Support Request (Admin)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PATCH | `/support/:id` | Admin | Update support ticket status |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Request Body:**
```json
{
  "status": "resolved",
  "response": "Issue has been resolved"
}
```

---

### 15.6 Delete Support Request (Admin)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| DELETE | `/support/:id` | Admin | Delete support ticket |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 15.7 Get Support Stats (Admin)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/support/stats` | Admin | Get support statistics |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

## 16. Verification APIs

### 16.1 Upload Documents
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/verification/upload` | Provider | Upload verification documents |

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: multipart/form-data
```

**Form Data:**
- `idProof`: ID proof document (PDF/JPG)
- `addressProof`: Address proof document (PDF/JPG)
- `businessProof`: Business proof (optional)

---

### 16.2 Get Verification Status
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/verification/status` | Provider | Get verification status |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

## 17. Wallet APIs

### 17.1 Get Wallet Details
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/wallet/details` | Provider | Get wallet balance and transactions |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

---

### 17.2 Top Up Wallet
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/wallet/topup` | Provider | Add funds to wallet |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Request Body:**
```json
{
  "amount": 1000,
  "paymentDetails": {
    "transactionId": "TXN123",
    "method": "upi"
  }
}
```

---

### 17.3 Update Bank Details
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PATCH | `/wallet/bank-details` | Provider | Update bank account details |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Request Body:**
```json
{
  "bankName": "State Bank of India",
  "accountNumber": "1234567890",
  "ifscCode": "SBIN0001234",
  "accountHolder": "Provider Name"
}
```

---

### 17.4 Request Payout
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/wallet/request-payout` | Provider | Request withdrawal |

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Request Body:**
```json
{
  "amount": 5000
}
```

---

## Complete API URLs List

### Authentication
1. `POST http://localhost:5000/api/auth/login`
2. `POST http://localhost:5000/api/auth/signup`
3. `POST http://localhost:5000/api/auth/forgot-password`
4. `POST http://localhost:5000/api/auth/reset-password`
5. `POST http://localhost:5000/api/auth/refresh-token`
6. `POST http://localhost:5000/api/auth/logout`
7. `GET http://localhost:5000/api/auth/profile`
8. `PUT http://localhost:5000/api/auth/profile`
9. `PUT http://localhost:5000/api/auth/change-password`
10. `GET http://localhost:5000/api/auth/admin/users`
11. `GET http://localhost:5000/api/health`

### Admin
12. `GET http://localhost:5000/api/admin/dashboard/stats`
13. `GET http://localhost:5000/api/admin/users`
14. `GET http://localhost:5000/api/admin/providers`
15. `GET http://localhost:5000/api/admin/seekers`
16. `PATCH http://localhost:5000/api/admin/users/:id/status`
17. `GET http://localhost:5000/api/admin/bookings`
18. `GET http://localhost:5000/api/admin/revenue`
19. `GET http://localhost:5000/api/admin/verifications`
20. `PATCH http://localhost:5000/api/admin/verifications/:id`

### Booking
21. `POST http://localhost:5000/api/bookings`
22. `GET http://localhost:5000/api/bookings/seeker`
23. `GET http://localhost:5000/api/bookings/provider`
24. `GET http://localhost:5000/api/bookings/:id`
25. `PATCH http://localhost:5000/api/bookings/:id/accept`
26. `PATCH http://localhost:5000/api/bookings/:id/reject`
27. `PATCH http://localhost:5000/api/bookings/:id/cancel`
28. `PATCH http://localhost:5000/api/bookings/:id/complete`

### Chat
29. `GET http://localhost:5000/api/chat/conversations`
30. `GET http://localhost:5000/api/chat/:bookingId`
31. `POST http://localhost:5000/api/chat/send`

### Contact
32. `POST http://localhost:5000/api/contact`
33. `GET http://localhost:5000/api/contact/stats`
34. `GET http://localhost:5000/api/contact`
35. `PATCH http://localhost:5000/api/contact/:id`
36. `DELETE http://localhost:5000/api/contact/:id`

### Favourites
37. `GET http://localhost:5000/api/favorites`
38. `POST http://localhost:5000/api/favorites`
39. `DELETE http://localhost:5000/api/favorites/:providerId`
40. `GET http://localhost:5000/api/favorites/check/:providerId`
41. `POST http://localhost:5000/api/favorites/check-bulk`

### Invoice
42. `POST http://localhost:5000/api/invoices/generate`
43. `GET http://localhost:5000/api/invoices/provider`
44. `GET http://localhost:5000/api/invoices/seeker`
45. `POST http://localhost:5000/api/invoices/complete-payment/:invoiceId`

### Notification
46. `GET http://localhost:5000/api/notifications`
47. `GET http://localhost:5000/api/notifications/unread-count`
48. `GET http://localhost:5000/api/notifications/category-counts`
49. `PATCH http://localhost:5000/api/notifications/:id/read`
50. `PATCH http://localhost:5000/api/notifications/read-category/:category`
51. `PATCH http://localhost:5000/api/notifications/read-all`
52. `DELETE http://localhost:5000/api/notifications/:id`

### Provider Profile
53. `GET http://localhost:5000/api/profile/provider`
54. `PUT http://localhost:5000/api/profile/provider`
55. `PUT http://localhost:5000/api/profile/provider/services`
56. `POST http://localhost:5000/api/profile/provider/images`
57. `DELETE http://localhost:5000/api/profile/provider/images/:imageIndex`
58. `GET http://localhost:5000/api/profile/nearby`
59. `GET http://localhost:5000/api/profile/dashboard/stats`
60. `GET http://localhost:5000/api/profile/dashboard/recent-services`

### Seeker Profile
61. `GET http://localhost:5000/api/seeker/profile`
62. `PUT http://localhost:5000/api/seeker/profile`
63. `POST http://localhost:5000/api/seeker/location`
64. `GET http://localhost:5000/api/seeker/services`
65. `GET http://localhost:5000/api/seeker/services/:categoryId/providers`
66. `GET http://localhost:5000/api/seeker/providers/:providerId`

### Reviews
67. `POST http://localhost:5000/api/reviews`
68. `GET http://localhost:5000/api/reviews/provider/:providerId`
69. `GET http://localhost:5000/api/reviews/booking/:bookingId`
70. `PATCH http://localhost:5000/api/reviews/:id/reply`
71. `PATCH http://localhost:5000/api/reviews/reminder/:bookingId`

### Service Catalog
72. `GET http://localhost:5000/api/service-catalog/categories`
73. `GET http://localhost:5000/api/service-catalog/categories/:categoryId/sub-services`
74. `GET http://localhost:5000/api/service-catalog/provider/service`
75. `POST http://localhost:5000/api/service-catalog/provider/service`
76. `DELETE http://localhost:5000/api/service-catalog/provider/service`

### Settings
77. `GET http://localhost:5000/api/settings`
78. `PATCH http://localhost:5000/api/settings`

### Subscription
79. `POST http://localhost:5000/api/subscriptions/subscribe`
80. `GET http://localhost:5000/api/subscriptions/my-subscription`
81. `POST http://localhost:5000/api/subscriptions/cancel`
82. `GET http://localhost:5000/api/subscriptions/all`

### Support
83. `POST http://localhost:5000/api/support`
84. `GET http://localhost:5000/api/support/my-requests`
85. `GET http://localhost:5000/api/support/my-requests/:id`
86. `GET http://localhost:5000/api/support`
87. `PATCH http://localhost:5000/api/support/:id`
88. `DELETE http://localhost:5000/api/support/:id`
89. `GET http://localhost:5000/api/support/stats`

### Verification
90. `POST http://localhost:5000/api/verification/upload`
91. `GET http://localhost:5000/api/verification/status`

### Wallet
92. `GET http://localhost:5000/api/wallet/details`
93. `POST http://localhost:5000/api/wallet/topup`
94. `PATCH http://localhost:5000/api/wallet/bank-details`
95. `POST http://localhost:5000/api/wallet/request-payout`

---

## Testing Checklist

### Pre-Testing Setup
- [ ] Import collection into Postman
- [ ] Set up environment variables
- [ ] Create test users (admin, provider, seeker)
- [ ] Note down access tokens after login

### Authentication Testing
- [ ] Test login with valid credentials
- [ ] Test login with invalid password
- [ ] Test login with non-existent user
- [ ] Test signup for seeker
- [ ] Test signup for provider
- [ ] Test duplicate email/phone registration
- [ ] Test forgot password flow
- [ ] Test token refresh
- [ ] Test protected endpoints without token
- [ ] Test logout

### Booking Testing
- [ ] Test create booking
- [ ] Test create booking with past date
- [ ] Test duplicate booking
- [ ] Test accept/reject booking
- [ ] Test cancel booking
- [ ] Test complete booking
- [ ] Test get bookings with filters

### Role-Based Access Testing
- [ ] Test seeker accessing provider routes
- [ ] Test provider accessing seeker routes
- [ ] Test non-admin accessing admin routes
- [ ] Test unauthorized user accessing others' data

---

*Document generated for ConnectVista Postman API Testing*
