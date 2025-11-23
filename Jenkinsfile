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

        stage('Security - npm audit') {
            steps {
                dir("${APP_DIR}") {
                    echo "Ejecutando npm audit..."
                    sh "npm audit --audit-level=high || true"
                }
            }
        }

        stage('Security - SAST (Semgrep)') {
            steps {
                echo "Ejecutando análisis SAST con Semgrep sobre frontend/src..."
                sh """
                    pip3 install --user semgrep --break-system-packages --ignore-installed || true
                    ~/.local/bin/semgrep --config auto frontend/src > semgrep-report.txt || true
                    cat semgrep-report.txt || true
                """
            }
        }

        stage('Security - Secret Scanning') {
            steps {
                echo "Buscando secretos sensibles en el repositorio (ignorando node_modules)..."
                sh """
                    pip3 install --user detect-secrets --break-system-packages --ignore-installed || true
                    detect-secrets scan --all-files --exclude-files '.*node_modules.*' > detect-secrets-report.json || true
                    cat detect-secrets-report.json || true
                """
            }
        }

        stage('Security - IaC Checkov') {
            steps {
                echo "Analizando archivos IaC con Checkov..."
                sh "checkov -d infra || true"
            }
        }

        stage('Security - Hardening checks') {
            steps {
                echo "Ejecutando validaciones de hardening..."
                sh """
                    echo "Verificando que no exista archivo .env en el repositorio..."
                    if [ -f ".env" ]; then
                        echo "ADVERTENCIA: Se encontró un archivo .env. No debe subirse al repositorio."
                    else
                        echo "OK: No hay archivo .env expuesto."
                    fi

                    echo "Verificando permisos inseguros..."
                    find . -type f -perm 777 -exec echo "Archivo con permisos inseguros: {}" \\; || true
                """
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
