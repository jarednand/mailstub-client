# mailstub-client

Official client for [MailStub](https://github.com/jarednand/mailstub) - a lightweight email testing tool for developers.

## Installation

```bash
npm install mailstub-client
```

Or using your preferred package manager:

```bash
# pnpm
pnpm add mailstub-client

# yarn
yarn add mailstub-client
```

## Quick Start

```typescript
import { client } from 'mailstub-client';

await client.send('p_your-project-id', {
  sender: 'noreply@myapp.com',
  receiver: 'user@example.com',
  subject: 'Welcome to My App!',
  body: '<h1>Hello!</h1><p>Thanks for signing up.</p>'
});
```

## Prerequisites

Before using the client, you need:

1. **MailStub server running** - Install and start the [MailStub](https://www.npmjs.com/package/mailstub) server:
   ```bash
   npm install -g mailstub
   mailstub start
   ```

2. **A project created** - Open `http://localhost:8000` and create a project

3. **A test user added** - Add a user with an email address to your project

4. **Your project ID** - Copy the project ID from the MailStub UI (format: `p_xxxxx`)

## API Reference

### Default Client

The default client connects to `http://localhost:8000`:

```typescript
import { client } from 'mailstub-client';

await client.send(projectId, options);
```

### Custom Client

Create a client with custom configuration:

```typescript
import { createClient } from 'mailstub-client';

const client = createClient({ 
  baseURL: 'http://localhost:3000' 
});

await client.send(projectId, options);
```

### `client.send(projectId, options)`

Send a test email to MailStub.

**Parameters:**

- `projectId` (string, required) - Your project ID (format: `p_xxxxx`)
- `options` (object, required):
  - `sender` (string, required) - Full sender email address
  - `receiver` (string, required) - Recipient email (must be a user in your project)
  - `subject` (string, required) - Email subject line
  - `body` (string, required) - Email body (HTML supported)

**Returns:** `Promise<{ message: Message }>` - The created message object

**Throws:** Error if validation fails or the request fails

**Example:**

```typescript
try {
  const result = await client.send('p_abc123', {
    sender: 'support@myapp.com',
    receiver: 'testuser@example.com',
    subject: 'Password Reset',
    body: '<p>Click here to reset your password...</p>'
  });
  
  console.log('Email sent:', result.message.id);
} catch (error) {
  console.error('Failed to send email:', error.message);
}
```

## Usage Examples

### Welcome Email

```typescript
await client.send('p_abc123', {
  sender: 'welcome@myapp.com',
  receiver: 'newuser@example.com',
  subject: 'Welcome aboard!',
  body: `
    <h1>Welcome to MyApp!</h1>
    <p>We're excited to have you here.</p>
  `
});
```

### Password Reset

```typescript
await client.send('p_abc123', {
  sender: 'security@myapp.com',
  receiver: 'user@example.com',
  subject: 'Reset your password',
  body: `
    <p>Click the link below to reset your password:</p>
    <a href="https://myapp.com/reset/token123">Reset Password</a>
  `
});
```

### Order Confirmation

```typescript
await client.send('p_abc123', {
  sender: 'orders@myapp.com',
  receiver: 'customer@example.com',
  subject: 'Order #12345 Confirmed',
  body: `
    <h2>Thank you for your order!</h2>
    <p>Order #12345 has been confirmed.</p>
    <p>Total: $99.99</p>
  `
});
```

### Testing Framework Integration

```typescript
import { client } from 'mailstub-client';
import { describe, it, expect } from 'vitest';

describe('Email notifications', () => {
  it('should send welcome email', async () => {
    const result = await client.send('p_test123', {
      sender: 'test@myapp.com',
      receiver: 'testuser@example.com',
      subject: 'Welcome!',
      body: '<p>Test email</p>'
    });
    
    expect(result.message.id).toMatch(/^m_/);
  });
});
```

## Configuration

### Custom Server URL

If your MailStub server is running on a different port or host:

```typescript
import { createClient } from 'mailstub-client';

const client = createClient({ 
  baseURL: 'http://localhost:3000' 
});
```

### Environment Variables

You can configure the base URL via environment variables:

```typescript
const client = createClient({ 
  baseURL: process.env.MAILSTUB_URL || 'http://localhost:8000'
});
```

## TypeScript Support

This package includes full TypeScript definitions. Import types as needed:

```typescript
import { client, type SendEmailOptions, type Message } from 'mailstub-client';

const options: SendEmailOptions = {
  sender: 'test@myapp.com',
  receiver: 'user@example.com',
  subject: 'Test',
  body: '<p>Test email</p>'
};

const result = await client.send('p_abc123', options);
const message: Message = result.message;
```

## Error Handling

The client throws errors for:

- Invalid project ID format
- Missing required fields
- Network errors
- Server errors

Always wrap calls in try-catch:

```typescript
try {
  await client.send('p_abc123', emailOptions);
} catch (error) {
  if (error.message.includes('Network')) {
    console.error('Cannot reach MailStub server');
  } else {
    console.error('Failed to send email:', error.message);
  }
}
```

## Best Practices

### ✅ Do

- Use MailStub for development and testing environments
- Create separate projects for different apps or environments
- Add multiple test users to cover different scenarios
- Use descriptive sender addresses
- Include HTML formatting in email bodies

### ❌ Don't

- Use MailStub in production
- Store sensitive or real user data
- Use for compliance-regulated communications
- Rely on MailStub for delivery guarantees

## Troubleshooting

### "Cannot connect to MailStub server"

Make sure the MailStub server is running:

```bash
mailstub start
```

### "Invalid project ID"

Project IDs must start with `p_`. Check your project ID in the MailStub UI.

### "User not found"

The receiver email must match a user in your project. Add the user in the MailStub UI first.

### Custom port not working

If your server uses a custom port, create a custom client:

```typescript
const client = createClient({ baseURL: 'http://localhost:3000' });
```

## Related

- [MailStub](https://www.npmjs.com/package/mailstub) - The main MailStub server
- [GitHub Repository](https://github.com/jarednand/mailstub)

## License

MIT

## Support

- 🐛 [Report Issues](https://github.com/jarednand/mailstub/issues)
- 📖 [Documentation](https://github.com/jarednand/mailstub)

---

Part of the [MailStub](https://github.com/jarednand/mailstub) ecosystem.