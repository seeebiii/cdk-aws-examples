import { Construct } from 'constructs';
import { CfnOutput, Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Repository } from 'aws-cdk-lib/aws-ecr';

export class EcrSetup extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id);

    const ecrRepo = new Repository(this, 'example-repository', {
      repositoryName: 'example-repository',
      removalPolicy: RemovalPolicy.DESTROY,
      // since this stack only exists just for demonstration purposes, quickly remove the images
      lifecycleRules: [{ maxImageCount: 1, maxImageAge: Duration.days(1) }]
    });

    new CfnOutput(this, 'repo-uri', {
      value: ecrRepo.repositoryUri,
    });
  }
}
