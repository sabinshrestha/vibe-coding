import config from './config';

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Vibe Marketplace API',
    version: '1.0.0',
    description: 'API documentation for Vibe Freelance Marketplace - A platform connecting freelancers with clients',
  },
  servers: [
    {
      url: `http://localhost:${config.port}`,
      description: 'Local Development Server',
    },
    {
      url: process.env.CODESPACE_NAME 
        ? `https://${process.env.CODESPACE_NAME}-${config.port}.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`
        : `http://localhost:${config.port}`,
      description: 'GitHub Codespace Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your Bearer token in the format: Bearer {token}',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '507f1f77bcf86cd799439011' },
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', format: 'email', example: 'john@example.com' },
          role: { type: 'string', enum: ['freelancer', 'client'], example: 'client' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'An error occurred' },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check endpoint',
        description: 'Check if the API server is running',
        responses: {
          '200': {
            description: 'Server is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'OK' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register a new user',
        description: 'Create a new user account (client or freelancer)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password', 'role'],
                properties: {
                  name: { type: 'string', example: 'John Doe' },
                  email: { type: 'string', format: 'email', example: 'john@example.com' },
                  password: { type: 'string', format: 'password', example: 'password123' },
                  role: { type: 'string', enum: ['freelancer', 'client'], example: 'client' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: { $ref: '#/components/schemas/User' },
                    token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Email already exists',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '500': {
            description: 'Registration failed',
          },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Login user',
        description: 'Authenticate user and receive JWT token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'john@example.com' },
                  password: { type: 'string', format: 'password', example: 'password123' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: { $ref: '#/components/schemas/User' },
                    token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Invalid credentials',
          },
          '500': {
            description: 'Login failed',
          },
        },
      },
    },
    '/api/services': {
      get: {
        tags: ['Services'],
        summary: 'Get all services',
        description: 'Retrieve list of all active services with optional filtering',
        parameters: [
          {
            in: 'query',
            name: 'category',
            schema: { type: 'string' },
            description: 'Filter by category',
          },
          {
            in: 'query',
            name: 'searchTerm',
            schema: { type: 'string' },
            description: 'Search term for service title/description',
          },
        ],
        responses: {
          '200': {
            description: 'List of services',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      title: { type: 'string' },
                      description: { type: 'string' },
                      price: { type: 'number' },
                      category: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Services'],
        summary: 'Create a new service',
        description: 'Create a new service listing (requires authentication)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'description', 'category', 'price', 'deliveryTime'],
                properties: {
                  title: { type: 'string', example: 'Professional Logo Design' },
                  description: { type: 'string', example: 'I will create a modern logo for your business' },
                  category: { type: 'string', example: 'Design' },
                  price: { type: 'number', example: 50 },
                  deliveryTime: { type: 'number', example: 3 },
                  revisions: { type: 'number', example: 2 },
                  tags: { type: 'array', items: { type: 'string' }, example: ['logo', 'design', 'branding'] },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Service created successfully',
          },
          '401': {
            description: 'Unauthorized - authentication required',
          },
          '500': {
            description: 'Failed to create service',
          },
        },
      },
    },
    '/api/services/{id}': {
      get: {
        tags: ['Services'],
        summary: 'Get service by ID',
        description: 'Retrieve detailed information about a specific service',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Service ID',
          },
        ],
        responses: {
          '200': {
            description: 'Service details',
          },
          '404': {
            description: 'Service not found',
          },
        },
      },
    },
    '/api/orders': {
      post: {
        tags: ['Orders'],
        summary: 'Create a new order',
        description: 'Place an order for a service (requires authentication)',
        security: [{ bearerAuth: [] }],
        responses: {
          '201': {
            description: 'Order created successfully',
          },
          '401': {
            description: 'Unauthorized',
          },
        },
      },
      get: {
        tags: ['Orders'],
        summary: 'Get user orders',
        description: 'Retrieve orders for the authenticated user',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of orders',
          },
          '401': {
            description: 'Unauthorized',
          },
        },
      },
    },
  },
  tags: [
    { name: 'Health', description: 'Health check endpoints' },
    { name: 'Authentication', description: 'User authentication endpoints' },
    { name: 'Services', description: 'Service listing endpoints' },
    { name: 'Orders', description: 'Order management endpoints' },
  ],
};

export default swaggerSpec;
