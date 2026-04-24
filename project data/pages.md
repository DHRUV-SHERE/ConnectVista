# ConnectVista — All Pages Documentation

---

## CONNECTVISTA_FRONTEND

---

### COMMON PAGES (Accessible by all users)

---

#### 1. CommonHome.jsx
**Route:** `/`
**Why this page exists:** This is the public landing page — the first thing any visitor sees. It sells the platform concept and drives signups.
**What it does:**
- Hero section with CTA buttons (Find Services / Become a Provider)
- Problem section — explains pain points for both seekers and providers
- Solution section — shows how ConnectVista solves those problems
- How It Works — 4-step process (Sign Up → Verify → Search/Offer → Connect)
- Features section — Smart Matching, Location-based search, Secure Payments, Reviews, 24/7 Support
- Testimonials from community members
- Final CTA section pushing users to sign up or explore services
- Platform stats (10K+ providers, 50K+ customers, 98% satisfaction)

---

#### 2. CommonAbout.jsx
**Route:** `/about`
**Why this page exists:** Builds trust and credibility by explaining who built ConnectVista, why it was built, and what values it stands for.
**What it does:**
- Hero section with platform tagline
- Platform stats (Active Users, Service Providers, Cities Served, Avg Rating)
- Our Story — origin and growth narrative
- Mission & Vision cards
- Core Values — Community First, Empowerment, Quality Service, Transparency
- Community Voices — testimonials with location
- Developer Journey section — about Dhruv Shere (B.Tech IT, MERN stack)
- CTA to join the community

---

#### 3. CommonContact.jsx
**Route:** `/contact`
**Why this page exists:** Provides a direct communication channel between users and the ConnectVista team for support, queries, or feedback.
**What it does:**
- Hero section with contact intro
- Contact method cards — Call Us, Email Us, Community Forum
- Contact Details sidebar — address, phone, email, business hours
- Quick Response card (1-hour response promise)
- Contact form — name, email, phone, subject, message (submits via contactService API)
- Google Maps embed showing Naroda, Ahmedabad location
- Footer CTA with FAQ and Contact Support buttons

---

#### 4. Login.jsx
**Route:** `/login`
**Why this page exists:** Unified login entry point for all three roles — Service Seeker, Service Provider, and Admin. Redirects each role to their respective dashboard after login.
**What it does:**
- Split layout — left side has illustration + welcome text, right side has the form
- Email + password fields with show/hide password toggle
- Remember Me checkbox + Forgot Password link
- Role-based redirect after login: seeker → `/user/home`, provider → `/service-provider/dashboard` (or `/service-provider/verify` if not verified), admin → `/admin/dashboard`
- Social login buttons (Google, Phone — UI only)
- Link to signup page

---

#### 5. SignupSelector.jsx
**Route:** `/signup`
**Why this page exists:** Acts as a role selection gateway before signup. Users choose whether they want to join as a Service Seeker or Service Provider, then get routed to the correct signup form.
**What it does:**
- Split layout — left side illustration, right side role selection
- Two clickable cards: Service Seeker (→ `/user/signup`) and Service Provider (→ `/service-provider/signup`)
- Back to login link
- Back to home link

---

#### 6. ForgotPassword.jsx
**Route:** `/forgot-password`
**Why this page exists:** Allows users who forgot their password to request a reset link via email.
**What it does:**
- Email input form
- Submits reset request to backend
- Shows confirmation message after submission

---

#### 7. ResetPassword.jsx
**Route:** `/reset-password`
**Why this page exists:** Allows users to set a new password after clicking the reset link from their email.
**What it does:**
- New password + confirm password fields
- Token-based password reset via API
- Redirects to login on success

---

#### 8. Chat.jsx
**Route:** `/user/chat/:bookingId` or `/service-provider/chat/:bookingId`
**Why this page exists:** Enables real-time messaging between a Service Seeker and Service Provider for an active booking. Reduces the need for external communication.
**What it does:**
- Split layout — left sidebar shows all conversations, right panel shows active chat
- Conversations list with search, last message preview, and timestamps
- Real-time messaging via Socket.IO (subscribe to `chat:message` events)
- Message bubbles — own messages on right (accent color), other's on left
- Send message form with paperclip (attachment placeholder) and send button
- Auto-scroll to latest message
- Shows booking ID reference in chat header
- Mobile responsive — sidebar hides when chat is open

---

