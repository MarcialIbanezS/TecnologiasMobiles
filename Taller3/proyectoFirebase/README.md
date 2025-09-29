# Migration from Firebase to AWS RDS MySQL

This project has been migrated from Firebase Firestore to AWS RDS MySQL database with a Node.js Express backend API.

## Architecture Overview

```
┌─────────────────┐    HTTP/REST API    ┌─────────────────┐    MySQL Connection    ┌─────────────────┐
│   Angular/Ionic │ ◄──────────────────► │   Node.js API   │ ◄────────────────────► │   AWS RDS MySQL │
│    Frontend     │                      │    Backend      │                        │    Database     │
└─────────────────┘                      └─────────────────┘                        └─────────────────┘
```

## Setup Instructions

### 1. AWS RDS MySQL Setup

1. **Create an AWS RDS MySQL instance:**
   - Go to AWS RDS Console
   - Create a new MySQL database instance
   - Configure security groups to allow connections from your backend server
   - Note down the endpoint, port, database name, username, and password

2. **Database Schema:**
   The backend will automatically create the required table:
   ```sql
   CREATE TABLE items (
     id INT AUTO_INCREMENT PRIMARY KEY,
     titulo VARCHAR(255) NOT NULL,
     detalle TEXT,
     creadoEn DATETIME DEFAULT CURRENT_TIMESTAMP,
     actualizadoEn DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );
   ```

### 2. Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your actual values
   notepad .env  # or use your preferred editor
   ```

4. **Configure your .env file:**
   ```env
   NODE_ENV=development
   PORT=3000
   
   # AWS RDS MySQL Database Configuration
   DB_HOST=your-rds-endpoint.region.rds.amazonaws.com
   DB_PORT=3306
   DB_NAME=your_database_name
   DB_USER=your_username
   DB_PASSWORD=your_password
   
   # CORS Configuration
   FRONTEND_URL=http://localhost:8100
   ```

5. **Run the backend server:**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Or production mode
   npm start
   ```

### 3. Frontend Setup

1. **Update package.json dependencies:**
   Remove Firebase dependencies and ensure HttpClient is available:
   ```bash
   npm uninstall @angular/fire firebase
   ```

2. **Update environment files:**
   The environment files have been updated to point to your backend API instead of Firebase.

3. **Run the frontend:**
   ```bash
   ionic serve
   ```

## Key Changes Made

### 1. **Environment Configuration**
- Removed Firebase configuration
- Added API base URL and database configuration

### 2. **Service Layer (items.ts)**
- Replaced Firebase imports with HttpClient
- Changed from Firestore operations to HTTP REST API calls
- Updated Item interface to use ISO date strings instead of Firebase Timestamps

### 3. **Main Application (main.ts)**
- Removed Firebase providers
- Added HttpClient provider

### 4. **Component Updates (libros.page.ts)**
- Updated async operations to handle HTTP responses
- Added error handling for API calls
- Modified to refresh data after operations

### 5. **Backend API**
- Created Express.js server with MySQL connection
- Implemented RESTful API endpoints for CRUD operations
- Added input validation and error handling
- Configured CORS for frontend communication

## API Endpoints

- `GET /api/items` - List all items
- `GET /api/items/:id` - Get a specific item
- `POST /api/items` - Create a new item
- `PUT /api/items/:id` - Update an item
- `DELETE /api/items/:id` - Delete an item
- `GET /health` - Health check

## Security Considerations

1. **Database Credentials**: Never commit database credentials to version control
2. **CORS**: Configure CORS properly for production
3. **Input Validation**: All inputs are validated on the backend
4. **SQL Injection**: Using parameterized queries to prevent SQL injection
5. **Environment Variables**: Use environment variables for all configuration

## Production Deployment

### Backend Deployment Options:
1. **AWS EC2**: Deploy on EC2 instances with load balancing
2. **AWS ECS**: Container-based deployment
3. **AWS Lambda**: Serverless deployment (requires some modifications)
4. **Heroku**: Simple cloud deployment

### Frontend Deployment:
1. **AWS S3 + CloudFront**: Static site hosting
2. **Netlify/Vercel**: Simple deployment platforms
3. **AWS Amplify**: Full-stack deployment

## Monitoring and Logging

Consider adding:
- CloudWatch for AWS resources monitoring
- Application logging (Winston, Morgan)
- Error tracking (Sentry)
- Performance monitoring

## Migration Checklist

- [x] Remove Firebase dependencies
- [x] Update environment configuration
- [x] Replace Firestore service with HTTP service
- [x] Update main.ts providers
- [x] Create backend API server
- [x] Implement MySQL database connection
- [x] Create RESTful API endpoints
- [x] Add input validation and error handling
- [x] Update frontend components to use new service
- [ ] Set up AWS RDS MySQL instance
- [ ] Configure backend environment variables
- [ ] Test all CRUD operations
- [ ] Deploy backend to production
- [ ] Update frontend environment for production
- [ ] Deploy frontend to production

## Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Check AWS RDS security groups
   - Verify database credentials
   - Ensure database is publicly accessible (if needed)

2. **CORS Errors**
   - Check backend CORS configuration
   - Verify frontend URL in backend environment

3. **API Not Found**
   - Ensure backend server is running
   - Check API base URL in frontend environment

4. **TypeScript Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check that HttpClient is properly imported