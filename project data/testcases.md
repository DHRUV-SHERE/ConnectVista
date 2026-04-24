# ConnectVista - Test Cases

## Table of Contents
1. [User Authentication](#91-user-authentication)
2. [Service Categories](#92-service-categories)
3. [Booking Management](#93-booking-management)
4. [Seeker Profile](#94-seeker-profile)
5. [Provider Profile](#95-provider-profile)
6. [Review System](#96-review-system)
7. [Wallet Management](#97-wallet-management)
8. [Chat System](#98-chat-system)
9. [Notifications](#99-notifications)
10. [Contact/Support](#910-contactsupport)
11. [Subscription](#911-subscription)
12. [Favourites](#912-favourites)
13. [Invoice Management](#913-invoice-management)
14. [Verification](#914-verification)
15. [Admin Panel](#915-admin-panel)

---

## 9.1 User Authentication

### 9.1.1 User Login
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 1.1.1 | Valid Login - Seeker | Login with correct seeker credentials | email: user@gmail.com / password: Password123 / role: seeker | JWT token generated, user redirected to seeker dashboard |
| 1.1.2 | Valid Login - Provider | Login with correct provider credentials | email: provider@gmail.com / password: Password123 / role: provider | JWT token generated, user redirected to provider dashboard |
| 1.1.3 | Valid Login - Admin | Login with correct admin credentials | email: admin@gmail.com / password: Admin123 | JWT token generated, admin dashboard access granted |
| 1.1.4 | Invalid Password | Correct email, wrong password | email: user@gmail.com / password: wrongpass | Error message: "Invalid credentials" |
| 1.1.5 | Unregistered User | Email not present in database | email: new@user.com / password: anypass | Error message: "Invalid credentials" |
| 1.1.6 | Empty Email Field | Email field left blank | email: (empty) / password: Password123 | Validation error: "Email is required" |
| 1.1.7 | Empty Password Field | Password field left blank | email: user@gmail.com / password: (empty) | Validation error: "Password is required" |
| 1.1.8 | Empty Both Fields | Both fields left blank | email: (empty) / password: (empty) | Validation error: "All fields are required" |
| 1.1.9 | Wrong Role Access | Seeker accessing provider route | Valid JWT (seeker role) / attempting provider-only route | 403 Forbidden - "Access denied. Invalid role." |
| 1.1.10 | Deactivated Account | Active user account deactivated by admin | email: deactivated@gmail.com / password: Password123 | Error message: "Account is deactivated" |
| 1.1.11 | Invalid Email Format | Email not in proper format | email: invalidemail / password: Password123 | Validation error: "Invalid email format" |
| 1.1.12 | Case Sensitivity - Email | Email with different case | email: USER@GMAIL.COM / password: Password123 | JWT token generated (case-insensitive email) |

### 9.1.2 User Signup
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 1.2.1 | Valid Signup - Seeker | Register new seeker account | name: John Doe / email: john@gmail.com / phone: 9876543210 / password: Pass123! / role: seeker | Account created, JWT token, seeker profile generated |
| 1.2.2 | Valid Signup - Provider | Register new provider account | name: Jane Doe / email: jane@gmail.com / phone: 9876543211 / password: Pass123! / role: provider / businessName: JD Services | Account created, JWT token, provider profile generated |
| 1.2.3 | Duplicate Email | Email already exists | email: existing@gmail.com / phone: 9876543210 / password: Pass123! | Error: "Email already exists" |
| 1.2.4 | Duplicate Phone | Phone number already exists | email: new@gmail.com / phone: 9876543210 / password: Pass123! | Error: "Phone number already exists" |
| 1.2.5 | Both Email and Phone Exist | Same email and phone registered | email: existing@gmail.com / phone: 9876543210 | Error: "Email and phone already exists" |
| 1.2.6 | Missing Required Fields | Required field missing | email: new@gmail.com / (phone missing) / password: Pass123! | Error: "Missing required fields: email, phone, password, and role are required" |
| 1.2.7 | Empty Signup Form | All fields blank | (all empty) | Validation error: "Missing required fields" |
| 1.2.8 | Invalid Email Format | Email not proper format | email: invalid-email / phone: 9876543210 / password: Pass123! | Validation error: "Invalid email format" |
| 1.2.9 | Invalid Role | Role not in allowed values | email: new@gmail.com / phone: 9876543210 / password: Pass123! / role: guest | Validation error: "Invalid role specified" |
| 1.2.10 | Weak Password | Password too short | email: new@gmail.com / phone: 9876543210 / password: 123 | Validation error based on password policy |

### 9.1.3 Password Management
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 1.3.1 | Forgot Password - Valid Email | Request password reset with valid email | email: user@gmail.com | Success message: "Reset token generated", token sent |
| 1.3.2 | Forgot Password - Unregistered Email | Request reset with non-existent email | email: nonexistent@gmail.com | Error: "No user found with that email address" |
| 1.3.3 | Forgot Password - Empty Email | Request reset with empty email | email: (empty) | Validation error: "Email is required" |
| 1.3.4 | Reset Password - Valid Token | Reset password with valid token | token: validtoken123 / password: NewPass123! | Success: "Password reset successfully" |
| 1.3.5 | Reset Password - Expired Token | Reset with expired token | token: expiredtoken123 / password: NewPass123! | Error: "Invalid or expired reset token" |
| 1.3.6 | Reset Password - Invalid Token | Reset with invalid token | token: invalidtoken / password: NewPass123! | Error: "Invalid or expired reset token" |
| 1.3.7 | Reset Password - Empty Fields | Reset with empty token and password | token: (empty) / password: (empty) | Validation error: "Token and password are required" |
| 1.3.8 | Change Password - Correct Current | Change password with correct current | currentPassword: OldPass123! / newPassword: NewPass123! | Success: "Password changed successfully. Please login again." |
| 1.3.9 | Change Password - Wrong Current | Change with incorrect current password | currentPassword: WrongPass / newPassword: NewPass123! | Error: "Current password is incorrect" |
| 1.3.10 | Change Password - Empty Fields | Empty fields submitted | currentPassword: (empty) / newPassword: (empty) | Validation error: "All fields are required" |

### 9.1.4 Token Management
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 1.4.1 | Refresh Token - Valid | Refresh with valid refresh token | Valid refresh token in cookie | New access token generated |
| 1.4.2 | Refresh Token - Missing | Refresh without token | No refresh token | Error: "Refresh token required" |
| 1.4.3 | Refresh Token - Invalid | Refresh with tampered token | Tampered refresh token | Error: "Invalid refresh token" |
| 1.4.4 | Refresh Token - Expired | Refresh with expired token | Expired refresh token | Error: "Invalid refresh token" |
| 1.4.5 | Logout - Valid Session | Logout with valid session | Valid refresh token | Success: "Logged out successfully", token deleted |
| 1.4.6 | Logout - No Token | Logout without token | No refresh token | Success: "Logged out successfully" |

### 9.1.5 Profile Management
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 1.5.1 | Get Profile - Seeker | Fetch seeker profile | Valid JWT (seeker) | Seeker profile data returned |
| 1.5.2 | Get Profile - Provider | Fetch provider profile | Valid JWT (provider) | Provider profile data returned |
| 1.5.3 | Get Profile - No Auth | Access profile without token | No JWT | 401 Unauthorized: "Access denied. No token provided." |
| 1.5.4 | Update Profile - Valid | Update profile with valid data | Valid JWT + profile data | Success: "Profile updated successfully" |
| 1.5.5 | Update Profile - No Auth | Update without authentication | No JWT | 401 Unauthorized |
| 1.5.6 | Update Profile - Wrong Role | Provider updating seeker-only data | Valid JWT (provider) | Updated successfully (role-based access) |

---

## 9.2 Service Categories

### 9.2.1 Category Management
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 2.1.1 | Get All Categories - Public | Fetch all service categories | No authentication | List of categories with provider counts |
| 2.1.2 | Get Categories - Empty | No categories exist | No categories in DB | Empty array returned |
| 2.1.3 | Get Sub-Services - Valid Category | Get sub-services for valid category | categoryId: validcategory123 | List of sub-services for that category |
| 2.1.4 | Get Sub-Services - Invalid Category | Get sub-services with invalid ID | categoryId: invalid123 | 400 Bad Request or empty result |
| 2.1.5 | Get Sub-Services - No Category | Category not found | categoryId: nonexistent123 | 404 Not Found |

### 9.2.2 Provider Service Management
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 2.2.1 | Get Provider Service - Authenticated | Fetch provider's own service | Valid JWT (provider) | Provider's service details |
| 2.2.2 | Get Provider Service - No Auth | Access without token | No JWT | 401 Unauthorized |
| 2.2.3 | Get Provider Service - Wrong Role | Seeker accessing provider service | Valid JWT (seeker) | 403 Forbidden - "Access denied. Invalid role." |
| 2.2.4 | Save Provider Service - Valid | Create/update service | Valid JWT + service data | Success: Service saved |
| 2.2.5 | Save Provider Service - No Service | Submit empty service | Valid JWT + empty data | Success or validation error |
| 2.2.6 | Delete Provider Service | Remove provider's service | Valid JWT + serviceId | Success: Service deleted |
| 2.2.7 | Delete Non-Owner Service | Try to delete another's service | Valid JWT + otherProviderId | 403 Forbidden |

---

## 9.3 Booking Management

### 9.3.1 Create Booking
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 3.1.1 | Create Booking - Valid | Book a service with valid data | Valid seeker JWT + booking details | Success: Booking created, notification sent to provider |
| 3.1.2 | Create Booking - No Auth | Book without authentication | No JWT | 401 Unauthorized |
| 3.1.3 | Create Booking - Provider Role | Provider trying to book | Valid JWT (provider) | 403 Forbidden |
| 3.1.4 | Create Booking - Invalid Provider | Non-existent provider ID | Valid seeker JWT + providerId: fake123 | Error: "Service provider not found" |
| 3.1.5 | Create Booking - Unverified Provider | Booking unverified provider | Valid seeker JWT + unverified provider | Error: "Provider is not verified" |
| 3.1.6 | Create Booking - Service Unavailable | Provider service not available | Valid seeker JWT + unavailable service | Error: "Provider service not available" |
| 3.1.7 | Create Booking - Existing Active | Already has active booking in category | Valid seeker JWT + same category | Error: "You already have an active booking for this service category" |
| 3.1.8 | Create Booking - Past Date | Booking date in the past | Valid seeker JWT + bookingDate: yesterday | Error: "Booking date must be in the future" |
| 3.1.9 | Create Booking - Duplicate Slot | Same provider, date, time already booked | Valid seeker JWT + duplicate time slot | Error: "This time slot is already booked" |
| 3.1.10 | Create Booking - Outside Working Hours | Booking outside provider hours | Valid seeker JWT + outside working hours | Error: "Provider is only available between X:00 and Y:00" |
| 3.1.11 | Create Booking - Provider Day Off | Booking on provider's day off | Valid seeker JWT + provider's off day | Error: "Provider is not available on [day]s" |
| 3.1.12 | Create Booking - Missing Fields | Missing required booking fields | Valid seeker JWT + incomplete data | Validation error: Required fields missing |
| 3.1.13 | Create Booking - Urgent Priority | Book with urgent priority | Valid seeker JWT + priority: urgent | Booking created with 1.5x charge, urgent notification |

### 9.3.2 Get Bookings
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 3.2.1 | Get Seeker Bookings - Valid | Fetch all seeker bookings | Valid JWT (seeker) | List of seeker's bookings with pagination |
| 3.2.2 | Get Seeker Bookings - Filter by Status | Filter by specific status | Valid JWT + status: pending | Filtered list of pending bookings |
| 3.2.3 | Get Seeker Bookings - No Profile | Seeker profile not found | Valid JWT + no seeker profile | Error: "Seeker profile not found" |
| 3.2.4 | Get Provider Bookings - Valid | Fetch all provider bookings | Valid JWT (provider) | List of provider's bookings with stats |
| 3.2.5 | Get Provider Bookings - Filter by Status | Filter bookings by status | Valid JWT + status: accepted | Filtered list |
| 3.2.6 | Get Single Booking - Authorized | View own booking | Valid JWT + bookingId | Booking details |
| 3.2.7 | Get Single Booking - Unauthorized | View another user's booking | Valid JWT + otherBookingId | 403 Forbidden: "Not authorized to view this booking" |
| 3.3.8 | Get Single Booking - Invalid ID | View with invalid ID | Valid JWT + bookingId: invalid | Error: "Invalid booking ID" |
| 3.3.9 | Get Single Booking - Not Found | Booking doesn't exist | Valid JWT + bookingId: nonexistent | 404 Not Found |

### 9.3.3 Accept/Reject Booking
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 3.3.1 | Accept Booking - Valid | Provider accepts pending booking | Valid JWT (provider) + bookingId | Success: Status changed to "accepted", seeker notified |
| 3.3.2 | Accept Booking - Wrong Role | Seeker trying to accept | Valid JWT (seeker) | 403 Forbidden |
| 3.3.3 | Accept Booking - Not Owner | Accept another provider's booking | Valid JWT + otherProviderBookingId | 403 Forbidden |
| 3.3.4 | Accept Booking - Not Pending | Accept already accepted booking | Valid JWT + status: accepted | Error: "Cannot accept booking with status 'accepted'" |
| 3.3.5 | Accept Booking - Unverified Provider | Unverified provider trying to accept | Valid JWT (unverified) + bookingId | Error: "Your account is not verified" |
| 3.3.6 | Reject Booking - Valid | Provider rejects booking | Valid JWT + bookingId + reason | Success: Status changed to "rejected" |
| 3.3.7 | Reject Booking - With Reason | Reject with cancellation reason | Valid JWT + bookingId + reason: "Schedule conflict" | Success with reason stored |
| 3.3.8 | Reject Booking - Not Pending | Reject non-pending booking | Valid JWT + status: completed | Error: "Cannot reject booking with status 'completed'" |

### 9.3.4 Cancel Booking
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 3.4.1 | Cancel Booking - Seeker | Seeker cancels own booking | Valid JWT (seeker) + bookingId | Success: Status "cancelled", provider notified |
| 3.4.2 | Cancel Booking - Provider | Provider cancels own booking | Valid JWT (provider) + bookingId | Success: Status "cancelled", seeker notified |
| 3.4.3 | Cancel Booking - With Reason | Cancel with reason | Valid JWT + bookingId + reason | Success with reason stored |
| 3.4.4 | Cancel Booking - Unauthorized | Cancel another's booking | Valid JWT + otherUserBookingId | 403 Forbidden |
| 3.4.5 | Cancel Booking - Already Cancelled | Cancel already cancelled booking | Valid JWT + status: cancelled | Error: "Cannot cancel booking with status 'cancelled'" |
| 3.4.6 | Cancel Booking - Already Completed | Cancel completed booking | Valid JWT + status: completed | Error: "Cannot cancel booking with status 'completed'" |
| 3.4.7 | Cancel Booking - Not Found | Cancel non-existent booking | Valid JWT + bookingId: fake123 | 404 Not Found |

### 9.3.5 Complete Booking
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 3.5.1 | Complete Booking - Valid | Provider marks booking complete | Valid JWT (provider) + bookingId | Success: Status "completed", seeker notified |
| 3.5.2 | Complete Booking - With Notes | Complete with provider notes | Valid JWT + bookingId + providerNotes | Success with notes stored |
| 3.5.3 | Complete Booking - Not Owner | Provider completing another's booking | Valid JWT + otherProviderBookingId | 403 Forbidden |
| 3.5.4 | Complete Booking - Wrong Status | Complete non-accepted booking | Valid JWT + status: pending | Error: "Cannot complete booking with status 'pending'" |
| 3.5.5 | Complete Booking - Wrong Role | Seeker trying to complete | Valid JWT (seeker) | 403 Forbidden |

---

## 9.4 Seeker Profile

### 9.4.1 Profile Operations
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 4.1.1 | Get Seeker Profile - Valid | Fetch seeker profile | Valid JWT (seeker) | Seeker profile with all details |
| 4.1.2 | Get Seeker Profile - No Auth | Access without token | No JWT | 401 Unauthorized |
| 4.1.3 | Get Seeker Profile - Wrong Role | Provider accessing seeker profile | Valid JWT (provider) | 403 Forbidden |
| 4.1.4 | Update Seeker Profile - Valid | Update profile successfully | Valid JWT + updated data | Success: "Profile updated successfully" |
| 4.1.5 | Update Seeker Profile - Partial | Update only some fields | Valid JWT + partial data | Success: Only specified fields updated |
| 4.1.6 | Update Seeker Profile - Invalid Data | Invalid data in update | Valid JWT + invalid phone format | Validation error |
| 4.1.7 | Update Seeker Profile - No Auth | Update without token | No JWT | 401 Unauthorized |

### 9.4.2 Location Management
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 4.2.1 | Update Location - Valid | Update live location | Valid JWT + lat/lng | Success: Location updated |
| 4.2.2 | Update Location - Invalid Coordinates | Invalid lat/lng values | Valid JWT + lat: 999 / lng: 999 | Validation error or accepted with warning |
| 4.2.3 | Update Location - No Auth | Update without authentication | No JWT | 401 Unauthorized |
| 4.2.4 | Clear Location | Remove saved location | Valid JWT | Success: Location cleared/removed |

---

## 9.5 Provider Profile

### 9.5.1 Provider Profile Operations
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 5.1.1 | Get Provider Profile - Valid | Fetch provider profile | Valid JWT (provider) | Full provider profile |
| 5.1.2 | Get Provider Profile - No Auth | Access without token | No JWT | 401 Unauthorized |
| 5.1.3 | Get Provider Profile - Wrong Role | Seeker accessing provider profile | Valid JWT (seeker) | 403 Forbidden |
| 5.1.4 | Update Provider Profile - Valid | Update profile successfully | Valid JWT + updated data | Success: "Profile updated successfully" |
| 5.1.5 | Update Provider Profile - Partial | Update specific fields | Valid JWT + partial data | Success with partial update |
| 5.1.6 | Update Provider Services - Valid | Update services offered | Valid JWT + service data | Success: Services updated |
| 5.1.7 | Update Provider Services - No Services | Remove all services | Valid JWT + empty services | Success: Services cleared |

### 9.5.2 Business Images
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 5.2.1 | Upload Images - Valid | Upload valid images | Valid JWT + image files (JPEG/PNG) | Success: Images uploaded to cloud storage |
| 5.2.2 | Upload Images - Invalid Format | Upload invalid file type | Valid JWT + .exe file | Error: "Invalid file format" |
| 5.2.3 | Upload Images - Too Large | Upload oversized image | Valid JWT + file > 10MB | Error: "File too large" |
| 5.2.4 | Upload Images - Max Limit | Upload more than 10 images | Valid JWT + 15 images | Error: "Maximum 10 images allowed" |
| 5.2.5 | Delete Image - Valid | Delete existing image | Valid JWT + imageIndex | Success: Image removed |
| 5.2.6 | Delete Image - Invalid Index | Delete non-existent image | Valid JWT + imageIndex: 99 | Error: "Image not found" |

### 9.5.3 Nearby Providers
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 5.3.1 | Get Nearby Providers - Valid | Search nearby providers | Valid JWT + lat/lng | List of providers within radius |
| 5.3.2 | Get Nearby Providers - With Filters | Filter results | Valid JWT + lat/lng + radius=10 + sortBy=rating | Filtered and sorted results |
| 5.3.3 | Get Nearby Providers - No Location | Missing location data | Valid JWT + no coordinates | Error: Location required |
| 5.3.4 | Get Dashboard Stats | Get provider dashboard data | Valid JWT (provider) | Stats: earnings, bookings, ratings |
| 5.3.5 | Get Recent Services | Get recent service history | Valid JWT (provider) | Recent bookings/services list |

---

## 9.6 Review System

### 9.6.1 Create Review
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 6.1.1 | Create Review - Valid | Create review for completed booking | Valid JWT (seeker) + bookingId + rating + comment | Success: Review created, rating updated |
| 6.1.2 | Create Review - No Auth | Create without token | No JWT | 401 Unauthorized |
| 6.1.3 | Create Review - Wrong Role | Provider trying to create review | Valid JWT (provider) | 403 Forbidden |
| 6.1.4 | Create Review - Already Reviewed | Review already exists for booking | Valid JWT + existing review booking | Error: "Review already exists for this booking" |
| 6.1.5 | Create Review - Booking Not Completed | Review incomplete booking | Valid JWT + status: pending | Error: "Can only review completed bookings" |
| 6.1.6 | Create Review - Unauthorized Booking | Review another's booking | Valid JWT + otherSeekerBookingId | Error: "Not authorized to review this booking" |
| 6.1.7 | Create Review - Invalid Rating | Rating out of range | Valid JWT + rating: 6 | Validation error: "Rating must be 1-5" |
| 6.1.8 | Create Review - Missing Rating | No rating provided | Valid JWT + comment only | Validation error: "Rating is required" |
| 6.1.9 | Create Review - Empty Comment | Only rating, no comment | Valid JWT + rating: 5 | Success: Review created (comment optional) |

### 9.6.2 Get Reviews
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 6.2.1 | Get Provider Reviews - Public | View provider reviews | No auth + providerId | List of reviews for provider |
| 6.2.2 | Get Provider Reviews - With Pagination | Paginated reviews | providerId + page + limit | Paginated review list |
| 6.2.3 | Get Provider Reviews - No Reviews | Provider has no reviews | Valid providerId | Empty review list |
| 6.2.4 | Get Review by Booking - Valid | Get review for specific booking | Valid JWT + bookingId | Review details |
| 6.2.5 | Get Review by Booking - No Review | No review exists | Valid JWT + unrated booking | 404 Not Found |

### 9.6.3 Reply to Review
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 6.3.1 | Reply to Review - Valid | Provider replies to review | Valid JWT (provider) + reviewId + reply | Success: Reply added to review |
| 6.3.2 | Reply to Review - Not Owner | Reply to another's review | Valid JWT + otherProviderReviewId | 403 Forbidden |
| 6.3.3 | Reply to Review - Wrong Role | Seeker trying to reply | Valid JWT (seeker) | 403 Forbidden |
| 6.3.4 | Reply to Review - Empty Reply | Reply with empty text | Valid JWT + reviewId + (empty) | Validation error or empty reply accepted |

### 9.6.4 Review Reminder
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 6.4.1 | Set Review Reminder - Valid | Set reminder for unrated booking | Valid JWT (seeker) + bookingId | Success: Reminder set |
| 6.4.2 | Set Review Reminder - Already Reviewed | Set for reviewed booking | Valid JWT + reviewed bookingId | Error or ignored |

---

## 9.7 Wallet Management

### 9.7.1 Wallet Operations
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 7.1.1 | Get Wallet Details - Valid | Fetch wallet balance | Valid JWT (provider) | Wallet details with balance and transactions |
| 7.1.2 | Get Wallet Details - No Auth | Access without token | No JWT | 401 Unauthorized |
| 7.1.3 | Get Wallet Details - Wrong Role | Seeker accessing provider wallet | Valid JWT (seeker) | 403 Forbidden |
| 7.1.4 | Get Wallet Details - New Wallet | Provider with no transactions | Valid JWT + new provider | Initial wallet with zero balance |
| 7.1.5 | Top Up Wallet - Valid | Add funds to wallet | Valid JWT + amount + payment details | Success: Balance updated |
| 7.1.6 | Top Up Wallet - Invalid Amount | Negative or zero amount | Valid JWT + amount: -100 | Error: "Invalid amount" |
| 7.1.7 | Top Up Wallet - Payment Failed | Payment processing fails | Valid JWT + valid amount + failed payment | Error: "Payment failed" |
| 7.1.8 | Top Up Wallet - No Auth | Top up without authentication | No JWT | 401 Unauthorized |

### 9.7.2 Bank Details & Payout
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 7.2.1 | Update Bank Details - Valid | Add bank account | Valid JWT + bank details | Success: Bank details saved |
| 7.2.2 | Update Bank Details - Invalid Account | Invalid bank account number | Valid JWT + invalid account | Validation error |
| 7.2.3 | Request Payout - Valid | Request withdrawal | Valid JWT + amount + valid bank | Success: Payout requested |
| 7.2.4 | Request Payout - Insufficient Balance | Request more than available | Valid JWT + amount > balance | Error: "Insufficient balance" |
| 7.2.5 | Request Payout - No Bank Details | Request without bank info | Valid JWT + no bank details on file | Error: "Bank details required" |
| 7.2.6 | Request Payout - Already Pending | Request while previous pending | Valid JWT + pending payout exists | Error: "Payout already pending" |

---

## 9.8 Chat System

### 9.8.1 Conversations
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 8.1.1 | Get Conversations - Valid | Fetch all conversations | Valid JWT | List of conversations with other users |
| 8.1.2 | Get Conversations - No Auth | Access without token | No JWT | 401 Unauthorized |
| 8.1.3 | Get Conversations - Empty | No conversations yet | Valid JWT + new user | Empty conversation list |

### 9.8.2 Messages
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 8.2.1 | Get Messages - Valid | Fetch messages for booking | Valid JWT + bookingId | Message history for booking |
| 8.2.2 | Get Messages - No Auth | Access without token | No JWT | 401 Unauthorized |
| 8.2.3 | Get Messages - Unauthorized | Not part of booking chat | Valid JWT + otherUserBookingId | Error or empty result |
| 8.2.4 | Send Message - Valid | Send message to booking chat | Valid JWT + bookingId + message | Success: Message sent, recipient notified |
| 8.2.5 | Send Message - Empty Content | Send empty message | Valid JWT + bookingId + (empty) | Error: "Message content required" |
| 8.2.6 | Send Message - No Auth | Send without token | No JWT | 401 Unauthorized |
| 8.2.7 | Send Message - Invalid Booking | Message to non-existent booking | Valid JWT + bookingId: fake123 | Error: "Booking not found" |
| 8.2.8 | Send Message - Long Text | Very long message | Valid JWT + long text (>5000 chars) | Success or truncated/validation error |

---

## 9.9 Notifications

### 9.9.1 Get Notifications
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 9.1.1 | Get Notifications - Valid | Fetch user notifications | Valid JWT | List of notifications |
| 9.1.2 | Get Notifications - With Filters | Filter by category/status | Valid JWT + category: booking + isRead: false | Filtered notifications |
| 9.1.3 | Get Notifications - Pagination | Paginated results | Valid JWT + page: 2 + limit: 10 | Second page of notifications |
| 9.1.4 | Get Notifications - No Auth | Access without token | No JWT | 401 Unauthorized |
| 9.1.5 | Get Unread Count - Valid | Get unread notification count | Valid JWT | Count of unread notifications |
| 9.1.6 | Get Category Counts | Get counts per category | Valid JWT | Category-wise notification counts |

### 9.9.2 Mark Notifications
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 9.2.1 | Mark as Read - Single | Mark one notification read | Valid JWT + notificationId | Success: Notification marked read |
| 9.2.2 | Mark as Read - Already Read | Mark already read notification | Valid JWT + read notificationId | Success: No change |
| 9.2.3 | Mark as Read - Invalid ID | Mark non-existent notification | Valid JWT + notificationId: fake123 | 404 Not Found |
| 9.2.4 | Mark Category as Read | Mark all in category | Valid JWT + category: booking | All booking notifications marked read |
| 9.2.5 | Mark All as Read | Mark all notifications read | Valid JWT | All notifications marked read |
| 9.2.6 | Mark as Read - No Auth | Mark without token | No JWT | 401 Unauthorized |

### 9.9.3 Delete Notifications
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 9.3.1 | Delete Notification - Valid | Delete single notification | Valid JWT + notificationId | Success: Notification deleted |
| 9.3.2 | Delete Notification - Not Owner | Delete another's notification | Valid JWT + otherUserNotificationId | 403 Forbidden |
| 9.3.3 | Delete Notification - Not Found | Delete non-existent | Valid JWT + notificationId: fake123 | 404 Not Found |

---

## 9.10 Contact/Support

### 9.10.1 Contact Form (Public)
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 10.1.1 | Submit Contact - Valid | Submit contact form | name + email + message | Success: Form submitted, admin notified |
| 10.1.2 | Submit Contact - Missing Fields | Incomplete form | name + email (message missing) | Validation error: "Message is required" |
| 10.1.3 | Submit Contact - Invalid Email | Invalid email format | name + invalid-email + message | Validation error: "Invalid email format" |
| 10.1.4 | Submit Contact - Empty Form | All fields empty | (all empty) | Validation error: All fields required |

### 9.10.2 Admin Contact Management
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 10.2.1 | Get All Contacts - Admin | Fetch all contact submissions | Valid JWT (admin) | List of all contact submissions |
| 10.2.2 | Get Contact Stats | Get contact submission stats | Valid JWT (admin) | Statistics dashboard data |
| 10.2.3 | Get Single Contact | View specific contact | Valid JWT (admin) + contactId | Contact details |
| 10.2.4 | Update Contact Status | Update contact resolution | Valid JWT (admin) + contactId + status | Success: Status updated |
| 10.2.5 | Delete Contact | Delete contact submission | Valid JWT (admin) + contactId | Success: Contact deleted |
| 10.2.6 | Contact Access - Non-Admin | Regular user accessing admin routes | Valid JWT (seeker) | 403 Forbidden |

### 9.10.3 Provider Support Requests
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 10.3.1 | Create Support Request - Valid | Submit support ticket | Valid JWT (provider) + subject + description | Success: Ticket created |
| 10.3.2 | Create Support Request - No Auth | Submit without token | No JWT | 401 Unauthorized |
| 10.3.3 | Create Support Request - Wrong Role | Seeker submitting ticket | Valid JWT (seeker) | 403 Forbidden |
| 10.3.4 | Get My Support Requests | View own tickets | Valid JWT (provider) | List of provider's tickets |
| 10.3.5 | Get Support Request Details | View specific ticket | Valid JWT + ticketId | Ticket details |
| 10.3.6 | Admin Get All Requests | Admin views all tickets | Valid JWT (admin) | All support requests |
| 10.3.7 | Admin Update Request | Admin updates ticket | Valid JWT (admin) + ticketId + update | Success: Ticket updated |
| 10.3.8 | Admin Delete Request | Admin deletes ticket | Valid JWT (admin) + ticketId | Success: Ticket deleted |
| 10.3.9 | Get Support Stats | Admin views support statistics | Valid JWT (admin) | Support ticket statistics |

---

## 9.11 Subscription

### 9.11.1 Subscription Management
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 11.1.1 | Subscribe - Valid | Subscribe to a plan | Valid JWT (provider) + planId + payment | Success: Subscription created |
| 11.1.2 | Subscribe - No Auth | Subscribe without token | No JWT | 401 Unauthorized |
| 11.1.3 | Subscribe - Wrong Role | Seeker trying to subscribe | Valid JWT (seeker) | 403 Forbidden |
| 11.1.4 | Subscribe - Already Subscribed | Subscribe when already active | Valid JWT + active subscription | Error: "Already subscribed" or extend existing |
| 11.5.5 | Subscribe - Payment Failed | Payment processing error | Valid JWT + valid plan + failed payment | Error: "Payment failed" |
| 11.1.6 | Get My Subscription - Valid | View current subscription | Valid JWT (provider) | Subscription details |
| 11.1.7 | Get My Subscription - None | No active subscription | Valid JWT + no subscription | Success: No subscription found |
| 11.1.8 | Cancel Subscription - Valid | Cancel active subscription | Valid JWT (provider) | Success: Subscription cancelled |
| 11.1.9 | Cancel Subscription - Already Cancelled | Cancel already cancelled | Valid JWT + cancelled subscription | Error: "Subscription already cancelled" |
| 11.1.10 | Get All Subscriptions - Admin | Admin views all subscriptions | Valid JWT (admin) | All subscription records |

---

## 9.12 Favourites

### 9.12.1 Favourite Providers
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 12.1.1 | Get Favourites - Valid | Fetch favorite providers | Valid JWT (seeker) | List of favorite providers |
| 12.1.2 | Get Favourites - Empty | No favorites yet | Valid JWT + new user | Empty favorites list |
| 12.1.3 | Get Favourites - No Auth | Access without token | No JWT | 401 Unauthorized |
| 12.1.4 | Get Favourites - Wrong Role | Provider accessing favorites | Valid JWT (provider) | 403 Forbidden |
| 12.1.5 | Add Favourite - Valid | Add provider to favorites | Valid JWT (seeker) + providerId | Success: Provider added to favorites |
| 12.1.6 | Add Favourite - Already Favorited | Add already favorited provider | Valid JWT + alreadyFavoritedId | Error: "Already in favorites" or duplicate handled |
| 12.1.7 | Add Favourite - Invalid Provider | Add non-existent provider | Valid JWT + providerId: fake123 | Error: "Provider not found" |
| 12.1.8 | Remove Favourite - Valid | Remove from favorites | Valid JWT (seeker) + providerId | Success: Removed from favorites |
| 12.1.9 | Remove Favourite - Not Favorited | Remove provider not in favorites | Valid JWT + notFavoritedId | Success: No change or error |
| 12.1.10 | Check Favorite - Is Favorite | Check favorited provider | Valid JWT (seeker) + providerId | { isFavorite: true } |
| 12.1.11 | Check Favorite - Not Favorite | Check non-favorited provider | Valid JWT (seeker) + providerId | { isFavorite: false } |
| 12.1.12 | Bulk Check Favorites | Check multiple providers | Valid JWT + array of providerIds | Map of providerId: isFavorite |

---

## 9.13 Invoice Management

### 9.13.1 Generate Invoice
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 13.1.1 | Generate Invoice - Valid | Create invoice for completed booking | Valid JWT (provider) + bookingId | Success: Invoice generated with PDF |
| 13.1.2 | Generate Invoice - No Auth | Generate without token | No JWT | 401 Unauthorized |
| 13.1.3 | Generate Invoice - Wrong Role | Seeker trying to generate | Valid JWT (seeker) | 403 Forbidden |
| 13.1.4 | Generate Invoice - Not Owner | Generate invoice for another's booking | Valid JWT + otherProviderBookingId | 403 Forbidden |
| 13.1.5 | Generate Invoice - Invalid Booking | Invoice for non-existent booking | Valid JWT + bookingId: fake123 | Error: "Booking not found" |
| 13.1.6 | Generate Invoice - Already Generated | Generate for already invoiced booking | Valid JWT + alreadyInvoicedBookingId | Error: "Invoice already exists" |

### 9.13.2 Invoice Retrieval
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 13.2.1 | Get Provider Invoices - Valid | Fetch provider's invoices | Valid JWT (provider) | List of provider's invoices |
| 13.2.2 | Get Seeker Invoices - Valid | Fetch seeker's invoices | Valid JWT (seeker) | List of seeker's invoices |
| 13.2.3 | Get Invoices - Empty | No invoices yet | Valid JWT + new user | Empty invoice list |
| 13.2.4 | Get Invoices - With Filters | Filter by date/status | Valid JWT + startDate + endDate | Filtered invoice list |

### 9.13.3 Online Payment
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 13.3.1 | Complete Online Payment - Valid | Complete payment for invoice | Valid JWT (provider) + invoiceId + paymentDetails | Success: Payment recorded, status updated |
| 13.3.2 | Complete Online Payment - Already Paid | Pay already paid invoice | Valid JWT + paidInvoiceId | Error: "Invoice already paid" |
| 13.3.3 | Complete Online Payment - Failed | Payment gateway failure | Valid JWT + valid invoice + failed payment | Error: "Payment failed" |
| 13.3.4 | Complete Online Payment - Invalid Invoice | Pay non-existent invoice | Valid JWT + invoiceId: fake123 | 404 Not Found |

---

## 9.14 Verification

### 9.14.1 Document Upload
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 14.1.1 | Upload Documents - Valid | Upload valid verification documents | Valid JWT (provider) + ID proof + address proof | Success: Documents uploaded |
| 14.1.2 | Upload Documents - No Auth | Upload without token | No JWT | 401 Unauthorized |
| 14.1.3 | Upload Documents - Wrong Role | Seeker trying to upload | Valid JWT (seeker) | 403 Forbidden |
| 14.1.4 | Upload Documents - Invalid Format | Upload non-PDF/JPEG | Valid JWT + .exe file | Error: "Invalid file format" |
| 14.1.5 | Upload Documents - Too Large | Upload oversized file | Valid JWT + file > 5MB | Error: "File too large" |
| 14.1.6 | Upload Documents - Missing Files | Upload without required documents | Valid JWT + only one file | Error: "Required documents missing" |

### 9.14.2 Verification Status
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 14.2.1 | Get Verification Status - Pending | Check status when pending | Valid JWT (provider) + pending documents | Status: "pending" |
| 14.2.2 | Get Verification Status - Verified | Check after approval | Valid JWT + verified status | Status: "verified" |
| 14.2.3 | Get Verification Status - Rejected | Check after rejection | Valid JWT + rejected status | Status: "rejected" with reason |
| 14.2.4 | Get Verification Status - No Auth | Check without token | No JWT | 401 Unauthorized |

---

## 9.15 Admin Panel

### 9.15.1 Dashboard & Stats
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 15.1.1 | Get Dashboard Stats - Admin | Fetch dashboard statistics | Valid JWT (admin) | Stats: users, bookings, revenue, verifications |
| 15.1.2 | Get Dashboard Stats - No Auth | Access without token | No JWT | 401 Unauthorized |
| 15.1.3 | Get Dashboard Stats - Wrong Role | Non-admin accessing | Valid JWT (seeker/provider) | 403 Forbidden |

### 9.15.2 User Management
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 15.2.1 | Get All Users - Admin | Fetch all platform users | Valid JWT (admin) | List of all users with pagination |
| 15.2.2 | Get All Providers - Admin | Fetch all service providers | Valid JWT (admin) | List of providers |
| 15.2.3 | Get All Seekers - Admin | Fetch all service seekers | Valid JWT (admin) | List of seekers |
| 15.2.4 | Update User Status - Activate | Activate deactivated user | Valid JWT (admin) + userId | Success: User activated |
| 15.2.5 | Update User Status - Deactivate | Deactivate user | Valid JWT (admin) + userId | Success: User deactivated |
| 15.2.6 | Update User Status - Not Found | Update non-existent user | Valid JWT (admin) + userId: fake123 | 404 Not Found |

### 9.15.3 Booking Management
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 15.3.1 | Get All Bookings - Admin | Fetch all bookings | Valid JWT (admin) | All bookings with filters |
| 15.3.2 | Get Revenue Data - Admin | Fetch revenue statistics | Valid JWT (admin) | Revenue data by period |

### 9.15.4 Verification Management
| # | Test Case Title | Description | Input | Expected Output |
|---|----------------|-------------|-------|-----------------|
| 15.4.1 | Get Pending Verifications | Fetch pending verification requests | Valid JWT (admin) | List of pending verifications |
| 15.4.2 | Approve Verification | Approve provider verification | Valid JWT (admin) + verificationId | Success: Provider verified |
| 15.4.3 | Reject Verification | Reject verification with reason | Valid JWT (admin) + verificationId + reason | Success: Verification rejected |
| 15.4.4 | Get Verification - Not Found | Access non-existent verification | Valid JWT (admin) + verificationId: fake123 | 404 Not Found |

---

## Test Case Summary Statistics

| Module | Total Test Cases | Best Case | Worst Case |
|--------|-----------------|-----------|------------|
| User Authentication | 40 | Valid login/signup | Deactivated account |
| Service Categories | 7 | Get categories | Invalid category |
| Booking Management | 33 | Create valid booking | Already completed booking |
| Seeker Profile | 7 | Get/update profile | No auth |
| Provider Profile | 11 | Get/update profile | Invalid image upload |
| Review System | 13 | Create valid review | Unauthorized review |
| Wallet Management | 12 | Get wallet details | Insufficient balance |
| Chat System | 8 | Get conversations | Unauthorized access |
| Notifications | 14 | Get notifications | Delete others' notification |
| Contact/Support | 18 | Submit valid contact | Non-admin access |
| Subscription | 10 | Subscribe | Payment failed |
| Favourites | 12 | Add/remove favorites | Already favorited |
| Invoice Management | 10 | Generate invoice | Already paid |
| Verification | 8 | Upload valid docs | Invalid file format |
| Admin Panel | 14 | Dashboard stats | Wrong role access |
| **TOTAL** | **217** | - | - |

---

*Document generated for ConnectVista Testing*
