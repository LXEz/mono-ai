#!/bin/bash

################################################################################
# Script Name : restart-vailley-ai-copilot-container.sh
# Description : restart vailley-ai-copilot containers.
# Usage       : sh restart-vailley-ai-copilot-container.sh SERVICE_NAME REGISTRY_URL REPO_NAME TAG
# Author      : VAILLEY AI
# Version     : 1.0
################################################################################

# apps dir: /app/vailley-mono/vailley-ai-copilot
# Backend container SERVICE_NAME: [vailley-ai-copilot]
SERVICE_NAME=$1
REGISTRY_URL=$2
REPO_NAME=$3
TAG=$4

COMPOSE_FILE_PATH="/app/vailley-mono/vailley-ai-copilot"

CONTAINER_NAME=`docker ps -a|grep ${SERVICE_NAME}|awk '{print $NF}'`
echo ${CONTAINER_NAME}
# CONTAINER_STATUS:
#          running,
#          exited,
#          No such container: ${CONTAINER_NAME}
CONTAINER_STATUS=`docker container inspect --format '{{.State.Status}}' ${CONTAINER_NAME}`
echo ${CONTAINER_STATUS}

cd ${COMPOSE_FILE_PATH}

if [ "${CONTAINER_STATUS}" = "running" ]; then
    sed -i "s/\(image: ${REGISTRY_URL}\/${REPO_NAME}:\)[^ ]*/\1${TAG}/" "${COMPOSE_FILE_PATH}/docker-compose.yml"

    # restart container
    docker compose down ${SERVICE_NAME}
    docker compose up -d ${SERVICE_NAME}
elif [ "${CONTAINER_STATUS}" = "exited" ]; then
    echo "Container ${CONTAINER_NAME} is exited ..."
    sed -i "s/\(image: ${REGISTRY_URL}\/${REPO_NAME}:\)[^ ]*/\1${TAG}/" "${COMPOSE_FILE_PATH}/docker-compose.yml"

    # start container
    docker compose up -d ${SERVICE_NAME}
else
    echo "No such container: ${CONTAINER_NAME}"
    sed -i "s/\(image: ${REGISTRY_URL}\/${REPO_NAME}:\)[^ ]*/\1${TAG}/" "${COMPOSE_FILE_PATH}/docker-compose.yml"
    docker compose up -d ${SERVICE_NAME}
fi
