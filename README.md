# LocalConnect

**Connecting local business owners with student developers for real-world projects.**
🌐 Live Demo

Explore the deployed LocalConnect application: https://localconnect-lake.vercel.app/
<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-v18+-3c873a?style=flat-square)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0+-47a248?style=flat-square)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

[Features](#features) • [Tech Stack](#technology-stack) • [Installation](#installation) • [Architecture](#architecture) • [Roadmap](#roadmap)

</div>

---

## Overview

LocalConnect is a **MERN stack marketplace** designed to bridge the gap between local businesses and student developers. Business owners post software and web development projects, while students discover opportunities, build portfolios, and gain real-world experience.

The platform streamlines project discovery, application management, and collaboration—giving businesses access to development talent while enabling students to develop professional skills.

---

## Features

### ✅ Completed Features

#### Authentication & Security
- JWT-based authentication with HTTP-only cookies
- Password hashing with bcryptjs
- Refresh token mechanism for secure session management
- Google OAuth integration
- Role-based access control (RBAC) middleware
- Protected routes and frontend redirects
- Authentication middleware on all sensitive endpoints

#### Profile Management
**Student Developer Profiles:**
- Add and manage technical skills
- Professional bio
- GitHub, LinkedIn, and portfolio links
- Resume upload
- Profile image upload and editing with cropping
- Cloudinary integration for image storage

**Business Owner Profiles:**
- Business name and type
- Business description and information
- Contact details (phone, address)
- Website and social media links
- Profile image management

#### Project Management
- Create, read, update, and delete projects
- Project details: title, description, budget, deadline, required skills
- Business owner project dashboard
- Search and filter projects by keywords
- Dedicated edit page with form validation
- Project visibility to students

#### Application System
- Students can apply to projects with cover letters
- Estimated project duration in applications
- Application status tracking (Pending, Accepted, Rejected, Withdrawn)
- Business owners can review all applicants and applications
- Accept/reject applications with immediate database updates
- Students can view their application history and status
- Students can withdraw applications anytime

#### Reviews & Ratings
- Business owners can review students after project completion
- Students can review business owners
- Review retrieval and display on profiles
- Bidirectional review system for accountability

#### User Interface
- Fully responsive design (mobile, tablet, desktop)
- Role-based dashboards for students and business owners
- Protected frontend routes
- Navigation bar with profile dropdown
- Clean modal components for actions
- 404 error page
- Image cropping modal for profile images
- Modular component architecture
- Built with Tailwind CSS v4

---

### 🚀 In Progress / Coming Soon

- **Real-time Messaging & Chat** – Direct communication between students and business owners
- **Admin Panel** – Dashboard for platform administration and moderation
- **Deployment** – Cloud hosting and production setup
- **Additional UI Improvements** – Refinements to user experience and accessibility

---

## Technology Stack

| Layer | Technology | Details |
|-------|-----------|---------|
| **Frontend** | React 19, Vite 8 | Declarative UI with modern tooling |
| **Styling** | Tailwind CSS v4 | Utility-first responsive design |
| **State Management** | React Context API | Lightweight state across components |
| **HTTP Client** | Axios | Promise-based API requests with interceptors |
| **Backend** | Node.js, Express 5 | RESTful API server |
| **Database** | MongoDB, Mongoose | NoSQL data persistence with schema validation |
| **Authentication** | JWT, Google OAuth | Secure token-based and OAuth2 authentication |
| **File Management** | Multer, Cloudinary | Server-side file uploads and cloud storage |
| **Password Security** | bcryptjs | Cryptographic password hashing |

---

## Architecture

```mermaid
graph TB
    subgraph Client["React Frontend"]
        A["React App"]
        B["Axios HTTP Client"]
        C["Context API State"]
    end
    
    subgraph API["Express Backend"]
        D["REST API Server"]
        E["Auth Middleware"]
        F["RBAC Middleware"]
        G["Controllers"]
        H["Business Logic"]
    end
    
    subgraph Data["Data & Storage"]
        I["MongoDB"]
        J["Cloudinary<br/>Image Storage"]
        K["Google OAuth<br/>Provider"]
    end
    
    subgraph Security["Security"]
        L["HTTP-only Cookies"]
        M["JWT Tokens"]
        N["Refresh Tokens"]
    end
    
    A -->|Axios Requests| B
    B -->|API Calls| D
    C -->|State Updates| A
    
    D --> E
    E --> F
    F --> G
    G --> H
    
    B -.->|Auth Interceptor| L
    B -.->|Token Refresh| N
    
    H -->|Query/Mutate| I
    H -->|Upload/Retrieve| J
    E -->|Validate| K
    
    style Client fill:#61dafb,stroke:#333,stroke-width:2px,color:#000
    style API fill:#90c53f,stroke:#333,stroke-width:2px,color:#000
    style Data fill:#13aa52,stroke:#333,stroke-width:2px,color:#fff
    style Security fill:#f39200,stroke:#333,stroke-width:2px,color:#000
```

---

## Project Workflow

```mermaid
sequenceDiagram
    participant BO as Business Owner
    participant Platform as LocalConnect
    participant Student as Student Developer
    
    BO->>Platform: Creates Project
    Platform->>Platform: Project Posted
    
    Student->>Platform: Discovers Project
    Student->>Platform: Reviews Details
    
    Student->>Platform: Submits Application
    Platform->>BO: Notifies of New Applicant
    
    BO->>Platform: Reviews Applicant Profile
    BO->>Platform: Reviews Application
    
    alt Accepts Application
        BO->>Platform: Accept
        Platform->>Student: Application Accepted
        Student->>Platform: Begins Work
    else Rejects Application
        BO->>Platform: Reject
        Platform->>Student: Application Rejected
    end
    
    Student->>Platform: Completes Project
    
    BO->>Platform: Leaves Review
    Student->>Platform: Leaves Review
    
    Platform->>Platform: Reviews Recorded
```

---

## Security Architecture

LocalConnect implements multiple layers of security to protect user data and maintain platform integrity:

### Authentication & Authorization
- **JWT Tokens** – Stateless authentication using signed JSON Web Tokens
- **HTTP-only Cookies** – Tokens stored in secure, HTTP-only cookies to prevent XSS attacks
- **Refresh Token Mechanism** – Access tokens expire quickly; refresh tokens enable long-lived sessions
- **Role-Based Access Control (RBAC)** – Middleware enforces user role permissions (Student, Business Owner, Admin)
- **Protected Routes** – Both frontend and backend validate user authentication and authorization

### Password Security
- **bcryptjs Hashing** – Passwords hashed with salt rounds before database storage
- **No Plain Text Storage** – Passwords never stored or transmitted in plain text

### OAuth Integration
- **Google OAuth 2.0** – Secure third-party authentication
- **Credential Validation** – OAuth tokens validated server-side before user creation

### API Security
- **Axios Interceptors** – Automatic token injection into request headers
- **Token Refresh Flow** – Expired tokens automatically refreshed without user intervention
- **CORS Configuration** – Cross-origin requests restricted to trusted domains
- **Middleware Chain** – Requests pass through authentication, authorization, and validation middleware

### File Upload Security
- **Multer Configuration** – Server-side file validation before upload
- **Cloudinary Storage** – Third-party CDN for secure file storage and delivery
- **Access Control** – Users can only upload and modify their own profile images and resumes

### Best Practices
- Environment variables store all secrets (never committed to version control)
- Sensitive data is not logged or exposed in error messages
- Session data validated on every request

---

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user account | Public |
| POST | `/api/auth/login` | Login with email and password | Public |
| POST | `/api/auth/google` | Authenticate with Google OAuth | Public |
| POST | `/api/auth/logout` | Logout and clear session | Authenticated |
| POST | `/api/auth/refresh` | Refresh access token | Authenticated |

### Project Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/projects` | Create new project | Business Owner |
| GET | `/api/projects` | Fetch all projects with filters | Public |
| GET | `/api/projects/:id` | Fetch project by ID | Public |
| PUT | `/api/projects/:id` | Update project details | Project Owner |
| DELETE | `/api/projects/:id` | Delete project | Project Owner |
| GET | `/api/projects/user/my-projects` | Fetch user's projects | Business Owner |

### Application Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/applications` | Submit project application | Student |
| GET | `/api/applications/user/my-applications` | Fetch student's applications | Student |
| GET | `/api/applications/project/:projectId` | Fetch project applicants | Project Owner |
| PATCH | `/api/applications/:id/accept` | Accept application | Project Owner |
| PATCH | `/api/applications/:id/reject` | Reject application | Project Owner |
| DELETE | `/api/applications/:id` | Withdraw application | Applicant |

### Profile Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/profiles/:userId` | Fetch user profile | Public |
| PUT | `/api/profiles/:userId` | Update user profile | Profile Owner |
| POST | `/api/profiles/:userId/avatar` | Upload profile image | Profile Owner |
| POST | `/api/profiles/:userId/resume` | Upload resume | Student |
| GET | `/api/profiles/:userId/reviews` | Fetch user reviews | Public |

### Review Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/reviews` | Submit review | Authenticated |
| GET | `/api/reviews/user/:userId` | Fetch user's reviews | Public |
| GET | `/api/reviews/received/:userId` | Fetch reviews received by user | Public |

---

## Project Structure

```
LocalConnect/
├── client/                          # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   └── ...
│   │   ├── context/                 # React Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── UserContext.jsx
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ProjectDetails.jsx
│   │   │   └── ...
│   │   ├── App.jsx
│   │   ├── index.css               # Global styles + Tailwind
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                          # Express Backend
│   ├── config/                      # Configuration files
│   │   └── database.js
│   ├── controllers/                 # Route handlers
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── applicationController.js
│   │   ├── profileController.js
│   │   └── reviewController.js
│   ├── middlewares/                 # Custom middleware
│   │   ├── authMiddleware.js
│   │   ├── rbacMiddleware.js
│   │   └── errorHandler.js
│   ├── models/                      # Mongoose schemas
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Application.js
│   │   └── Review.js
│   ├── routes/                      # API route definitions
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── applications.js
│   │   ├── profiles.js
│   │   └── reviews.js
│   ├── utils/                       # Utility functions
│   │   ├── validators.js
│   │   └── cloudinary.js
│   ├── server.js                   # Express app entry point
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## Installation & Setup

### Prerequisites

- **Node.js** v18 or later ([Download](https://nodejs.org/))
- **MongoDB** Atlas account or local installation ([Get Started](https://www.mongodb.com/))
- **Git** for version control

### 1. Clone the Repository

```bash
git clone https://github.com/akashzone/localconnect.git
cd localconnect
```

### 2. Backend Setup

Navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `server` directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NODE_ENV=development
```

### 3. Frontend Setup

Navigate to the client directory:

```bash
cd ../client
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the `client` directory:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 4. Running the Application

Start the backend server:

```bash
cd server
npm run dev
```

The backend will run on `http://localhost:5000`

In a new terminal, start the frontend development server:

```bash
cd client
npm run dev
```

The frontend will run on `http://localhost:5173`

Open your browser and navigate to:

```
http://localhost:5173
```

---

## Environment Variables

### Backend (`server/.env`)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/localconnect

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
REFRESH_TOKEN_EXPIRE=30d

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

# CORS
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/.env.local`)

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

---

## Screenshots

<details>
<summary><b>View Screenshots</b></summary>

| Section | Preview |
|---------|---------|
| **Home Page** | [Home Screenshot] |
| **Student Dashboard** | [Student Dashboard] |
| **Business Dashboard** | [Business Dashboard] |
| **Project Listing** | [Project Listing] |
| **Project Details** | [Project Details] |
| **Application Form** | [Application Form] |
| **Profile Management** | [Profile Management] |
| **Application Management** | [Application Management] |

*Screenshots coming soon. To add them:*
1. *Generate or capture screenshots of each major section*
2. *Upload to a hosting service (Imgur, GitHub, etc.)*
3. *Replace placeholders with actual URLs*

</details>

---

## Roadmap

### ✅ Completed
- [x] JWT authentication with HTTP-only cookies
- [x] Google OAuth integration
- [x] Role-based access control (RBAC)
- [x] Student and business owner profiles
- [x] Profile image upload and editing
- [x] Resume upload
- [x] Project creation and management
- [x] Project discovery and search
- [x] Application system with status tracking
- [x] Application withdrawal
- [x] Review system (bidirectional)
- [x] Responsive UI with Tailwind CSS
- [x] Protected routes (frontend and backend)
- [x] Cloudinary integration
- [x] Refresh token mechanism

### 🚀 In Progress
- [ ] Real-time messaging and chat
- [ ] Notification system
- [ ] Advanced search and filtering

### 📋 Planned
- [ ] Admin panel and moderation tools
- [ ] Payment integration
- [ ] Production deployment
- [ ] Performance optimization
- [ ] Additional UI refinements
- [ ] Project completion workflow
- [ ] Dispute resolution system
- [ ] Analytics dashboard

---

## Future Improvements

- **Real-time Notifications** – Instant alerts for applications, messages, and project updates
- **Video Conferencing** – In-app video meetings between students and business owners
- **Payment Processing** – Secure payment integration for project work
- **Advanced Analytics** – Dashboard insights for business owners and platform admins
- **Skill Matching Algorithm** – Improved project recommendations based on student skills
- **Portfolio Integration** – Automatic portfolio showcase from completed projects
- **Mobile App** – Native iOS/Android applications
- **Internationalization** – Multi-language support
- **Accessibility** – Enhanced WCAG compliance

---

## Contributing

Contributions are welcome! If you'd like to contribute to LocalConnect:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the project's style guidelines and includes appropriate tests.

---

## License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

---

## Author

**Akash Nadar**  
Aspiring Full Stack Developer

- **GitHub:** [github.com/akashzone](https://github.com/akashzone)
- **Project Repository:** [github.com/akashzone/localconnect](https://github.com/akashzone/localconnect)

---

<div align="center">

Made with ❤️ by [Akash Nadar](https://github.com/akashzone)

</div>
