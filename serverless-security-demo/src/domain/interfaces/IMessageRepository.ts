import { EncryptedMessage } from '../entities/Message';

export interface IMessageRepository {
  save(message: EncryptedMessage): Promise<void>;
  findById(id: string): Promise<EncryptedMessage | null>;
  findAll(): Promise<EncryptedMessage[]>;
}