#### 9. Error.jsx
**Route:** `*` (404)
**Why this page exists:** Handles unknown routes gracefully instead of showing a blank page.
**What it does:** Shows a 404 not found message with a link back to home.

---

#### 10. Error500.jsx / Error503.jsx
**Route:** Shown on server errors
**Why these pages exist:** Handles server-side errors (500 Internal Server Error, 503 Service Unavailable) with user-friendly messages.

---

#### 11. Unauthorized.jsx
**Route:** `/unauthorized`
**Why this page exists:** Shown when a user tries to access a page they don't have permission for (e.g., a seeker trying to access provider routes).
**What it does:** Displays an access denied message with a redirect to the appropriate home page.

---

#### 12. PrivacyPolicy.jsx
**Route:** `/privacy-policy`
**Why this page exists:** Legal requirement — informs users how their data is collected, stored, and used.

---

#### 13. TermsOfService.jsx
**Route:** `/terms-of-service`
**Why this page exists:** Legal requirement — outlines the rules and conditions users agree to when using the platform.

---

#### 14. CookiePolicy.jsx
**Route:** `/cookie-policy`
**Why this page exists:** Legal requirement — explains how cookies are used on the platform.

---

#### 15. RefundPolicy.jsx
**Route:** `/refund-policy`
**Why this page exists:** Informs users about the refund process for paid services or subscriptions.

---

### USER (SERVICE SEEKER) PAGES

---

#### 16. UserSignup.jsx
**Route:** `/user/signup`
**Why this page exists:** Onboards new Service Seekers with a structured 3-step registration process.
**What it does:**
- Step 1 — Personal Info: name, email, phone
- Step 2 — Account Setup: password, confirm password, gender
- Step 3 — Location: address, city, state, PIN code
- Step indicator with progress tracking
- Per-step validation before advancing
- On success → redirects to `/user/home`
- Left side illustration + branding panel

---

#### 17. UserHome.jsx
**Route:** `/user/home`
**Why this page exists:** The authenticated home page for seekers after login — a personalized entry point into the platform.
**What it does:**
- Welcome message and quick navigation
- Featured service categories
- Nearby providers preview
- Quick links to browse services, bookings, and profile

---

#### 18. UserDashboard.jsx
**Route:** `/user/dashboard`
**Why this page exists:** Gives seekers a bird's-eye view of their activity on the platform — bookings, spending, and notifications.
**What it does:**
- Stats cards: Active Bookings, Total Spent (₹), Services Completed, Notifications
- Recent Bookings list — provider name, location, price, status badge, navigate to bookings
- Recent Invoices list — provider name, date, amount
- ConnectVista Verified trust badge card
- Animated stat cards using Framer Motion
- Quick "Find a Service" button

---

#### 19. UserServices.jsx
**Route:** `/user/services`
**Why this page exists:** The main service discovery page — allows seekers to browse all available service categories and find providers near them.
**What it does:**
- Hero section with search bar and platform stats
- Left sidebar: service category filter, sort options (popular/rating/price), search radius selector (5–30 km)
- Uses browser geolocation to find nearby providers
- Fetches services from API with price ranges and provider counts
- Grid / List / Map view toggle
- Service cards showing name, description, price range, nearby provider count
- Clicking a service navigates to `/user/explore?categoryId=...`
- Map view using SimpleMapServices component

---

#### 20. UserExplore.jsx
**Route:** `/user/explore`
**Why this page exists:** Drills down into a specific service category to show individual verified providers the seeker can book.
**What it does:**
- Lists all providers for a selected service category
- Provider cards with rating, location, price, sub-services
- Filter and sort providers
- Book Now button opens booking modal
- Add to favorites functionality
- View provider full profile (about, portfolio, schedule, reviews)

---

#### 21. UserBookings.jsx
**Route:** `/user/bookings`
**Why this page exists:** Central management page for all bookings made by the seeker — track status, cancel, review, and chat.
**What it does:**
- Tab filters: All, Pending, Accepted, Completed, Cancelled
- Search by provider name
- Booking cards showing: provider name, verified badge, date/time, location, status badge, amount
- Cancel booking (with reason prompt via modal)
- Chat button for active bookings → navigates to chat page
- Rate Experience button for completed unreviewed bookings → opens ReviewModal
- Shows submitted review + provider reply inline
- Real-time updates via Socket.IO (booking:accepted, booking:rejected, booking:completed events)
- Pagination support

