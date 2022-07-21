#!/usr/bin/env sh

REPO=$(aws cloudformation describe-stacks --stack-name EcrSetup --query "Stacks[0].Outputs[?OutputKey=='repouri'].OutputValue" --output text)
docker build . -t "${REPO}:latest"
aws ecr get-login-password | docker login --username AWS --password-stdin "${REPO}:latest"
docker push "${REPO}:latest"
