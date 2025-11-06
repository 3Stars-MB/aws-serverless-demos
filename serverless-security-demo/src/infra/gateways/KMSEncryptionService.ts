import { KMSClient, EncryptCommand, DecryptCommand } from '@aws-sdk/client-kms';
import { IEncryptionService } from '../../domain/interfaces/IEncryptionService';
import { EncryptionError } from '../../utils/errors';

export class KMSEncryptionService implements IEncryptionService {
  private kmsClient: KMSClient;
  private keyId: string;

  constructor(keyId: string) {
    this.kmsClient = new KMSClient({});
    this.keyId = keyId;
  }

  async encrypt(plaintext: string): Promise<string> {
    try {
      const command = new EncryptCommand({
        KeyId: this.keyId,
        Plaintext: Buffer.from(plaintext, 'utf-8')
      });

      const result = await this.kmsClient.send(command);
      
      if (!result.CiphertextBlob) {
        throw new EncryptionError('No ciphertext returned');
      }

      return Buffer.from(result.CiphertextBlob).toString('base64');
    } catch (error) {
      throw new EncryptionError('Failed to encrypt message');
    }
  }

  async decrypt(ciphertext: string): Promise<string> {
    try {
      const command = new DecryptCommand({
        CiphertextBlob: Buffer.from(ciphertext, 'base64')
      });

      const result = await this.kmsClient.send(command);
      
      if (!result.Plaintext) {
        throw new EncryptionError('No plaintext returned');
      }

      return Buffer.from(result.Plaintext).toString('utf-8');
    } catch (error) {
      throw new EncryptionError('Failed to decrypt message');
    }
  }
}