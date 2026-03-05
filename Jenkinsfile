pipeline {
  agent any
  options { timestamps() }

  // IMPORTANT: stop the implicit "Declarative: Checkout SCM"
  stages {
    stage('Checkout') {
      steps {
        // wipe workspace so we never hit "not in a git directory"
        deleteDir()
        checkout([
          $class: 'GitSCM',
          branches: [[name: '*/main']],
          userRemoteConfigs: [[url: 'https://github.com/saitejaperala/alarm-app-devops.git']]
        ])
        sh 'git rev-parse --short HEAD'
        sh 'ls -la'
      }
    }

    stage('Sanity') {
      steps {
        sh 'echo "Pipeline is running correctly."'
      }
    }
  }

  post {
    always {
      echo "🧹 Cleaning up..."
      // safe even if earlier stages failed, as long as we're still in a workspace
      cleanWs(deleteDirs: true, notFailBuild: true)
    }
    failure {
      echo "❌ Pipeline failed!"
      echo "🔍 Check logs for details."
    }
  }
}