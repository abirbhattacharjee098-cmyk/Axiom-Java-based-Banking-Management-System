# Axiom Bank API Documentation

Welcome to the API Documentation for Axiom Banking System. The API uses RESTful principles and is secured by JSON Web Tokens (JWT).

## Base URL
`/api`

---

## Authentication Endpoints

### 1. Register User
`POST /auth/register`

Creates a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "phoneNumber": "1234567890",
  "role": "ROLE_USER" // optional, defaults to ROLE_USER
}
```
**Response (200 OK):**
```json
{
  "message": "User registered successfully!"
}
```

### 2. Login
`POST /auth/login`

Authenticates a user and returns a JWT.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securepassword123"
}
```
**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUz...",
  "type": "Bearer",
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "ROLE_USER"
}
```

---

## Account Management Endpoints
*Requires Authorization: `Bearer <token>`*

### 1. Create Account
`POST /accounts?type={accountType}`

Creates a new account (e.g., SAVINGS or CURRENT) for the authenticated user.

**Query Parameters:**
- `type`: String (e.g., "SAVINGS", "CURRENT")

### 2. Get User Accounts
`GET /accounts`

Retrieves a list of accounts belonging to the authenticated user.

### 3. Get Account Balance
`GET /accounts/{id}/balance`

Returns the current balance of a specific account.

---

## Transaction Endpoints
*Requires Authorization: `Bearer <token>`*

### 1. Make a Deposit
`POST /transactions/deposit`

**Request Body:**
```json
{
  "destinationAccountId": 1,
  "amount": 500.00
}
```

### 2. Make a Withdrawal
`POST /transactions/withdraw`

**Request Body:**
```json
{
  "sourceAccountId": 1,
  "amount": 100.00
}
```

### 3. Transfer Money
`POST /transactions/transfer`

**Request Body:**
```json
{
  "sourceAccountId": 1,
  "destinationAccountId": 2,
  "amount": 150.00
}
```

### 4. Transaction History
`GET /transactions/history/{accountId}`

Retrieves the transaction history for a specific account.

---

## Admin Endpoints
*Requires Authorization: `Bearer <token>` and `ROLE_ADMIN` role.*

### 1. Get All Users
`GET /admin/users`

### 2. Get All Accounts
`GET /admin/accounts`

### 3. Get All Transactions
`GET /admin/transactions`
*(Used by Admin Dashboard to monitor the system and view `isSuspicious` flagged transactions.)*
