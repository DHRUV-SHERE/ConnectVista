# 🚀 ConnectVista Project Roadmap & Ideas

This file serves as a reference for remaining functionalities and future improvements.

## ✅ Recently Completed
- [x] **EmailJS Integration:** Library installed and service configured.
- [x] **Forgot Password Flow:**
    - Backend: Added `resetPasswordToken` to User model.
    - Backend: Created `forgotPassword` and `resetPassword` controllers.
    - Frontend: Created `ForgotPassword.jsx` and `ResetPassword.jsx` pages.
    - Frontend: Linked "Forgot Password" from Login page.
    - Email: Integrated EmailJS to send the reset link.

---

## 🛠️ High Priority: Communication & Notifications
- [ ] **New Booking Email (EmailJS):**
    - **Idea:** Automatically email the **Provider** when a Seeker creates a new booking.
    - **Template Needed:** Provider Name, Seeker Name, Service Type, Date/Time, and "View Booking" link.
- [ ] **Booking Status Updates (EmailJS):**
    - **Idea:** Email the **Seeker** when a Provider accepts or rejects their booking.
- [ ] **Real-time Chat:**
    - Implementation of a persistent `Message` model and Chat UI.
    - Socket.io is already connected, needs "Join Room" logic for specific bookings.

## 💰 Financials & Payments
- [ ] **Real Payment Gateway:**
    - Replace dummy logic in `walletController.js` and `subscriptionController.js` with **Stripe** or **Razorpay**.
- [ ] **Subscription Expiry:**
    - Background job (cron) to check for expired plans and restrict provider access.
- [ ] **PDF Invoices:**
    - Allow seekers to download professional invoices after a completed service.

## 🔑 Security & User Experience
- [ ] **Email Verification:**
    - Force users to verify their email before they can book or list services.
- [ ] **Review Submission UI:**
    - Create a popup/modal for Seekers to rate providers (1-5 stars + comment).
- [ ] **Favorites Persistence:**
    - Save "Favorite Providers" to the database so they appear on any device.
- [ ] **Advanced Search Filters:**
    - Filter by Rating, Price Range, and specific sub-services.

## 🛡️ Admin Panel Enhancements
- [ ] **Dynamic Category Management:**
    - UI for Admin to add/edit/delete categories (moving away from static `services.json`).
- [ ] **Platform Statistics:**
    - More detailed charts for monthly revenue and user growth.
- [ ] **Global Configuration:**
    - Admin setting for "Platform Fee %" and "Minimum Payout Amount".

## 🌐 General
- [ ] **SEO & Metadata:** For better search engine visibility.
- [ ] **Legal Pages:** Terms of Service and Privacy Policy.
- [ ] **Error Handling:** Custom 404 and 500 error pages.
