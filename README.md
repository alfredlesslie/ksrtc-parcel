KSRTC Parcel

«BOOK. TRACK. COLLECT.»

A digital experience for simplifying the KSRTC parcel journey — from booking and digital confirmation to tracking, issue reporting, and verified collection.

🚀 Live Demo

"Open KSRTC Parcel →" (https://ksrtc-parcel.vercel.app/)

«The prototype is deployed and can be accessed directly through the link above.»

---

📌 About the Project

KSRTC already operates a courier and logistics service with consignment tracking.

KSRTC Parcel explores a simpler digital experience layer around that existing workflow by bringing key customer and staff interactions into one interface.

The core idea is:

One parcel. One digital identity. One visible journey.

---

✨ Key Features

👤 Customer

- 📦 Digital parcel booking
- 🧾 Digital booking confirmation
- 🔢 Unique consignment ID
- 📱 QR-based digital receipt
- 🚚 Visual parcel tracking timeline
- 🔔 Ready-for-collection notification preference
- ⚠️ Parcel issue reporting
- ❌ Booking cancellation
- 🔐 Receiver verification
- ✅ Collection confirmation

👨‍💼 Staff

- 📊 Parcel dashboard
- 🔎 Consignment search
- 📦 Parcel details
- 🔄 Status management
- ⚠️ Issue management
- 🔐 Receiver handover verification
- ✅ Collection completion

---

🔄 Parcel Journey

BOOKED
   ↓
ACCEPTED
   ↓
LOADED
   ↓
IN TRANSIT
   ↓
ARRIVED
   ↓
READY FOR COLLECTION
   ↓
COLLECTED

Issue Resolution

REPORTED
   ↓
ACKNOWLEDGED
   ↓
RESOLVED

---

🧠 How It Works

1. Book

The customer enters the origin, destination, sender, receiver, parcel category and weight.

2. Confirm

A unique consignment ID and digital booking confirmation are generated.

3. Track

The customer can follow recorded parcel status updates through a visual timeline.

4. Arrive

The parcel reaches the destination stage and becomes ready for collection.

5. Verify

The receiver completes the demo handover verification.

6. Collect

The parcel is marked as collected.

---

🛠️ Tech Stack

- React
- Vite
- JavaScript
- CSS
- Lucide React
- QRCode
- Local State / LocalStorage

---

🖥️ Run Locally

Clone the repository

git clone https://github.com/alfredlesslie/ksrtc-parcel.git

Navigate to the project

cd ksrtc-parcel

Install dependencies

npm install

Start the development server

npm run dev

Open:

http://localhost:5173

---

🧪 Prototype Scope

This is a working prototype created for the ANAVANDI 2026 selection process.

The prototype currently uses simulated/local data and does not connect to KSRTC's internal systems or APIs.

Currently simulated

- Parcel records
- Consignment status updates
- Charge estimates
- Notifications
- OTP verification
- Collection estimates

Production integration opportunities

- KSRTC system/API integration
- Real consignment data
- Real notifications
- Digital payments
- Depot-level integration
- Production authentication and security
- Real-time logistics updates where available

---

🎯 Product Vision

«Make every parcel easier to follow.»

From booking to collection, customers should always know what happened, what happens next, and where they need to act.

---

📁 Project Structure

ksrtc-parcel/
│
├── public/
├── src/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── package.json
├── vite.config.js
└── README.md

---

👥 Project

KSRTC Parcel

Built for ANAVANDI 2026

Live Prototype:
https://ksrtc-parcel.vercel.app/

Repository:
https://github.com/alfredlesslie/ksrtc-parcel