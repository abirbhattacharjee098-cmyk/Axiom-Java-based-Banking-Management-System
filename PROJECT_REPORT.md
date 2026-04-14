# Comprehensive Project Report: Axiom Banking Management System

**Project Title:** Axiom Banking Management System  
**System Type:** Full-Stack Enterprise Web Application  
**Primary Tech Stack:** Java 17, Spring Boot 3.x, React.js (Vite), PostgreSQL, Docker, Maven  

---

## 1. Abstract
The Axiom Banking Management System is a highly secure, heavily optimized, full-stack enterprise web application engineered to facilitate core digital banking operations. Designed to replicate modern corporate banking systems, the application employs a distributed three-tier architecture that rigorously separates the presentation layer from business logic and data persistence. 

This project aims to deliver a strictly ACID-compliant transactional environment capable of processing user authentication, account provisioning, monetary transfers, and automated fraud-monitoring. By combining the resilient structure of the Java Spring Ecosystem with the instantaneous state transformations of React.js, the system provides a seamless, zero-latency user experience wrapped in modern Glassmorphism aesthetics.

---

## 2. Introduction

### 2.1 Background
With the total paradigm shift toward digital banking, software architectures handling financial data face extreme scrutiny. They must reliably scale, absolutely guarantee the mathematical integrity of numerical balances under high concurrency, and proactively repel unauthorized intrusion. The Axiom Banking System was conceptualized as a solution to securely aggregate these demands into a cohesive, easily deployable microservice-adjacent monolith.

### 2.2 Objective and Scope
The primary objectives of the application development lifecycle included:
1. **Unassailable Authentication:** Implementing a purely stateless authentication system using JSON Web Tokens (JWT) that eliminates typical server-side session vulnerabilities.
2. **Precision Transaction Routing:** Abstracting all monetary mutations behind strict logical checkpoints that rollback automatically upon encountering database constraint violations.
3. **Automated Threat Intelligence:** Building an integrated heuristic layer that silently monitors high-value transactions and flags potential anomalies for administrative validation.
4. **Seamless User Interface (UI):** Constructing a highly intuitive, responsive, and visually striking frontend that requires zero instructional overhead for end-users to navigate.

---

## 3. Technology Stack Breakdown

To achieve the stringent requirements of a financial application, enterprise-trusted tools were selected:

### 3.1 Backend: Spring Boot & Java
- **Java 17:** Selected for advanced garbage collection paradigms, native Records (for payload structures), and LTS durability.
- **Spring Boot 3.x:** Functions as the orchestration skeleton. It autoconfigures embedded Tomcat servers and handles complex dependency injection across beans seamlessly.
- **Spring Data JPA & Hibernate:** Provides Object-Relational Mapping (ORM), abstracting direct SQL interactions into programmatic interface derivations, shielding against SQL-injection vulnerabilities natively.
- **Spring Security 6:** Constructs a formidable filter-chain surrounding the exposed REST endpoints.

### 3.2 Frontend: React.js
- **React 18:** Supplies a Virtual DOM architecture allowing rapid UI updates when transaction states shift.
- **Vite:** Handled the application scaffolding, offering instant Hot Module Replacement (HMR) and optimized minimal bundle-sizes during build.
- **Axios:** Functions as the HTTP networking layer, uniquely modified with interceptors to inject authorization headers onto every outbound network promise automatically.
- **Vanilla CSS:** To bypass the physical overhead of utility libraries, thousands of lines of precise, semantic CSS were written to create custom frosted-glass interfaces ("Glassmorphism").

### 3.3 Infrastructure & Database
- **PostgreSQL:** An advanced, open-source relational database known for mathematically perfect strictness regarding foreign key relations and data persistence.
- **Docker & Docker Compose:** Containerizes the PostgreSQL instance, standardizing database configurations and port allocations making the system natively reproducible across varying Operating Systems.

---

## 4. Architectural Design & Workflows

### 4.1 Tier Isolation Model
The application successfully bifurcates client concerns from server responsibilities. 
- The React application operates completely disconnected from the database. 
- It relies on standardized `application/json` payload exchanges across the `/api` namespace to request data manipulations.
- The server responds with `ResponseEntity` envelopes carrying strictly defined Data Transfer Objects (DTOs), specifically omitting heavily nested relations (e.g. omitting the `@ManyToOne` User mapping via `@JsonIgnore`) to prevent data leakage and infinite recursion bugs.

