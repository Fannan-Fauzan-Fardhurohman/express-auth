# Express.js Authentication & Authorization API

A robust, production-ready boilerplate for an Express.js application implementing JWT-based Authentication, Role-Based Access Control (RBAC), and Advanced Security Mitigations.

## 🚀 Features

- **Authentication**: Secure registration, login, and logout.
- **Authorization**: Granular role-based access control with 3 roles: `admin`, `manager`, and `user`.
- **Persistence**: SQLite database integration using **Prisma ORM**.
- **Security Mitigations**: 
  - Password hashing with `bcryptjs`.
  - **XSS & CSRF Prevention**: Uses `httpOnly`, `Secure`, and `SameSite=Strict` cookies instead of JSON payloads for JWT.
  - **Brute Force Protection**: Request rate limiting via `express-rate-limit`.
  - **HTTP Security Headers**: Powered by `helmet`.
  - **Strict Algorithm Check**: Prevents Algorithm Confusion by strictly verifying `HS256` in JWT.
- **Error Handling**: Centralized global error handling middleware.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **ORM**: Prisma
- **Database**: SQLite
- **Security**: JWT, bcryptjs, helmet, express-rate-limit, cookie-parser

---

## 🏗️ Project Structure

```text
/
├── prisma/
│   ├── schema.prisma        # Database schema & connection
│   └── dev.db               # SQLite database file (generated)
├── src/
│   ├── app.js               # Express app config, rate limits & helmet
│   ├── config/
│   │   └── roles.js         # Role definitions
│   ├── controllers/         # Request handling logic
│   ├── middlewares/         # Auth (Cookies), Role, & Error middlewares
│   ├── routes/              # API route definitions
│   └── services/            # Business logic & DB interactions
├── .env                     # Environment variables
├── package.json             # Dependencies & scripts
└── server.js                # App entry point
```

---

## 🏁 Getting Started

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Installation
Clone or navigate to the project directory and run:
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file (if not already present) and configure your secrets:
```env
PORT=3000
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=15m
```

### 4. Database Initialization
Synchronize your Prisma schema with the SQLite database:
```bash
npx prisma db push
```

### 5. Running the Application
Start the development server with nodemon:
```bash
npm run dev
```
The server will be running at `http://localhost:3000`.

---

## 📝 API Contract

### **Auth Endpoints**

#### **Register User**
`POST /api/auth/register`
- **Body**:
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user" 
  }
  ```
  *(Note: `role` defaults to `user` if not provided. Supported roles: `admin`, `manager`, `user`).*
- **Response (201 Created)**:
  ```json
  {
    "message": "User registered successfully",
    "user": { "id": 1, "username": "john_doe", "email": "john@example.com", "role": "user" }
  }
  ```

#### **Login User**
`POST /api/auth/login`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response (200 OK & Sets `httpOnly` Cookie named `token`)**:
  ```json
  {
    "message": "Login successful",
    "user": { "id": 1, "username": "john_doe", "role": "user" }
  }
  ```

#### **Logout User**
`POST /api/auth/logout`
- **Response (200 OK & Clears Cookie)**:
  ```json
  {
    "message": "Logout successful"
  }
  ```

---

### **User Endpoints (Protected)**
*All these endpoints primarily look for the `token` in **httponly browser cookies**, but will fallback to checking the `Authorization: Bearer <token>` header.*

#### **Get Profile** (Public for all Roles)
`GET /api/users/profile`
- **Access**: `user`, `manager`, `admin`

#### **Get Manager Data** (Restricted)
`GET /api/users/manager-data`
- **Access**: `manager`, `admin`

#### **Get Admin Data** (Highly Restricted)
`GET /api/users/admin-data`
- **Access**: `admin`

---

### **Employee (Karyawan) Endpoints (Admin Only)**
*All these endpoints require an active token with `role: admin`.*

#### **Create Employee**
`POST /api/employees`
- **Body**: `{ "name": "Budi", "email": "budi@work.com", "position": "Developer", "salary": 15000000 }`

#### **Get All Employees**
`GET /api/employees`

#### **Get Employee By ID**
`GET /api/employees/:id`

#### **Update Employee**
`PUT /api/employees/:id`
- **Body**: `{ "position": "Senior Developer", "salary": 20000000 }`

#### **Delete Employee**
`DELETE /api/employees/:id`

---

## 🛡️ Role Definitions

| Role     | Description                                           |
|----------|-------------------------------------------------------|
| `admin`   | Full access to all data and endpoints.                |
| `manager` | Access to manage data and view generic reports.       |
| `user`    | Standard user access; can only view their own profile. |

---

## 🛠️ Useful Commands

- `npm run dev`: Start dev server with nodemon.
- `npx prisma db push`: Push schema changes to the DB.
- `npx prisma studio`: Open a GUI to view/edit your database data.
