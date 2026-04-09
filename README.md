# Axiom Bank - Full-Stack Banking Management System

Axiom Bank is a production-ready, full-stack Banking Management System architected for secure financial operations. 
Built using enterprise-grade technologies, it integrates a robust Spring Boot backend with a highly dynamic React frontend, seamlessly containerized with Docker.

## Project Architecture

### Backend Stack
- **Spring Boot 3.x** (Java 17)
- **Spring Security** (Stateless authentication with JWT)
- **Spring Data JPA** (Hibernate)
- **PostgreSQL** (Relational Database)

### Frontend Stack
- **React 18** (Vite build tool)
- **React Router DOM**
- **Axios**
- **Vanilla CSS** (Custom Glassmorphism Design System)

## Core Features

1. **Authentication:** Secure user registration and JWT-based stateless login. Role-based access control separates standard users from administrators.
2. **Account Management:** Users can instantly create multiple bank accounts (Savings / Current).
3. **Core Banking Logic:** Execute deposits, withdrawals, and inter-account transfers. Built with transactional atomicity to prevent race conditions or negative balances.
4. **Transaction Monitoring:** Immediate reflection of balance adjustments and persistent transaction history logging.
5. **Fraud Detection System:** Includes business logic to silently flag transactions that exceed suspicious thresholds (e.g., transfers over $10,000).
6. **Administrator Dashboard:** A privileged hub for administrators to oversee total system metrics, observe live transaction streams, and review suspicious fraud alerts.

## Repository Structure

```
├── backend/            # Spring Boot application
├── frontend/           # React.js SPA (Vite)
├── docs/               # In-depth API Specification
└── docker-compose.yml  # Docker environment config
```

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Java 17+ (If running backend natively)
- Node.js v18+ (If running frontend natively)
- Maven

### Step 1: Database Setup
Launch the PostgreSQL database using Docker Compose:
```bash
docker-compose up -d
```
*Note: Make sure port 5432 is free.*

### Step 2: Running the Backend
Navigate to the `backend` directory and run the Spring Boot application using the Maven wrapper:
```bash
cd backend
./mvnw spring-boot:run
```
The server will start on `http://localhost:8080`. The database schema is automatically updated upon application startup.

### Step 3: Running the Frontend
In a new terminal window, navigate to the `frontend` directory, install dependencies, and start the Vite development server:
```bash
cd frontend
npm install
npm run dev
```
The application UI will be accessible at `http://localhost:5173`.

## First Steps (Testing the Application)
1. Navigate to the frontend homepage.
2. Click **Register** to create a standard user account.
3. If you want to view the Admin Dashboard, create an account selecting the **Admin** role from the dropdown when registering.
4. Log in and create a "Savings" or "Current" account.
5. Execute deposits, withdrawals, and view your transaction history entirely seamlessly. 

## Documentation
For complete technical details on API interactions and payload schemas, please check the [API Documentation](./docs/api-documentation.md).
