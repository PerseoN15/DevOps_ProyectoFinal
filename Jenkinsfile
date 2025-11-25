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
                    python3 -m semgrep --config auto frontend/src > semgrep-report.txt || true
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

        /* ============================================================
         *   NUEVO STAGE: DEPLOY A AWS EC2
         * ============================================================ */
        stage('Deploy to EC2') {
            steps {
                echo "Realizando deploy automático en EC2..."

                sshagent(credentials: ['ec2-jenkins-key']) {   // <-- ID de tu credencial SSH en Jenkins
                    sh '''
                        ssh -o StrictHostKeyChecking=no ec2-user@3.15.205.151 << 'EOF'
                          echo ">> Entrando a la instancia EC2..."
                          
                          cd DevOps_ProyectoFinal

                          echo ">> Actualizando repositorio..."
                          git pull

                          echo ">> Backend: instalando dependencias..."
                          cd backend
                          npm install

                          echo ">> Reiniciando backend con PM2..."
                          pm2 restart backend || pm2 start index.js --name backend
                          pm2 save

                          echo ">> Frontend: construyendo producción..."
                          cd ../frontend
                          npm install
                          npm run build

                          echo ">> Reiniciando frontend con PM2..."
                          cd dist
                          pm2 restart frontend || pm2 start "npx serve -s . -l 80" --name frontend
                          pm2 save

                          echo ">> DEPLOY COMPLETADO EXITOSAMENTE"
                        EOF
                    '''
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
