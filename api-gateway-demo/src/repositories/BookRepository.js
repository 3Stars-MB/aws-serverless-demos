import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand, GetCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

class BookRepository {
  constructor() {
    const client = new DynamoDBClient({});
    this.dynamodb = DynamoDBDocumentClient.from(client);
    this.tableName = process.env.BOOKS_TABLE;
  }

  async create(book) {
    await this.dynamodb.send(new PutCommand({
      TableName: this.tableName,
      Item: book,
    }));
    return book;
  }

  async findAll() {
    const result = await this.dynamodb.send(new ScanCommand({
      TableName: this.tableName,
      FilterExpression: 'entityType = :entityType',
      ExpressionAttributeValues: {
        ':entityType': 'Book'
      }
    }));
    return result.Items;
  }

  async findById(id) {
    const result = await this.dynamodb.send(new GetCommand({
      TableName: this.tableName,
      Key: { 
        PK: `BOOK#${id}`,
        SK: 'METADATA'
      },
    }));
    return result.Item;
  }

  async update(id, book) {
    const result = await this.dynamodb.send(new UpdateCommand({
      TableName: this.tableName,
      Key: { 
        PK: `BOOK#${id}`,
        SK: 'METADATA'
      },
      UpdateExpression: 'SET title = :title, author = :author, #year = :year, updatedAt = :updatedAt',
      ExpressionAttributeNames: { '#year': 'year' },
      ExpressionAttributeValues: {
        ':title': book.title,
        ':author': book.author,
        ':year': book.year,
        ':updatedAt': book.updatedAt,
      },
      ReturnValues: 'ALL_NEW',
    }));
    return result.Attributes;
  }

  async delete(id) {
    await this.dynamodb.send(new DeleteCommand({
      TableName: this.tableName,
      Key: { 
        PK: `BOOK#${id}`,
        SK: 'METADATA'
      },
    }));
  }
}

export default BookRepository;