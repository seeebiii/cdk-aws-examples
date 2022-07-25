import {
  BatchGetItemCommand,
  BatchWriteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand
} from '@aws-sdk/client-dynamodb';

/**
 * These are just examples to show you how to work with the DynamoDB SDK in TypeScript.
 * Consider that there is also a special DynamoDB Client
 * (https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/index.html) to hide the low-level
 * data types like S, N, BOOL, etc.
 *
 * The AWS SDK for Java and .NET provide further high-level APIs:
 * https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HigherLevelInterfaces.html
 */
describe('working with dynamodb sdk', () => {
  const TableName = 'table-with-sort-key';
  const client = new DynamoDBClient({});

  it('should add item', async () => {
    await client.send(new PutItemCommand({
      TableName,
      Item: {
        'Flight': {
          'S': 'BER-CGN'
        },
        'Date': {
          S: '2022-01-01-00-00'
        },
        'Attr1': {
          BOOL: true
        },
        'Attr2': {
          N: '1234'
        }
      },
    }));
  });

  it('should read item', async () => {
    const item = await client.send(new GetItemCommand({
      TableName,
      Key: {
        'Flight': {
          'S': 'BER-CGN'
        },
        'Date': {
          S: '2022-01-01-00-00'
        },
      },
    }));

    expect(item.Item?.Flight.S).toBe('BER-CGN');
    expect(item.Item?.Date.S).toBe('2022-01-01-00-00');
    expect(item.Item?.Attr1.BOOL).toBe(true);
    expect(item.Item?.Attr2.N).toBe('1234');
  });

  it('should find all flights with given flight id', async () => {
    const items = await client.send(new QueryCommand({
      TableName,
      KeyConditionExpression: 'Flight = :flight',
      ExpressionAttributeValues: {
        ':flight': {
          S: 'BER-CGN'
        }
      }
    }));

    expect(items.Items?.[0]?.Flight.S).toBe('BER-CGN');

    // print flights to console
    console.log(items.Items?.map(item => ({ flight: item?.Flight, date: item?.Date })));
  });

  it('should add items via batch', async () => {
    await client.send(new BatchWriteItemCommand({
      RequestItems: {
        [TableName]: [
          {
            PutRequest: {
              Item: {
                'Flight': {
                  S: 'BER-CGN'
                },
                'Date': {
                  S: '2022-01-01-01-00'
                }
              }
            }
          }, {
            PutRequest: {
              Item: {
                'Flight': {
                  S: 'BER-CGN'
                },
                'Date': {
                  S: '2022-01-01-02-00'
                }
              }
            }
          }, {
            PutRequest: {
              Item: {
                'Flight': {
                  S: 'BER-CGN'
                },
                'Date': {
                  S: '2022-01-01-03-00'
                }
              }
            }
          }
        ]
      }
    }));
  });

  it('should get items via batch', async () => {
    const response = await client.send(new BatchGetItemCommand({
      RequestItems: {
        [TableName]: {
          Keys: [
            {
              'Flight': {
                S: 'BER-CGN'
              },
              'Date': {
                S: '2022-01-01-01-00'
              }
            }, {
              'Flight': {
                S: 'BER-CGN'
              },
              'Date': {
                S: '2022-01-01-02-00'
              }
            }, {
              'Flight': {
                S: 'BER-CGN'
              },
              'Date': {
                S: '2022-01-01-03-00'
              }
            }
          ]
        }
      }
    }));

    console.log(response.Responses?.[TableName]?.map(item => ({ flight: item?.Flight?.S, date: item?.Date?.S })));
  });
});
