Ride Booking API - A Scalable Ride-Sharing Platform
🎯 Project Overview
This project is a secure, scalable, and role-based backend API for a ride-booking system, similar to Uber or Pathao. Built with Express.js, TypeScript, and Mongoose, it provides a robust platform for managing ride requests and fulfillment. The system supports three distinct user roles: Riders, who can book and manage their rides; Drivers, who can accept and complete rides; and Admins, who oversee the entire system.

The architecture is modular and production-ready, focusing on clean code, security, and scalability. It features JWT-based authentication, role-based authorization, secure password hashing, and comprehensive data validation.

✨ Core Features
🔐 Authentication & Authorization
Secure Registration: New users can register with securely hashed passwords using bcrypt.

JWT-Based Login: Users receive accessToken and refreshToken upon successful login for secure API access.

Role-Based Access Control (RBAC): A powerful middleware protects routes, ensuring that only users with the appropriate roles (Admin, Driver, Rider) can access specific endpoints.

🧍 Rider Features
Request a Ride: Riders can request a ride by providing their pickup and destination locations.

View Ride History: Riders can view a complete history of their past rides, including driver details and fare.

Cancel a Ride: Riders can cancel a ride request as long as it has not been accepted by a driver.

🚗 Driver Features
Apply to be a Driver: Registered users can apply to become a driver by submitting their license and vehicle details.

Set Availability: Drivers can set their status to Online or Offline to start or stop receiving ride requests.

View Pending Rides (Geo-based): Online drivers can see pending ride requests from riders within a 5km radius of their current location.

Accept/Reject Rides: Drivers can accept or reject available ride requests.

Update Ride Status: Drivers manage the entire ride lifecycle by updating the status from ACCEPTED → PICKED_UP → IN_TRANSIT → COMPLETED.

View Earnings History: Drivers can view a detailed history of their completed rides and their total earnings.

👑 Admin Features
User Management: Admins can view all users and block or unblock their accounts.

Driver Management: Admins can view all driver applications, and approve or reject them.

System Overview: Admins have access to view all users, drivers, and rides in the system.

🚕 Ride & Fare Management
Complete Ride Lifecycle: The system tracks the entire lifecycle of a ride with detailed status history.

Distance-Based Fare Calculation: When a ride is completed, the fare is automatically calculated based on the distance between the pickup and destination locations (€20/km + base fare).

🛠️ Technologies Used
Backend: Node.js, Express.js

Database: MongoDB with Mongoose

Language: TypeScript

Authentication: JSON Web Token (JWT), bcrypt.js

Validation: Zod

Architecture: Modular, Service-Controller pattern

🚀 Getting Started
Follow these instructions to get the project up and running on your local machine.

Prerequisites
Node.js (v18 or later)

npm or yarn

MongoDB (local or cloud instance)

1. Clone the Repository
   Bash

git clone https://github.com/your-username/ride-booking-api.git
cd ride-booking-api 2. Install Dependencies
Bash

npm install 3. Set Up Environment Variables
Create a .env file in the root of the project and add the following environment variables.

Code snippet

# Server Configuration

PORT=3000
NODE_ENV=development

# Database Configuration

DB_URL=your_mongodb_connection_string

# Security Configuration

BCRYPT_SALT_ROUND=12

# JWT Configuration

JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_EXPIRES=365d 4. Run the Server
Bash

npm run dev
The server will start on http://localhost:3000.

API Endpoints
The base URL for all endpoints is /api/v1.

👤 Authentication (/auth)
Method Endpoint Description Access
POST /auth/login Log in a user and get JWT tokens. Public
POST /auth/refresh-token Get a new access token using a refresh token. Public
POST /auth/reset-password Reset password for a logged-in user. All Roles

Export to Sheets
🧍 User / Rider (/user)
Method Endpoint Description Access
POST /user/register Register a new user (as a Rider). Public

Export to Sheets
🚗 Driver (/drivers)
Method Endpoint Description Access
POST /drivers/apply Apply to become a driver. Rider
POST /drivers/me/availability Update driver's availability (Online/Offline). Driver
GET /drivers/me/earnings Get earnings history for the driver. Driver

Export to Sheets
🚕 Ride (/rides)
Method Endpoint Description Access
POST /rides/request Request a new ride. Rider
GET /rides/pending Get pending rides within a 5km radius. Driver
PATCH /rides/:rideId/accept Accept a ride request. Driver
PATCH /rides/:rideId/status Update the status of an ongoing ride. Driver
PATCH /rides/:rideId/cancel Cancel a requested ride. Rider
GET /rides/history Get ride history for the user. Rider, Driver

Export to Sheets
👑 Admin (/admin)
Method Endpoint Description Access
PATCH /admin/users/:id/status Block or unblock a user account. Admin
GET /admin/driver-applications Get all pending driver applications. Admin
PATCH /admin/driver-applications/:id/approve Approve a driver application. Admin
PATCH /admin/driver-applications/:id/reject Reject a driver application. Admin

Export to Sheets
