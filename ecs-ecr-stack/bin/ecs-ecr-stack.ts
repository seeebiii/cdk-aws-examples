#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { EcsFargateSetup } from '../lib/ecs-fargate-setup';
import { EcrSetup } from '../lib/ecr-setup';

const app = new cdk.App();

new EcrSetup(app, 'EcrSetup');
new EcsFargateSetup(app, 'EcsFargateSetup');
