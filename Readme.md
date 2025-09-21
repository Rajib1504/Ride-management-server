# Ride Booking System - Backend API

## 🎯 Project Overview

This project is a secure, scalable, and role-based backend API for a ride-booking system, similar to Uber or Pathao. It is built using **Node.js**, **Express.js**, **TypeScript**, and **Mongoose**. The system is designed to handle three distinct user roles: **Rider**, **Driver**, and **Admin**, each with specific permissions and functionalities.

The core features include a robust authentication system using JWT, role-based authorization for protecting routes, complete ride management from request to completion, and an admin panel for overseeing the entire system.

### Key Features:
-   **Authentication:** JWT-based login with Access and Refresh Tokens stored in secure `httpOnly` cookies.
-   **Role-Based Authorization:** Custom middleware to protect routes based on user roles (`Rider`, `Driver`, `Admin`).
-   **User Management:** Admins can view all users and block/unblock their accounts.
-   **Driver Lifecycle:** Riders can apply to become drivers, and admins can approve or reject these applications.
-   **Ride Lifecycle:** Riders can request rides, drivers can accept and update ride status (`PICKED_UP`, `IN_TRANSIT`, `COMPLETED`), and riders can cancel their requests.
-   
### video explanation: 
`https://drive.google.com/file/d/1oLeKXV0b6VOuYRSoyWSmGR6vYXJuLKvE/view?usp=sharing`

## 🛠️ Setup & Environment Instructions

### Prerequisites
-   [Node.js](https://nodejs.org/) (v18 or higher)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   [MongoDB](https://www.mongodb.com/) (either a local instance or a cloud service like MongoDB Atlas)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd ride-share-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the following variables. You can copy them from the `.env.example` file.

    ```env
    # .env.example
    PORT=3000
    DB_URL=mongodb://localhost:27017/ride_db

    BCRYPT_SALT_ROUND=12
    NODE_ENV=development

    JWT_ACCESS_SECRET="your-access-secret-key"
    JWT_ACCESS_EXPIRES="1d"
    JWT_REFRESH_SECRET="your-refresh-secret-key"
    JWT_REFRESH_EXPIRES="30d"
    ```

4.  **Build the project (for production):**
    ```bash
    npm run build
    ```

5.  **Run the server:**
    -   **For development (with hot-reloading):**
        ```bash
        npm run dev
        ```
    -   **For production (after building):**
        ```bash
        npm start
        ```
    The server should now be running on the port specified in your `.env` file.
7. ** Admin details: `
email: rider@test.com
password:Rider123!`
### Postman: import from GitHub repo.

## 🔁 API Endpoints Summary

The base URL for all endpoints is `/api/v1`.

---

### 🔐 Authentication (`/auth`)

| Method | Endpoint             | Description                                | Access      | Request Body              |
| :----- | :------------------- | :----------------------------------------- | :---------- | :------------------------ |
| `POST` | `/login`             | Logs in a user and returns tokens.         | Public      | `{ "email", "password" }` |
| `POST` | `/refresh-token`     | Generates a new access token using a refresh token from cookies. | Public      | _Empty_                   |
| `POST` | `/logout`            | Clears the authentication cookies.         | Authenticated | _Empty_                   |
| `POST` | `/reset-password`    | Allows a logged-in user to change their password. | Authenticated | `{ "oldPassword", "newPassword" }` |

---

### 🧍 User (`/user`)

| Method | Endpoint          | Description                                | Access      | Request Body              |
| :----- | :---------------- | :----------------------------------------- | :---------- | :------------------------ |
| `POST` | `/register`       | Registers a new user (defaults to Rider).  | Public      | `{ "name", "email", "password", "phone" }` |
| `PATCH`| `/:id`            | Updates a user's own profile information.  | Authenticated | `{ "name", "phone", "address" }` |
| `GET`  | `/all-users`      | Retrieves a list of all users.             | **Admin** | _Empty_                   |

---

### 🚕 Driver (`/drivers`)

| Method | Endpoint             | Description                                | Access      | Request Body              |
| :----- | :------------------- | :----------------------------------------- | :---------- | :------------------------ |
| `POST` | `/apply`             | A Rider applies to become a Driver.        | **Rider** | `{ "licenseNumber", "licenseImage", "vehicleDetails": {...} }` |
| `PATCH`| `/me/availability`   | A Driver sets their availability to Online/Offline. | **Driver** | `{ "isAvailable": true/false }` |

---

### ⚙️ Admin (`/admin`)

| Method | Endpoint                            | Description                                | Access      | Request Body              |
| :----- | :---------------------------------- | :----------------------------------------- | :---------- | :------------------------ |
| `PATCH`| `/users/:id/status`                 | Blocks or activates a user account.        | **Admin** | `{ "status": "BLOCK" or "ACTIVE" }` |
| `GET`  | `/driver-applications`              | Gets a list of all pending driver applications. | **Admin** | _Empty_                   |
| `PATCH`| `/driver-applications/:id/approve`  | Approves a driver application.             | **Admin** | _Empty_                   |
| `PATCH`| `/driver-applications/:id/reject`   | Rejects a driver application.              | **Admin** | _Empty_                   |

---

### 🚗 Ride (`/rides`)

| Method | Endpoint             | Description                                | Access          | Request Body              |
| :----- | :------------------- | :----------------------------------------- | :-------------- | :------------------------ |
| `POST` | `/request`           | A Rider requests a new ride.               | **Rider** | `{ "pickupLocation": {...}, "destinationLocation": {...} }` |
| `PATCH`| `/:rideId/accept`    | A Driver accepts a ride request. (Note: typo `accpt` in route file) | **Driver** | _Empty_                   |
| `PATCH`| `/:rideId/status`    | A Driver updates the status of an ongoing ride. | **Driver** | `{ "status": "PICKED_UP" or "IN_TRANSIT" or "COMPLETED" }` |
| `PATCH`| `/:rideId/cancel`    | A Rider cancels their ride request.        | **Rider** | _Empty_                   |
| `GET`  | `/history`           | Gets the ride history for the logged-in user. | **Rider/Driver**| _Empty_                   |
