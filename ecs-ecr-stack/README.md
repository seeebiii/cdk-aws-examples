# ecs-ecr-stack

An example CDK project deploying an ECR repository and an ECS Fargate setup which is using Docker images from the ECR repository.

## Requirements

- [Docker](https://docs.docker.com/get-docker/)
- [AWS CLI Setup](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- [AWS CDK CLI](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html)

## Quick Start

1. `cdk deploy EcrSetup`: creates the ECR repository
2. Execute the bash script to build a Docker image:
```shell
$ ./build-and-push-docker.sh
```
3. `cdk deploy EcsFargateSetup`: creates ECS Fargate resources like cluster, service, task definition (using the Docker image you pushed in step 2)

The ECS Fargate Setup will only start one task.
You can get the public ip address of the task and open it in your browser to see a `Hello World` text:

- `aws ecs list-tasks --cluster example-cluster`
- `aws ecs describe-tasks --cluster example-cluster --tasks <taskArn>`

### Updating Docker Image

If you want to update the Docker image, just make your changes to the [Dockerfile](./docker/Dockerfile) and push a new version using [`build-and-push-docker.sh`](./build-and-push-docker.sh).
Then, run `cdk deploy EcsFargateSetup` again.

> Consider that this simplified example is always using the `latest` tag for Docker images.
> If you push a new Docker image, a new version will overwrite the old one.


## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
