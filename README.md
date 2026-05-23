# 🌊 HireWave — Enterprise-Grade Job Matching Engine

<div align="center">

[![Tests Status](https://img.shields.io/badge/tests-12%2F12%20passing-brightgreen)](#)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](#)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](#)
[![Tech Stack](https://img.shields.io/badge/stack-MERN-orange.svg)](#)

**HireWave** is an ultra-premium, high-velocity SaaS job board engine built to connect world-class software engineers with verified corporate hiring partners. Experience high-agency matching, live status timelines, and stunning glassmorphic dashboards.

[Live Demo](#) • [Technical Documentation (PDF)](file:///c:/Users/rohan/Videos/Study/Coding/Project/HireWave/DOCUMENTATION.pdf) • [API Contracts](file:///c:/Users/rohan/Videos/Study/Coding/Project/HireWave/DOCUMENTATION.md#7-api-documentation)

</div>

---

## 🌟 Key Features

- 💼 **Startups Directory**: Public showcase of verified hiring partners displaying real-time aggregated job openings.
- ⚙️ **Glassmorphic Settings Console**: Recruiter-exclusive control panel to personalize company profiles, emojis, website links, and sizes.
- 🎉 **Micro-Interaction Banners**: High-priority celebratory overlays on seeker profiles upon shortlist/offer updates.
- 📝 **Requisition Form Designer**: Custom publisher for recruiters to post vacancies with requirements, skills, and benefits arrays.
- 🛡️ **JWT Rate-Limiting Shield**: Cryptographically signed access controls with account locking mechanisms on repetitive failed attempts.
- 🧪 **Vitest Suite Coverage**: Built-in automated integration test pipeline verifying 12 crucial developer E2E pathways.

---

## 🛠️ Architecture & Tech Stack

```
   ┌──────────────────────────────────────────────────────────┐
   │                       Vite + React                       │ (Frontend Client)
   └──────────────────────────────────────────────────────────┘
                                │  HTTPS Request + JWT Bearer
                                ▼
   ┌──────────────────────────────────────────────────────────┐
   │                    Express.js Router                     │ (REST API Layer)
   └──────────────────────────────────────────────────────────┘
                                │  Mongoose Aggregations
                                ▼
   ┌──────────────────────────────────────────────────────────┐
   │                         MongoDB                          │ (Flexible JSON Store)
   └──────────────────────────────────────────────────────────┘
```

- **Frontend**: React 18, Vite, Tailwind CSS v4, Framer Motion, Lucide React
- **Backend**: Node.js, Express, Mongoose ORM, BcryptJS, JSON Web Tokens
- **Testing**: Vitest, JSDOM, React Testing Library
- **Security**: express-mongo-sanitize, express-rate-limit, helmet, cors, compression

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js >= 18.0.0
- MongoDB Community Server running locally on `localhost:27017`

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/hirewave.git
cd hirewave
```

### Step 2: Set Up Backend
```bash
cd backend
npm install
cp .env.example .env  # Configure your secret keys & local MongoDB URL
npm run dev
```
*The server will boot on `http://localhost:5000` and automatically seed verified startup profile cards (Stripe, Vercel, Linear, etc.) and mock jobs!*

### Step 3: Set Up Frontend
```bash
cd ../frontend
npm install
npm run dev
```
*Open `http://localhost:5173` in your browser to interact with the platform!*

---

## 🧪 Running Automated Tests

To ensure the high integrity of routing, authentication, dynamic startup listings, and form submissions:
```bash
cd frontend
npm run test
```
*All 12 core Vitest suites are verified and in a **100% green passing state**.*

---

## 📂 File Directory Map

```text
HireWave/
├── backend/
│   ├── src/
│   │   ├── config/database.js    # DB Client connection & corporate seeder
│   │   ├── models/User.js        # User model with hashing & locking methods
│   │   ├── controllers/          # Business logic handlers
│   │   └── routes/               # API route maps & role guards
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable UI elements (PostJobForm, JobCard)
│   │   ├── pages/                # Screen routers (UserDashboard, CompaniesPage)
│   │   └── utils/api.js          # Unified fetch services
```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
