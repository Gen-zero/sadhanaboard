# SaadhanaBoard API Documentation

This document provides information about the API documentation setup for SaadhanaBoard.

## Overview

The API documentation is generated using Swagger/OpenAPI 3.0 and is automatically served by the backend server.

## Accessing Documentation

Once the backend server is running, you can access the API documentation at:

- Swagger UI: http://localhost:3004/api-docs
- OpenAPI JSON: http://localhost:3004/api-docs-json

## Documentation Structure

The documentation is organized by tags:

1. **Authentication** - User registration, login, and authentication
2. **Profile** - User profile management and social features
3. **Admin** - Admin panel functionality (to be documented)
4. **Books** - Book management and reading progress (to be documented)
5. **Sadhanas** - Sadhana practices and tracking (to be documented)
6. **Settings** - User settings management (to be documented)
7. **Groups** - Group management and participation (to be documented)

## Adding Documentation to Endpoints

To add documentation for an API endpoint, add JSDoc comments to the controller methods using the Swagger JSDoc format:

```javascript
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Authentication failed
 */
```

## Generating Additional Documentation

To generate documentation for controllers that don't have it yet, run:

```bash
npm run docs:generate
```

This will add the basic JSDoc structure to controller files that are missing it.

## API Client SDK

An API client SDK is available in the [sdk](file:///d%3A/saadhanaboard%28latest%29/sadhanaboard/saadhanaboard/sdk) directory. This SDK provides a simple JavaScript/TypeScript interface for interacting with the API.

## Customization

To customize the documentation:

1. Modify the [swagger.js](file:///d%3A/saadhanaboard%28latest%29/sadhanaboard/saadhanaboard/backend/swagger.js) file to add new schemas or modify existing ones
2. Add JSDoc comments to controller methods following the existing patterns
3. Restart the backend server to see changes

## Security

The documentation includes security schemes for JWT authentication. Endpoints that require authentication are marked with the `bearerAuth` security requirement.