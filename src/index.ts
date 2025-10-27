import axios, { AxiosInstance } from 'axios';

export interface SendEmailOptions {
  sender: string;
  receiver: string;
  subject: string;
  body: string;
}

export interface SendEmailResponse {
  message: {
    id: string;
    projectId: string;
    userId: string;
    sender: string;
    receiver: string;
    subject: string;
    body: string;
    read: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

/**
 * Creates a MailStub client for sending test emails.
 * 
 * @param options - Configuration options for the client
 * @param options.port - Port number of the MailStub server (default: 8000)
 * @returns MailStub client with send method
 * 
 * @example
 * ```typescript
 * // Using default port 8000
 * const client = createClient();
 * 
 * // Using custom port
 * const client = createClient({ port: 5000 });
 * 
 * await client.send('p_550e8400-e29b-41d4-a716-446655440000', {
 *   sender: 'noreply@myapp.com',
 *   receiver: 'user@example.com',
 *   subject: 'Welcome!',
 *   body: '<h1>Hello World</h1>'
 * });
 * ```
 */
export const createClient = ({ port = 8000 }: { port?: number } = {}) => {
  const axiosInstance: AxiosInstance = axios.create({
    baseURL: `http://localhost:${port}`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return {
    /**
     * Send a test email to MailStub
     * 
     * @param projectId - The ID of the project (format: p_xxxxx)
     * @param options - Email details (sender, receiver, subject, body)
     * @returns Promise with the created message
     */
    async send(
      projectId: string,
      options: SendEmailOptions
    ): Promise<SendEmailResponse> {
      try {
        const response = await axiosInstance.post<SendEmailResponse>(
          '/api/messages',
          {
            projectId,
            ...options,
          }
        );

        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(
            `Failed to send email: ${error.response?.data?.message || error.message}`
          );
        }
        throw error;
      }
    }
  };
};

// Export default client instance for convenience
export const client = createClient();