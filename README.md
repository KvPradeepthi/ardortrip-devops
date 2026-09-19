# ✈️ ArdorTrip: Cloud & DevOps Airline Booking System

[![Java](https://img.shields.io/badge/Java-17%20LTS-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED.svg)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Orchestrated-326CE5.svg)](https://kubernetes.io/)
[![Jenkins](https://img.shields.io/badge/CI%2FCD-Jenkins%20Declarative-D24939.svg)](https://www.jenkins.io/)
[![Prometheus](https://img.shields.io/badge/Metrics-Prometheus-E6522C.svg)](https://prometheus.io/)
[![Grafana](https://img.shields.io/badge/Monitoring-Grafana%20Dashboard-F46800.svg)](https://grafana.com/)

> **Project Description**:  
> A working end-to-end DevOps implementation of an airline booking system demonstrating modular application development, containerization, CI/CD automation, Kubernetes orchestration, and monitoring. Built using Java 17, Spring Boot 3, PostgreSQL, React, Docker, Kubernetes, Jenkins, and Prometheus/Grafana.

---

## 🏛️ System Architecture

```
                    PASSENGER / BROWSER
                             │
                             ▼
                 ┌───────────────────────┐
                 │    React Web UI       │ (React + JavaScript + Vite)
                 │    Port: 3000         │
                 └───────────┬───────────┘
                             │ HTTP /api & /actuator
                             ▼
                 ┌───────────────────────┐
                 │  Spring Boot REST API │ (Java 17 LTS, Spring Boot 3)
                 │  Port: 8080           │ (Modular Monolithic Backend)
                 └─────┬─────┬─────┬─────┘
                       │     │     │
         ┌─────────────┘     │     └─────────────┐
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ PostgreSQL 16   │ │ Spring Actuator │ │ Mock Payment    │
│ Relational DB   │ │ (health, metrics) │ │ Instant SUCCESS │
│ Port: 5432      │ │ Port: 8080      │ │ PNR Generation  │
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

## 🚀 Implementation Stages: Current vs. Roadmap

### Stage 1: Verified Local Development & DevOps (Current Implementation)
- **Application**: Modular Spring Boot 3 REST application (Java 17 LTS) with Spring Data JPA, JWT authentication, and transactional booking logic.
- **Frontend**: Clean React 18 Single Page Application (Search -> Select -> Book -> PNR Lookup -> Cancel).
- **Database**: PostgreSQL relational schema with foreign key constraints, indexes, and ACID transaction boundaries.
- **Containerization**: Optimized lightweight Docker runtime images for backend and frontend with Docker Compose multi-container orchestration.
- **Kubernetes (Local)**: Deployments with rolling updates, Services (`backend-service`), ConfigMaps, Secrets, and Actuator-based `livenessProbe` and `readinessProbe`.
- **CI Pipeline**: Declarative `Jenkinsfile` running Maven compilation, automated JUnit 5 tests, and Docker container packaging.
- **Monitoring & Observability**: Prometheus scraping Spring Boot Actuator and Grafana dashboard tracking JVM Heap, CPU, Latency, and HikariCP connection pool metrics.

### Stage 2: AWS Cloud Deployment & CD (Planned / Extension)
- **AWS ECR**: Remote Docker container image registry.
- **AWS EKS**: Managed Kubernetes cluster deployment.
- **AWS RDS**: Managed PostgreSQL database instance.
- **Jenkins CD**: Automated CD pipeline triggering remote ECR push and rolling rollout to EKS.
- **Terraform**: Declarative Infrastructure as Code (VPC, Subnets, ECR repositories, RDS).

---

## ⚡ Getting Started Locally

### Option A: Run Natively (Dev Profile)

1. **Start Backend (In-Memory H2 with Seed Data)**:
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

---

### Option B: Run with Docker Compose

```bash
docker compose up -d --build
```

**Service Access**:
- Web UI: `http://localhost:3000`
- REST API: `http://localhost:8080/api/flights`
- Actuator Health: `http://localhost:8080/actuator/health`
- Prometheus Metrics: `http://localhost:9090`
- Grafana Dashboard: `http://localhost:3001` *(User: `admin` / Password: `admin`)*

Generate real-time metrics for Grafana:
```bash
python scripts/traffic_generator.py
```

---

## ☸️ Kubernetes Deployment (Local)

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

*Note: Ingress (`k8s/ingress.yaml`) and HPA (`k8s/hpa.yaml`) are optional extensions that require an active Ingress Controller and Metrics Server.*

---

## 🧪 Automated Testing

```bash
cd backend
mvn test
```
- Tests run: 6 (Application Context, BookingService seat reservation and constraint checks, FlightController MockMvc contracts).
- Result: **100% passing, 0 failures**.
