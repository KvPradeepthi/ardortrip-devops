# YCC Co., Ltd. Technical Interview & Defense Kit
**Role**: Systems Engineer (Cloud Dev & Ops – AWS)  
**Location**: Bangalore Recruitment Event  
**Target Date**: October 19–20, 2026

---

## Part 1: Company Knowledge & Cultural Alignment

### About YCC Co., Ltd.
- **Founded**: 1966 (Celebrating 60th Anniversary).
- **Headquarters**: 3-1-2 Iida, Kofu, Yamanashi Prefecture, Japan.
- **Core Business**: Development, implementation, operation, and maintenance of social infrastructure information systems (local government administration, tax systems, resident registries, electronic medical records, healthcare solutions, and education systems like INCLSS®).
- **Engineering Values**: "Creating new value for society through the power of computers." High emphasis on communication, team collaboration, reliable maintenance, and sincerity alongside technical capability.
- **Global Inclusivity**: Active Indian engineers already working as senior mentors in Yamanashi.

### How this project aligns with YCC:
*"My project directly reflects the core responsibilities of a YCC Systems Engineer: taking system requirements from design to implementation, ensuring high reliability for critical services, containerizing workloads for seamless deployment, and implementing proactive monitoring for long-term maintenance."*

---

## Part 2: Elevator Pitches

### 30-Second Elevator Pitch
> *"I developed ArdorTrip, a cloud-ready airline booking system built with Java 17 and Spring Boot 3, backed by PostgreSQL, React, and an automated DevOps pipeline. I implemented multi-stage Docker containerization, Kubernetes orchestration with automated liveness and readiness health probes, a declarative Jenkins CI/CD pipeline, and Prometheus/Grafana application performance monitoring. This project taught me how to develop reliable systems, eliminate deployment downtime, and monitor services in production—skills that directly align with YCC's social infrastructure mission."*

### 2-Minute Architecture Walkthrough
> *"The project addresses the challenges of traditional, monolithic systems by modernizing an airline booking architecture into automated, containerized services.*
> 
> *On the development side, I used Java 17 and Spring Boot 3 to build RESTful APIs covering authentication, flight search, seat reservations, and mock payment workflows with unique PNR generation. The relational database is PostgreSQL, where I designed normalized schemas, transactional boundaries, and indexes to guarantee seat availability consistency without race conditions.*
> 
> *On the DevOps side, I containerized the backend and React frontend using multi-stage Docker builds to keep images small and secure. I then orchestrated the platform using Kubernetes, writing manifests for Deployments, Services, ConfigMaps, and Secrets. Crucially, I integrated Kubernetes liveness and readiness probes with Spring Boot Actuator, ensuring zero-downtime rolling updates.*
> 
> *For CI/CD, I authored a declarative Jenkinsfile that automatically runs Maven unit tests, builds container images, and prepares them for AWS ECR and EKS deployment. Finally, I connected Prometheus and Grafana to monitor JVM memory, CPU utilization, and HTTP request latency in real time. This covers the entire engineering lifecycle: develop, test, deploy, monitor, and maintain."*

---

## Part 3: Top Technical Interview Questions & Model Answers

### Q1: Why did you use PostgreSQL instead of MongoDB?
**Answer**:
> *"Airline reservation systems require strict ACID guarantees. When a passenger books a seat, we must ensure that two users cannot book the same seat simultaneously. PostgreSQL allows us to use relational transactions, foreign key constraints, and row-level locking. MongoDB's eventual consistency model is well-suited for unstructured catalogs, but financial and reservation systems require the relational integrity that PostgreSQL provides."*

### Q2: What problem does Docker solve in your project?
**Answer**:
> *"It eliminates the 'it works on my machine' problem. By packaging the Java runtime, dependencies, and application into a standardized, immutable container image, the application behaves identically across local development, CI/CD testing, and AWS Kubernetes production. Furthermore, by using multi-stage Docker builds, our production runtime image contains only the minimal JRE, reducing the attack surface and image size."*

### Q3: What is the difference between Kubernetes Liveness and Readiness probes?
**Answer**:
> *"The **Readiness probe** tells Kubernetes when the application is initialized and ready to accept user traffic (e.g., Spring Boot context loaded and database connections established). If it fails, Kubernetes temporarily removes the pod from service endpoints without killing it.*
> 
> *The **Liveness probe** checks if the application is running healthily. If an application enters an unrecoverable deadlock or memory leak, the liveness probe fails, and Kubernetes automatically restarts the pod to recover service availability."*

### Q4: What metrics do you track in Grafana and why?
**Answer**:
> *"Using Spring Boot Actuator's `/actuator/prometheus` endpoint, we collect:
> 1. **JVM Heap & Non-Heap Memory**: To identify memory leaks or tuning requirements.
> 2. **HikariCP Connection Pool**: To ensure database connections aren't exhausted during traffic spikes.
> 3. **HTTP Server Request Throughput & p95 Latency**: To verify response times remain acceptable.
> 4. **CPU Usage**: To trigger Kubernetes Horizontal Pod Autoscaling (HPA) when demand exceeds 75%."*

### Q5: What was your specific personal contribution?
**Answer**:
> *"While referencing the academic architecture for DevOps airline systems, I independently implemented and verified the entire codebase: writing the Spring Boot backend entities, repositories, and controllers; configuring the PostgreSQL schema; building the React interface; crafting the multi-stage Dockerfiles and Docker Compose orchestration; defining the Kubernetes manifests with custom health probes; writing the Jenkins CI/CD pipeline; and provisioning the Prometheus/Grafana APM dashboard."*
