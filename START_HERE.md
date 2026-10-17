# 🎯 TalentConnect - RUNNING NOW!

## 📍 Access Your Project

### **Frontend** (React App)
👉 Open browser: **http://localhost:5173**

### **Backend API** (Node.js Server)
👉 API Base URL: **http://localhost:5000/api**
👉 Health Check: **http://localhost:5000/api/health**

### **Database** (MySQL)
```bash
mysql -u root -p123456 talentconnect
```

---

## 🗄️ Database Information

**Name**: talentconnect
**User**: root
**Password**: 123456
**Host**: localhost
**Port**: 3306

---

## 📊 Key Database Components Running

✅ **7 Tables**
- USER, CLIENT, ARTIST, CATEGORY, EVENT, BOOKING, TRANSACTION

✅ **2 Views**
- vw_active_events
- vw_booking_summary

✅ **3 Stored Procedures**
- sp_check_discount()
- sp_generate_reports()
- sp_create_booking()

✅ **1 Cursor Procedure**
- sp_process_bookings()

✅ **4 Triggers**
- trg_before_booking_insert
- trg_after_event_insert
- trg_after_transaction_insert
- trg_before_booking_delete

✅ **Sample Data**
- 5 Users
- 3 Events
- 3 Bookings
- 3 Transactions

---

## 🧪 Quick Test Commands

### **MySQL Test**
```bash
mysql -u root -p123456 -e "USE talentconnect; SELECT * FROM USER;"
```

### **Backend Test**
```bash
curl http://localhost:5000/api/health
```

### **Frontend Test**
Visit: http://localhost:5173

---

## 🔄 Running Services

| Service | URL | Status |
|---------|-----|--------|
| React Frontend | http://localhost:5173 | ✅ Running |
| Node Backend | http://localhost:5000 | ✅ Running |
| MySQL Database | localhost:3306 | ✅ Connected |

---

## 📚 Database Queries You Can Run

### **In MySQL Workbench or Command Line**

```sql
-- 1. See all users
SELECT * FROM USER;

-- 2. View all events
SELECT * FROM EVENT;

-- 3. Check bookings
SELECT * FROM BOOKING;

-- 4. View transactions
SELECT * FROM TRANSACTION;

-- 5. Complex JOIN query
SELECT E.EventType, U.UserName, C.CategoryName, E.Date
FROM EVENT E
JOIN ARTIST A ON E.ArtistId = A.ArtistId
JOIN USER U ON A.UserID = U.UserID
JOIN CATEGORY C ON E.CategoryID = C.CategoryID;

-- 6. Bookings with amount > 1000
SELECT * FROM BOOKING WHERE Amount > 1000;

-- 7. Call stored procedure
CALL sp_check_discount(1, @discount);
SELECT @discount;

-- 8. View active events
SELECT * FROM vw_active_events;

-- 9. View booking summary
SELECT * FROM vw_booking_summary;

-- 10. Process pending bookings
CALL sp_process_bookings();
```

---

## 🛑 Stop Services (If Needed)

**Stop Backend**: Press `Ctrl + C` in backend terminal
**Stop Frontend**: Press `Ctrl + C` in frontend terminal

---

## 🔄 Restart Services

### **Backend**
```bash
cd e:\TalentConnect\server
node server.js
```

### **Frontend**
```bash
cd e:\TalentConnect
npm run dev
```

### **Both Together** (2 separate terminals)
```bash
# Terminal 1 - Backend
cd e:\TalentConnect\server && node server.js

# Terminal 2 - Frontend
cd e:\TalentConnect && npm run dev
```

---

## 📁 All 30 Database Topics Covered

✅ Topic 1-5: ER Model, Relational Model, Attributes, Relationships
✅ Topic 13: DDL (CREATE), DML (INSERT, UPDATE, DELETE)
✅ Topic 14: WHERE Clause (Simple & Compound)
✅ Topic 15: DCL (GRANT, REVOKE)
✅ Topic 16: JOIN Queries (INNER, LEFT, Multi-table)
✅ Topic 17: Subqueries (Simple, Correlated, EXISTS)
✅ Topic 21: Views (2 complex views)
✅ Topic 19-23: Procedures (3 with loops & conditionals)
✅ Topic 21: Cursors (Batch processing)
✅ Topic 24: Triggers (4 types - BEFORE/AFTER)
✅ Topic 25-27: Transactions (ACID)
✅ Topic 28: Locking (Shared & Exclusive)

---

## 🎉 You're All Set!

Everything is running! 
- Open **http://localhost:5173** in your browser
- Explore the TalentConnect application
- Test database queries in MySQL
- Call stored procedures and triggers

**Enjoy!** 🚀

---

**Need Help?**
- Check PROJECT_RUNNING.md for detailed info
- Check MYSQL_SETUP.md for database setup
- Check QUICKSTART.md for quick start guide
