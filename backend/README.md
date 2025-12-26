# LinkHub Backend API

A comprehensive Node.js + Express backend for the LinkHub link-sharing platform.

## 🚀 Features

- **Authentication**: JWT-based auth with signup/login
- **User Management**: Profile management and settings
- **Link Management**: CRUD operations with drag-and-drop reordering
- **Analytics**: Comprehensive click tracking and insights
- **Public API**: Public profile endpoints for sharing

## 🛠 Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **Validation**: Zod schemas
- **Security**: Helmet, CORS, Rate limiting

## 📦 Installation

1. **Clone and setup**
   ```bash
   cd backend
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Database setup**
   ```bash
   npm run db:generate
   npm run db:push
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/dashboard` - Get user with links

### Links
- `GET /api/links` - Get user links
- `POST /api/links` - Create new link
- `PUT /api/links/:id` - Update link
- `DELETE /api/links/:id` - Delete link
- `PUT /api/links/reorder` - Reorder links

### Analytics
- `POST /api/analytics/clicks` - Track link click
- `GET /api/analytics/overview` - Get analytics overview
- `GET /api/analytics/detailed` - Get detailed analytics

### Public
- `GET /api/public/profile/:username` - Get public profile
- `GET /api/public/username/:username/available` - Check username availability

## 🔐 Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📊 Database Schema

The API uses PostgreSQL with the following main entities:

- **User**: User accounts and profiles
- **Link**: User links with platform validation
- **Click**: Analytics data with user agent parsing
- **CustomDomain**: Custom domain configurations
- **AnalyticsCache**: Cached analytics data

## 🚀 Deployment

### Environment Variables

```env
NODE_ENV=production
PORT=5000
DATABASE_URL="postgresql://..."
JWT_SECRET="your-production-secret"
FRONTEND_URL="https://yourdomain.com"
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 📝 API Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": {
    // Response data
  }
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message"
}
```

## 🔧 Development

### Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
```

### Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration
│   ├── lib/             # Utilities and helpers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   └── server.ts        # Main server file
├── prisma/
│   └── schema.prisma    # Database schema
└── dist/                # Compiled JavaScript
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch
```

## 📄 License

MIT License - see LICENSE file for details.