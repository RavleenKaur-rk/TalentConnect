# 🚀 Quick Setup Guide - Firebase Ready

Your project is now **100% Firebase-ready**! Follow these 4 simple steps to get everything running.

---

## **Step 1: Install Backend Dependencies** (2 minutes)

```bash
cd e:\TalentConnect\server
npm install
```

---

## **Step 2: Get Firebase Service Account Key** (3 minutes)

1. Open [Firebase Console](https://console.firebase.google.com)
2. Select your project **talent-f474d**
3. Go to ⚙️ **Settings** → **Service Accounts** tab
4. Click **Generate New Private Key**
5. Save the file as `e:\TalentConnect\server\firebase-key.json`

---

## **Step 3: Import Sample Data** (1 minute)

```bash
cd e:\TalentConnect\server
node import-firebase-data.js
```

You should see:
```
✅ Data import completed successfully!
📊 Summary:
   • Users: 10
   • Events: 2
   • Bookings: 3
   • Pending Bookings: 3
```

---

## **Step 4: Run the Application** (simultaneous in 2 terminals)

**Terminal 1 - Backend:**
```bash
cd e:\TalentConnect\server
npm start
```
→ Runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd e:\TalentConnect
npm run dev
```
→ Runs on `http://localhost:5173`

---

## ✅ All Done!

Open `http://localhost:5173` in your browser and test the app! 🎉

---

## 📝 What Changed

### ✅ Removed (MySQL Files)
- `init-db-simple.js`
- `init-db-v2.js`
- `init-db.js`
- `server.js`
- `mysql-client.js`
- `remove-columns.js`
- `show-data.js`
- `config/` folder
- `database/` folder
- MySQL routes

### ✅ Added (Firebase)
- `import-firebase-data.js` - Import script
- Updated `package.json` - Now uses firebase-admin
- Updated `.env` - Firebase credentials ready

### ✅ Kept (Firebase Routes)
- `server-firebase.js` - Main backend
- `routes/auth-firebase.js`
- `routes/events-firebase.js`
- `routes/bookings-firebase.js`
- `routes/users-firebase.js`

---

## 🔒 Security Notes

1. **Never commit `firebase-key.json` to GitHub** - It's in `.gitignore`
2. **Keep your API keys secret** - They're in `.env`
3. **Use environment variables** - Never hardcode credentials

---

## 🆘 Need Help?

- **Firebase issues?** → https://console.firebase.google.com
- **Backend problems?** → Check `server-firebase.js`
- **Frontend issues?** → Check `src/services/firebaseApi.js`

---

## 📚 Full Documentation

See `FIREBASE_SETUP_COMPLETE.md` for detailed setup and API documentation.
