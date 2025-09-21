
---

# Student Internship Management System

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge\&logo=next.js\&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge\&logo=tailwind-css\&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge\&logo=mongodb\&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge\&logo=postman\&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge\&logo=vercel\&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge\&logo=github\&logoColor=white)

A full-stack **Student Internship Management System (SIMS)** built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **MongoDB**. This application helps students apply for internships and allows companies to manage and approve applications efficiently.

---

## Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [System Requirements](#system-requirements)
* [Installation](#installation)
* [Environment Variables](#environment-variables)
* [Project Structure](#project-structure)
* [Usage](#usage)
* [API Documentation](#api-documentation)
* [Contributing](#contributing)
* [License](#license)

---

## Features

### General Features

* Role-based authentication (Student / Company)
* Student registration and login
* Company login only (no signup for companies)
* Internship application and approval workflow
* Dashboard for students and companies
* Real-time status updates
* Dark and light mode support

### Student Features

* Create, update, and delete profile
* Apply for internships
* Track application status
* View company details

### Company Features

* Review student applications
* Approve or reject internship requests
* Manage company profile
* Track active interns

---

## Tech Stack

* **Frontend & Backend:** Next.js, TypeScript
* **Styling:** Tailwind CSS
* **Database:** MongoDB
* **API Testing:** Postman
* **Version Control:** GitHub
* **Deployment:** Vercel

---

## System Requirements

* Node.js >= 18.x
* npm >= 9.x or yarn >= 1.x
* MongoDB Atlas account or local MongoDB setup
* Git

---

## Installation

1. **Clone the repository:**

```bash
git clone https://github.com/<your-username>/student-internship-management-system.git
cd student-internship-management-system
```

2. **Install dependencies:**

```bash
npm install
# or
yarn install
```

3. **Run the development server:**

```bash
npm run dev
# or
yarn dev
```

4. **Open your browser:**

```
http://localhost:3000
```

---

## Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## Project Structure

```
├── components        # Reusable React components
├── pages             # Next.js pages
├── pages/api         # API routes for backend
├── styles            # Tailwind CSS and custom styles
├── utils             # Utility functions
├── middleware.ts     # Authentication middleware
├── types             # TypeScript types
├── prisma/           # (Optional) If using Prisma ORM
└── .env.local        # Environment variables
```

---

## Usage

### Development

* Run `npm run dev` to start the app locally
* Use Postman to test API endpoints under `/pages/api`
* Student and company dashboards available at `/student` and `/company`

### Production

* Deployed version hosted on **Vercel**
* Automatically syncs GitHub main branch on deployment

---

## API Documentation

| Endpoint                   | Method | Description                    |
| -------------------------- | ------ | ------------------------------ |
| `/api/auth/login`          | POST   | Login for student/company      |
| `/api/auth/signup`         | POST   | Student signup only            |
| `/api/students`            | GET    | Fetch all students             |
| `/api/students/:id`        | GET    | Fetch a single student         |
| `/api/internships`         | GET    | Fetch all internships          |
| `/api/internships/apply`   | POST   | Student applies for internship |
| `/api/internships/approve` | PATCH  | Company approves internship    |

> Use Postman collection `SIMS.postman_collection.json` (included in the repo) for testing endpoints.

---

## Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature-name`)
3. Make your changes and commit (`git commit -m 'Add new feature'`)
4. Push to your branch (`git push origin feature-name`)
5. Create a pull request

---

## License

This project is licensed under the MIT License.

---

## Acknowledgements

* [Next.js Documentation](https://nextjs.org/docs)
* [Tailwind CSS Documentation](https://tailwindcss.com/docs)
* [MongoDB Documentation](https://docs.mongodb.com/)
* Inspiration from modern internship management systems

---
