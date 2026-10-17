# TalentConnect - PlantUML Activity Diagrams

## 1. User Authentication Flow

```plantuml
@startuml User_Authentication
title User Authentication Flow

start
:User visits Login/Signup page;
:Enter email and password;
if (Signup?) then (Yes)
  :Enter name and select user type;
  :Call /api/auth/signup;
  :Firebase creates user account;
  :Store user in Firestore;
  :Generate JWT token;
  :Redirect to Home;
else (No - Login)
  :Call /api/auth/login;
  :Verify credentials via Firebase;
  :Generate JWT token;
  :Store token in localStorage;
  :Redirect to Home;
endif
:Update AuthContext with user data;
:User is authenticated;
stop

@enduml
```

---

## 2. Event Browsing & Discovery

```plantuml
@startuml Event_Discovery
title Event Discovery & Browsing Flow

start
:User lands on Browse Events page;
:Load all events from Firebase;
:Display event list with EventCard;
if (Apply filters?) then (Yes)
  :Select category filter;
  :Select price range;
  :Select date range;
  :Select location;
  :Backend filters events;
  :Display filtered results;
else (No)
  :Show all events;
endif
if (Search for event?) then (Yes)
  :Enter search query;
  :Backend searches by name/description;
  :Display search results;
else (No)
  :Continue browsing;
endif
:User clicks on EventCard;
:Navigate to EventDetails page;
:Load full event information;
:Show organizer profile;
:Display reviews and ratings;
:User can Book Event;
stop

@enduml
```

---

## 3. Event Booking & Payment

```plantuml
@startuml Event_Booking_Payment
title Event Booking & Payment Flow

start
:User clicks "Book Now" on event;
:Navigate to EventBooking page;
:Display event details and pricing;
:User selects ticket quantity;
:Calculate total amount (tickets + fees + GST);
:User fills attendee details;
if (Event has custom questions?) then (Yes)
  :User answers custom questions;
else (No)
  :Skip custom questions;
endif
:Display order summary;
:User clicks "Proceed to Payment";
:Create pending booking in Firebase;
:Redirect to Payment page;
:Initialize Razorpay payment gateway;
:User selects payment method (UPI/Card/Wallet);
:Complete payment on Razorpay;
if (Payment successful?) then (Yes)
  :Update booking status to "confirmed";
  :Update event availableTickets;
  :Send confirmation email;
  :Create transaction record;
  :Redirect to confirmation page;
else (No - Payment failed)
  :Delete pending booking;
  :Show error message;
  :Offer retry option;
endif
stop

@enduml
```

---

## 4. Organizer Event Creation

```plantuml
@startuml Organizer_Create_Event
title Organizer - Create Event Flow

start
:Organizer clicks "Host Event";
:Navigate to HostEvent page;
:Fill event basic info (name, description);
:Select event category;
:Choose event type (In-person/Online);
if (In-person?) then (Yes)
  :Enter venue name and address;
else (No - Online)
  :Enter event link/meeting URL;
endif
:Select date and time;
:Upload event image;
:Set ticket price and total tickets;
:Define custom questions (optional);
:Click "Create Event";
:Validate form data;
:Call /api/events POST endpoint;
:Save event to Firestore;
:Event status = "draft";
:Generate unique eventId;
if (Publish event?) then (Yes)
  :Update status to "published";
  :Event visible to all users;
else (No - Save as draft)
  :Event only visible to organizer;
endif
:Redirect to OrganizerDashboard;
stop

@enduml
```

---

## 5. Organizer Dashboard & Management

```plantuml
@startuml Organizer_Dashboard
title Organizer Dashboard Flow

start
:Organizer logs in;
:Navigate to Dashboard;
:Load organizer's events from Firestore;
:Load organizer's bookings;
:Calculate revenue statistics;
:Display stats cards (Total Events, Bookings, Revenue);
if (View event details?) then (Yes)
  :Click on event;
  :Show event analytics;
  :Display booking list for event;
  :Show revenue breakdown;
else (No)
  :View all events list;
endif
if (Edit event?) then (Yes)
  :Click edit button;
  :Update event details;
  :Call /api/events PUT endpoint;
  :Update Firestore;
else (No)
  :Continue browsing;
endif
if (Cancel event?) then (Yes)
  :Confirm cancellation;
  :Call /api/events DELETE endpoint;
  :Update event status = "canceled";
  :Notify all booked users;
  :Process refunds if needed;
else (No)
  :Keep event active;
endif
:View booking requests;
:Approve or reject bookings;
stop

@enduml
```

