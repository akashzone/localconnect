# 🤝 LocalConnect - Local Business & Student Developer Marketplace

LocalConnect is a modern MERN stack web application designed to bridge the gap between local business owners and student developers. Business owners can post software or web development projects, and student developers can apply to work on these projects. This helps local businesses establish a premium digital presence while providing students with real-world experience, portfolio additions, and hands-on networking opportunities.

---

## 🚀 Accomplishments & Features Built So Far

We have established a robust project architecture, fully integrated API endpoints, and created a responsive frontend experience. Below is the detailed breakdown of what has been implemented:

### 1. 🔐 Authentication & Authorization
* **Secure Cookie-Based JWT Auth:** Configured secure, cookie-based JSON Web Token (JWT) authentication, including request validation and token verification.
* **Role-Based Access Control (RBAC):** Custom middleware to distinguish and authorize routing for `Student Developer` vs. `Business Owner` roles.
* **Smart Route Protection:** Redirects unauthenticated users to the login page when trying to apply for projects, and prevents logged-in users from accessing the login or register pages (redirecting them to their respective dashboards instead).
* **Robust Password Encryption:** Implemented secure registration workflows with password hashing using `bcryptjs`.

### 2. 📁 Profile Management System
* **Developer Profiles:** Developers can specify their technical skills, showcase professional links (GitHub, LinkedIn, portfolio website), provide a personal biography, and add a link to their resume.
* **Business Profiles:** Business owners can configure their business type, business description, phone, address, website link, and social profiles.
* **Applicant Inspection Flow:** Integrated a view-profile functionality (`DeveloperProfile.jsx`) that allows business owners to review a student developer's full credentials directly from their project applications.

### 3. 💼 Project Lifecycle Management
* **Full CRUD Operations:** Built endpoints and UI controllers to create, view, update, and delete projects.
* **Project Dashboard (`MyProjects.jsx`):** Business owners have a private dashboard to list, review, and edit all projects they have posted.
* **Search & Filter Controls:** Integrated search and filter controls on the project listing page (`Projects.jsx`), allowing users to find specific projects based on keywords.
* **Frontend Editing Form:** Added an `EditProject` page and custom forms to easily modify project parameters such as tech requirements, description, and timelines.

### 4. 📝 Application System
* **Application Submission:** Implemented application models allowing developers to send cover letters and credentials for posted projects.
* **Application Withdrawal:** Enabled developers to withdraw their applications, accompanied by a clean confirmation modal on the frontend.
* **Accept / Reject Mechanism:** Business owners can manage applicants inside their dashboard. Added immediate action buttons to accept or reject candidates, updating their application statuses in real-time in the database.

### 5. 🖥️ Responsive UI/UX
* **Redesigned Navbar:** Fully responsive navigation bar containing toggle menus for mobile screens and context-sensitive action links based on authentication state and user role.
* **Tailwind CSS v4 & FontAwesome Integration:** The interface is styled using modern Tailwind CSS v4, smooth transition micro-animations, clean font pairings, custom modals, and icons.
* **Improved Back-Navigation:** Resolved navigation quirks by preserving states and paths when returning from a detailed project view.

---

## 🛠️ Technology Stack

| Layer | Technology | Key Libraries |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite 8, React Router Dom 7 | Axios, FontAwesome Icons |
| **Backend** | Node.js, Express 5 | jsonwebtoken, cookie-parser, CORS, bcryptjs, Multer |
| **Database** | MongoDB | Mongoose 9 |
| **Styling** | Tailwind CSS v4 | Custom Tailwind Variables & Utilities |

---

## 📁 Repository Structure

```text
LocalConnect/
├── client/                     # Frontend React SPA
│   ├── public/                 # Static assets (images, icons)
│   ├── src/
│   │   ├── context/            # AuthContext for state preservation
│   │   ├── pages/              # Core routing pages (Dashboards, Profiles, Projects)
│   │   ├── components/         # Global shared UI components (Navbar, Footer, Modals)
│   │   └── index.css           # Styling entries & Tailwind imports
│   └── package.json            # Frontend script entry and packages
│
├── server/                     # Backend API Server
│   ├── config/                 # DB connections & API configs
│   ├── controllers/            # Controller functions (Auth, Projects, Applications, Profiles)
│   ├── middlewares/            # Security and auth middleware files
│   ├── models/                 # Database schemas (User, Profile, Project, Application)
│   ├── routes/                 # Express API routes
│   ├── utils/                  # Utility helper functions
│   ├── server.js               # Express Server Entrypoint
│   └── package.json            # Backend dependencies and nodemon scripts
│
├── .gitignore                  # Git untracked pattern file
└── README.md                   # Repository Documentation
```

---

## ⚙️ Getting Started & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or a local MongoDB database instance

### Setup Steps

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/akashzone/localconnect.git
   cd localconnect
   ```

2. **Configure Environment Variables:**
   Create a `.env` file in the `/server` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_uri
   JWT_SECRET=your_jwt_signature_secret
   ```

3. **Install Project Dependencies:**
   Install dependencies for both folders:
   ```bash
   # Install server packages
   cd server
   npm install

   # Install client packages
   cd ../client
   npm install
   ```

4. **Run the Application:**
   Start both client and server:
   - **Backend API:**
     ```bash
     cd server
     npm run dev  # runs server via nodemon
     ```
   - **Frontend Client:**
     ```bash
     cd client
     npm run dev  # starts Vite dev server
     ```
   Access the web app at `http://localhost:5173` (or the port indicated by Vite).

---

## 👤 Author

- **Akash Nadar** - *Aspiring Full Stack Developer* - [GitHub](https://github.com/akashzone)