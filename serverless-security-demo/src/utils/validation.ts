import { z } from 'zod';

export const CreateMessageSchema = z.object({
  content: z.string().min(1).max(1000),
  userId: z.string().min(1)
});

export const MessageParamsSchema = z.object({
  id: z.string().uuid()
});

export type CreateMessageInput = z.infer<typeof CreateMessageSchema>;
export type MessageParams = z.infer<typeof MessageParamsSchema>;