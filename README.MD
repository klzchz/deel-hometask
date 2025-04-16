# 💼 Deel Backend Challenge

This is a full-stack backend solution built for Deel's technical challenge using Node.js, Express, Sequelize, and SQLite. The system handles profiles, contracts, jobs, balances, and reporting.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS recommended)
- npm

### Installation
```bash
npm install
npm run seed     # Seed the SQLite database (⚠️ will reset data)
npm start
```

## 🔐 Authentication
Every request that requires authentication must send a header:
```
profile_id: <number>
```
This represents the current profile making the request. The server uses it to load the associated Profile.

## 📌 API Documentation

### 🔹 Contracts
**GET /contracts/:id**  
Returns the contract only if it belongs to the profile making the request.

Headers:
```
profile_id: <number>
```

Response:
```json
{
  "id": 1,
  "terms": "Contract details",
  "status": "in_progress",
  "ClientId": 1,
  "ContractorId": 5
}
```

**GET /contracts**  
Returns a list of all non-terminated contracts for the authenticated profile.

Headers:
```
profile_id: <number>
```

Response:
```json
[
  {
    "id": 2,
    "terms": "Web development contract",
    "status": "in_progress"
  }
]
```

### 🔹 Jobs
**GET /jobs/unpaid**  
Returns all unpaid jobs from active contracts (status: in_progress) associated with the profile.

Headers:
```
profile_id: <number>
```

Response:
```json
[
  {
    "id": 4,
    "description": "Landing page",
    "price": 200,
    "paid": false
  }
]
```

**POST /jobs/:job_id/pay**  
Pays for a job if:
- The profile is the client of the job
- The job is unpaid
- The client has sufficient balance

Headers:
```
profile_id: <number>
```

Response:
```json
{
  "success": true
}
```

Errors:
- 404 if job not found or unauthorized
- 400 if job is already paid or balance is insufficient

### 🔹 Balances
**POST /balances/deposit/:userId**  
Deposits money into a client's balance.
- Clients can only deposit to their own account.
- Limit: 25% of their total unpaid jobs

Headers:
```
profile_id: <number>
```

Body:
```json
{
  "amount": 100
}
```

Response:
```json
{
  "success": true,
  "newBalance": 1150.00
}
```

Errors:
- 403 if trying to deposit into another user's account
- 400 if exceeding 25% of unpaid jobs

### 🔹 Admin
**GET /admin/best-profession?start=<date>&end=<date>**  
Returns the profession that earned the most money from paid jobs in the given range.

Example: `/admin/best-profession?start=2024-01-01&end=2024-12-31`

Response:
```json
{
  "profession": "Programmer",
  "totalEarned": 5000
}
```

**GET /admin/best-clients?start=<date>&end=<date>&limit=<number>**  
Returns the top clients who paid the most for jobs during the given time range.

Default limit: 2

Example: `/admin/best-clients?start=2024-01-01&end=2024-12-31&limit=3`

Response:
```json
[
  {
    "id": 1,
    "fullName": "John Doe",
    "paid": 1200
  },
  {
    "id": 2,
    "fullName": "Jane Smith",
    "paid": 900
  }
]
```

## 📦 Tech Stack
- Node.js
- Express.js
- Sequelize ORM
- SQLite (file-based database)
- Insomnia (API testing)

## 🧠 Highlights
- Modular MVC architecture
- Sequelize transactions for financial integrity
- Clean validation and permission logic
- Complete adherence to the challenge spec
- Fully tested manually using realistic data and headers

## 📁 Project Structure
```
src/
├── controllers/       # Business logic
├── routes/            # API routes
├── middleware/        # Authentication middleware
├── model.js           # Sequelize models
├── app.js             # App setup
└── server.js          # Entry point
```

## ✉️ Author
Lucas Andrade  
[LinkedIn](https://linkedin.com/in/lucas-de-andrade-34072514a)  
[GitHub](https://github.com/klzchz)