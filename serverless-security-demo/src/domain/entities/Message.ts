export interface Message {
  id: string;
  content: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EncryptedMessage {
  id: string;
  encryptedContent: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}