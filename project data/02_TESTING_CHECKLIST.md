# 🧪 ConnectVista - Complete Testing Checklist

## 📋 Overview
This document provides a comprehensive testing checklist for all features in the ConnectVista platform. Use this to ensure all functionality works as expected before deployment.

---

## 🔐 Authentication & Authorization Testing

### ✅ User Registration
- [ ] **Seeker Registration**
  - [ ] Can register with valid email, password, name, phone
  - [ ] Password is hashed (not visible in database)
  - [ ] Duplicate email shows error
  - [ ] Invalid email format shows error
  - [ ] Weak password shows error
  - [ ] Success toast displayed
  - [ ] Redirects to login page

- [ ] **Provider Registration**
  - [ ] Can register as provider
  - [ ] Provider profile creation optional
  - [ ] Business details can be added later
  - [ ] Success notification shown

### ✅ Login
- [ ] **Seeker Login**
  - [ ] Can login with correct credentials
  - [ ] JWT token stored in localStorage
  - [ ] Redirects to seeker dashboard/explore
  - [ ] Wrong password shows error
  - [ ] Non-existent email shows error
  - [ ] Success toast displayed

- [ ] **Provider Login**
  - [ ] Can login with provider credentials
  - [ ] Redirects to provider dashboard
  - [ ] Provider-specific features visible

- [ ] **Admin Login**
  - [ ] Admin can access admin panel
  - [ ] Admin routes protected

### ✅ Logout
- [ ] Logout button works
- [ ] Token removed from localStorage
- [ ] Redirects to login page
- [ ] Cannot access protected routes after logout
- [ ] Success toast displayed

### ✅ Forgot Password
- [ ] Email input validation works
- [ ] Reset link sent to valid email (check console/logs)
- [ ] Can reset password with valid token
- [ ] Invalid/expired token shows error
- [ ] Password successfully changed
- [ ] Can login with new password

### ✅ Session Management
- [ ] Token expires after set time (7 days default)
- [ ] Auto-logout on token expiry
- [ ] Refresh token works (if implemented)

---

## 👤 Profile Management Testing

### ✅ Seeker Profile
- [ ] **View Profile**
  - [ ] Can view profile at `/user/profile`
  - [ ] All tabs visible (Overview, Favorites, Settings)
  - [ ] User details displayed correctly
  - [ ] Profile image/avatar shows

- [ ] **Edit Profile**
  - [ ] Can update name
  - [ ] Can update phone number
  - [ ] Can update address
  - [ ] Can upload profile image
  - [ ] Changes saved successfully
  - [ ] Success toast displayed

- [ ] **Location Settings**
  - [ ] Can set location coordinates
  - [ ] Geolocation permission requested
  - [ ] Manual address entry works
  - [ ] Location saved to database

### ✅ Provider Profile
- [ ] **Create Profile**
  - [ ] Can create provider profile
  - [ ] Business name required
  - [ ] Service category selection works
  - [ ] Can add sub-services
  - [ ] Can set location
  - [ ] Can set business hours
  - [ ] Profile created successfully

- [ ] **Edit Profile**
  - [ ] Can update business details
  - [ ] Can add/remove sub-services
  - [ ] Can update pricing
  - [ ] Can add portfolio images
  - [ ] Can update business hours
  - [ ] Changes saved successfully

- [ ] **Profile Visibility**
  - [ ] Profile visible to seekers
  - [ ] Shows in search results
  - [ ] All details displayed correctly

---

## 🔍 Service Discovery & Search Testing

### ✅ Browse Services (Seeker)
- [ ] **Service Catalog**
  - [ ] All service categories displayed
  - [ ] Category cards show provider count
  - [ ] Price ranges displayed
  - [ ] Can click category to view providers

- [ ] **Search Functionality**
  - [ ] Search bar works
  - [ ] Can search by service name
  - [ ] Can search by location
  - [ ] Search results accurate
  - [ ] No results message displays

- [ ] **Filters**
  - [ ] Can filter by category
  - [ ] Can filter by price range
  - [ ] Can filter by rating
  - [ ] Can filter by distance
  - [ ] Multiple filters work together

- [ ] **Sorting**
  - [ ] Sort by distance works
  - [ ] Sort by rating works
  - [ ] Sort by price (low to high)
  - [ ] Sort by price (high to low)
  - [ ] Sort by experience works