### 4.2 Entity Relationship Breakdown
1. **User Entity:** Contains immutable registration data (`username`, `password_hash`, `role`).
2. **Account Entity:** Contains relational bonds referencing the `User` table constraint. Generates discrete `account_number` mappings and tracks independent `balance` states.
3. **Transaction Entity:** The absolute ledger tracking. Maintains the historical chronological metadata of `source_account`, `destination_account`, `amount`, and `status`.

---

## 5. Module Implementation & Business Logic

### 5.1 Identity and Access Management (IAM)
Users are logically partitioned into two specific groups upon initialization: `ROLE_USER` and `ROLE_ADMIN`. 
The `AuthEntryPointJwt.java` handler catches all unauthenticated traffic striking securing zones and forcibly bounces them back with `401 Unauthorized`. Upon a successful match of username and bcrypt-hashed password, the system algorithmically generates an encrypted JWT string valid for exactly 24 hours, storing this token asynchronously within the browser's storage mechanisms.

### 5.2 The Core Ledger System
When a standard user executes a deposit, withdrawal, or transfer:
- The `TransactionService` validates if the user truly holds authority over the requested `Account.id`.
- For Withdrawals/Transfers, a mathematical validation occurs confirming: `(CurrentBalance - RequestedAmount >= 0)`.
- The database commits a deduction to `Account A` and an addition to `Account B` specifically inside an `@Transactional` annotation. If the database crashes mid-execution, the entire state identically rolls back, preventing instances where money leaves an account but vanishes into the void.

### 5.3 Algorithmic Fraud Detection 
Instead of relying on third-party security vendors, the Axiom System integrates heuristics directly into the transaction layer. 
If an explicit transfer payload crosses a defined constant threshold (`$10,000 USD`), the backend constructs the transaction but modifies the native `isSuspicious` matrix flag to `true`. 

The user receives a standard successful response, preventing them from realizing they have been flagged. Concurrently, the `/api/admin` endpoint automatically filters these specific transactions to the separate administrative dashboard UI, where security staff can review the exact timestamps, source IPs, and transaction IDs of the suspicious flow.

---

## 6. Security Analysis and Hardening

- **Preflight CORS Manipulation:** Cross-Origin Resource Sharing (CORS) is typically a massive point of failure for disconnected web applications. Preflight browser requests (`OPTIONS`) arrive natively stripped of Authorization Headers. A bespoke `CorsConfigurationSource` overrides standard Spring Security blocking protocols, allowing the `OPTIONS` request inside freely, while instantly slamming the gate on raw unregistered `POST` commands.
- **Cryptographic Hashing:** Under no circumstance does Axiom Bank retain plain-text user passwords. Integration of `BCryptPasswordEncoder` injects unique cryptographic salts into every password hash organically, making "Rainbow Table" brute-force decrypt attacks mathematically unfeasible.
- **Entity Masking:** Deeply nested Hibernate proxies (`LazyInitializationException` risks) are specifically ignored via embedded `@JsonIgnore` instructions at the Java payload layer, guaranteeing that backend database user-tables never serialize into the frontend network tab.

---

## 7. Conclusion

The Axiom Banking Management System represents a flawlessly executed junction of security, strictness, and aesthetic modernity. Iterative development methodologies successfully integrated a relational SQL architecture into a loosely coupled RESTful framework, subsequently marrying it perfectly to an instantaneous React visual layer. 

The successful implementation of transactional atomicity and real-time JWT filtering drastically outperforms monolithic counterparts, demonstrating extreme viability as an enterprise-scalable foundational application perfectly suited for integration with heavier external real-time payment gateways in the future.

---

## 8. Future Enhancements
Expanding the functional parameterization of Axiom Bank could branch across several vectors:
1. **2FA Network Gateways:** Integrating SMS OTPs via Twilio or Email-validation layers (SMTP) upon registration flows to establish two-factor verification routines.
2. **PDF Statement Generation:** Leveraging `iText` or Apache `PDFBox` native Java libraries allowing customers to download encrypted quarterly PDF bank statements directly from the application UI.
3. **Docker Multi-Staging:** Converting the React application into a static Nginx Docker build, enabling instantaneous fully-containerized cloud microservice deployment onto AWS ECS or Kubernetes clusters without requiring human intervention. 
