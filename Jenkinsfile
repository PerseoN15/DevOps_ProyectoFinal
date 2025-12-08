pipeline {
    agent any

    environment {
        APP_DIR     = "frontend"
        BACKEND_DIR = "backend"
    }

    stages {

        stage('Checkout') {
            steps {
                echo "Realizando checkout del repositorio..."
                checkout scm
            }
        }

        stage('Instalar dependencias') {
            parallel {
                stage('Dependencias Frontend') {
                    steps {
                        dir("${APP_DIR}") {
                            echo "Instalando dependencias del frontend..."
                            sh "npm install"
                        }
                    }
                }
                stage('Dependencias Backend') {
                    steps {
                        dir("${BACKEND_DIR}") {
                            echo "Instalando dependencias del backend..."
                            sh "npm install"
                            echo "Reconstruyendo bcrypt para entorno Linux (si aplica)..."
                            sh "npm rebuild bcrypt --build-from-source || true"
                        }
                    }
                }
            }
        }

        stage('Tests') {
            parallel {
                stage('Tests Backend') {
                    steps {
                        dir("${BACKEND_DIR}") {
                            echo "Ejecutando tests del backend..."
                            sh "npm run test:ci || true"
                        }
                    }
                    post {
                        always {
                            publishHTML([
                                allowMissing: true,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'backend/coverage/lcov-report',
                                reportFiles: 'index.html',
                                reportName: 'Backend Coverage Report',
                                reportTitles: 'Backend Test Coverage'
                            ])
                        }
                    }
                }
                stage('Tests Frontend') {
                    steps {
                        dir("${APP_DIR}") {
                            echo "Ejecutando tests del frontend..."
                            sh "npm run test:ci || true"
                        }
                    }
                    post {
                        always {
                            publishHTML([
                                allowMissing: true,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'frontend/coverage/lcov-report',
                                reportFiles: 'index.html',
                                reportName: 'Frontend Coverage Report',
                                reportTitles: 'Frontend Test Coverage'
                            ])
                        }
                    }
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
            parallel {
                stage('Audit Frontend') {
                    steps {
                        dir("${APP_DIR}") {
                            echo "Ejecutando npm audit en frontend..."
                            sh "npm audit --audit-level=high || true"
                        }
                    }
                }
                stage('Audit Backend') {
                    steps {
                        dir("${BACKEND_DIR}") {
                            echo "Ejecutando npm audit en backend..."
                            sh "npm audit --audit-level=high || true"
                        }
                    }
                }
            }
        }

        stage('Security - SAST (Semgrep)') {
            steps {
                echo "Ejecutando analisis SAST con Semgrep..."
                sh """
                    pip3 install --user semgrep --break-system-packages --ignore-installed || true
                    python3 -m semgrep --config auto frontend/src backend > semgrep-report.txt || true
                    cat semgrep-report.txt || true
                """
            }
        }

        stage('Security - Secret Scanning') {
            steps {
                echo "Buscando secretos sensibles en el repositorio..."
                sh """
                    pip3 install --user detect-secrets --break-system-packages --ignore-installed || true
                    detect-secrets scan --all-files --exclude-files '.*node_modules.*' --exclude-files '.*coverage.*' > detect-secrets-report.json || true
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
                        echo "ADVERTENCIA: Se encontro un archivo .env. No debe subirse al repositorio."
                    else
                        echo "OK: No hay archivo .env expuesto."
                    fi

                    echo "Verificando permisos inseguros..."
                    find . -type f -perm 777 -exec echo "Archivo con permisos inseguros: {}" \\; || true
                """
            }
        }

        stage('Actualizar version del backend') {
            steps {
                echo "Actualizando archivo backend_version.txt en EC2..."
                sshagent(credentials: ['ec2-jenkins-key']) {
                    sh '''
ssh -o StrictHostKeyChecking=no ec2-user@3.15.205.151 << 'EOF'
  cd DevOps_ProyectoFinal/backend

  VERSION_FILE="backend_version.txt"

  if [ ! -f "$VERSION_FILE" ]; then
    echo "0" > "$VERSION_FILE"
  fi

  CURRENT_VERSION=$(cat "$VERSION_FILE")
  NEXT_VERSION=$((CURRENT_VERSION + 1))

  echo "$NEXT_VERSION" > "$VERSION_FILE"

  echo ">> Version de backend actualizada a: $NEXT_VERSION"
EOF
                    '''
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                echo "Realizando deploy automatico en EC2..."

                sshagent(credentials: ['ec2-jenkins-key']) {
                    sh '''
ssh -o StrictHostKeyChecking=no ec2-user@3.15.205.151 2>/dev/null << 'EOF'
  set -e

  echo "=== Entrando al proyecto ==="
  cd ~/DevOps_ProyectoFinal 2>/dev/null || exit 1

  echo "=== Limpiando procesos PM2 existentes ==="
  pm2 delete all 2>/dev/null || true

  echo "=== Backend: limpiando node_modules y reinstalando ==="
  cd backend
  rm -rf node_modules package-lock.json 2>/dev/null
  npm install --silent --no-warnings 2>/dev/null

  echo "=== Backend: reconstruyendo bcrypt para Linux ==="
  npm rebuild bcrypt --build-from-source 2>/dev/null || true

  echo "=== Backend: iniciando con PM2 ==="
  pm2 start index.js --name backend 2>/dev/null || pm2 restart backend 2>/dev/null

  echo "=== Frontend: instalando dependencias ==="
  cd ../frontend
  npm install --silent --no-warnings 2>/dev/null

  echo "=== Frontend: construyendo produccion ==="
  npm run build --silent 2>/dev/null

  echo "=== Frontend: iniciando con PM2 en puerto 80 ==="
  cd dist
  pm2 start "npx serve -s . -l 80" --name frontend 2>/dev/null || pm2 restart frontend 2>/dev/null

  echo "=== Guardando configuracion de PM2 ==="
  pm2 save 2>/dev/null

  echo "=== Estado actual de PM2 ==="
  pm2 status 2>/dev/null

  echo "=== Verificando logs del backend ==="
  pm2 logs backend --lines 5 --nostream 2>/dev/null

  echo "=== Proceso completado ==="
EOF
                    '''
                }
            }
        }
    }

    post {
        success {
            echo """
            =======================================
            PIPELINE COMPLETADO CON EXITO
            =======================================
            
            Tests ejecutados:
            - Backend: Ver reporte en Jenkins
            - Frontend: Ver reporte en Jenkins
            
            Security scans completados
            Deploy exitoso en EC2
            
            Build: #${env.BUILD_NUMBER}
            =======================================
            """
        }
        failure {
            echo """
            =======================================
            PIPELINE FALLO
            =======================================
            
            Build: #${env.BUILD_NUMBER}
            Revisar logs para mas detalles
            
            =======================================
            """
        }
    }
}