export APP_NAME=go-bank-online-banking-frontend
export APP_VERSION=1.0.2
export AWS_REGION=ap-south-1
export NAMESPACE=go-apix
export ENVIRONMENT=prod

kubectl-afin-dev-init

npm run build

docker build -t ${APP_NAME}:${APP_VERSION} .
$(aws ecr get-login --no-include-email --region ap-south-1 --profile=afin)
docker tag ${APP_NAME}:${APP_VERSION} 368696334230.dkr.ecr.ap-south-1.amazonaws.com/${APP_NAME}:${APP_VERSION}
docker push 368696334230.dkr.ecr.ap-south-1.amazonaws.com/${APP_NAME}:${APP_VERSION}

# helm repo update s3-charts
# helm search s3-charts/${APP_NAME}
helm package --version=${APP_VERSION} --app-version=${APP_VERSION} ${APP_NAME}/
echo "Running Helm push for ${APP_NAME}-${APP_VERSION}.tgz"
helm s3 push --force ${APP_NAME}-${APP_VERSION}.tgz s3-charts

kubectl-afin-prod-init

if helm ls --namespace ${NAMESPACE} |grep ${APP_NAME}; then
    echo "Release ${APP_NAME} exists, Upgrading !! "
    helm del --purge $APP_NAME
    helm install -n ${APP_NAME} --namespace ${NAMESPACE} -f ${APP_NAME}/env/${ENVIRONMENT}-values.yaml --version ${APP_VERSION} ${APP_NAME}/
else
    echo "Release ${APP_NAME} not found, Installing!!"
    helm install -n ${APP_NAME} --namespace ${NAMESPACE} -f ${APP_NAME}/env/${ENVIRONMENT}-values.yaml ${APP_NAME}/
fi