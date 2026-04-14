# Axiom Bank - Full-Stack Banking Management System

Axiom Bank is a production-ready, full-stack Banking Management System architected for secure financial operations. 
Built using enterprise-grade technologies, it integrates a robust Spring Boot backend with a highly dynamic React frontend, seamlessly containerized with Docker.

## Project Architecture

### Backend Stack
- **Spring Boot 3.x** (Java 17)
- **Spring Security** (Stateless authentication with JWT)
- **Spring Data JPA** (Hibernate)
- **PostgreSQL** (Relational Database)
- **Redis** (Caching Layer)
- **Spring Mail** (Email Notifications)
- **Spring Events** (Async Event-Driven Processing)

### Frontend Stack
- **React 18** (Vite build tool)
- **React Router DOM**
- **Axios**
- **Recharts** (Data Visualization)
- **jsPDF** (PDF Statement Generation)
- **Lucide React** (Modern Icons)
- **Vanilla CSS** (Custom Glassmorphism Design System with Dark/Light Theme)

## Core Features

1. **Authentication:** Secure user registration and JWT-based stateless login. Role-based access control separates standard users from administrators.
2. **Account Management:** Users can instantly create multiple bank accounts (Savings / Current) with multi-currency support (USD, EUR, GBP, INR).
3. **Core Banking Logic:** Execute deposits, withdrawals, and inter-account transfers with automatic forex conversion. Built with transactional atomicity.
4. **Transaction Monitoring:** Immediate reflection of balance adjustments and persistent transaction history logging.
5. **Fraud Detection System (Event-Driven):** Asynchronous fraud detection via Spring Events. Suspicious transactions are flagged and email alerts are dispatched.
6. **Administrator Dashboard:** A privileged hub with Recharts visualizations (Pie charts for transaction breakdown), live fraud alerts, system metrics, and loan management.
7. **Interactive Data Visualization:** Line charts for balance history, pie charts for transaction types, all powered by Recharts.
8. **Downloadable Bank Statements:** Export transaction history as professionally formatted PDF documents via jsPDF.
9. **Beneficiary Management:** Save frequent transfer contacts and use them for quick transfers.
10. **Dark / Light Theme Toggle:** Full CSS variable-based theming with persistent localStorage preference.
11. **Automated Interest Calculation:** Scheduled cron job (`@Scheduled`) calculates and credits 5% APY daily to Savings accounts.
12. **Recurring Payments (Standing Instructions):** Users can schedule automatic future transactions (Daily, Weekly, Monthly).
13. **Loan & Credit Module:** Users apply for loans. Admins approve/reject with automatic principal disbursement.
14. **Multi-Currency & Forex:** Accounts support multiple currencies with automatic exchange rate conversion during transfers.
15. **Redis Caching:** High-traffic read endpoints cached via Redis for improved performance.
16. **Email Notification System:** Configurable alert system (Mailtrap-ready) for fraud alerts and transaction receipts.

## Repository Structure

```
├── backend/            # Spring Boot application
│   ├── controllers/    # REST API endpoints
│   ├── models/         # JPA Entities (Account, User, Transaction, Loan, Beneficiary, RecurringPayment)
│   ├── services/       # Business logic (TransactionService, ForexService, FraudDetection, InterestScheduler, EmailNotification)
│   ├── events/         # Spring Event classes
│   └── security/       # JWT + Spring Security config
├── frontend/           # React.js SPA (Vite)
│   ├── components/     # Reusable components (Navbar, PdfDownloader, RecurringPayments)
│   ├── pages/          # Route pages (Dashboard, Transfer, Loans, AdminDashboard)
│   ├── context/        # React Contexts (AuthContext, ThemeContext)
│   └── services/       # API client (Axios)
├── docs/               # In-depth API Specification
└── docker-compose.yml  # Docker environment config (PostgreSQL + Redis)
```

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Java 17+ (If running backend natively)
- Node.js v18+ (If running frontend natively)
- Maven

### Step 1: Database & Cache Setup
Launch the PostgreSQL database and Redis cache using Docker Compose:
```bash
docker-compose up -d
```
*Note: Make sure ports 5432 (Postgres) and 6379 (Redis) are free.*

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
6. Try the **Dark/Light mode toggle** (Sun/Moon icon in navbar).
7. After some transactions, view the **Balance History chart** on your dashboard.
8. Click **Export Statement** to download a PDF of your transactions.
9. Navigate to **Loans** to apply for a credit facility.
10. As an Admin, visit the **Admin Dashboard** to approve loans and view fraud alerts.

## Email Configuration (Optional)
To enable real email alerts, update `application.properties`:
```
axiom.mail.enabled=true
spring.mail.username=your_mailtrap_username
spring.mail.password=your_mailtrap_password
```

## Documentation
For complete technical details on API interactions and payload schemas, please check the [API Documentation](./docs/api-documentation.md).
