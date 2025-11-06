import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Container } from '../config/container';
import { CreateMessageSchema, MessageParamsSchema } from '../utils/validation';
import { AppError, ValidationError } from '../utils/errors';

const handleError = (error: unknown): APIGatewayProxyResult => {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.code, message: error.message })
    };
  }
  return {
    statusCode: 500,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: 'INTERNAL_ERROR', message: 'An unexpected error occurred' })
  };
};

const extractUserId = (event: APIGatewayProxyEvent): string => {
  return event.requestContext?.identity?.userArn?.split('/').pop() || 'demo-user';
};

export const create = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      throw new ValidationError('Request body is required');
    }

    const body = JSON.parse(event.body);
    const userId = extractUserId(event);
    const validatedInput = CreateMessageSchema.parse({ ...body, userId });

    const container = Container.getInstance();
    const messageUseCase = container.getMessageUseCase();
    const result = await messageUseCase.createMessage(validatedInput);

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    };
  } catch (error) {
    return handleError(error);
  }
};

export const get = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const params = MessageParamsSchema.parse(event.pathParameters);
    const userId = extractUserId(event);

    const container = Container.getInstance();
    const messageUseCase = container.getMessageUseCase();
    const message = await messageUseCase.getMessage(params.id, userId);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: message.id,
        content: message.content,
        userId: message.userId,
        createdAt: message.createdAt.toISOString(),
        updatedAt: message.updatedAt.toISOString()
      })
    };
  } catch (error) {
    return handleError(error);
  }
};

export const list = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = extractUserId(event);

    const container = Container.getInstance();
    const messageUseCase = container.getMessageUseCase();
    const messages = await messageUseCase.listMessages(userId);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messages.map(msg => ({
          id: msg.id,
          createdAt: msg.createdAt.toISOString(),
          updatedAt: msg.updatedAt.toISOString()
        }))
      })
    };
  } catch (error) {
    return handleError(error);
  }
};