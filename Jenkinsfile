pipeline {
    agent any

    tools {
        maven 'Maven-3.9.6'
        jdk 'JDK-17'
    }

    environment {
        APP_NAME        = 'ardortrip'
        BACKEND_IMAGE   = 'ardortrip-backend'
        FRONTEND_IMAGE  = 'ardortrip-frontend'
        IMAGE_TAG       = "${env.BUILD_NUMBER ?: '1.0.0'}"
        AWS_REGION      = 'ap-northeast-1' // Tokyo Region
        AWS_ACCOUNT_ID  = '123456789012'
        ECR_REGISTRY    = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    }

    stages {
        // ==========================================
        // STAGE 1: CONTINUOUS INTEGRATION (CI)
        // ==========================================
        stage('Checkout Code') {
            steps {
                echo 'Checking out source code from Git repository...'
                checkout scm
            }
        }

        stage('Backend Build & Unit Tests') {
            steps {
                dir('backend') {
                    echo 'Running Maven compilation and automated JUnit 5 tests...'
                    sh 'mvn clean test'
                }
            }
            post {
                always {
                    junit 'backend/target/surefire-reports/*.xml'
                }
            }
        }

        stage('Backend Package JAR') {
            steps {
                dir('backend') {
                    echo 'Packaging Spring Boot executable fat JAR...'
                    sh 'mvn package -DskipTests'
                }
            }
        }

        stage('Frontend Lint & Build') {
            steps {
                dir('frontend') {
                    echo 'Building React + JavaScript production bundle...'
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Docker Image Build') {
            steps {
                echo 'Building multi-stage container images...'
                sh "docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} ./backend"
                sh "docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} ./frontend"
            }
        }

        // ==========================================
        // STAGE 2: CONTINUOUS DEPLOYMENT (CD - AWS / K8s)
        // ==========================================
        stage('Push to AWS ECR') {
            when {
                branch 'main'
            }
            steps {
                echo 'Authenticating with AWS ECR and pushing container images...'
                sh """
                    aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}
                    docker tag ${BACKEND_IMAGE}:${IMAGE_TAG} ${ECR_REGISTRY}/${BACKEND_IMAGE}:${IMAGE_TAG}
                    docker tag ${FRONTEND_IMAGE}:${IMAGE_TAG} ${ECR_REGISTRY}/${FRONTEND_IMAGE}:${IMAGE_TAG}
                    docker push ${ECR_REGISTRY}/${BACKEND_IMAGE}:${IMAGE_TAG}
                    docker push ${ECR_REGISTRY}/${FRONTEND_IMAGE}:${IMAGE_TAG}
                """
            }
        }

        stage('Deploy to Kubernetes') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying application manifests to Kubernetes cluster...'
                sh 'kubectl apply -f k8s/configmap.yaml'
                sh 'kubectl apply -f k8s/secret.yaml'
                sh 'kubectl apply -f k8s/postgres-deployment.yaml'
                sh 'kubectl apply -f k8s/backend-deployment.yaml'
                sh 'kubectl apply -f k8s/backend-service.yaml'
                sh 'kubectl apply -f k8s/frontend-deployment.yaml'
            }
        }

        stage('Kubectl Verification & Smoke Test') {
            when {
                branch 'main'
            }
            steps {
                echo 'Verifying rollout status and probe health...'
                sh 'kubectl rollout status deployment/flights-deployment --timeout=90s'
                sh 'kubectl rollout status deployment/frontend-deployment --timeout=90s'
                sh 'kubectl get pods -l app=ardortrip-backend'
                sh 'kubectl get services'
                echo 'Running automated health check probe...'
                sh 'python scripts/health_check.py http://localhost:8080'
            }
        }
    }

    post {
        success {
            echo "CI/CD Pipeline Succeeded for build #${env.BUILD_NUMBER}!"
        }
        failure {
            echo "Pipeline Failed! Check logs and notify the engineering team."
        }
    }
}
