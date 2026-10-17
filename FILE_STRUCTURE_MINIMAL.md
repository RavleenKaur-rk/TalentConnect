# 📁 TalentConnect - Minimal File Structure

## Quick Overview

```
TalentConnect/
├── 📂 public/                  (Static HTML files)
├── 📂 src/                     (React app)
│   ├── 📂 components/          (Reusable components)
│   ├── 📂 pages/               (14 page components)
│   ├── 📂 services/            (api.js, firebase.js)
│   ├── 📂 utils/               (constants.js, helpers.js)
│   ├── 📂 styles/              (CSS files)
│   ├── App.jsx                 (Root component)
│   └── main.jsx                (Entry point)
│
├── 📂 server/                  (Node.js backend)
│   ├── 📂 routes/              (4 Firebase route files)
│   ├── 📂 config/              (firebase.js)
│   ├── 📂 middleware/          (Auth middleware)
│   ├── server-firebase.js      (Main server)
│   ├── import-firebase-data.js (Data import script)
│   └── package.json
│
├── .env                        (Firebase config)
├── package.json               (Frontend dependencies)
├── vite.config.js            (Vite config)
└── index.html                (HTML entry point)
```

---

## Core Files Only

### Frontend - src/
```
src/
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── BrowseEvents.jsx
│   ├── EventDetails.jsx
│   ├── EventBooking.jsx
│   ├── Payment.jsx
│   ├── Profile.jsx
│   ├── OrganizerDashboard.jsx
│   ├── HostEvent.jsx
│   ├── OrganizerVerification.jsx
│   ├── AboutUs.jsx
│   ├── ContactUs.jsx
│   ├── PrivacyPolicy.jsx
│   └── TermsConditions.jsx
│
├── components/
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   └── SignupForm.jsx
│   ├── common/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Notification.jsx
│   │   └── LoadingSpinner.jsx
│   ├── events/
│   │   ├── EventCard.jsx
│   │   ├── EventDetails.jsx
│   │   └── EventFilters.jsx
│   ├── profile/
│   │   ├── ProfileInfo.jsx
│   │   ├── BookingCard.jsx
│   │   └── StatsCard.jsx
│   └── context/
│       └── AuthContext.jsx
│
├── services/
│   ├── api.js
│   └── firebase.js
│
├── utils/
│   ├── constants.js
│   └── helpers.js
│
├── styles/
│   ├── global.css
│   └── [component-specific CSS]
│
├── App.jsx
├── main.jsx
└── hooks/
    ├── useAuth.js
    ├── useEvents.js
    └── useBookings.js
```

### Backend - server/
```
server/
├── routes/
│   ├── auth-firebase.js
│   ├── events-firebase.js
│   ├── bookings-firebase.js
│   └── users-firebase.js
│
├── config/
│   └── firebase.js
│
├── middleware/
│   └── auth.js
│
├── server-firebase.js
├── import-firebase-data.js
├── package.json
└── .env
```

---

## What Each Folder Does

| Folder | Purpose |
|--------|---------|
| `src/pages/` | Full page components (14 pages) |
| `src/components/` | Reusable UI components |
| `src/services/` | API & Firebase integration |
| `src/utils/` | Helper functions & constants |
| `src/styles/` | CSS stylesheets |
| `src/hooks/` | Custom React hooks |
| `server/routes/` | API endpoints (4 modules) |
| `server/config/` | Firebase admin setup |
| `server/middleware/` | Authentication logic |

---

## Key Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Root component with routing |
| `src/main.jsx` | React entry point |
| `src/services/firebase.js` | Firebase config |
| `src/services/api.js` | API calls |
| `src/components/context/AuthContext.jsx` | Global auth state |
| `server/server-firebase.js` | Express server (port 5000) |
| `server/routes/*-firebase.js` | API endpoint handlers |
| `.env` | Firebase credentials |
| `vite.config.js` | Vite development config |
| `package.json` | Frontend dependencies |

---

## How to Navigate

1. **For Pages** → `src/pages/` (14 components)
2. **For Reusable Components** → `src/components/`
3. **For State Management** → `src/components/context/AuthContext.jsx`
4. **For Data Fetching** → `src/services/` (api.js, firebase.js)
5. **For API Endpoints** → `server/routes/` (4 files)
6. **For Configuration** → `.env` (Firebase), `vite.config.js`

---

## Quick Stats

- **Pages**: 14
- **Components**: 13+
- **Backend Routes**: 4
- **API Endpoints**: 15+
- **Database Collections**: 4 (Firestore)
- **Total Frontend Files**: 30+