### ✅ Provider Listing
- [ ] **Provider Cards**
  - [ ] Business name displayed
  - [ ] Service category shown
  - [ ] Rating and reviews count visible
  - [ ] Distance from user shown
  - [ ] Price range displayed
  - [ ] Profile image/avatar shows

- [ ] **View Modes**
  - [ ] Grid view works
  - [ ] List view works
  - [ ] Map view works (if implemented)
  - [ ] Switch between views smooth

### ✅ Provider Details
- [ ] **Profile Modal/Page**
  - [ ] Full business details shown
  - [ ] Sub-services listed
  - [ ] Portfolio images displayed
  - [ ] Business hours shown
  - [ ] Contact information visible
  - [ ] Reviews section works
  - [ ] Can scroll through reviews

- [ ] **Book Service Button**
  - [ ] Opens booking modal
  - [ ] Pre-fills provider info
  - [ ] Works from provider card
  - [ ] Works from profile view

---

## ❤️ Favorites Feature Testing

### ✅ Add to Favorites
- [ ] **From Explore Page**
  - [ ] Heart icon visible on provider cards
  - [ ] Click heart adds to favorites
  - [ ] Heart fills with color
  - [ ] Toast: "Added to favorites"
  - [ ] Saved to database
  - [ ] Persists after refresh

- [ ] **From Provider Profile**
  - [ ] Heart icon in profile modal
  - [ ] Click adds to favorites
  - [ ] Visual feedback immediate
  - [ ] Success notification shown

### ✅ Remove from Favorites
- [ ] **From Explore Page**
  - [ ] Click filled heart removes favorite
  - [ ] Heart becomes outline
  - [ ] Toast: "Removed from favorites"
  - [ ] Removed from database

- [ ] **From Profile Page**
  - [ ] Trash icon removes favorite
  - [ ] Confirmation not required (instant)
  - [ ] Card removed from list
  - [ ] Success notification shown

### ✅ View Favorites
- [ ] **Favorites Tab**
  - [ ] Navigate to `/user/profile`
  - [ ] Click "Favorites" tab
  - [ ] All favorite providers listed
  - [ ] Provider cards display correctly
  - [ ] Loading state shows
  - [ ] Empty state if no favorites

- [ ] **Favorites List**
  - [ ] Business name visible
  - [ ] Rating and reviews shown
  - [ ] Location displayed
  - [ ] Sub-services listed
  - [ ] "View Profile" button works
  - [ ] "Remove" button works

### ✅ Favorites Sync
- [ ] Add favorite in Explore → appears in Profile
- [ ] Remove from Profile → heart empty in Explore
- [ ] Favorites persist across sessions
- [ ] Favorites sync across devices (same account)

---

## 📅 Booking Management Testing

### ✅ Create Booking (Seeker)
- [ ] **Booking Form**
  - [ ] Opens from provider card
  - [ ] Provider pre-selected
  - [ ] Date picker works
  - [ ] Time picker works
  - [ ] Can select sub-service
  - [ ] Can add notes
  - [ ] Address auto-filled from profile
  - [ ] Can edit address
  - [ ] Contact phone editable

- [ ] **Validation**
  - [ ] Past dates disabled
  - [ ] Required fields enforced
  - [ ] Phone number validation
  - [ ] Success toast on submission

- [ ] **Booking Creation**
  - [ ] Booking saved to database
  - [ ] Status: "pending"
  - [ ] Provider receives notification
  - [ ] Seeker sees booking in list
  - [ ] Redirects to bookings page

### ✅ View Bookings (Seeker)
- [ ] **Bookings List**
  - [ ] Navigate to bookings page
  - [ ] All bookings displayed
  - [ ] Can filter by status (all, pending, accepted, completed, cancelled)
  - [ ] Booking cards show details
  - [ ] Date and time visible
  - [ ] Provider name shown
  - [ ] Status badge displayed

- [ ] **Booking Details**
  - [ ] Can click to view full details
  - [ ] All info displayed correctly
  - [ ] Service address shown
  - [ ] Additional notes visible
  - [ ] Price shown (if available)

### ✅ Cancel Booking (Seeker)
- [ ] Can cancel pending booking
- [ ] Can add cancellation reason
- [ ] Confirmation modal shows
- [ ] Status changes to "cancelled"
- [ ] Provider notified
- [ ] Success toast displayed

### ✅ Booking Management (Provider)
- [ ] **View Booking Requests**
  - [ ] Navigate to bookings page
  - [ ] Pending requests visible
  - [ ] Request cards show details
  - [ ] Seeker info displayed
  - [ ] Service details shown
  - [ ] Date/time visible