---

## 6. Organizer Verification (KYC)

```plantuml
@startuml Organizer_Verification
title Organizer Verification & KYC Flow

start
:New organizer accesses Verification page;
:Step 1: Phone Verification;
:Enter phone number;
:Receive OTP via SMS;
:Enter OTP;
:Verify phone in Firebase;
:Step 2: Email Verification;
:Verify email is confirmed;
:Step 3: Business Information;
:Fill business name and type;
:Enter address, city, state, zipCode;
:Enter tax ID (GST);
:Step 4: Bank Details;
:Enter account number;
:Enter IFSC code;
:Enter account holder name;
:Step 5: Payment for Verification;
:Click "Pay Verification Fee";
:Initialize Razorpay payment;
:Complete payment;
if (Payment successful?) then (Yes)
  :Update verification status = "pending";
  :Store all business info in Firestore;
  :Create verification request;
  :Wait for admin approval;
else (No - Payment failed)
  :Show retry option;
endif
:Admin reviews verification details;
if (Approved?) then (Yes)
  :Update organizerVerified = true;
  :Set verificationStatus = "verified";
  :Send approval email;
else (No - Rejected)
  :Set verificationStatus = "rejected";
  :Send rejection with reason;
  :Allow re-submission;
endif
:Organizer can now host events;
stop

@enduml
```

---

## 7. User Profile Management

```plantuml
@startuml User_Profile_Management
title User Profile Management Flow

start
:User navigates to Profile page;
:Load user data from Firebase;
:Display profile information;
:Show ProfileInfo component;
:Show user stats (StatsCard);
:Display total bookings, amount spent, member since;
if (Edit profile?) then (Yes)
  :Click "Edit Profile";
  :Enable edit mode;
  :User updates name, phone, avatar;
  :Call /api/users/:userId PUT endpoint;
  :Update Firestore user document;
  :Show success message;
else (No)
  :View profile only;
endif
if (Change password?) then (Yes)
  :Click "Change Password";
  :Enter old password;
  :Enter new password;
  :Verify via Firebase Auth;
  :Update password in Firebase;
  :Show success message;
else (No)
  :Keep current password;
endif
if (User is organizer?) then (Yes)
  :Show organizer verification status;
  :Display business information;
  :Show bank details;
else (No)
  :Show customer dashboard link;
endif
:User can view/download receipt history;
stop

@enduml
```

---

## 8. My Bookings & History

```plantuml
@startuml My_Bookings
title My Bookings & History Flow

start
:User navigates to My Bookings;
:Load user bookings from Firebase;
:Call /api/bookings/my-bookings/:userId;
:Fetch all user bookings;
:Categorize bookings by status;
if (Show upcoming events?) then (Yes)
  :Filter bookings with date > today;
  :Display as Upcoming Events section;
  :Show event details via BookingCard;
else (No)
  :Skip upcoming section;
endif
if (Show past events?) then (Yes)
  :Filter bookings with date < today and status="confirmed";
  :Display as Past Events section;
  :Show review/rating option;
else (No)
  :Skip past section;
endif
if (Show canceled bookings?) then (Yes)
  :Filter bookings with status="canceled";
  :Display as Canceled Events section;
  :Show refund status;
else (No)
  :Skip canceled section;
endif
:User clicks on booking;
:Display booking details;
:Show ticket information;
:Show event details;
:Show payment details;
if (Cancel booking?) then (Yes)
  :Click "Cancel Booking";
  :Confirm cancellation;
  :Call /api/bookings/:id DELETE endpoint;
  :Update booking status = "canceled";
  :Process refund;
  :Show refund status;
else (No)
  :Keep booking active;
endif
stop

@enduml
```

---

## 9. Complete User Journey (End-to-End)

```plantuml
@startuml Complete_User_Journey
title Complete TalentConnect User Journey

start
:New User visits website;
:Navigate to Login/Signup;
:Create account (signup);
:Verify email;
:Redirect to Home page;
:Browse featured events;
:Navigate to Browse Events;
:Filter and search events;
:Select an event;
:View event details and reviews;
:Click "Book Now";
:Fill booking form (tickets + attendees);
:Review order summary;
:Proceed to payment;
:Complete Razorpay payment;
:Booking confirmed;
:Receive confirmation email;
:Navigate to My Bookings;
:View upcoming events;
:Event date arrives;
:Attend event;
:Post-event, leave review/rating;
:Event appears in Past Events;
:View profile and booking history;
:Can book more events;
end

@enduml
```

