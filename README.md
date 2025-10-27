# mailstub-client

Official client for sending test emails to [MailStub](https://github.com/jarednand/mailstub).

## Installation

```bash
npm install mailstub-client
```

Or using your preferred package manager:

```bash
pnpm add mailstub-client
yarn add mailstub-client
```

## Quick Start

### Prerequisites

1. Install and start the MailStub server:
   ```bash
   npm install -g mailstub
   # or: pnpm add -g mailstub
   # or: yarn global add mailstub
   
   mailstub start
   ```

2. Open `http://localhost:8000` and:
   - Create a project
   - Add a test user with an email address
   - Copy your project ID (format: `p_xxxxx`)

### Send Your First Email

```typescript
import { client } from 'mailstub-client';

await client.send('p_your-project-id', {
  sender: 'noreply@myapp.com',
  receiver: 'user@example.com',
  subject: 'Welcome!',
  body: '<h1>Hello!</h1><p>Thanks for signing up.</p>'
});
```

## API Reference

### `client.send(projectId, options)`

**Parameters:**

- `projectId` (string) - Your project ID (format: `p_xxxxx`)
- `options` (object):
  - `sender` (string) - Sender email address
  - `receiver` (string) - Recipient email (must be a user in your project)
  - `subject` (string) - Email subject line
  - `body` (string) - Email body (HTML supported)

**Returns:** Promise with the created message object

**Example:**

```typescript
const result = await client.send('p_abc123', {
  sender: 'support@myapp.com',
  receiver: 'testuser@example.com',
  subject: 'Password Reset',
  body: '<p>Click here to reset your password...</p>'
});

console.log('Message ID:', result.message.id);
```

### Custom Port

If your MailStub server runs on a different port:

```typescript
import { createClient } from 'mailstub-client';

const client = createClient({ port: 3000 });
```

## Usage Examples

### Development vs Production

Create an abstraction to switch between MailStub (dev) and real email services (production):

```typescript
import { client as mailstubClient } from 'mailstub-client';
import sendgrid from '@sendgrid/mail';

sendgrid.setApiKey(process.env.SENDGRID_API_KEY || '');

export async function sendEmail({ to, from, subject, html }) {
  if (process.env.NODE_ENV === 'production') {
    await sendgrid.send({ to, from, subject, html });
  } else {
    await mailstubClient.send(process.env.MAILSTUB_PROJECT_ID!, {
      sender: from,
      receiver: to,
      subject,
      body: html
    });
  }
}

// Usage anywhere in your app:
await sendEmail({
  to: 'user@example.com',
  from: 'noreply@myapp.com',
  subject: 'Welcome!',
  html: '<h1>Welcome!</h1>'
});
```

### Testing Integration

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

## Troubleshooting

**"Cannot connect to MailStub server"**  
Make sure the server is running: `mailstub start`

**"Failed to send email"**  
Check that:
- Project ID starts with `p_`
- Receiver exists as a user in your project
- Server is running on the correct port

**Custom port not working**  
Create a client with the custom port and ensure the server started with the same port:
```bash
mailstub start --port 3000
```
```typescript
const client = createClient({ port: 3000 });
```

## License

MIT

## Links

- [GitHub](https://github.com/jarednand/mailstub-client)
- [Issues](https://github.com/jarednand/mailstub-client/issues)
- [MailStub](https://www.npmjs.com/package/mailstub)