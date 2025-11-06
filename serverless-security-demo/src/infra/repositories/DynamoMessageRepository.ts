import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { IMessageRepository } from '../../domain/interfaces/IMessageRepository';
import { EncryptedMessage } from '../../domain/entities/Message';
import { AppError } from '../../utils/errors';

export class DynamoMessageRepository implements IMessageRepository {
  private docClient: DynamoDBDocumentClient;
  private tableName: string;

  constructor(tableName: string) {
    const client = new DynamoDBClient({});
    this.docClient = DynamoDBDocumentClient.from(client);
    this.tableName = tableName;
  }

  async save(message: EncryptedMessage): Promise<void> {
    try {
      const command = new PutCommand({
        TableName: this.tableName,
        Item: message
      });
      await this.docClient.send(command);
    } catch (error) {
      throw new AppError('Failed to save message');
    }
  }

  async findById(id: string): Promise<EncryptedMessage | null> {
    try {
      const command = new GetCommand({
        TableName: this.tableName,
        Key: { id }
      });
      const result = await this.docClient.send(command);
      return result.Item as EncryptedMessage || null;
    } catch (error) {
      throw new AppError('Failed to retrieve message');
    }
  }

  async findAll(): Promise<EncryptedMessage[]> {
    try {
      const command = new ScanCommand({
        TableName: this.tableName,
        ProjectionExpression: 'id, userId, createdAt, updatedAt'
      });
      const result = await this.docClient.send(command);
      return (result.Items || []) as EncryptedMessage[];
    } catch (error) {
      throw new AppError('Failed to list messages');
    }
  }
}