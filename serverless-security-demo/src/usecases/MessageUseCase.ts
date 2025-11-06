import { v4 as uuidv4 } from 'uuid';
import { IMessageRepository } from '../domain/interfaces/IMessageRepository';
import { IEncryptionService } from '../domain/interfaces/IEncryptionService';
import { Message, EncryptedMessage } from '../domain/entities/Message';
import { CreateMessageInput } from '../utils/validation';
import { NotFoundError } from '../utils/errors';

export class MessageUseCase {
  constructor(
    private messageRepository: IMessageRepository,
    private encryptionService: IEncryptionService
  ) {}

  async createMessage(input: CreateMessageInput): Promise<{ id: string }> {
    const messageId = uuidv4();
    const now = new Date();
    const encryptedContent = await this.encryptionService.encrypt(input.content);

    const encryptedMessage: EncryptedMessage = {
      id: messageId,
      encryptedContent,
      userId: input.userId,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    await this.messageRepository.save(encryptedMessage);
    return { id: messageId };
  }

  async getMessage(id: string, requestingUserId: string): Promise<Message> {
    const encryptedMessage = await this.messageRepository.findById(id);
    
    if (!encryptedMessage || encryptedMessage.userId !== requestingUserId) {
      throw new NotFoundError('Message not found');
    }

    const decryptedContent = await this.encryptionService.decrypt(encryptedMessage.encryptedContent);

    return {
      id: encryptedMessage.id,
      content: decryptedContent,
      userId: encryptedMessage.userId,
      createdAt: new Date(encryptedMessage.createdAt),
      updatedAt: new Date(encryptedMessage.updatedAt)
    };
  }

  async listMessages(userId: string): Promise<Array<{ id: string; createdAt: Date; updatedAt: Date }>> {
    const allMessages = await this.messageRepository.findAll();
    
    return allMessages
      .filter(msg => msg.userId === userId)
      .map(msg => ({
        id: msg.id,
        createdAt: new Date(msg.createdAt),
        updatedAt: new Date(msg.updatedAt)
      }));
  }
}