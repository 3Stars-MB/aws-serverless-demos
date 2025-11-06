import { MessageUseCase } from '../usecases/MessageUseCase';
import { DynamoMessageRepository } from '../infra/repositories/DynamoMessageRepository';
import { KMSEncryptionService } from '../infra/gateways/KMSEncryptionService';

export class Container {
  private static instance: Container;
  private messageUseCase: MessageUseCase | null = null;

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  getMessageUseCase(): MessageUseCase {
    if (!this.messageUseCase) {
      const tableName = process.env.MESSAGES_TABLE!;
      const kmsKeyId = process.env.KMS_KEY_ID!;

      const messageRepository = new DynamoMessageRepository(tableName);
      const encryptionService = new KMSEncryptionService(kmsKeyId);

      this.messageUseCase = new MessageUseCase(messageRepository, encryptionService);
    }
    return this.messageUseCase;
  }
}