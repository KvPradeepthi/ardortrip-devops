# ArdorTrip Architecture & Engineering Specifications

## 1. Architectural Philosophy
In accordance with social infrastructure standards (critical public systems, airline booking, medical administration), ArdorTrip is engineered around three non-negotiable principles:
1. **Reliability & Zero Downtime**: Modular, decoupled application architecture, stateless application tiers, automated health probes, and rolling updates.
2. **Data Integrity & Consistency**: Relational database (PostgreSQL) enforcing ACID transactions, seat decrement locks, unique booking reference codes (PNR), and foreign key audit constraints.
3. **Proactive Observability**: Built-in instrumentation exposing real-time metrics (JVM memory, thread pools, response latency, database connection pools) directly to Prometheus and Grafana.

---

## 2. Core Service Components

### 2.1 Backend API Tier (Spring Boot 3.3.3 / Java 17 LTS)
- **Spring Web**: Handles RESTful routing, input validation, and content negotiation.
- **Spring Data JPA & Hibernate**: Object-relational mapping with PostgreSQL and H2 dialect support.
- **Spring Security & JJWT**: Stateless token-based authentication using HMAC-SHA256. Protects sensitive administrative and booking actions while maintaining high-throughput public search APIs.
- **Spring Boot Actuator & Micrometer**: Exposes operational telemetry at `/actuator/health`, `/actuator/health/liveness`, `/actuator/health/readiness`, and `/actuator/prometheus`.

### 2.2 Relational Database Tier (PostgreSQL 16)
- **Tables**:
  - `users`: Stores credentials (BCrypt hashed) and roles (`ROLE_USER`, `ROLE_ADMIN`).
  - `airports`: Master reference table with airport codes (IATA 3-letter codes: DEL, BLR, HND, NRT, SFO, etc.).
  - `flights`: Flight numbers, schedule, route, class, total seats, and available seats.
  - `bookings`: Central transaction table tracking PNR, user, flight, seat number, amount, and lifecycle status (`CONFIRMED`, `CANCELLED`).
  - `passengers`: Traveler passport, full name, and contact details.
  - `payments`: Simulated payment transaction audit log with unique transaction IDs (`TXN-xxxxxxxx`).

### 2.3 Frontend Tier (React 18 + JavaScript + Vite + Nginx)
- Single Page Application built with Vite for sub-second development builds and optimized production bundling.
- Containerized Nginx reverse proxy serving optimized static production assets and routing `/api/` and `/actuator/` requests to the backend.

---

## 3. High-Availability & Kubernetes Design

```text
                  Incoming Traffic (Ingress / NodePort)
                                │
                                ▼
                       Frontend Service
                                │
                  ┌─────────────┴─────────────┐
                  ▼                           ▼
            Frontend Pod 1              Frontend Pod 2
                  │                           │
                  └─────────────┬─────────────┘
                                │ HTTP /api/
                                ▼
                        Flights Service
                                │
                  ┌─────────────┴─────────────┐
                  ▼                           ▼
             Backend Pod 1               Backend Pod 2
         [Liveness/Readiness]        [Liveness/Readiness]
                  │                           │
                  └─────────────┬─────────────┘
                                │ JDBC
                                ▼
                      PostgreSQL Service
                                │
                                ▼
                         PostgreSQL Pod
```

### Probes Implementation:
- **Readiness Probe (`/actuator/health/readiness`)**: Ensures the database connection pool is healthy and the JVM is warm before routing user traffic to the Pod.
- **Liveness Probe (`/actuator/health/liveness`)**: Detects thread deadlocks or internal server failure, automatically restarting the failing container without manual operator intervention.
