# 🎓 ESTINVENTS

> Centralized university event management platform for ESTIN students.

![ESTINVENTS Banner](https://img.shields.io/badge/ESTIN-VENTS-00C896?style=for-the-badge&logo=calendar&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **ESTIN-only Auth** | Only `x_familyname@estin.dz` emails can register |
| 📅 **Events** | Browse, filter by category, register with capacity tracking |
| 📰 **Campus News** | Announcements, achievements, pinned articles |
| 👨‍🏫 **Professor Status** | Real-time attendance (present/absent/unknown) |
| ⚡ **Admin Panel** | Full CRUD for events, news, and professors |
| 🌙 **Dark / Light Mode** | System-aware theme with manual toggle |
| 📱 **Responsive** | Mobile-first, sidebar collapses on small screens |

---

## 🛠️ Tech Stack

| Layer      | Technology |
|---|---|
| Frontend   | React 18, React Router v6, Vite |
| Styling    | Pure CSS with CSS Variables (no framework) |
| Backend    | Node.js, Express.js |
| Database   | MongoDB with Mongoose ODM |
| Auth       | JWT (jsonwebtoken) + bcrypt |
| Fonts      | Syne (display) + DM Sans (body) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- Git

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/estinvents.git
cd estinvents
```

### 2. Backend setup

```bash
cd backend
npm install

# Copy env file and configure it
cp .env.example .env
# Edit .env and set your MONGODB_URI and JWT_SECRET
```

**.env** (backend):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/estinvents
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

```bash
# Seed the database with demo data
npm run seed

# Start development server
npm run dev
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
npm run dev
```

### 4. Open the app

Navigate to **http://localhost:5173**

---

## 🔑 Demo Accounts (after seeding)

| Role    | Email                  | Password    |
|---------|------------------------|-------------|
| Admin   | `a_estin@estin.dz`     | `admin123`  |
| Student | `b_boutria@estin.dz`   | `student123`|

---

## 📁 Project Structure

```
estinvents/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   └── auth.js            # JWT + admin guard
│   ├── models/
│   │   ├── User.js            # Student accounts
│   │   ├── Event.js           # Campus events
│   │   ├── News.js            # News articles
│   │   └── Professor.js       # Professor + attendance
│   ├── routes/
│   │   ├── auth.js            # Register / Login / Profile
│   │   ├── events.js          # Events CRUD + registration
│   │   ├── news.js            # News CRUD
│   │   └── professors.js      # Professors CRUD + status
│   ├── seed.js                # Demo data seeder
│   ├── server.js              # Express app entry point
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── favicon.svg
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.jsx        # Navigation sidebar
    │   │   ├── Topbar.jsx         # Page header bar
    │   │   ├── EventCard.jsx      # Event display card
    │   │   ├── NewsCard.jsx       # News article card
    │   │   ├── ProfessorCard.jsx  # Professor status card
    │   │   ├── Modal.jsx          # Reusable modal
    │   │   ├── Loader.jsx         # Spinner / loading page
    │   │   └── ProtectedRoute.jsx # Auth route guards
    │   ├── context/
    │   │   ├── AuthContext.jsx    # User session state
    │   │   ├── ThemeContext.jsx   # Dark/light mode
    │   │   └── ToastContext.jsx   # Global notifications
    │   ├── pages/
    │   │   ├── AuthPage.jsx       # Login / Register
    │   │   ├── Dashboard.jsx      # Home with stats
    │   │   ├── EventsPage.jsx     # Events listing
    │   │   ├── NewsPage.jsx       # News listing
    │   │   ├── ProfessorsPage.jsx # Attendance tracker
    │   │   ├── AdminEvents.jsx    # Admin: manage events
    │   │   ├── AdminNews.jsx      # Admin: manage news
    │   │   └── AdminProfessors.jsx# Admin: manage profs
    │   ├── utils/
    │   │   ├── api.js             # Axios with JWT interceptor
    │   │   └── helpers.js         # Date formatting, etc.
    │   ├── App.jsx                # Router + layout
    │   ├── index.css              # Design system + themes
    │   └── main.jsx               # React entry point
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🌐 Deployment

### Frontend → Vercel / Netlify
```bash
cd frontend
npm run build
# Upload the dist/ folder or connect your GitHub repo
```

### Backend → Railway / Render / Heroku
1. Set environment variables in your platform dashboard
2. Set `MONGODB_URI` to your Atlas connection string
3. Deploy the `backend/` folder

### MongoDB → MongoDB Atlas
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string and update `MONGODB_URI`

---

## 📧 Email Validation Rule

ESTIN student emails follow the strict pattern:

```
first_letter_of_firstname + _ + lastname + @estin.dz
```

| Name          | Valid Email             |
|---------------|-------------------------|
| Bilal Boutria | `b_boutria@estin.dz`    |
| Amina Bensalem| `a_bensalem@estin.dz`   |
| Mohamed Khaled| `m_khaled@estin.dz`     |

The backend validates this on both registration and login.

---

## 👥 Team

Built for **ESTIN** — École Supérieure en Sciences et Technologies de l'Informatique et du Numérique, Bordj Bou Arréridj, Algeria.

- Boutria Bilal — Team Leader
- Aidi Oussama — Database Specialist
- Khaled Mohamed Redha — Frontend Developer
- Boubekeur Samy — Backend Developer
- Ben Arour Islam — Backend Developer
- Merdaci Mohamed Mehdi Safouan — UI/UX Designer

---

## 📄 License

MIT © ESTINVENTS Team 2025
