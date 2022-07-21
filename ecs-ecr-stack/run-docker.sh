#!/usr/bin/env sh

REPO=$(aws cloudformation describe-stacks --stack-name EcrSetup --query "Stacks[0].Outputs[?OutputKey=='repouri'].OutputValue" --output text)
docker run -t -i -p 80:80 "${REPO}:latest"