---

#### 22. UserBookingModel.jsx
**Route:** Used as a modal/overlay (not a standalone route)
**Why this page exists:** Handles the booking creation flow when a seeker wants to book a specific provider.
**What it does:**
- Select service, date, time slot
- Enter service address
- Confirm booking details and submit

---

#### 23. UserProfile.jsx
**Route:** `/user/profile`
**Why this page exists:** Allows seekers to view their account info, manage favorite providers, and access account settings.
**What it does:**
- Header with avatar (initial-based), name, account type, rating, member since
- Tab navigation: Overview, Favorites, Settings
- Overview tab: personal info (email, phone, address), stats (total bookings, completed, upcoming), favorite categories
- Favorites tab: saved providers with rating, location, sub-services — view full profile or remove from favorites
- Provider detail modal (About, Portfolio, Availability, Reviews tabs)
- Settings tab: Edit Profile, Notification Settings, Change Password, 2FA, Connected Devices, Delete Account
- Logout button

---

#### 24. UserNotification.jsx
**Route:** `/user/notifications`
**Why this page exists:** Shows all platform notifications for the seeker — booking updates, account status changes, etc.
**What it does:**
- Lists notifications with type, message, timestamp
- Mark as read functionality
- Filter by read/unread

---

#### 25. UserInvoices.jsx
**Route:** `/user/invoices`
**Why this page exists:** Provides a record of all financial transactions — seekers can view and download invoices for completed services.
**What it does:**
- Lists all invoices with provider name, service, date, amount
- View invoice details
- Download invoice as PDF

---

### SERVICE PROVIDER PAGES

---

#### 26. ServiceProviderSignup.jsx
**Route:** `/service-provider/signup`
**Why this page exists:** Onboards new Service Providers with a detailed 4-step registration that captures business, professional, service, and location data.
**What it does:**
- Step 1 — Business Info: full name, business name, email, phone
- Step 2 — Professional Details: password, business description, experience years, starting price, emergency charge, extra charge notes
- Step 3 — Service Selection: checkbox list of service categories from services.json, optional sub-services per category, custom service option
- Step 4 — Location: map picker (MapLocationPicker component) + manual address entry (street, city, state, PIN, lat/lng), language selection
- Per-step validation
- On success → redirects to `/service-provider/verify`
- Left side illustration + verification notice (24-48 hour approval)

---

#### 27. ServiceProviderVerification.jsx
**Route:** `/service-provider/verify`
**Why this page exists:** Providers must upload identity and business documents before they can access the dashboard. This is the trust/safety gate of the platform.
**What it does:**
- Fetches current verification status from API on load
- Auto-redirects to dashboard if already approved
- Required documents: Business Registration, Government ID, Address Proof
- Optional documents: Tax Certificate, Insurance Certificate
- Each document card shows upload status (pending/approved/rejected) with view and delete options
- File validation: max 5MB, accepted formats PDF/JPG/PNG/DOC/DOCX
- Upload progress indicator
- Verification notes section (24-48 hour timeline, email notifications)
- After upload → redirects to dashboard (verification pending)
- Left side shows current verification status badge

---

#### 28. ServiceProviderDashboard.jsx
**Route:** `/service-provider/dashboard`
**Why this page exists:** The main control center for providers — shows business performance, recent activity, and quick navigation to all features.
**What it does:**
- Stats cards: Total Services, Active Bookings, Wallet Balance, Monthly Revenue (with trend indicators)
- Weekly Performance chart (completed vs pending per day) — lazy loaded
- Monthly Revenue chart — lazy loaded
- Recent Services table with search and status filter
- Quick Actions: Manage Clients, Schedule, Reviews, Analytics, Need Support
- Recent Activity timeline
- Refresh and Export buttons
- NeedSupportModal integration

---

#### 29. ServiceProviderBookings.jsx
**Route:** `/service-provider/bookings`
**Why this page exists:** Allows providers to manage all incoming and ongoing booking requests — accept, reject, update status, and communicate with seekers.
**What it does:**
- Tab filters: All, Pending, Accepted, In Progress, Completed, Cancelled
- Booking cards with seeker info, service details, date/time, location, amount
- Accept / Reject booking actions (with rejection reason)
- Update status (In Progress → Completed)
- Chat button for active bookings
- Real-time updates via Socket.IO
- Pagination

---

