import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';

export class DynamodbTables extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new Table(this, 'table-pay-per-request', {
      tableName: 'table-pay-per-request',
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'Id',
        type: AttributeType.STRING,
      },
    });

    new Table(this, 'table-provisioned-throughput', {
      tableName: 'table-provisioned-throughput',
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PROVISIONED,
      partitionKey: {
        name: 'Id',
        type: AttributeType.STRING,
      },
      writeCapacity: 1,
      readCapacity: 1,
    });

    new Table(this, 'table-with-sort-key', {
      tableName: 'table-with-sort-key',
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'Flight',
        type: AttributeType.STRING
      },
      sortKey: {
        name: 'Date',
        type: AttributeType.STRING
      },
      // encryption: TableEncryption.AWS_MANAGED,
      // stream: StreamViewType.NEW_AND_OLD_IMAGES
    });
  }
}
