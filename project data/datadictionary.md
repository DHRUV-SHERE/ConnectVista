# ConnectVista Data Dictionary

This document provides a comprehensive description of all database models and their fields in the ConnectVista application.

---

## Table of Contents
1. [User](#user)
2. [ServiceProvider](#serviceprovider)
3. [ServiceSeeker](#serviceseeker)
4. [Service](#service)
5. [Booking](#booking)
6. [Review](#review)
7. [Payment](#payment)
8. [Invoice](#invoice)
9. [Notification](#notification)
10. [Message](#message)
11. [Token](#token)
12. [ContactSubmission](#contactsubmission)
13. [FavouriteServiceProvider](#favouriteserviceprovider)
14. [GlobalSettings](#globalsettings)
15. [ProviderPortfolio](#providerportfolio)
16. [ProviderSchedule](#providerschedule)
17. [ProviderService](#providerservice)
18. [ProviderSettings](#providersettings)
19. [ProviderSubscription](#providersubscription)
20. [ProviderSupportRequest](#providersupportrequest)
21. [ProviderVerification](#providerverification)
22. [Subscription](#subscription)
23. [PayoutRequest](#payoutrequest)
24. [WalletTransaction](#wallettransaction)

---

## User

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| _id (PK) | ObjectId | Primary Key, Auto | Unique user identifier |
| email | String | Required, Unique, Lowercase | User's email address |
| phone | String | Required | Contact phone number |
| password | String | Required, Select: false | Bcrypt-hashed password (min 6 chars) |
| role | Enum | Required, Default: 'seeker' | User role: 'seeker', 'provider', 'admin' |
| isActive | Boolean | Default: true | Account active status |
| isEmailVerified | Boolean | Default: false | Email verification status |
| lastLogin | Date | Optional | Last login timestamp |
| resetPasswordToken | String | Optional | Password reset token |
| resetPasswordExpires | Date | Optional | Password reset token expiry |
| createdAt | Date | Auto | Record creation timestamp |
| updatedAt | Date | Auto | Record last update timestamp |

---

## ServiceProvider

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| _id (PK) | ObjectId | Primary Key, Auto | Unique provider identifier |
| userId | ObjectId | Required, Unique, Ref: User | Link to user account |
| name | String | Required | Full name of provider |
| businessName | String | Required | Business/company name |
| description | String | Optional, Max: 1000 chars | Business description |
| experienceYears | Number | Default: 0, Min: 0 | Years of experience |
| businessAddress | Object | Required | Provider's business location |
| businessAddress.street | String | Required | Street address |
| businessAddress.city | String | Required | City name |
| businessAddress.state | String | Required | State name |
| businessAddress.pinCode | String | Required | Postal/ZIP code |
| businessAddress.coordinates | Object | Required | GeoJSON Point [longitude, latitude] |
| languages | Array[String] | Optional | Languages spoken |
| rating.average | Number | Default: 0, Min: 0, Max: 5 | Average rating score |
| rating.count | Number | Default: 0 | Total number of ratings |
| rating.breakdown | Object | Default: {1-5: 0} | Rating distribution |
| startingPrice | Number | Required, Min: 0 | Minimum service price |
| emergencyCharge | Number | Default: 0, Min: 0 | Emergency service charge |
| extraChargeNote | String | Optional | Additional charge notes |
| isVerified | Boolean | Default: false | Verification status |
| verificationStatus | Enum | Default: 'pending' | Status: 'pending', 'approved', 'rejected' |
| totalJobsCompleted | Number | Default: 0 | Completed bookings count |
| totalEarnings | Number | Default: 0 | Total earnings amount |
| walletBalance | Number | Default: 0, Min: 0 | Pre-paid credit balance |
| pendingEarnings | Number | Default: 0, Min: 0 | Pending payout amount |
| bankDetails | Object | Optional | Bank account information |
| bankDetails.accountHolder | String | Optional | Account holder name |
| bankDetails.accountNumber | String | Optional | Bank account number |
| bankDetails.bankName | String | Optional | Bank name |
| bankDetails.ifscCode | String | Optional | IFSC code |
| payoutPreference | Enum | Default: 'automatic' | 'manual' or 'automatic' |
| platformEarnings | Number | Default: 0 | Platform earnings |
| currentPlan | Enum | Default: null | Subscription: 'Basic', 'Professional', 'Business', 'Enterprise' |
| planExpiresAt | Date | Optional | Subscription expiry date |
| businessImages | Array[Object] | Optional | Business photos |
| businessImages[].url | String | Required | Image URL |
| businessImages[].filename | String | Optional | Stored filename |
| businessImages[].originalName | String | Optional | Original filename |
| businessImages[].uploadedAt | Date | Auto | Upload timestamp |
| createdAt | Date | Auto | Record creation timestamp |
| updatedAt | Date | Auto | Record last update timestamp |

---

## ServiceSeeker

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| _id (PK) | ObjectId | Primary Key, Auto | Unique seeker identifier |
| userId | ObjectId | Required, Unique, Ref: User | Link to user account |
| name | String | Required | Full name |
| gender | Enum | Required | 'male', 'female', 'other' |
| address | Object | Required | Seeker address details |
| address.street | String | Required | Street address |
| address.city | String | Required | City name |
| address.state | String | Required | State name |
| address.pinCode | String | Required | Postal/ZIP code |
| address.coordinates | Object | Optional | GeoJSON Point [longitude, latitude] |
| profileImage | String | Default: 'default-avatar.png' | Profile photo URL |
| preferences | Object | Optional | User preferences |
| preferences.notifications | Boolean | Default: true | Push notifications |
| preferences.emailUpdates | Boolean | Default: true | Email updates |
| createdAt | Date | Auto | Record creation timestamp |
| updatedAt | Date | Auto | Record last update timestamp |

---

## Service

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| _id (PK) | ObjectId | Primary Key, Auto | Unique service identifier |
| name | String | Required, Unique | Service name |
| description | String | Optional, Max: 500 chars | Service description |
| category | Enum | Required | Service category |
| category.values | Array | plumbing, electrical, carpentry, cleaning, painting, appliance-repair, moving, gardening, pest-control, renovation, other | Service category types |
| icon | String | Default: 'default-service-icon.png' | Service icon image |
| isActive | Boolean | Default: true | Service availability |
| totalProviders | Number | Default: 0 | Providers offering this service |
| totalBookings | Number | Default: 0 | Total bookings count |
| createdAt | Date | Auto | Record creation timestamp |
| updatedAt | Date | Auto | Record last update timestamp |

---

## Booking

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| _id (PK) | ObjectId | Primary Key, Auto | Unique booking identifier |
| seekerId | ObjectId | Required, Ref: ServiceSeeker | Service seeker reference |
| providerId | ObjectId | Required, Ref: ServiceProvider | Service provider reference |
| serviceId | ObjectId | Required, Ref: Service | Service reference |
| bookingDate | Date | Required | Scheduled booking date |
| bookingTime | String | Required, Format: HH:MM | Scheduled time |
| priority | Enum | Default: 'normal' | 'normal' or 'urgent' |
| serviceAddress | Object | Optional | Service location |
| serviceAddress.sameAsSeeker | Boolean | Default: true | Use seeker's address |
| serviceAddress.street | String | Optional | Street address |
| serviceAddress.city | String | Optional | City name |
| serviceAddress.state | String | Optional | State name |
| serviceAddress.pinCode | String | Optional | Postal code |
| serviceAddress.coordinates | Object | Optional | GeoJSON Point |
| additionalNote | String | Optional, Max: 500 chars | Special instructions |
| basePrice | Number | Required, Min: 0 | Base service price |
| visitingCharge | Number | Default: 0, Min: 0 | Visiting fee |
| extraCharge | Number | Default: 0, Min: 0 | Additional charges |
| platformFee | Number | Default: 0, Min: 0 | Platform commission |
| totalPrice | Number | Required, Min: 0 | Final total price |
| paymentStatus | Enum | Default: 'pending' | Payment status |
| paymentStatus.values | Array | pending, paid, failed, refunded, partially-refunded, visiting-paid, fully-paid | Payment states |
| paymentMethod | Enum | Default: 'stripe' | Payment method used |
| paymentMethod.values | Array | stripe, razorpay, cash, bank-transfer, online | Payment methods |
| paymentId | String | Optional | External payment reference |
| status | Enum | Default: 'pending' | Booking status |
| status.values | Array | pending, accepted, rejected, confirmed, in-progress, completed, cancelled, disputed | Booking states |
| rejectionReason | String | Optional | Reason for rejection |
| cancellationReason | String | Optional | Reason for cancellation |
| cancelledBy | Enum | Optional | Who cancelled: 'seeker', 'provider', 'system', 'admin' |
| completedAt | Date | Optional | Completion timestamp |
| finalWorkDetails | Array[Object] | Optional | Work itemized details |
| finalWorkDetails[].description | String | Optional | Work description |
| finalWorkDetails[].amount | Number | Optional | Work amount |
| invoiceId | ObjectId | Optional, Ref: Invoice | Related invoice |
| providerNotes | String | Optional | Provider notes |
| seekerFeedback | String | Optional | Seeker feedback |
| isReviewed | Boolean | Default: false | Review submitted |
| reviewReminderDate | Date | Optional | Review reminder date |
| createdAt | Date | Auto | Record creation timestamp |
| updatedAt | Date | Auto | Record last update timestamp |

---

## Review

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| _id (PK) | ObjectId | Primary Key, Auto | Unique review identifier |
| bookingId | ObjectId | Required, Unique, Ref: Booking | Associated booking |
| seekerId | ObjectId | Required, Ref: ServiceSeeker | Reviewer reference |
| providerId | ObjectId | Required, Ref: ServiceProvider | Provider being reviewed |
| rating | Number | Required, Min: 1, Max: 5 | Rating score (1-5) |
| reviewText | String | Optional, Max: 1000 chars | Review comment |
| likes | Number | Default: 0 | Like count |
| dislikes | Number | Default: 0 | Dislike count |
| providerReply | Object | Optional | Provider's response |
| providerReply.text | String | Optional | Reply text |
| providerReply.repliedAt | Date | Optional | Reply timestamp |
| isReadByProvider | Boolean | Default: false | Read status |
| isEdited | Boolean | Default: false | Edit status |
| editedAt | Date | Optional | Last edit timestamp |
| createdAt | Date | Auto | Record creation timestamp |
| updatedAt | Date | Auto | Record last update timestamp |

---

## Payment

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| _id (PK) | ObjectId | Primary Key, Auto | Unique payment identifier |
| userId | ObjectId | Required, Ref: User | User who made payment |
| subscriptionId | ObjectId | Optional, Ref: Subscription | Related subscription |
| plan | String | Required | Subscription plan name |
| duration | Enum | Required | 'monthly' or 'yearly' |
| amount | Number | Required | Payment amount |
| method | Enum | Required | Payment method |
| method.values | Array | card, upi, netbanking, wallet | Payment methods |
| status | Enum | Default: 'pending' | Payment status |
| status.values | Array | success, failed, pending | Payment states |
| transactionId | String | Unique | External transaction ID |
| cardLast4 | String | Optional | Last 4 digits of card |
| cardType | String | Optional | Card type (Visa, Mastercard, etc.) |
| createdAt | Date | Auto | Record creation timestamp |

---

## Invoice

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| _id (PK) | ObjectId | Primary Key, Auto | Unique invoice identifier |
| invoiceNumber | String | Unique, Auto | Generated invoice number (CV-YYYYMM-XXXX) |
| bookingId | ObjectId | Required, Ref: Booking | Related booking |
| providerId | ObjectId | Required, Ref: ServiceProvider | Service provider |
| seekerId | ObjectId | Required, Ref: ServiceSeeker | Service seeker |
| items | Array[Object] | Required | Invoice line items |
| items[].description | String | Required | Item description |
| items[].amount | Number | Required | Item amount |
| visitingCharge | Number | Default: 0 | Visiting fee |
| subTotal | Number | Required | Subtotal before fees |
| platformFee | Number | Required | Platform commission (2%) |
| grandTotal | Number | Required | Total amount |
| netEarnings | Number | Required | Provider earnings (grandTotal - platformFee) |
| paymentMethod | Enum | Required | 'cash' or 'online' |
| paymentStatus | Enum | Default: 'pending' | Payment status |
| paymentStatus.values | Array | pending, paid, failed, refunded | Payment states |
| invoiceDate | Date | Auto | Invoice generation date |
| pdfUrl | String | Optional | URL to PDF invoice |
| createdAt | Date | Auto | Record creation timestamp |
| updatedAt | Date | Auto | Record last update timestamp |

---

## Notification

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| _id (PK) | ObjectId | Primary Key, Auto | Unique notification identifier |
| userId | ObjectId | Required, Ref: User | Target user |
| bookingId | ObjectId | Optional, Ref: Booking | Related booking |
| title | String | Required | Notification title |
| message | String | Required | Notification content |
| category | Enum | Default: 'system' | Notification category |
| category.values | Array | booking, payment, verification, system, promotion, review | Categories |
| type | Enum | Default: 'info' | Notification type |
| type.values | Array | info, success, warning, error | Display types |
| isRead | Boolean | Default: false | Read status |
| readAt | Date | Optional | When notification was read |
| actionUrl | String | Optional | Deep link URL |
| metadata | Mixed | Optional | Additional data |
| createdAt | Date | Auto | Record creation timestamp |

---

## Message

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| _id (PK) | ObjectId | Primary Key, Auto | Unique message identifier |
| bookingId | ObjectId | Required, Ref: Booking | Associated booking |
| senderId | ObjectId | Required, Ref: User | Message sender |
| receiverId | ObjectId | Required, Ref: User | Message recipient |
| message | String | Required | Message content |
| attachments | Array[Object] | Optional | File attachments |
| attachments[].fileUrl | String | Optional | File URL |
| attachments[].fileType | String | Optional | MIME type |
| attachments[].fileName | String | Optional | Original filename |
| isRead | Boolean | Default: false | Read status |
| readAt | Date | Optional | When message was read |
| createdAt | Date | Auto | Record creation timestamp |
| updatedAt | Date | Auto | Record last update timestamp |

---

## Token

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| _id (PK) | ObjectId | Primary Key, Auto | Unique token identifier |
| userId | ObjectId | Required, Ref: User | Token owner |
| refreshToken | String | Required | JWT refresh token |
| userAgent | String | Required | Browser/client info |
| ipAddress | String | Required | Client IP address |
| expiresAt | Date | Required | Token expiry date |
| createdAt | Date | Auto | Record creation timestamp |

---

## ContactSubmission

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| _id (PK) | ObjectId | Primary Key, Auto | Unique submission identifier |
| name | String | Required | Submitter's name |
| email | String | Required, Lowercase | Contact email |
| phone | String | Optional | Contact phone |
| subject | String | Required | Message subject |
| message | String | Required, Min: 10, Max: 5000 | Message content |
| status | Enum | Default: 'pending' | Resolution status |
| status.values | Array | pending, reviewed, resolved | Status values |
| adminNotes | String | Optional | Admin notes |
| createdAt | Date | Auto | Record creation timestamp |
| updatedAt | Date | Auto | Record last update timestamp |

---

## FavouriteServiceProvider

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| _id (PK) | ObjectId | Primary Key, Auto | Unique favorite identifier |
| seekerId | ObjectId | Required, Ref: ServiceSeeker | Seeker who favorited |
| providerId | ObjectId | Required, Ref: ServiceProvider | Favorited provider |
| createdAt | Date | Auto | Record creation timestamp |

---

## GlobalSettings

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| _id (PK) | ObjectId | Primary Key, Auto | Unique setting identifier |
| commissionPercentage | Number | Default: 10, Min: 0, Max: 100 | Platform commission % |
| minPayoutAmount | Number | Default: 500, Min: 0 | Minimum payout threshold |
| visitingFee | Number | Default: 200 | Default visiting fee |
| updatedBy | ObjectId | Optional, Ref: User | Admin who updated |
| createdAt | Date | Auto | Record creation timestamp |
| updatedAt | Date | Auto | Record last update timestamp |

---

## ProviderPortfolio

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| _id (PK) | ObjectId | Primary Key, Auto | Unique portfolio item ID |
| providerId | ObjectId | Required, Ref: ServiceProvider | Provider reference |
| imageUrl | String | Required | Portfolio image URL |
| caption | String | Optional, Max: 200 chars | Image caption |
| category | Enum | Default: 'other' | Image category |
| category.values | Array | before, after, work-in-progress, certification, other | Categories |
| isActive | Boolean | Default: true | Display status |
| createdAt | Date | Auto | Record creation timestamp |

---

## ProviderSchedule

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| _id (PK) | ObjectId | Primary Key, Auto | Unique schedule identifier |
| providerId | ObjectId | Required, Unique, Ref: ServiceProvider | Provider reference |
| responseTime | Enum | Default: 'within-2-hours' | Expected response time |
| responseTime.values | Array | within-30-min, within-1-hour, within-2-hours, within-4-hours, next-day | Response options |
| serviceAreaRadius | Number | Default: 10, Min: 1, Max: 100 | Service radius in km |
| weeklySchedule | Object | Default: Standard hours | Weekly availability |
| weeklySchedule.{day}.isAvailable | Boolean | Default varies | Day availability |
| weeklySchedule.{day}.startTime | String | Default varies | Start time (HH:MM) |
| weeklySchedule.{day}.endTime | String | Default varies | End time (HH:MM) |
| isAvailable | Boolean | Default: true | Overall availability |
| createdAt | Date | Auto | Record creation timestamp |
| updatedAt | Date | Auto | Record last update timestamp |

---

## ProviderService

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| _id (PK) | ObjectId | Primary Key, Auto | Unique service identifier |
| providerId | ObjectId | Required, Unique, Ref: ServiceProvider | Provider reference |
| mainService | Object | Required | Primary service |
| mainService.name | String | Required | Service name |
| mainService.serviceId | ObjectId | Optional, Ref: Service | Service reference |
| subServices | Array[Object] | Optional | Additional services |
| subServices[].name | String | Required | Sub-service name |
| subServices[].serviceId | ObjectId | Optional, Ref: Service | Service reference |
| customService | Object | Optional | Custom service request |
| customService.status | Enum | Default: 'pending' | Approval status |
| minPrice | Number | Required, Min: 0 | Minimum price |
| maxPrice | Number | Optional, Min: 0 | Maximum price |
| pricingType | Enum | Default: 'fixed' | Price calculation type |
| pricingType.values | Array | hourly, fixed, square-feet, project | Pricing models |
| isAvailable | Boolean | Default: true | Service availability |
| createdAt | Date | Auto | Record creation timestamp |
| updatedAt | Date | Auto | Record last update timestamp |

---

## ProviderSettings

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| _id (PK) | ObjectId | Primary Key, Auto | Unique settings identifier |
| providerId | ObjectId | Required, Unique, Ref: ServiceProvider | Provider reference |
| notifications | Object | Default: All true | Notification preferences |
| notifications.newBooking | Boolean | Default: true | New booking alerts |
| notifications.bookingUpdate | Boolean | Default: true | Booking updates |
| notifications.paymentReceived | Boolean | Default: true | Payment alerts |
| notifications.newReview | Boolean | Default: true | Review alerts |
| notifications.promotional | Boolean | Default: false | Promotional alerts |
| notifications.email | Boolean | Default: true | Email notifications |
| notifications.push | Boolean | Default: true | Push notifications |
| notifications.sms | Boolean | Default: false | SMS notifications |
| autoAcceptBooking | Boolean | Default: false | Auto-accept bookings |
| maxDailyBookings | Number | Default: 5, Min: 1 | Maximum daily bookings |
| showPhone | Boolean | Default: false | Display phone number |
| showEmail | Boolean | Default: false | Display email |
| showExactAddress | Boolean | Default: false | Show exact location |
| showRatings | Boolean | Default: true | Display ratings |
| showPortfolio | Boolean | Default: true | Display portfolio |
| createdAt | Date | Auto | Record creation timestamp |
| updatedAt | Date | Auto | Record last update timestamp |

---

## ProviderSubscription

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| _id (PK) | ObjectId | Primary Key, Auto | Unique subscription identifier |
| providerId | ObjectId | Required, Ref: ServiceProvider | Provider reference |
| subscriptionId | ObjectId | Required, Ref: Subscription | Subscription plan reference |
| startDate | Date | Required, Auto | Subscription start |
| endDate | Date | Required | Subscription end |
| paymentId | String | Optional | Payment reference |
| paymentStatus | Enum | Default: 'pending' | Payment status |
| paymentStatus.values | Array | pending, paid, failed, refunded | Payment states |
| isActive | Boolean | Default: true | Active status |
| autoRenew | Boolean | Default: false | Auto-renewal enabled |
| cancelledAt | Date | Optional | Cancellation timestamp |
| cancellationReason | String | Optional | Cancellation reason |
| createdAt | Date | Auto | Record creation timestamp |
| updatedAt | Date | Auto | Record last update timestamp |

---

## ProviderSupportRequest

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| _id (PK) | ObjectId | Primary Key, Auto | Unique request identifier |
| providerId | ObjectId | Required, Ref: ServiceProvider | Provider reference |
| title | String | Required | Support request title |
| description | String | Required, Min: 10, Max: 5000 | Issue description |
| category | Enum | Default: 'other' | Issue category |
| category.values | Array | technical, billing, account, booking, verification, other | Categories |
| priority | Enum | Default: 'medium' | Issue priority |
| priority.values | Array | low, medium, high, urgent | Priority levels |
| attachments | Array[Object] | Optional | Supporting files |
| attachments[].url | String | Optional | File URL |
| attachments[].filename | String | Optional | Original filename |
| status | Enum | Default: 'open' | Request status |
| status.values | Array | open, in-progress, resolved, closed | Status values |
| adminNotes | String | Optional | Admin notes |
| createdAt | Date | Auto | Record creation timestamp |
| updatedAt | Date | Auto | Record last update timestamp |
| resolvedAt | Date | Optional | Resolution timestamp |

---

## ProviderVerification

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| _id (PK) | ObjectId | Primary Key, Auto | Unique verification ID |
| providerId | ObjectId | Required, Ref: ServiceProvider | Provider reference |
| documents | Array[Object] | Required | Verification documents |
| documents[].documentType | Enum | Required | Document type |
| documents[].documentType.values | Array | business-registration, government-id, address-proof, tax-certificate, insurance | Document types |
| documents[].documentUrl | String | Required | Document URL |
| documents[].status | Enum | Default: 'pending' | Document status |
| documents[].status.values | Array | pending, approved, rejected | Status values |
| documents[].uploadedAt | Date | Auto | Upload timestamp |
| documents[].reviewedAt | Date | Optional | Review timestamp |
| documents[].rejectionReason | String | Optional | Rejection reason |
| overallStatus | Enum | Default: 'pending' | Overall verification status |
| overallStatus.values | Array | pending, approved, rejected | Status values |
| reviewedBy | ObjectId | Optional, Ref: User | Admin reviewer |
| reviewedAt | Date | Optional | Review timestamp |
| rejectionReason | String | Optional | Overall rejection reason |
| createdAt | Date | Auto | Record creation timestamp |
| updatedAt | Date | Auto | Record last update timestamp |

---

## Subscription

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| _id (PK) | ObjectId | Primary Key, Auto | Unique subscription identifier |
| providerId | ObjectId | Required, Ref: ServiceProvider | Provider reference |
| plan | Enum | Required | Subscription plan |
| plan.values | Array | Basic, Professional, Business, Enterprise | Plan names |
| amount | Number | Required | Subscription amount |
| duration | Enum | Required | Billing cycle |
| duration.values | Array | monthly, yearly | Billing periods |
| status | Enum | Default: 'active' | Subscription status |
| status.values | Array | active, cancelled, expired | Status values |
| paymentDetails | Object | Optional | Payment information |
| paymentDetails.transactionId | String | Optional | Transaction ID |
| paymentDetails.method | String | Optional | Payment method |
| paymentDetails.cardLast4 | String | Optional | Card last 4 digits |
| paymentDetails.cardType | String | Optional | Card type |
| startDate | Date | Auto | Subscription start |
| endDate | Date | Required | Subscription end |
| autoRenew | Boolean | Default: false | Auto-renewal status |
| createdAt | Date | Auto | Record creation timestamp |

---

## PayoutRequest

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| _id (PK) | ObjectId | Primary Key, Auto | Unique payout identifier |
| providerId | ObjectId | Required, Ref: ServiceProvider | Provider reference |
| amount | Number | Required | Payout amount |
| bankDetails | Object | Optional | Bank information |
| bankDetails.accountHolder | String | Optional | Account holder |
| bankDetails.accountNumber | String | Optional | Account number |
| bankDetails.bankName | String | Optional | Bank name |
| bankDetails.ifscCode | String | Optional | IFSC code |
| status | Enum | Default: 'pending' | Payout status |
| status.values | Array | pending, processing, completed, failed | Status values |
| payoutDate | Date | Optional | Actual payout date |
| transactionReference | String | Optional | Bank transaction ID |
| remarks | String | Optional | Admin remarks |
| createdAt | Date | Auto | Record creation timestamp |
| updatedAt | Date | Auto | Record last update timestamp |

---

## WalletTransaction

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| _id (PK) | ObjectId | Primary Key, Auto | Unique transaction identifier |
| providerId | ObjectId | Required, Ref: ServiceProvider | Provider reference |
| type | Enum | Required | Transaction type |
| type.values | Array | topup, commission_deduction, online_earning, payout, refund | Transaction types |
| amount | Number | Required | Transaction amount |
| balanceAfter | Number | Required | Balance after transaction |
| bookingId | ObjectId | Optional, Ref: Booking | Related booking |
| invoiceId | ObjectId | Optional, Ref: Invoice | Related invoice |
| description | String | Optional | Transaction description |
| status | Enum | Default: 'success' | Transaction status |
| status.values | Array | pending, success, failed | Status values |
| transactionDate | Date | Auto | Transaction timestamp |
| createdAt | Date | Auto | Record creation timestamp |
| updatedAt | Date | Auto | Record last update timestamp |

---

## Appendix: Common Field Types

| Type | Description |
|------|-------------|
| ObjectId | MongoDB auto-generated unique identifier |
| String | Text data |
| Number | Numeric data (Integer or Decimal) |
| Boolean | True/False value |
| Date | Date and time |
| Enum | Predefined set of allowed values |
| Array | List of values |
| Object | Nested document structure |
| Mixed | Flexible schema type |

## Appendix: Common Constraints

| Constraint | Description |
|------------|-------------|
| Primary Key | Unique identifier for the record |
| Required | Field must have a value |
| Unique | No duplicate values allowed |
| Default | Value used if none provided |
| Auto | Value automatically generated |
| Ref | Reference to another collection |
| Min/Max | Value boundaries |
| Optional | Field may be null or omitted |
