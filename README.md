# 🏦 Axiom Bank: Enterprise-Grade Banking Management System

[![Java](https://img.shields.io/badge/Java-17-orange.svg?style=flat-square&logo=java)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen.svg?style=flat-square&logo=spring-boot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg?style=flat-square&logo=react)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg?style=flat-square&logo=docker)](https://www.docker.com/)

Axiom Bank is a production-ready, full-stack Banking Management System architected for secure, scalable, and high-performance financial operations. Built using an enterprise-grade technology stack, it seamlessly integrates a robust Spring Boot backend with a dynamic React frontend, fully containerized for modern cloud deployment.

---

## 🏗️ System Architecture

Axiom Bank follows a clean, decoupled architecture designed for maintainability and scalability.

### 🚀 Backend Stack (Enterprise Core)
- **Framework**: Spring Boot 3.x (Java 17)
- **Security**: Spring Security with stateless JWT (JSON Web Token) authentication.
- **Persistence**: Spring Data JPA with Hibernate ORM.
- **Database**: PostgreSQL for ACID-compliant relational data management.
- **Validation**: Jakarta Bean Validation for robust data integrity.

### 🎨 Frontend Stack (Modern Experience)
- **Library**: React 18 with Vite for optimized build performance.
- **Routing**: React Router DOM for seamless single-page application navigation.
- **State Management**: React Context API for lightweight, efficient state handling.
- **Design**: Custom Glassmorphism UI system built with Vanilla CSS for a premium, modern aesthetic.
- **API Client**: Axios with interceptors for centralized request/response handling.

---

## ✨ Key Features

### 🔐 Advanced Security & Authentication
- **Stateless Auth**: Secure JWT-based authentication with token expiration and refresh logic.
- **RBAC**: Role-Based Access Control distinguishing between `Standard Users` and `Administrators`.
- **Encrypted Storage**: Industry-standard password hashing using BCrypt.

### 💳 Core Banking Operations
- **Account Management**: Instant creation and management of Savings and Current accounts.
- **Transactional Atomicity**: All financial operations (deposits, withdrawals, transfers) are wrapped in database transactions to ensure data consistency.
- **Overdraft Protection**: Built-in business logic to prevent negative balances and ensure fiscal responsibility.

### 📊 Real-Time Monitoring & Fraud Detection
- **Live Activity Feed**: Immediate reflection of balance adjustments and transaction history.
- **Fraud Engine**: Automated flagging of suspicious activities based on configurable thresholds (e.g., high-value transfers).
- **Admin Command Center**: A privileged dashboard for overseeing system-wide metrics, user activity, and security alerts.

---

## 📂 Repository Structure

```bash
├── backend/            # Spring Boot REST API
│   ├── src/            # Source code (Java 17)
│   └── pom.xml         # Maven dependencies
├── frontend/           # React.js SPA (Vite)
│   ├── src/            # Component-based architecture
│   └── package.json    # Node.js dependencies
├── docs/               # Technical API documentation
├── docker-compose.yml  # Multi-container orchestration
└── .gitignore          # Environment-safe exclusions
```

---

## 🛠️ Installation & Setup

### Prerequisites
- **Docker & Docker Compose** (Recommended)
- **Java 17+** (For native execution)
- **Node.js v18+** (For native execution)
- **Maven**

### Quick Start with Docker
The fastest way to get Axiom Bank running is via Docker Compose:
```bash
docker-compose up -d --build
```
*Access the application at `http://localhost:5173`.*

### Manual Development Setup

#### 1. Database Initialization
Ensure PostgreSQL is running on port `5432`. Update `backend/src/main/resources/application.properties` with your credentials.

#### 2. Backend Execution
```bash
cd backend
./mvnw spring-boot:run
```
*API will be live at `http://localhost:8080`.*

#### 3. Frontend Execution
```bash
cd frontend
npm install
npm run dev
```
*UI will be live at `http://localhost:5173`.*

---

## 📖 Documentation & API Reference

Detailed technical specifications, including endpoint descriptions, request/response schemas, and error handling protocols, are available in the [API Documentation](./docs/api-documentation.md).

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Developed with ❤️ by the Axiom Engineering Team
</p>
