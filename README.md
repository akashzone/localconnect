# LocalConnect - Local Business & Student Developer Marketplace

LocalConnect is a MERN stack web application that connects local business owners with student developers. Business owners can post software or web development projects, and student developers can apply to work on them. The platform helps businesses build their digital presence while giving students real-world experience, portfolio projects, and networking opportunities.

---

# Accomplishments & Features Built So Far

The project has a well-structured architecture with a connected frontend and backend. Below are the features implemented so far.

## 1. Authentication & Authorization

- Secure JWT authentication using cookies.
- Password hashing with `bcryptjs`.
- Role-based access control for `Student Developer` and `Business Owner`.
- Protected routes for authenticated users.
- Prevents logged-in users from accessing login and register pages.
- Redirects unauthenticated users to the login page when trying to apply for projects.

## 2. Profile Management

### Developer Profile

Developers can:

- Add technical skills.
- Write a short bio.
- Add GitHub, LinkedIn, and portfolio links.
- Add a resume link.

### Business Profile

Business owners can:

- Add business name and type.
- Write a business description.
- Add phone number and address.
- Add website and social media links.

### View Developer Profile

Business owners can view a developer's complete profile before accepting or rejecting an application.

---

## 3. Project Management

- Create new projects.
- View project details.
- Update project information.
- Delete projects.
- Business owners have a **My Projects** dashboard to manage all posted projects.
- Search and filter projects by keywords.
- Edit project details using a dedicated edit page.

---

## 4. Application System

- Developers can apply to projects.
- Applications include a cover letter.
- Developers can withdraw applications.
- Business owners can accept or reject applications.
- Application status updates are reflected immediately in the database.

---

## 5. User Interface

- Fully responsive design.
- Responsive navigation bar with mobile support.
- Different navigation options based on user role.
- Built using Tailwind CSS v4.
- Clean modals and smooth page navigation.
- Improved back navigation between pages.

---

# Technology Stack

| Layer | Technology | Libraries |
|-------|------------|-----------|
| **Frontend** | React 19, Vite 8, React Router DOM 7 | Axios, FontAwesome |
| **Backend** | Node.js, Express 5 | jsonwebtoken, cookie-parser, CORS, bcryptjs, Multer |
| **Database** | MongoDB | Mongoose |
| **Styling** | Tailwind CSS v4 | Custom Tailwind Utilities |

---

# Project Structure

```text
LocalConnect/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── index.css
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# Getting Started

## Prerequisites

- Node.js (v18 or later)
- MongoDB Atlas or a local MongoDB installation

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/akashzone/localconnect.git
cd localconnect
```

### 2. Configure Environment Variables

Create a `.env` file inside the `server` folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_uri
JWT_SECRET=your_jwt_secret
```

### 3. Install Dependencies

Install backend packages:

```bash
cd server
npm install
```

Install frontend packages:

```bash
cd ../client
npm install
```

---

## Run the Project

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend:

```bash
cd client
npm run dev
```

Open your browser and visit:

```
http://localhost:5173
```

---

# Author

**Akash Nadar**

Aspiring Full Stack Developer

GitHub: https://github.com/akashzone