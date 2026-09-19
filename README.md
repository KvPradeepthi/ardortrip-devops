# ✈️ ArdorTrip: Cloud & DevOps Airline Booking System

[![Java](https://img.shields.io/badge/Java-17%20LTS-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED.svg)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Orchestrated-326CE5.svg)](https://kubernetes.io/)
[![Jenkins](https://img.shields.io/badge/CI%2FCD-Jenkins%20Declarative-D24939.svg)](https://www.jenkins.io/)
[![Prometheus](https://img.shields.io/badge/Metrics-Prometheus-E6522C.svg)](https://prometheus.io/)
[![Grafana](https://img.shields.io/badge/APM-Grafana%20Dashboards-F46800.svg)](https://grafana.com/)
[![AWS](https://img.shields.io/badge/Cloud-AWS%20(ECR%20%7C%20EKS%20%7C%20RDS)-FF9900.svg)](https://aws.amazon.com/)

> **Project Statement**:  
> *"This project was developed by referencing the comprehensive academic architecture for a DevOps-transformed airline booking system and independently rebuilding and deploying the core application and DevOps pipeline. The implementation focuses on an end-to-end engineering lifecycle: Java 17 Spring Boot REST API, PostgreSQL database, React web interface, multi-stage Docker containerization, Kubernetes orchestration with liveness/readiness probes, Jenkins CI/CD, and Prometheus/Grafana application performance monitoring (APM)."*

---

## 🏛️ System Architecture

```
                    PASSENGER / BROWSER
                             │
                             ▼
                 ┌───────────────────────┐
                 │    React Web UI       │ (Vite + TypeScript)
                 │    Port: 3000         │
                 └───────────┬───────────┘
                             │ HTTP /api & /actuator
                             ▼
                 ┌───────────────────────┐
                 │   Spring Boot 3 REST  │ (Java 17 LTS)
                 │   Port: 8080          │
                 └─────┬─────┬─────┬─────┘
                       │     │     │
         ┌─────────────┘     │     └─────────────┐
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ PostgreSQL 16   │ │ Spring Actuator │ │ Mock Payment    │
│ Relational DB   │ │ /prometheus     │ │ Txn Simulation  │
│ Port: 5432      │ │ Port: 8080      │ │ Instant PNR     │
└─────────────────┘ └────────┬────────┘ └─────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Prometheus      │ (Scrapes metrics every 15s)
                    │ Port: 9090      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Grafana APM     │ (JVM, CPU, Latency, DB Pool)
                    │ Port: 3001      │
                    └─────────────────┘
```

---

## 🚀 DevOps CI/CD Pipeline

```
Developer Push ──► GitHub Repository
                         │
                         ▼
                    Jenkins CI
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
   Maven Build      Unit Tests       Docker Build
 (Java 17 target)  (JUnit 5 Mock)   (Multi-stage)
        │                │                │
        └────────────────┼────────────────┘
                         ▼
             Stage 1 (Local Verification)
             Docker Compose Stack
             Kubernetes Deployments + Probes
                         │
                         ▼
             Stage 2 (Cloud Progression)
             Tag & Push to AWS ECR
             Deploy to AWS EKS Cluster
             Managed AWS RDS PostgreSQL
```

---

## 📂 Repository Layout

```
ardortrip-devops/
├── backend/                       # Spring Boot 3 Java 17 REST API
│   ├── src/main/java/com/ardortrip/
│   │   ├── config/               # Security, JWT Token Filter, WebMvc
│   │   ├── controller/           # Auth, Flight, Booking, Airport APIs
│   │   ├── dto/                  # Request/Response DTOs
│   │   ├── model/                # JPA Entities (User, Flight, Booking, etc.)
│   │   ├── repository/           # Spring Data JPA Repositories
│   │   └── service/              # Business logic & mock payments
│   ├── src/main/resources/       # application.yml (H2 dev + Postgres prod)
│   ├── src/test/java/            # Automated JUnit 5 test suite
│   ├── pom.xml                   # Maven dependencies & build plugins
│   └── Dockerfile                # Multi-stage Dockerfile (JRE 17)
│
├── frontend/                      # React 18 + Vite Web Application
│   ├── src/                      # Flight search, booking modal, PNR lookup
│   ├── package.json              # React dependencies
│   ├── nginx.conf                # Production reverse proxy config
│   └── Dockerfile                # Multi-stage Node + Nginx build
│
├── database/                      # Relational Database Design
│   ├── schema.sql                # PostgreSQL DDL with indexes & FK constraints
│   └── seed-data.sql             # Routes connecting India, Japan, and USA
│
├── k8s/                           # Kubernetes Orchestration Manifests
│   ├── configmap.yaml            # Environment variables & DB connection string
│   ├── secret.yaml               # Encrypted credentials & JWT secret
│   ├── backend-deployment.yaml   # Deployments with Liveness/Readiness probes
│   ├── backend-service.yaml      # ClusterIP Service
│   ├── frontend-deployment.yaml  # Web UI Deployment & NodePort Service
│   ├── postgres-deployment.yaml  # Local K8s PostgreSQL Pod & Service
│   ├── ingress.yaml              # Nginx Ingress Controller routing & CORS
│   └── hpa.yaml                  # Horizontal Pod Autoscaler (CPU 75%)
│
├── monitoring/                    # Observability & APM Stack
│   ├── prometheus.yml            # Scrape config for /actuator/prometheus
│   └── grafana/                  # Auto-provisioned Grafana datasource & dashboard
│
├── scripts/                       # Python DevOps Automation
│   ├── health_check.py           # Automated smoke test for CI/CD pipelines
│   └── traffic_generator.py      # Generates load for Prometheus/Grafana
│
├── terraform/                     # AWS Infrastructure as Code (Stage 2)
│   ├── main.tf                   # VPC, Subnets, ECR, EKS, RDS definitions
│   └── variables.tf              # Region (Tokyo default) and credentials
│
├── docker-compose.yml             # Single-command local orchestration
├── Jenkinsfile                    # Declarative CI/CD pipeline definition
└── docs/                          # YCC Systems Engineer Defense Kit
    ├── ARCHITECTURE.md           # Detailed architecture & data flow
    ├── YCC_INTERVIEW_PREP.md     # 30s/2m/5m pitches, tech Q&A, culture fit
    └── PRESENTATION_SLIDES.md    # 18-slide presentation deck
```

---

## ⚡ Getting Started Locally

### Prerequisites
- Java 17 LTS & Maven 3.9+
- Node.js 18+ & npm
- Docker & Docker Compose (optional, for full containerized stack)

### Option A: Run Natively (Dev Mode)

1. **Start Backend (uses in-memory H2 with pre-seeded data)**:
   ```bash
   cd backend
   mvn clean test
   java -jar target/ardortrip-backend-1.0.0.jar --spring.profiles.active=dev
   ```
   *Backend running at `http://localhost:8080`*

2. **Start Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *Frontend running at `http://localhost:3000`*

3. **Verify Health**:
   ```bash
   python scripts/health_check.py http://localhost:8080
   ```

---

### Option B: Run Multi-Container Stack with Docker Compose

Start the full stack (PostgreSQL + Spring Boot + React + Prometheus + Grafana):
```bash
docker-compose up -d --build
```

**Service URLs**:
- **Web Application**: `http://localhost:3000`
- **Spring Boot API**: `http://localhost:8080/api/flights`
- **Actuator Health**: `http://localhost:8080/actuator/health`
- **Prometheus Metrics**: `http://localhost:9090`
- **Grafana Dashboard**: `http://localhost:3001` *(User: `admin` / Password: `admin`)*

Generate real-time metrics for Grafana:
```bash
python scripts/traffic_generator.py
```

---

## ☸️ Kubernetes Deployment

Deploy to any local Kubernetes cluster (Docker Desktop / Minikube / Kind) or cloud EKS:

```bash
# 1. Apply configurations and secrets
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml

# 2. Deploy Database
kubectl apply -f k8s/postgres-deployment.yaml

# 3. Deploy Backend & Frontend
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml

# 4. Verify Pod Status & Probes
kubectl get pods
kubectl describe pod -l app=ardortrip-backend
kubectl get services
```

---

## 🧪 Automated Testing

```bash
# Backend unit & MockMvc integration tests
cd backend
mvn test
```
- Total test cases: 6
- Result: **0 failures, 0 errors, 100% passing**.

---

## 🧑‍💻 Technical Defense & YCC Alignment

For technical interview discussions regarding:
- *Why Java 17 + Spring Boot 3 for enterprise reliability*
- *Why PostgreSQL relational schema over NoSQL*
- *How Kubernetes Liveness and Readiness probes eliminate downtime*
- *How Prometheus and Grafana provide proactive observability for social infrastructure maintenance*

See [`docs/YCC_INTERVIEW_PREP.md`](docs/YCC_INTERVIEW_PREP.md) and [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
