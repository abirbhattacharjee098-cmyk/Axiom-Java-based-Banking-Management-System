# 📚 Axiom Bank API Documentation

Welcome to the comprehensive API Documentation for the Axiom Banking System. This document provides detailed specifications for interacting with the backend services, which are built upon RESTful principles and secured using JSON Web Tokens (JWT).

Our API is designed to facilitate secure and efficient management of banking operations, including user authentication, account management, and transaction processing. This guide will help developers understand the available endpoints, request/response formats, and authentication mechanisms.

---

## Table of Contents

1.  [Base URL](#base-url)
2.  [Authentication Endpoints](#authentication-endpoints)
    *   [Register User](#1-register-user)
    *   [Login](#2-login)
3.  [Account Management Endpoints](#account-management-endpoints)
    *   [Create Account](#1-create-account)
    *   [Get User Accounts](#2-get-user-accounts)
    *   [Get Account Balance](#3-get-account-balance)
4.  [Transaction Endpoints](#transaction-endpoints)
    *   [Make a Deposit](#1-make-a-deposit)
    *   [Make a Withdrawal](#2-make-a-withdrawal)
    *   [Transfer Money](#3-transfer-money)
    *   [Transaction History](#4-transaction-history)
5.  [Admin Endpoints](#admin-endpoints)
    *   [Get All Users](#1-get-all-users)
    *   [Get All Accounts](#2-get-all-accounts)
    *   [Get All Transactions](#3-get-all-transactions)

---

## Base URL

The base URL for all API endpoints is:

`http://localhost:8080/api` (for local development)

---

## Authentication Endpoints

These endpoints handle user registration and authentication, providing JWTs for subsequent authorized requests.

### 1. Register User

`POST /auth/register`

Creates a new user account in the system.

**Request Body:**

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "phoneNumber": "1234567890",
  "role": "ROLE_USER" // Optional: defaults to ROLE_USER if not provided
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

Authenticates a user with their credentials and returns a JSON Web Token (JWT) for authorization.

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

These endpoints allow authenticated users to manage their banking accounts.

*Requires Authorization: `Bearer <JWT_TOKEN>`*

### 1. Create Account

`POST /accounts?type={accountType}`

Creates a new bank account (e.g., `SAVINGS` or `CURRENT`) for the authenticated user.

**Query Parameters:**

- `type`: String (e.g., "SAVINGS", "CURRENT") - Specifies the type of account to create.

### 2. Get User Accounts

`GET /accounts`

Retrieves a list of all banking accounts associated with the authenticated user.

### 3. Get Account Balance

`GET /accounts/{id}/balance`

Returns the current balance of a specific account identified by its ID.

---

## Transaction Endpoints

These endpoints facilitate various financial transactions.

*Requires Authorization: `Bearer <JWT_TOKEN>`*

### 1. Make a Deposit

`POST /transactions/deposit`

Initiates a deposit into a specified account.

**Request Body:**

```json
{
  "destinationAccountId": 1,
  "amount": 500.00
}
```

### 2. Make a Withdrawal

`POST /transactions/withdraw`

Initiates a withdrawal from a specified account.

**Request Body:**

```json
{
  "sourceAccountId": 1,
  "amount": 100.00
}
```

### 3. Transfer Money

`POST /transactions/transfer`

Facilitates money transfer between two accounts.

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

Retrieves the complete transaction history for a given account.

---

## Admin Endpoints

These endpoints are accessible only to users with the `ROLE_ADMIN` role and provide administrative functionalities.

*Requires Authorization: `Bearer <JWT_TOKEN>` and `ROLE_ADMIN` role.*

### 1. Get All Users

`GET /admin/users`

Retrieves a list of all registered users in the system.

### 2. Get All Accounts

`GET /admin/accounts`

Retrieves a list of all banking accounts across the system.

### 3. Get All Transactions

`GET /admin/transactions`

Retrieves a comprehensive list of all transactions, including those flagged as suspicious by the fraud detection system. This endpoint is primarily used by the Admin Dashboard for system monitoring.

---

## Error Handling

Our API returns standard HTTP status codes to indicate the success or failure of an API request. In case of an error, the API will return a JSON object with an `error` message and a `status` code.

| HTTP Status Code | Description                                  |
| :--------------- | :------------------------------------------- |
| `200 OK`         | Request successful                           |
| `201 Created`    | Resource successfully created                |
| `400 Bad Request`| Invalid request payload or parameters        |
| `401 Unauthorized`| Authentication required or invalid credentials |
| `403 Forbidden`  | Insufficient permissions to access resource  |
| `404 Not Found`  | Resource not found                           |
| `500 Internal Server Error`| An unexpected error occurred on the server |

---

## Conclusion

This documentation aims to provide a clear and comprehensive guide for integrating with the Axiom Bank API. For further assistance or to report issues, please refer to the project's GitHub repository.
