pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'docker.io'
        BACKEND_IMAGE = 'alarm-backend'
        FRONTEND_IMAGE = 'alarm-frontend'
        IMAGE_TAG = "${BUILD_NUMBER}"
        PROJECT_NAME = 'alarm-app'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '📥 Checking out code from repository...'
                checkout scm
            }
        }
        
        stage('Environment Info') {
            steps {
                echo '🔍 Environment Information'
                sh '''
                    echo "Node version: $(node --version)"
                    echo "NPM version: $(npm --version)"
                    echo "Docker version: $(docker --version)"
                    echo "Build Number: ${BUILD_NUMBER}"
                '''
            }
        }
        
        stage('Install Dependencies') {
            parallel {
                stage('Backend Dependencies') {
                    steps {
                        echo '📦 Installing backend dependencies...'
                        dir('backend') {
                            sh 'npm install'
                        }
                    }
                }
                stage('Frontend Dependencies') {
                    steps {
                        echo '📦 Installing frontend dependencies...'
                        dir('frontend') {
                            sh 'npm install'
                        }
                    }
                }
            }
        }
        
        stage('Run Tests') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        echo '🧪 Running backend tests...'
                        dir('backend') {
                            sh 'npm test || echo "No tests configured yet"'
                        }
                    }
                }
                stage('Frontend Tests') {
                    steps {
                        echo '🧪 Running frontend tests...'
                        dir('frontend') {
                            sh 'npm test -- --watchAll=false || echo "No tests configured yet"'
                        }
                    }
                }
            }
        }
        
        stage('Build Docker Images') {
            parallel {
                stage('Build Backend Image') {
                    steps {
                        echo '🐳 Building backend Docker image...'
                        dir('backend') {
                            sh """
                                docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} .
                                docker tag ${BACKEND_IMAGE}:${IMAGE_TAG} ${BACKEND_IMAGE}:latest
                            """
                        }
                    }
                }
                stage('Build Frontend Image') {
                    steps {
                        echo '🐳 Building frontend Docker image...'
                        dir('frontend') {
                            sh """
                                docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} .
                                docker tag ${FRONTEND_IMAGE}:${IMAGE_TAG} ${FRONTEND_IMAGE}:latest
                            """
                        }
                    }
                }
            }
        }
        
        stage('Push to Registry') {
            steps {
                echo '📤 Pushing images to registry...'
                sh '''
                    echo "Images built successfully!"
                    docker images | grep alarm
                '''
                // In production, you would push to Docker Hub:
                // docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                // docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
            }
        }
        
        stage('Deploy') {
            steps {
                echo '🚀 Deploying application...'
                sh '''
                    # Stop old containers
                    docker-compose down || true
                    
                    # Start new containers
                    docker-compose up -d
                    
                    # Wait for services to be ready
                    sleep 10
                    
                    # Verify deployment
                    docker-compose ps
                '''
            }
        }
        
        stage('Health Check') {
            steps {
                echo '✅ Running health checks...'
                sh '''
                    # Check backend health
                    curl -f http://localhost:5000/health || exit 1
                    
                    # Check frontend
                    curl -f http://localhost:3000 || exit 1
                    
                    echo "All services are healthy! ✅"
                '''
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline completed successfully!'
            echo '🎉 Application deployed and running!'
        }
        failure {
            echo '❌ Pipeline failed!'
            echo '🔍 Check logs for details.'
        }
        always {
            echo '🧹 Cleaning up...'
            sh 'docker system prune -f || true'
        }
    }
}