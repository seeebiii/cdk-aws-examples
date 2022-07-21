import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Cluster, ContainerImage, FargateService, FargateTaskDefinition, LogDriver } from 'aws-cdk-lib/aws-ecs';
import { Peer, Port, SecurityGroup } from 'aws-cdk-lib/aws-ec2';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Repository } from 'aws-cdk-lib/aws-ecr';

export class EcsFargateSetup extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const cluster = new Cluster(this, 'example-cluster', {
      clusterName: 'example-cluster',
    });

    const taskDefinition = new FargateTaskDefinition(this, 'example-task-definition', {
      cpu: 256,
      memoryLimitMiB: 512,
      family: 'example-task-definition',
    });

    const ecrRepo = Repository.fromRepositoryName(this, 'example-repository', 'example-repository');

    taskDefinition.addContainer('example-container', {
      // image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      image: ContainerImage.fromEcrRepository(ecrRepo, 'latest'),
      cpu: 256,
      memoryLimitMiB: 512,
      containerName: 'example-container',
      portMappings: [{ containerPort: 80, hostPort: 80 }],
      logging: LogDriver.awsLogs({
        logRetention: RetentionDays.ONE_WEEK,
        streamPrefix: 'example-prefix'
      })
    });

    const sg = new SecurityGroup(this, 'example-sg', {
      vpc: cluster.vpc,
      allowAllOutbound: true,
    });
    sg.addIngressRule(Peer.anyIpv4(), Port.tcp(80));

    const ecsService = new FargateService(this, 'example-service', {
      cluster,
      taskDefinition,
      serviceName: 'example-service',
      assignPublicIp: true,
      securityGroups: [sg],
    });

    ecsService.autoScaleTaskCount({
      minCapacity: 1,
      maxCapacity: 1
    });
  }
}