#### 30. ServiceProviderProfile.jsx
**Route:** `/service-provider/profile`
**Why this page exists:** Allows providers to manage their public-facing profile — the information seekers see when browsing.
**What it does:**
- Edit business name, description, experience, pricing
- Upload/manage business images and portfolio
- Manage sub-services offered
- View profile as seekers see it
- Account settings and logout

---

#### 31. ServiceManagement.jsx
**Route:** `/service-provider/services`
**Why this page exists:** Dedicated page for providers to manage the specific services they offer — add, edit, or remove sub-services and pricing.
**What it does:**
- List of current services/sub-services
- Add new service or sub-service
- Edit pricing per service
- Toggle service availability

---

#### 32. ServiceProviderReviews.jsx
**Route:** `/service-provider/reviews`
**Why this page exists:** Allows providers to view all customer reviews and respond to them — managing their reputation on the platform.
**What it does:**
- Lists all reviews with seeker name, rating, review text, date
- Reply to reviews
- Overall rating summary and breakdown
- Filter by rating

---

#### 33. ServiceProviderNotification.jsx
**Route:** `/service-provider/notifications`
**Why this page exists:** Keeps providers informed about booking requests, verification status, payment updates, and platform announcements.
**What it does:**
- Notification list with type icons, messages, timestamps
- Mark as read / mark all as read
- Filter by type (booking, payment, system)

---

#### 34. ServiceProviderSettings.jsx
**Route:** `/service-provider/settings`
**Why this page exists:** Allows providers to configure their account preferences, availability schedule, service area, and security settings.
**What it does:**
- Weekly availability schedule (day-by-day time slots)
- Service area radius setting
- Notification preferences
- Password change
- Account deletion

---

#### 35. ServiceProviderSubscription.jsx
**Route:** `/service-provider/subscription`
**Why this page exists:** Providers need an active subscription to access premium features and appear in search results. This page manages plan selection and billing.
**What it does:**
- Shows current subscription status and expiry
- Plan comparison cards (Basic, Pro, Premium)
- Pre-subscription discount offer (20% off)
- Upgrade/renew button → navigates to PaymentPage with plan details
- Subscription history

---

#### 36. ServiceProviderWallet.jsx
**Route:** `/service-provider/wallet`
**Why this page exists:** Providers maintain a prepaid wallet balance used for cash payment transactions. This page manages wallet top-ups and transaction history.
**What it does:**
- Current wallet balance display
- Add funds (top-up) flow
- Transaction history (credits and debits)
- Low balance warning

---

#### 37. ServiceProviderInvoices.jsx
**Route:** `/service-provider/invoices`
**Why this page exists:** Providers can view and download invoices for all completed services — useful for accounting and tax purposes.
**What it does:**
- Invoice list with seeker name, service, date, amount, status
- View invoice details
- Download as PDF

---

#### 38. ServiceProviderSupportRequests.jsx
**Route:** `/service-provider/support`
**Why this page exists:** Allows providers to raise support tickets for platform issues, billing disputes, or verification problems.
**What it does:**
- Submit new support request (subject, category, description)
- View existing tickets with status (open/in-progress/resolved)
- Reply to admin responses

---

### PAYMENT PAGE

---

#### 39. PaymentPage.jsx
**Route:** `/payment`
**Why this page exists:** Handles the subscription payment flow for Service Providers. Simulates a real payment gateway experience for demo purposes.
**What it does:**
- Receives plan, duration, amount via route state from SubscriptionPage
- Step 1 — Method Selection: Credit/Debit Card, UPI, Net Banking, Wallet
- Step 2 — Form: Card details with live card preview (card number, holder name, expiry, CVV), Luhn algorithm validation
- Step 3 — Processing: animated loading with step-by-step bank connection messages
- Step 4 — OTP: 6-digit OTP entry (demo OTP: 123456)
- Step 5 — Result: success (transaction ID shown) or failure (retry option)
- On success → calls `/subscriptions/subscribe` API to activate the plan
- Pre-subscription discount display (20% off with strikethrough original price)
- "Demo Payment Gateway" badge — no real transactions

---

## CONNECTVISTA_ADMIN

---

#### 40. Login.jsx (Admin)
**Route:** `/admin/login`
**Why this page exists:** Separate secure login for admin users — isolated from the main frontend login to prevent unauthorized access.
**What it does:**
- Email + password form
- Role hardcoded as `admin` in the API call
- On success → stores token and redirects to `/admin`
- Error display for invalid credentials
- ConnectVista logo and branding
- Back to Website link

