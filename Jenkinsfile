pipeline {
    agent any

    environment {
        APP_DIR = "frontend"
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Realizando checkout del repositorio..."
                checkout scm
            }
        }

        stage('Instalar dependencias') {
            steps {
                dir("${APP_DIR}") {
                    echo "Instalando dependencias del frontend..."
                    sh "npm install"
                }
            }
        }

        stage('Lint') {
            steps {
                dir("${APP_DIR}") {
                    echo "Ejecutando lint..."
                    sh "npm run lint"
                }
            }
        }

        stage('Build') {
            steps {
                dir("${APP_DIR}") {
                    echo "Compilando proyecto..."
                    sh "npm run build"
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline completado con éxito"
        }
        failure {
            echo "El pipeline falló. Revisar logs."
        }
    }
}