---

## 10. Organizer Complete Journey

```plantuml
@startuml Organizer_Complete_Journey
title Complete Organizer Journey

start
:Organizer signs up;
:Navigate to Verification page;
:Complete KYC process;
:Submit business details;
:Pay verification fee;
:Admin approves verification;
:Organizer gets "verified" badge;
:Navigate to Host Event page;
:Create first event;
:Add event details and pricing;
:Upload event image;
:Publish event;
:Event goes live;
:Users can book tickets;
:Navigate to Dashboard;
:Monitor booking requests;
:View event analytics;
:Track revenue;
:Process booking approvals;
:View upcoming bookings;
:Event date arrives;
:Receive payment from platform;
:Can create more events;
:View profile stats;
:Update business information;
end

@enduml
```

---

## 11. Admin Payment Processing

```plantuml
@startuml Admin_Payment_Processing
title Payment Processing & Revenue Flow

start
:Customer completes booking payment;
:Razorpay processes payment;
:Payment successful;
:Create Transaction record in Firestore;
:Store: bookingId, userId, organizerId, amount;
:Deduct platform fee (10-15%);
:Deduct GST (18%);
:Calculate organizer payout;
if (Payout >= minimum amount?) then (Yes)
  :Add to organizer's payout queue;
else (No)
  :Hold payout until threshold reached;
endif
:Weekly payout cycle;
:Calculate total payout for organizer;
:Process payment to organizer bank account;
:Send payout confirmation email;
:Update transaction status = "completed";
:If payment fails;
:Retry payment next cycle;
:Log failed transaction;
stop

@enduml
```

---

## 12. Real-Time Notifications

```plantuml
@startuml Real_Time_Notifications
title Real-Time Notifications & Events

start
:Event triggers in system;
:Check notification rules;
if (New booking?) then (Yes)
  :Send email to organizer;
  :Update dashboard in real-time;
  :Show booking notification;
else if (Payment completed?) then (Yes)
  :Send confirmation email to customer;
  :Send receipt;
else if (Booking canceled?) then (Yes)
  :Send cancellation email;
  :Show refund status;
else if (Event reminder?) then (Yes)
  :Send 1-day before reminder;
  :Send 1-hour before reminder;
else if (Review posted?) then (Yes)
  :Notify organizer of new review;
  :Update event rating;
endif
:Log notification in database;
:Track notification delivery status;
stop

@enduml
```

---

## How to Use These PlantUML Diagrams

### Option 1: PlantUML Online Editor
1. Visit: https://www.plantuml.com/plantuml/uml/
2. Paste any diagram code from above
3. Click "Submit"
4. View and export diagram

### Option 2: VS Code Extension
1. Install PlantUML extension: `jebbs.plantuml`
2. Copy diagram code into `.puml` or `.plantuml` file
3. Right-click → "Preview Diagram"
4. Export as PNG/SVG

### Option 3: Local PlantUML
```bash
# Install PlantUML
npm install -g plantuml

# Generate diagram
plantuml diagram.puml -o output/
```

### Option 4: Mermaid Syntax (Alternative)
If you prefer Mermaid instead of PlantUML, these can be converted to Mermaid syntax.

---

## Customization Tips

- **Change colors**: Add `!theme default` or custom theme
- **Adjust layout**: Use `skinparam` for positioning
- **Add notes**: Use `note left/right/top/bottom`
- **Highlight paths**: Use `if` conditions to show decision branches
- **Add actors**: Define swimlanes for different users (customer, organizer, admin)

---

## Example with Actors (Swimlanes)

```plantuml
@startuml Booking_with_Actors
title Event Booking Flow - With Actors

|Customer|
:User visits Browse Events;
|Backend|
:Fetch events from Firebase;
|Customer|
:Filter and select event;
:Navigate to event details;
|Backend|
:Load event data;
|Customer|
:Click "Book Now";
:Fill booking form;
|Backend|
:Create pending booking;
:Initialize Razorpay;
|Customer|
:Complete payment;
|Razorpay|
:Process payment;
|Backend|
:Confirm booking;
:Update database;
:Send confirmation email;
|Customer|
:View confirmation;

@enduml
```

---

**Copy any diagram code above and paste into PlantUML editor to visualize!**