---

#### 41. Dashboard.jsx (Admin)
**Route:** `/admin` or `/admin/dashboard`
**Why this page exists:** Gives admins a complete overview of platform health — users, providers, bookings, revenue, and pending verifications.
**What it does:**
- Stats cards: Total Users, Service Providers, Total Bookings, Total Revenue (with trend %)
- Platform Growth line chart — users, providers, revenue over 6 months
- Pending Verifications widget — shows recent providers awaiting review with quick Review links
- Monthly Bookings bar chart
- Recent Bookings table — service, seeker → provider, status badge, amount
- Fetches live stats from `getDashboardStats` API

---

#### 42. Verification.jsx (Admin)
**Route:** `/admin/verification`
**Why this page exists:** The most critical admin function — reviewing and approving/rejecting provider verification documents to maintain platform trust and safety.
**What it does:**
- Summary cards: Pending count, Approved this month, Rejected this month
- Searchable and filterable table (by provider name, service, status)
- Status badges (pending/approved/rejected)
- View Details modal — shows provider business info, all uploaded documents with view buttons
- Approve (Yes) / Reject (No) action buttons for pending verifications
- Document viewer modal — renders document in iframe
- Fetches from `getVerifications` API, updates via `updateVerification` API

---

#### 43. Users.jsx (Admin)
**Route:** `/admin/users`
**Why this page exists:** Allows admins to monitor and manage all registered users (seekers) on the platform.
**What it does:**
- Searchable and filterable user table
- View user details (name, email, phone, join date, booking count)
- Suspend or delete user accounts
- Export user data

---

#### 44. Services.jsx (Admin)
**Route:** `/admin/services`
**Why this page exists:** Allows admins to manage the master list of service categories available on the platform — add new categories or review custom service requests from providers.
**What it does:**
- List of all service categories and sub-services
- Add / edit / delete service categories
- Review and approve custom service requests submitted by providers during signup

---

#### 45. Bookings.jsx (Admin)
**Route:** `/admin/bookings`
**Why this page exists:** Gives admins full visibility into all bookings across the platform for monitoring, dispute resolution, and analytics.
**What it does:**
- Complete bookings table with seeker, provider, service, date, status, amount
- Search and filter by status, date range, service type
- View booking details
- Intervene in disputes if needed

---

#### 46. Revenue.jsx (Admin)
**Route:** `/admin/revenue`
**Why this page exists:** Tracks all financial activity on the platform — subscription revenue, transaction fees, and overall financial health.
**What it does:**
- Revenue charts (monthly/quarterly/yearly)
- Subscription revenue breakdown by plan
- Transaction history
- Revenue export

---

#### 47. Reviews.jsx (Admin)
**Route:** `/admin/reviews`
**Why this page exists:** Allows admins to moderate reviews — remove fake or abusive reviews to maintain platform integrity.
**What it does:**
- All reviews table with seeker, provider, rating, review text, date
- Flag and remove inappropriate reviews
- Search and filter by rating or provider

---

#### 48. Subscriptions.jsx (Admin)
**Route:** `/admin/subscriptions`
**Why this page exists:** Manages all provider subscription plans — view active subscriptions, handle renewals, and configure plan pricing.
**What it does:**
- Active subscriptions list with provider, plan, start/end date, status
- Subscription plan configuration (pricing, features)
- Expired and cancelled subscription history

---

#### 49. Contacts.jsx (Admin)
**Route:** `/admin/contacts`
**Why this page exists:** Manages all contact form submissions from the public Contact page — allows admin to respond to user inquiries.
**What it does:**
- List of all contact form submissions with name, email, subject, message, date
- Mark as read / resolved
- Reply functionality

---

#### 50. SupportRequests.jsx (Admin)
**Route:** `/admin/support`
**Why this page exists:** Central hub for managing all support tickets raised by providers — ensures platform issues are tracked and resolved.
**What it does:**
- Support tickets table with provider, category, subject, status, date
- View ticket details and conversation thread
- Reply to tickets
- Update ticket status (open → in-progress → resolved)
- Priority flagging

---

#### 51. Settings.jsx (Admin)
**Route:** `/admin/settings`
**Why this page exists:** Allows admins to configure platform-wide settings — site configuration, notification templates, and admin account management.
**What it does:**
- Platform configuration (site name, contact info, maintenance mode)
- Notification template management
- Admin account settings (password change, profile)
- API key management

