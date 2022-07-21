#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DynamodbTables } from '../lib/dynamodb-tables';

const app = new cdk.App();
new DynamodbTables(app, 'DynamodbTables', {});
