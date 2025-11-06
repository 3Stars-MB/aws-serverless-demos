import { MessageUseCase } from './MessageUseCase';
import { IMessageRepository } from '../domain/interfaces/IMessageRepository';
import { IEncryptionService } from '../domain/interfaces/IEncryptionService';
import { EncryptedMessage } from '../domain/entities/Message';
import { NotFoundError } from '../utils/errors';

describe('MessageUseCase', () => {
  let messageUseCase: MessageUseCase;
  let mockRepository: jest.Mocked<IMessageRepository>;
  let mockEncryption: jest.Mocked<IEncryptionService>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn()
    };

    mockEncryption = {
      encrypt: jest.fn(),
      decrypt: jest.fn()
    };

    messageUseCase = new MessageUseCase(mockRepository, mockEncryption);
  });

  describe('createMessage', () => {
    it('should create and encrypt message', async () => {
      const input = { content: 'Test message', userId: 'user123' };
      mockEncryption.encrypt.mockResolvedValue('encrypted-content');

      const result = await messageUseCase.createMessage(input);

      expect(result.id).toBeDefined();
      expect(mockEncryption.encrypt).toHaveBeenCalledWith(input.content);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('getMessage', () => {
    it('should retrieve and decrypt message for authorized user', async () => {
      const messageId = 'test-id';
      const userId = 'user123';
      const encryptedMessage: EncryptedMessage = {
        id: messageId,
        encryptedContent: 'encrypted-content',
        userId,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      };

      mockRepository.findById.mockResolvedValue(encryptedMessage);
      mockEncryption.decrypt.mockResolvedValue('decrypted content');

      const result = await messageUseCase.getMessage(messageId, userId);

      expect(result.content).toBe('decrypted content');
      expect(mockEncryption.decrypt).toHaveBeenCalledWith('encrypted-content');
    });

    it('should throw NotFoundError for unauthorized user', async () => {
      const encryptedMessage: EncryptedMessage = {
        id: 'test-id',
        encryptedContent: 'encrypted-content',
        userId: 'owner123',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      };

      mockRepository.findById.mockResolvedValue(encryptedMessage);

      await expect(
        messageUseCase.getMessage('test-id', 'different-user')
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('listMessages', () => {
    it('should return only user messages', async () => {
      const userId = 'user123';
      const allMessages: EncryptedMessage[] = [
        {
          id: 'msg1',
          encryptedContent: 'encrypted1',
          userId,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z'
        },
        {
          id: 'msg2',
          encryptedContent: 'encrypted2',
          userId: 'other-user',
          createdAt: '2023-01-02T00:00:00Z',
          updatedAt: '2023-01-02T00:00:00Z'
        }
      ];

      mockRepository.findAll.mockResolvedValue(allMessages);

      const result = await messageUseCase.listMessages(userId);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('msg1');
    });
  });
});