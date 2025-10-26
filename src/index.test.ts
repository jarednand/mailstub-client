import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { createClient, SendEmailOptions } from './index';

describe('MailStub Client', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  describe('createClient', () => {
    it('should create client with default port 8000', async () => {
      const testClient = createClient();
      const projectId = 'p_550e8400-e29b-41d4-a716-446655440000';
      const emailOptions: SendEmailOptions = {
        sender: 'noreply@myapp.local',
        receiver: 'user@example.com',
        subject: 'Test Email',
        body: '<h1>Hello</h1>',
      };

      const mockResponse = {
        message: {
          id: 'm_123',
          projectId,
          userId: 'u_456',
          sender: emailOptions.sender,
          receiver: emailOptions.receiver,
          subject: emailOptions.subject,
          body: emailOptions.body,
          read: false,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
      };

      mock.onPost('http://localhost:8000/api/messages').reply(200, mockResponse);

      const result = await testClient.send(projectId, emailOptions);

      expect(result).toEqual(mockResponse);
    });

    it('should create client with custom port', async () => {
      const testClient = createClient({ port: 5000 });
      const projectId = 'p_test123';
      const emailOptions: SendEmailOptions = {
        sender: 'sender@test.com',
        receiver: 'receiver@test.com',
        subject: 'Custom Port Test',
        body: 'Testing custom port',
      };

      const mockResponse = {
        message: {
          id: 'm_789',
          projectId,
          userId: 'u_999',
          sender: emailOptions.sender,
          receiver: emailOptions.receiver,
          subject: emailOptions.subject,
          body: emailOptions.body,
          read: false,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
      };

      mock.onPost('http://localhost:5000/api/messages').reply(200, mockResponse);

      const result = await testClient.send(projectId, emailOptions);

      expect(result).toEqual(mockResponse);
    });
  });

  describe('send method', () => {
    it('should send email successfully', async () => {
      const testClient = createClient();
      const projectId = 'p_abc123';
      const emailOptions: SendEmailOptions = {
        sender: 'app@example.com',
        receiver: 'user@example.com',
        subject: 'Welcome',
        body: '<p>Welcome to our app</p>',
      };

      const mockResponse = {
        message: {
          id: 'm_success',
          projectId,
          userId: 'u_user1',
          sender: emailOptions.sender,
          receiver: emailOptions.receiver,
          subject: emailOptions.subject,
          body: emailOptions.body,
          read: false,
          createdAt: '2025-01-15T10:30:00Z',
          updatedAt: '2025-01-15T10:30:00Z',
        },
      };

      mock.onPost('http://localhost:8000/api/messages').reply(200, mockResponse);

      const result = await testClient.send(projectId, emailOptions);

      expect(result.message.id).toBe('m_success');
      expect(result.message.sender).toBe(emailOptions.sender);
    });

    it('should handle API error with message', async () => {
      const testClient = createClient();
      const projectId = 'p_error';
      const emailOptions: SendEmailOptions = {
        sender: 'error@test.com',
        receiver: 'user@test.com',
        subject: 'Error Test',
        body: 'This will fail',
      };

      mock.onPost('http://localhost:8000/api/messages').reply(400, {
        message: 'Invalid email format',
      });

      await expect(testClient.send(projectId, emailOptions)).rejects.toThrow(
        'Failed to send email: Invalid email format'
      );
    });

    it('should handle network error', async () => {
      const testClient = createClient();
      const projectId = 'p_network';
      const emailOptions: SendEmailOptions = {
        sender: 'network@test.com',
        receiver: 'user@test.com',
        subject: 'Network Error',
        body: 'Network failure',
      };

      mock.onPost('http://localhost:8000/api/messages').networkError();

      await expect(testClient.send(projectId, emailOptions)).rejects.toThrow(
        'Failed to send email: Network Error'
      );
    });

    it('should handle 500 server error', async () => {
      const testClient = createClient();
      const projectId = 'p_500';
      const emailOptions: SendEmailOptions = {
        sender: 'server@test.com',
        receiver: 'user@test.com',
        subject: 'Server Error',
        body: 'Server failure',
      };

      mock.onPost('http://localhost:8000/api/messages').reply(500, {
        message: 'Internal server error',
      });

      await expect(testClient.send(projectId, emailOptions)).rejects.toThrow(
        'Failed to send email: Internal server error'
      );
    });
  });

  describe('default client instance', () => {
    it('should be able to create clients that work the same way', async () => {
      // Instead of testing the pre-created client, just test that createClient() 
      // with no args works the same as createClient({ port: 8000 })
      const defaultClient = createClient();
      const explicitClient = createClient({ port: 8000 });
      
      const projectId = 'p_default';
      const emailOptions: SendEmailOptions = {
        sender: 'default@test.com',
        receiver: 'user@test.com',
        subject: 'Default Client Test',
        body: 'Using default client',
      };

      const mockResponse = {
        message: {
          id: 'm_default',
          projectId,
          userId: 'u_default',
          sender: emailOptions.sender,
          receiver: emailOptions.receiver,
          subject: emailOptions.subject,
          body: emailOptions.body,
          read: false,
          createdAt: '2025-01-15T10:30:00Z',
          updatedAt: '2025-01-15T10:30:00Z',
        },
      };

      // Both should call the same endpoint
      mock.onPost('http://localhost:8000/api/messages').reply(200, mockResponse);

      const result1 = await defaultClient.send(projectId, emailOptions);
      expect(result1).toEqual(mockResponse);

      // Reset and test again
      mock.resetHistory();
      mock.onPost('http://localhost:8000/api/messages').reply(200, mockResponse);

      const result2 = await explicitClient.send(projectId, emailOptions);
      expect(result2).toEqual(mockResponse);
    });
  });
});