import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import AWSXRay from 'aws-xray-sdk-core';

const dynamoClient = AWSXRay.captureAWSv3Client(new DynamoDBClient({}));
const tableName = process.env.DYNAMODB_TABLE!;

interface DataItem {
  id: string;
  name: string;
  value: number;
  timestamp: string;
}

export const processData = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const segment = AWSXRay.getSegment();
  const subsegment = segment?.addNewSubsegment('processData');

  try {
    console.log('Processing request:', JSON.stringify(event, null, 2));

    if (!event.body) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Request body is required' }),
      };
    }

    const data: DataItem = JSON.parse(event.body);
    
    // Validação
    if (!data.name || !data.value) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Name and value are required' }),
      };
    }

    // Adicionar timestamp e ID
    const item: DataItem = {
      ...data,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };

    // Salvar no DynamoDB
    await dynamoClient.send(new PutItemCommand({
      TableName: tableName,
      Item: marshall(item),
    }));

    console.log('Item saved successfully:', item);

    // Métricas customizadas
    subsegment?.addMetadata('item', item);
    subsegment?.addAnnotation('operation', 'create');

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Data processed successfully',
        item,
      }),
    };
  } catch (error) {
    console.error('Error processing data:', error);
    
    subsegment?.addError(error as Error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  } finally {
    subsegment?.close();
  }
};