- [ ] **Accept Booking**
  - [ ] Can click "Accept" button
  - [ ] Confirmation modal (optional)
  - [ ] Status changes to "accepted"
  - [ ] Seeker notified
  - [ ] Success toast displayed

- [ ] **Reject Booking**
  - [ ] Can click "Reject" button
  - [ ] Can add rejection reason
  - [ ] Status changes to "rejected"
  - [ ] Seeker notified
  - [ ] Reason visible to seeker

- [ ] **Complete Booking**
  - [ ] Can mark as completed
  - [ ] Can add provider notes
  - [ ] Status changes to "completed"
  - [ ] Payment processed (if applicable)
  - [ ] Review prompt sent to seeker

---

## ⭐ Review & Rating Testing

### ✅ Submit Review (Seeker)
- [ ] **Review Form**
  - [ ] Available after booking completion
  - [ ] Rating selector (1-5 stars)
  - [ ] Text area for review
  - [ ] Can upload images (optional)
  - [ ] Submit button enabled

- [ ] **Validation**
  - [ ] Rating required
  - [ ] Review text optional
  - [ ] Min/max character limits
  - [ ] Success toast on submission

- [ ] **Review Creation**
  - [ ] Review saved to database
  - [ ] Linked to booking
  - [ ] Provider rating updated
  - [ ] Review visible on provider profile
  - [ ] Cannot review twice

### ✅ View Reviews
- [ ] **Provider Profile**
  - [ ] All reviews displayed
  - [ ] Newest first
  - [ ] Pagination works
  - [ ] Rating stars visible
  - [ ] Review text shown
  - [ ] Reviewer name shown
  - [ ] Date posted visible

- [ ] **Average Rating**
  - [ ] Calculated correctly
  - [ ] Updates when new review added
  - [ ] Displayed on provider card
  - [ ] Shown on provider profile

### ✅ Reply to Review (Provider)
- [ ] Can click "Reply" button
- [ ] Text area appears
- [ ] Can submit reply
- [ ] Reply saved
- [ ] Reply visible under review
- [ ] Seeker notified

---

## 💬 Chat & Messaging Testing

### ✅ Start Conversation
- [ ] **From Provider Profile**
  - [ ] "Message" button visible
  - [ ] Clicking opens chat window
  - [ ] Provider name shown
  - [ ] Chat history loaded (if exists)

### ✅ Send Messages
- [ ] **Text Messages**
  - [ ] Can type in input field
  - [ ] Send button enabled when text entered
  - [ ] Press Enter to send
  - [ ] Message sent successfully
  - [ ] Message appears in chat
  - [ ] Timestamp shown

- [ ] **Real-time Delivery**
  - [ ] Recipient receives message instantly (Socket.IO)
  - [ ] No page refresh needed
  - [ ] Notification sound/badge (optional)

### ✅ Receive Messages
- [ ] New messages appear automatically
- [ ] Sender name/avatar shown
- [ ] Message content displayed
- [ ] Timestamp visible
- [ ] Unread badge on chat icon

### ✅ Chat UI
- [ ] **Conversations List**
  - [ ] All conversations listed
  - [ ] Recent conversations first
  - [ ] Last message preview shown
  - [ ] Unread count badge
  - [ ] Can click to open chat

- [ ] **Chat Window**
  - [ ] Messages in chronological order
  - [ ] Own messages aligned right
  - [ ] Other messages aligned left
  - [ ] Scroll to bottom on new message
  - [ ] Can scroll up for history

### ✅ Mark as Read
- [ ] Messages marked read when viewed
- [ ] Unread count updates
- [ ] Read receipt shown (optional)

---

## 🔔 Notification Testing

### ✅ Notification Types
- [ ] **Booking Notifications**
  - [ ] New booking request (provider)
  - [ ] Booking accepted (seeker)
  - [ ] Booking rejected (seeker)
  - [ ] Booking completed (seeker)
  - [ ] Booking cancelled

- [ ] **Message Notifications**
  - [ ] New message received
  - [ ] Unread count updated

- [ ] **System Notifications**
  - [ ] Subscription expiry warning
  - [ ] Profile update confirmations
  - [ ] Verification status updates

### ✅ Notification UI
- [ ] Bell icon in header
- [ ] Unread count badge visible
- [ ] Click opens notification dropdown
- [ ] Notifications listed newest first
- [ ] Can click notification to view details
- [ ] Can mark as read
- [ ] Can mark all as read
- [ ] Can delete notification

