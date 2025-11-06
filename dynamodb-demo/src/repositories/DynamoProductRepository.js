import { ScanCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { IProductRepository } from './IProductRepository.js';
import { Product } from '../models/Product.js';

export class DynamoProductRepository extends IProductRepository {
  constructor(docClient, tableName) {
    super();
    this.docClient = docClient;
    this.tableName = tableName;
  }

  async findAll() {
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: 'begins_with(PK, :pk)',
      ExpressionAttributeValues: {
        ':pk': 'PRODUCT#'
      }
    });

    const result = await this.docClient.send(command);
    return result.Items.map(item => Product.fromDynamoItem(item));
  }

  async findById(id) {
    const keys = Product.createKeys(id);
    const command = new GetCommand({
      TableName: this.tableName,
      Key: keys
    });

    const result = await this.docClient.send(command);
    return result.Item ? Product.fromDynamoItem(result.Item) : null;
  }
}