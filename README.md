# 🎟️ EventBooker - Full Stack Event Management System

A modern, full-stack event booking application built with the **MERN stack**.  
This project was developed as part of the **Software Developer Intern assignment for SmartWinnr**.  
It features a comprehensive event lifecycle: from administrative creation to secure user booking and automated digital ticketing.

---

## 🌟 Key Features

### User Capabilities
- **Event Discovery:** Browse a responsive grid of upcoming events (Concerts, Sports, Workshops).
- **Advanced Filtering:** Search events by title, city, or specific dates using an interactive calendar.
- **Detailed View:** Dedicated event pages with "Read More" toggles for long descriptions and integrated **Google Maps** for venue navigation.
- **Secure Booking:** Integrated **Stripe Payment Gateway** for real-world transaction processing.
- **Digital Wallet:** A "My Tickets" section for users to view their booking history.

### Administrative Capabilities
- **Event Management (CRUD):** Full dashboard to Create, Read, Update, and Delete events.
- **Availability Control:** Real-time tracking of ticket slots (Automatic "Sold Out" logic).
- **Protected Access:** Admin routes are secured via JWT and custom middleware.

### Automated Notifications
- **Smart Confirmation:** Immediate email triggers upon successful payment.
- **QR Code Ticketing:** Each confirmation email includes a unique, scannable **QR Code** generated from the Ticket ID for entry verification.

---

## 🚀 Tech Stack

### Frontend
- **React 18**
- **Vite**
- **Tailwind CSS**
- **React Router 6**
- **Axios**
- **Lucide React**

### Backend
- **Node.js & Express.js**
- **MongoDB & Mongoose**
- **JWT (JSON Web Tokens)**
- **Nodemailer**
- **Stripe SDK**

---

## 📁 Project Structure

```text
event-booking-system/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── bookingRoutes.js
│   ├── utils/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── README.md

---

📋 Prerequisites

Before running the application, ensure you have:

Node.js (v18.0.0 or higher)

npm (v9.0.0 or higher)

MongoDB Atlas account or local MongoDB installation

Stripe API Keys (Test mode)


🛠️ Installation & Setup

Clone the Repository
```bash
git clone https://github.com/Shlesha24/event-booking-system.git   
cd event-booking-system
```

### 🔹 Backend setup commands 
Navigate to the backend directory:

```bash
cd backend
npm install
```

### 🔹 .env file 

Create a .env file in the backend folder:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xatfnb7.mongodb.net/event_booking
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_test_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:5173
```

### Backend Server

```bash
npm start
```

Backend runs on:
http://localhost:5000

### Frontend setup
```bash
cd frontend
npm install
npm run dev
```

Open in browser:
http://localhost:5173

---

📊 Database Schema

Event Model

title: String (Required)
description: String (Required)
location / city: String (Required)
price: Number (Required)
date: Date (Required)
totalSlots / bookedSlots: Number (Availability tracking)

User Model

name: String (Required)
email: String (Unique)
password: String (Hashed using bcrypt)
isAdmin: Boolean (Default: false)

🔐 Security Features
Bcrypt.js: Passwords are never stored in plain text.

JWT Authentication: Tokens are sent in headers to authorize protected actions.

Input Validation: Backend checks for empty fields and slot availability before finalizing bookings.

👨‍💻 Author
Shlesha Kasoju
Software Developer Intern Assignment – SmartWinnr

🙏 Acknowledgments
SmartWinnr HR Team for the opportunity.
Stripe Documentation for payment integration guides.