### ✅ Real-time Notifications
- [ ] Notifications appear without refresh
- [ ] Socket.IO connection works
- [ ] Notification sound (optional)
- [ ] Badge updates in real-time

---

## 💰 Wallet & Payment Testing

### ✅ View Wallet (Provider)
- [ ] Navigate to wallet page
- [ ] Current balance displayed
- [ ] Pending balance shown
- [ ] Total earnings visible
- [ ] Transaction history listed

### ✅ Add Money (Mock)
- [ ] Can click "Add Money"
- [ ] Amount input works
- [ ] Payment gateway integration (if implemented)
- [ ] Balance updates after payment
- [ ] Transaction recorded
- [ ] Success notification

### ✅ Withdraw Money
- [ ] Can request withdrawal
- [ ] Minimum payout enforced
- [ ] Withdrawal form works
- [ ] Bank details required
- [ ] Request submitted
- [ ] Status: "pending"
- [ ] Balance deducted from available

### ✅ Transaction History
- [ ] All transactions listed
- [ ] Type visible (credit/debit)
- [ ] Amount shown
- [ ] Description provided
- [ ] Date/time visible
- [ ] Related booking linked
- [ ] Can filter by type

---

## 📊 Subscription Testing (Provider)

### ✅ View Plans
- [ ] Navigate to subscriptions page
- [ ] All plans displayed
- [ ] Plan features listed
- [ ] Pricing shown
- [ ] Can select plan

### ✅ Subscribe
- [ ] Can click "Subscribe" button
- [ ] Payment modal opens
- [ ] Payment processed (mock)
- [ ] Subscription activated
- [ ] Expiry date set
- [ ] Success notification

### ✅ Current Subscription
- [ ] Can view current plan
- [ ] Expiry date shown
- [ ] Features listed
- [ ] Auto-renew toggle visible
- [ ] Can cancel subscription

### ✅ Subscription Expiry
- [ ] Warning notification before expiry
- [ ] Features restricted after expiry
- [ ] Can renew from notification
- [ ] Can upgrade/downgrade

---

## 🛡️ Admin Panel Testing

### ✅ Admin Dashboard
- [ ] Login as admin
- [ ] Dashboard accessible at admin URL
- [ ] Stats cards displayed:
  - [ ] Total users
  - [ ] Total bookings
  - [ ] Total revenue
  - [ ] Active providers

### ✅ User Management
- [ ] **View Users**
  - [ ] All users listed
  - [ ] Can filter by role (seeker/provider/admin)
  - [ ] Search works
  - [ ] Pagination works

- [ ] **Verify Users**
  - [ ] Can verify provider accounts
  - [ ] Verification badge added
  - [ ] Provider notified

- [ ] **Delete Users**
  - [ ] Can delete user accounts
  - [ ] Confirmation modal required
  - [ ] User and related data removed
  - [ ] Success notification

### ✅ Booking Management
- [ ] View all bookings
- [ ] Can filter by status
- [ ] Can search by user/provider
- [ ] Booking details viewable
- [ ] Can cancel bookings (admin override)

### ✅ Platform Settings
- [ ] **Global Settings**
  - [ ] Can view settings page
  - [ ] Platform fee % editable
  - [ ] Minimum payout editable
  - [ ] Save button works
  - [ ] Changes applied immediately
  - [ ] Success notification

- [ ] **Subscription Plans**
  - [ ] Can view all plans
  - [ ] Can edit plan details
  - [ ] Can edit pricing
  - [ ] Changes saved successfully

### ✅ Revenue Tracking
- [ ] Total revenue displayed
- [ ] Platform fees tracked
- [ ] Provider earnings tracked
- [ ] Charts/graphs work (if implemented)
- [ ] Can filter by date range

---

## 🌍 Location & Map Testing

### ✅ Geolocation
- [ ] Browser asks for location permission
- [ ] Can allow location access
- [ ] User coordinates saved
- [ ] Can deny and use default location
- [ ] Manual location entry works

### ✅ Distance Calculation
- [ ] Distance shown from user to provider
- [ ] Calculation accurate
- [ ] Units correct (km/miles)
- [ ] Updates when location changes

### ✅ Map View (if implemented)
- [ ] Map loads correctly
- [ ] User location marker shown
- [ ] Provider markers displayed
- [ ] Can click marker for details
- [ ] Zoom in/out works
- [ ] Pan/drag works

