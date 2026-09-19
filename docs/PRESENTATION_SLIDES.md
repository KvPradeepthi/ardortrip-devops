# Presentation Slides Deck: ArdorTrip Airline Booking DevOps System
**Audience**: YCC Technical Interviewers & Zenken Panelists (Bangalore Offline Event)

---

### Slide 1: Title & Introduction
- **Title**: ArdorTrip: Cloud-Ready Airline Booking & DevOps Orchestration System
- **Presenter**: Engineering Candidate
- **Core Stack**: Java 17 LTS | Spring Boot 3 | PostgreSQL | React | Docker | Kubernetes | Jenkins | Prometheus & Grafana | AWS

### Slide 2: Problem Statement & Motivation
- Traditional travel reservation systems suffer from manual release cycles, siloed teams, and maintenance downtime.
- Goal: Demonstrate how modern DevOps practices transform a reservation system into a resilient, scalable, and observable cloud platform.

### Slide 3: System Architecture Overview
- Decoupled 3-Tier Architecture:
  - Client: Responsive React Single Page App
  - Application: Spring Boot 3 REST APIs (Stateless JWT Auth, Transactional Booking)
  - Data: PostgreSQL Relational Database (Strict ACID compliance)

### Slide 4: Core Functional Workflow
- **Search**: Origin, Destination, Class, and Schedule
- **Select**: Flight details, available seats, fare breakdown
- **Book**: Passenger details, seat allocation, mock payment authorization
- **Confirm**: Instant PNR reference generation and ticket lifecycle management (View / Cancel)

### Slide 5: Database Schema & Relational Design
- Normalized tables: `users`, `airports`, `flights`, `bookings`, `passengers`, `payments`
- Data integrity: Foreign key constraints, unique PNR indexing, seat decrement transactions.

### Slide 6: Security & API Architecture
- Stateless JWT Bearer Authentication (HS256)
- BCrypt password encryption
- Role-Based Access Control (RBAC): `ROLE_USER` vs. `ROLE_ADMIN`
- CORS configuration enabling secure frontend communication.

### Slide 7: Containerization Strategy with Docker
- Multi-stage Docker builds:
  - Backend: Maven builder -> Eclipse Temurin JRE 17 runtime
  - Frontend: Node.js Vite builder -> Nginx lightweight web server
- Benefits: Fast build caching, minimal image size, zero host dependencies.

### Slide 8: Local Multi-Container Stack (Docker Compose)
- Single-command spin-up: `docker-compose up -d`
- Seamless bridge networking connecting:
  - `postgres` (Port 5432)
  - `backend` (Port 8080)
  - `frontend` (Port 3000)
  - `prometheus` (Port 9090)
  - `grafana` (Port 3001)

### Slide 9: Kubernetes Orchestration & High Availability
- Manifest architecture: Deployments, Services (ClusterIP & NodePort), ConfigMaps, Secrets, Ingress, and HPA.
- Pod scaling: 2 replicas for fault tolerance and zero single points of failure.

### Slide 10: Zero-Downtime Reliability: Liveness & Readiness Probes
- Integration between Spring Boot Actuator and Kubernetes kubelet:
  - Readiness Probe: Blocks traffic until DB connection pool is active.
  - Liveness Probe: Detects internal stalls and restarts failing pods automatically.

### Slide 11: Continuous Integration Pipeline (Jenkins CI)
- Declarative pipeline (`Jenkinsfile`):
  1. Git Checkout
  2. Maven Build & Automated JUnit 5 Tests
  3. Spring Boot JAR Packaging
  4. React Frontend Production Build
  5. Docker Image Build & Tagging

### Slide 12: Continuous Deployment & Cloud Strategy (AWS)
- Progression to AWS:
  - AWS ECR: Secure Docker image repository
  - AWS EKS: Managed Kubernetes cluster
  - AWS RDS: Highly available managed PostgreSQL
  - Terraform IaC: Declarative provisioning of VPC, subnets, and clusters.

### Slide 13: Observability & Monitoring (Prometheus + Grafana)
- Proactive operations and maintenance:
  - Prometheus scraping `/actuator/prometheus`
  - Grafana APM dashboard: JVM Heap %, CPU %, HTTP Request Latency, HikariCP pool.

### Slide 14: Automated Testing & Quality Assurance
- Test-driven validation:
  - Unit tests: PNR generator, seat availability checks, overbooking prevention.
  - MockMvc tests: Flight API contracts, Actuator health status.
  - Python probe script: Automated end-to-end smoke testing.

### Slide 15: Engineering Challenges & Solutions
- Challenge 1: Hibernate Lazy Loading on PNR lookups -> Resolved with eager fetching and `@Transactional` boundaries.
- Challenge 2: Zero-downtime container updates -> Resolved using Kubernetes rolling update strategy + readiness probes.

### Slide 16: Alignment with YCC Social Infrastructure Mission
- YCC's 60-year tradition of supporting public administration and medical systems demands reliable, maintainable software.
- This project demonstrates practical capability across the full lifecycle: Design -> Implementation -> Containerization -> Monitoring.

### Slide 17: Future Scope
- Terraform automated provisioning for multi-region AWS DR
- Kafka event streaming for real-time flight departure delay notifications
- OpenTelemetry distributed tracing across microservices.

### Slide 18: Q&A & Demonstration
- Live Demo: Flight Search, Booking Confirmation, PNR Lookup, and Grafana Telemetry Dashboard.
- Open for questions. Thank you!
