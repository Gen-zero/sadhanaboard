# SaadhanaBoard API Client SDK

This SDK provides a simple JavaScript/TypeScript client for interacting with the SaadhanaBoard API.

## Installation

```bash
npm install saadhanaboard-sdk
```

Or if you're using the source directly:

```bash
# Copy the sdk directory to your project
```

## Usage

### Initialize the client

```javascript
const SaadhanaBoardClient = require('./saadhanaboard-client');

const client = new SaadhanaBoardClient({
  baseURL: 'http://localhost:3004/api',
  token: 'your-jwt-token' // Optional, can be set later
});
```

### Authentication

```javascript
// Register a new user
const registrationResponse = await client.auth.register({
  email: 'user@example.com',
  password: 'securepassword',
  displayName: 'User Name'
});

// Login
const loginResponse = await client.auth.login({
  email: 'user@example.com',
  password: 'securepassword'
});

// Set the token for subsequent requests
client.setToken(loginResponse.token);
```

### Profile Management

```javascript
// Get current user profile
const profile = await client.profile.get();

// Update profile
const updatedProfile = await client.profile.update({
  bio: 'Spiritual practitioner',
  spiritualPath: 'Yoga and Meditation'
});

// Follow a user
await client.profile.follow('user-id');

// Unfollow a user
await client.profile.unfollow('user-id');

// Get followers
const followers = await client.profile.getFollowers('user-id');

// Get following
const following = await client.profile.getFollowing('user-id');
```

### Analytics

```javascript
// Get practice trends
const trends = await client.analytics.getPracticeTrends({
  timeframe: '30d',
  granularity: 'daily'
});

// Get completion rates
const completionRates = await client.analytics.getCompletionRates({
  groupBy: 'category',
  timeframe: '30d'
});

// Get streaks
const streaks = await client.analytics.getStreaks();

// Get detailed report
const report = await client.analytics.getDetailedReport({
  start: '2023-01-01',
  end: '2023-12-31'
});
```

## API Reference

For detailed API documentation, visit the [Swagger UI](http://localhost:3004/api-docs) when running the backend server.

## Building the SDK

To build the SDK for distribution:

```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request