### ✅ Search by Location
- [ ] Can search by city
- [ ] Can search by pincode
- [ ] Search results accurate
- [ ] Providers filtered by radius

---

## 📱 Responsive Design Testing

### ✅ Mobile (< 768px)
- [ ] Layout adapts to mobile
- [ ] Navigation menu accessible
- [ ] Buttons sized appropriately
- [ ] Forms easy to fill
- [ ] Cards stack vertically
- [ ] Text readable
- [ ] No horizontal scroll

### ✅ Tablet (768px - 1024px)
- [ ] Layout uses available space
- [ ] Grid shows 2 columns
- [ ] Navigation optimized
- [ ] Touch targets large enough

### ✅ Desktop (> 1024px)
- [ ] Full layout displayed
- [ ] Sidebar navigation works
- [ ] Multi-column layouts
- [ ] Hover effects work
- [ ] All features accessible

---

## 🔒 Security Testing

### ✅ Authentication Security
- [ ] Passwords hashed with bcrypt
- [ ] JWT tokens secure
- [ ] Token expiry enforced
- [ ] Protected routes check auth
- [ ] Cannot access without login

### ✅ Authorization
- [ ] Seekers cannot access provider routes
- [ ] Providers cannot access seeker-only routes
- [ ] Admin routes restricted to admin
- [ ] Role-based access control works

### ✅ Input Validation
- [ ] SQL injection prevented (using Mongoose)
- [ ] XSS attacks prevented
- [ ] CSRF protection (if implemented)
- [ ] File upload validation
- [ ] Max file size enforced

### ✅ API Security
- [ ] Rate limiting works
- [ ] CORS configured correctly
- [ ] Helmet.js security headers
- [ ] API keys not exposed in frontend
- [ ] Sensitive data not logged

---

## ⚡ Performance Testing

### ✅ Load Time
- [ ] Home page loads < 3 seconds
- [ ] API responses < 1 second
- [ ] Images optimized
- [ ] Lazy loading implemented (if applicable)

### ✅ Database Queries
- [ ] Queries optimized with indexes
- [ ] Pagination implemented
- [ ] Large datasets handled well
- [ ] No N+1 query problems

### ✅ Frontend Performance
- [ ] Minimal re-renders
- [ ] Debounced search inputs
- [ ] Throttled API calls
- [ ] Code splitting (if applicable)

---

## 🐛 Error Handling Testing

### ✅ Network Errors
- [ ] API connection lost → shows error
- [ ] Retry mechanism works
- [ ] Graceful degradation
- [ ] Error messages user-friendly

### ✅ Form Errors
- [ ] Validation errors shown
- [ ] Error messages clear
- [ ] Fields highlighted
- [ ] Can correct and resubmit

### ✅ 404 Errors
- [ ] Invalid routes show 404 page
- [ ] Custom 404 page designed (if implemented)
- [ ] "Go Home" button works

### ✅ 500 Errors
- [ ] Server errors caught
- [ ] Error logged to console
- [ ] User-friendly message shown
- [ ] Can retry action

---

## ✅ Final Checklist

### Pre-Deployment
- [ ] All critical features tested
- [ ] No console errors in production build
- [ ] Environment variables configured
- [ ] Database indexes created
- [ ] API documentation updated
- [ ] User guide created (optional)

### Post-Deployment
- [ ] Production URLs working
- [ ] Database connected
- [ ] Email notifications working (if enabled)
- [ ] Real-time features working
- [ ] SSL certificate installed
- [ ] Monitoring setup (optional)

---

## 📝 Test Results Log

| Feature | Status | Tested By | Date | Notes |
|---------|--------|-----------|------|-------|
| Authentication | ⏳ | - | - | - |
| Profile Management | ⏳ | - | - | - |
| Service Discovery | ⏳ | - | - | - |
| Favorites | ⏳ | - | - | - |
| Bookings | ⏳ | - | - | - |
| Reviews | ⏳ | - | - | - |
| Chat | ⏳ | - | - | - |
| Notifications | ⏳ | - | - | - |
| Wallet | ⏳ | - | - | - |
| Subscriptions | ⏳ | - | - | - |
| Admin Panel | ⏳ | - | - | - |
| Responsive Design | ⏳ | - | - | - |
| Security | ⏳ | - | - | - |
| Performance | ⏳ | - | - | - |

**Legend**: ✅ Passed | ❌ Failed | ⏳ Pending | ⚠️ Issues Found

---

**Last Updated**: March 2026
**Version**: 1.0.0
