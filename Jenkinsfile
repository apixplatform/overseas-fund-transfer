#!groovy

def label = "afindevjenkins-slave-${UUID.randomUUID().toString()}"

def buildVer
def appNameVar
def appVerVar

podTemplate(label: label, yaml: """
apiVersion: v1
kind: Pod
spec:
  securityContext:
    runAsUser: 1000
    serviceAccount: jenkinsbuilduser
  containers:
  - name: afin-dev
    image: 368696334230.dkr.ecr.ap-south-1.amazonaws.com/afin-dev:angular6-latest
    command: ['cat']
    tty: true
    securityContext:
      runAsUser: 0
      privileged: true
      allowPrivilegeEscalation: true
    volumeMounts:
      - mountPath: /var/run/docker.sock
        name: docker-socket
  volumes:
    - name: docker-socket
      hostPath:
        path: /var/run/docker.sock
"""
  ) {
    node(label) {
      container('afin-dev') {
        try {
          notifyBuild('STARTED')

          stage('Compile & Build'){
              // container('afin-dev') {
                  checkout scm
                  sh ''' echo "Running the build."
                  export APP_VERSION=$(grep version ./package.json | awk \'{print $2}\' | sed \'s/\\"//g\' | sed \'s/,//g\')
                  export APP_NAME=${JOB_NAME%/*}
                  echo ${APP_NAME} > appNameVar
                  echo ${APP_VERSION} > appVerVar
                  if [ -d dist ]; then rm -R dist/ ; fi
                  node -v
                  npm install
                  # npm run-script build
                  node --max_old_space_size=12288 ./node_modules/@angular/cli/bin/ng build --prod --aot --base-href "/" 
                  echo ${APP_VERSION} > dist/version.html
                  
                  '''
                  appNameVar = readFile('appNameVar').trim()
                  appVerVar = readFile('appVerVar').trim()

                  echo "${appNameVar}"
                  echo "${appVerVar}"

          } // end of Compile and Package

          stage('Code Quality Tests'){
                  sh 'echo TODO "ADD CODE QUALITY TESTS"'
                  echo "${appNameVar}"
                  echo "${appVerVar}"
          } // end of Code Quality

          stage('Docker Build and Push') {
                echo "${appNameVar}"
                echo "${appVerVar}"
                  docker.build("${appNameVar}:${appVerVar}",".")
                  docker.withRegistry('https://368696334230.dkr.ecr.ap-south-1.amazonaws.com','ecr:ap-south-1:awsECRDev')
                      {
                          docker.image("${appNameVar}:${appVerVar}").push("${appVerVar}")
                          //docker.image("${appNameVar}:${appVerVar}").push("latest")
                    }
              } // end of Docker Build and Push

          stage('Helm Init & Package & Push') {
              withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'awsECRDev',accessKeyVariable: 'ACCESSKEY', secretKeyVariable: 'SECRETKEY']]) {
                sh 'aws configure set aws_access_key_id $ACCESSKEY'
                sh 'aws configure set aws_secret_access_key_id $SECRETKEY'
                sh 'aws configure set region ap-south-1 '
                sh 'aws configure set default_region ap-south-1'
                sh '''
                export AWS_ACCESS_KEY_ID=$ACCESSKEY
                export AWS_SECRET_ACCESS_KEY=$SECRETKEY
                export AWS_DEFAULT_REGION=ap-south-1
                export AWS_REGION=ap-south-1
                export S3_HELM_BUCKET=afin-helm-repo

                export APP_VERSION=$(grep version ./package.json | awk \'{print $2}\' | sed \'s/\\"//g\' | sed \'s/,//g\')
                echo ${APP_VERSION}
                export APP_NAME=${JOB_NAME%/*}
                export CHART_DIR=${APP_NAME}/
                export HELM_REPO_NAME=s3-charts

                aws sts get-caller-identity
                helm repo add s3-charts s3://afin-helm-repo/charts
                helm repo update s3-charts
                helm search s3-charts/${APP_NAME}
                helm package --version=${APP_VERSION} --app-version=${APP_VERSION} ${CHART_DIR}
                echo "Running Helm push for ${APP_NAME}-${APP_VERSION}.tgz"
                helm s3 push --force ${APP_NAME}-${APP_VERSION}.tgz ${HELM_REPO_NAME}
                '''
              }
          } // end of Helm init & Package

          stage('Deploy to Development') {
                sh '''
                export APP_NAME=${JOB_NAME%/*}
                export APP_VERSION=$(grep version ./package.json | awk \'{print $2}\' | sed \'s/\\"//g\' | sed \'s/,//g\')
                export NAMESPACE=marketplace
                export ENVIRONMENT=dev
                if helm ls --namespace ${NAMESPACE} |grep ${APP_NAME}; then
                echo "Release ${APP_NAME} exists, Upgrading !! "
                helm del --purge $APP_NAME
                helm install -n ${APP_NAME} --namespace ${NAMESPACE} -f ${APP_NAME}/env/${ENVIRONMENT}-values.yaml --version ${APP_VERSION} ${APP_NAME}/
                # helm upgrade --namespace ${NAMESPACE} -f ${APP_NAME}/env/${ENVIRONMENT}-values.yaml ${APP_NAME} ${APP_NAME}/
                else
                echo "Release ${APP_NAME} not found, Installing!!"
                helm install -n ${APP_NAME} --namespace ${NAMESPACE} -f ${APP_NAME}/env/${ENVIRONMENT}-values.yaml ${APP_NAME}/
                fi
                '''
          } //End Deploy to Dev Stage

          stage('Smoke test Development') {
              sh 'echo TODO "ADD FUNCTIONAL TESTS"'
          } // End smoke test stage
        } catch (e) {
          // If there was an exception thrown, the build failed
          currentBuild.result = "FAILED"
          throw e
        } finally {
          // Success or failure, always send notifications
          notifyBuild(currentBuild.result)
        }
        

     }
    }


   }


    def notifyBuild(String buildStatus = 'STARTED') {
      // build status of null means successful
      buildStatus =  buildStatus ?: 'SUCCESSFUL'

      // Default values
      def colorName = 'RED'
      def colorCode = '#FF0000'
      def subject = "${buildStatus}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'"
      def summary = "${subject} (${env.BUILD_URL})"

      // Override default values based on build status
      if (buildStatus == 'STARTED') {
        color = 'YELLOW'
        colorCode = '#FFFF00'
      } else if (buildStatus == 'SUCCESSFUL') {
        color = 'GREEN'
        colorCode = '#00FF00'
      } else {
        color = 'RED'
        colorCode = '#FF0000'
      }

      // Send notifications
      slackSend (color: colorCode, message: summary)
    }