---

## SUMMARY TABLE

| # | Page | App | Role | Route |
|---|------|-----|------|-------|
| 1 | CommonHome | Frontend | Public | `/` |
| 2 | CommonAbout | Frontend | Public | `/about` |
| 3 | CommonContact | Frontend | Public | `/contact` |
| 4 | Login | Frontend | All | `/login` |
| 5 | SignupSelector | Frontend | Public | `/signup` |
| 6 | ForgotPassword | Frontend | All | `/forgot-password` |
| 7 | ResetPassword | Frontend | All | `/reset-password` |
| 8 | Chat | Frontend | Seeker/Provider | `/user/chat/:id` |
| 9 | Error (404) | Frontend | All | `*` |
| 10 | Error500 | Frontend | All | — |
| 11 | Error503 | Frontend | All | — |
| 12 | Unauthorized | Frontend | All | `/unauthorized` |
| 13 | PrivacyPolicy | Frontend | Public | `/privacy-policy` |
| 14 | TermsOfService | Frontend | Public | `/terms-of-service` |
| 15 | CookiePolicy | Frontend | Public | `/cookie-policy` |
| 16 | RefundPolicy | Frontend | Public | `/refund-policy` |
| 17 | UserSignup | Frontend | Seeker | `/user/signup` |
| 18 | UserHome | Frontend | Seeker | `/user/home` |
| 19 | UserDashboard | Frontend | Seeker | `/user/dashboard` |
| 20 | UserServices | Frontend | Seeker | `/user/services` |
| 21 | UserExplore | Frontend | Seeker | `/user/explore` |
| 22 | UserBookings | Frontend | Seeker | `/user/bookings` |
| 23 | UserBookingModel | Frontend | Seeker | (modal) |
| 24 | UserProfile | Frontend | Seeker | `/user/profile` |
| 25 | UserNotification | Frontend | Seeker | `/user/notifications` |
| 26 | UserInvoices | Frontend | Seeker | `/user/invoices` |
| 27 | ServiceProviderSignup | Frontend | Provider | `/service-provider/signup` |
| 28 | ServiceProviderVerification | Frontend | Provider | `/service-provider/verify` |
| 29 | ServiceProviderDashboard | Frontend | Provider | `/service-provider/dashboard` |
| 30 | ServiceProviderBookings | Frontend | Provider | `/service-provider/bookings` |
| 31 | ServiceProviderProfile | Frontend | Provider | `/service-provider/profile` |
| 32 | ServiceManagement | Frontend | Provider | `/service-provider/services` |
| 33 | ServiceProviderReviews | Frontend | Provider | `/service-provider/reviews` |
| 34 | ServiceProviderNotification | Frontend | Provider | `/service-provider/notifications` |
| 35 | ServiceProviderSettings | Frontend | Provider | `/service-provider/settings` |
| 36 | ServiceProviderSubscription | Frontend | Provider | `/service-provider/subscription` |
| 37 | ServiceProviderWallet | Frontend | Provider | `/service-provider/wallet` |
| 38 | ServiceProviderInvoices | Frontend | Provider | `/service-provider/invoices` |
| 39 | ServiceProviderSupportRequests | Frontend | Provider | `/service-provider/support` |
| 40 | PaymentPage | Frontend | Provider | `/payment` |
| 41 | Login (Admin) | Admin | Admin | `/admin/login` |
| 42 | Dashboard (Admin) | Admin | Admin | `/admin/dashboard` |
| 43 | Verification (Admin) | Admin | Admin | `/admin/verification` |
| 44 | Users (Admin) | Admin | Admin | `/admin/users` |
| 45 | Services (Admin) | Admin | Admin | `/admin/services` |
| 46 | Bookings (Admin) | Admin | Admin | `/admin/bookings` |
| 47 | Revenue (Admin) | Admin | Admin | `/admin/revenue` |
| 48 | Reviews (Admin) | Admin | Admin | `/admin/reviews` |
| 49 | Subscriptions (Admin) | Admin | Admin | `/admin/subscriptions` |
| 50 | Contacts (Admin) | Admin | Admin | `/admin/contacts` |
| 51 | SupportRequests (Admin) | Admin | Admin | `/admin/support` |
| 52 | Settings (Admin) | Admin | Admin | `/admin/settings` |

**Total: 52 pages across Frontend + Admin**
