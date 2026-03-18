# 🚀 ConnectVista Project Roadmap & Ideas

This file serves as a reference for remaining functionalities and future improvements.

## ✅ Recently Completed
- [x] **EmailJS Integration:** Library installed and service configured.
- [x] **Forgot Password Flow:** Full implementation with backend tokens and frontend pages.
- [x] **Real-time Chat:** Persistent `Message` model, Socket.io integration, and responsive Chat UI.
- [x] **Global Admin Settings:** Configurable "Platform Fee %" and "Minimum Payout Amount" managed via Admin Panel.
- [x] **Custom UI Dialogs:** Replaced all browser native alerts/confirms with branded custom modals.
- [x] **Branding Sync:** Permanently set to Light Mode with modern Sky Blue theme.

---

## 🛠️ High Priority: Communication & Notifications
- [ ] **Advanced Email Notifications (EmailJS):**
    - **Note:** Logic implemented in `emailService.js` but disabled due to Free Plan (2 template limit).
    - **Future:** Upgrade plan to enable "New Booking" and "Status Update" templates.
- [ ] **PDF Invoices:**
    - Allow seekers to download professional invoices after a completed service.

## 💰 Financials & Payments
- [ ] **Real Payment Gateway:**
    - Replace dummy logic in `walletController.js` and `subscriptionController.js` with **Stripe** or **Razorpay**.
- [ ] **Subscription Expiry:**
    - Background job (cron) to check for expired plans and restrict provider access.

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

## 🌐 General
- [ ] **SEO & Metadata:** For better search engine visibility.
- [ ] **Legal Pages:** Terms of Service and Privacy Policy.
- [ ] **Error Handling:** Custom 404 and 500 error pages.
