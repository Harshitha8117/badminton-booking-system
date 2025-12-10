# 🏸 **Badminton Court Booking System**

*A full-stack MERN application featuring atomic booking, admin configuration, dynamic pricing, and automatic PDF receipts.*

---

## 📌 **Overview**

The **Badminton Court Booking System** is a complete resource-booking platform that supports courts, coaches, equipment rentals, and dynamic pricing rules. It ensures **accurate availability**, **prevents double-booking**, and provides a **modern UI for both users and admins**.

The system includes:

* User booking interface
* Admin dashboard for all configurations
* Pricing engine supporting peak hours, indoor premiums, weekend surcharges
* Atomic concurrency protection (Lock-based algorithm)
* PDF receipt generation
* Booking history
* Database seeding
* One-click run script

This project satisfies all functional requirements of a modern resource-scheduling system.

---

## 🌟 **Key Features**

### 🧑‍💻 User Module

* Select court, coach, equipment
* Choose date & slot
* Live pricing update based on admin rules
* Prevents double-booking (atomic booking)
* Generates downloadable **PDF receipt**
* Clean Booking History page

### 🛠 Admin Dashboard

* Courts (CRUD)
* Coaches (CRUD + unavailable periods support)
* Equipment inventory
* Pricing rules (CRUD):
  ✔ Peak hours
  ✔ Weekend surcharge
  ✔ Indoor premium
  ✔ Multipliers & surcharges
* Fully responsive UI
* Inline validation

### ⚙️ Pricing Engine

Automatically calculates:

* Base court price
* Equipment cost
* Coach hourly cost
* Dynamic rule-based adjustments
* Total payable amount

### 🔐 Atomic Concurrency Protection

Guarantees **zero double-bookings**, even if multiple users book the same slot at the same time.

Implementation uses:

* MongoDB transactions (if available)
* Lock-based fallback using a unique key
* Automatic conflict detection → returns HTTP `409`

### 🧾 PDF Receipt

Booking success generates a PDF containing:

* User details
* Court and coach
* Equipment
* Time slot
* Pricing breakdown
* Booking ID
* Timestamp

### 🗃 Database

MongoDB stores:

* Courts
* Coaches
* Unavailable periods
* Equipment
* Pricing rules
* Bookings with pricing breakdown

---

## 📂 **Project Structure**

```
/project-root
 ├── backend
 │   ├── config/
 │   ├── controllers/
 │   ├── models/
 │   ├── routes/
 │   ├── utils/
 │   ├── seed/
 │   ├── tests/
 │   └── server.js
 │
 ├── frontend
 │   ├── src/
 │   │   ├── components/
 │   │   ├── pages/
 │   │   ├── services/
 │   │   └── styles/
 │   └── index.html
 │
 └── run_project.bat
```

---

# ▶ **One-Click Run (Windows)**

This project includes a **single-click `.bat` launcher**.

### Run everything:

```
double-click: run_project.bat
```

The script will:

* Install backend deps
* Start backend
* Install frontend deps
* Start frontend
* Open browser automatically

---

# 🚀 **Local Setup (Manual)**

### 1️⃣ Backend Setup

```
cd backend
npm install
npm run seed
npm start
```

Backend runs at:

```
http://localhost:4000
```

### 2️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

# 🧪 **Concurrency Test (Double-Booking Prevention)**

To verify atomic booking:

```
cd backend
node tests/concurrencyTestAuto.js
```

Expected output:

* **1 booking succeeds**
* Remaining requests → `409 Resource already booked at this time`

This proves the system prevents race-condition double-booking.

---

# 🌐 **Deployment Guide**

### 🗄 Step 1: Deploy DB on MongoDB Atlas

1. Create cluster → Free tier
2. Add network access:

   ```
   0.0.0.0/0
   ```
3. Create DB User
4. Copy connection string:

   ```
   mongodb+srv://USER:PASS@cluster.mongodb.net/badminton
   ```
5. Replace in:

```
backend/config/db.js
```

---

### 🚀 Step 2: Deploy Backend on Render

1. Go to [https://render.com](https://render.com)
2. New → Web Service
3. Select GitHub repo
4. Root: `backend`
5. Environment: **Node**
6. Build command:

   ```
   npm install
   ```
7. Start command:

   ```
   node server.js
   ```
8. Add environment variable:

   ```
   MONGO_URI = <your atlas connection string>
   ```
9. Deploy
10. Copy backend URL:

```
https://your-backend.onrender.com
```

---

### 🌐 Step 3: Deploy Frontend on Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Set root directory: **frontend**
4. Add env variable:

   ```
   VITE_API_URL = https://your-backend.onrender.com/api
   ```
5. Build output: `/dist`
6. Deploy
7. Copy live URL:

```
https://yourproject.vercel.app
```

---

### 🔁 Step 4: Update Frontend API Config

In:

```
frontend/src/services/api.js
```

Replace `baseURL` with:

```js
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});
```

---

# 🏗 **Architecture Diagram**

```
[ React Frontend ]  →  [ Express Backend ]  →  [ MongoDB Atlas ]
          ↑                       ↓
       Vercel                Render Hosting
```

---

# 🛠 **Technologies Used**

### Frontend

* React
* Axios
* jsPDF
* Modern CSS UI

### Backend

* Node.js / Express
* MongoDB / Mongoose
* express-validator
* Atomic lock algorithm for concurrency

---

# 📸 **Screenshots (Add Your Images Here)**

You can add:

```
/screenshots/booking.png  
/screenshots/admin.png  
/screenshots/history.png  
```

---

# 📜 **Conclusion**

This project provides a complete booking platform with:

* Real-time pricing
* Robust admin control
* Atomic booking safety
* Clean modern UI
* Fully deployable MERN stack architecture

Perfect for academic submission, real-world scheduling apps, or extension into a SaaS product.

---

# 🙌 **Author**

**Harshitha**
GitHub: [https://github.com/Harshitha8117](https://github.com/Harshitha8117)

---
