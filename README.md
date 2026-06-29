# Finwise Backend API

Personal Finance Management System - Backend Foundation

## Project Description

This is the backend foundation for Finwise, a personal finance management platform. This foundation includes:
- Express server with ES6 modules
- MongoDB connection with retry logic
- Security middleware (Helmet, CORS, rate limiting)
- Health check and test endpoints
- Error handling middleware

## Quick Start

### Prerequisites
- Node.js 22 LTS or higher
- MongoDB Atlas account (free tier works)
- Git

### Installation

# Clone the repository (or navigate to backend folder)
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your MongoDB URI
# Open .env and replace YOUR_USERNAME and YOUR_PASSWORD

# Start development server
npm run dev

### Environment Variables

Variable	Example	      Purpose
PORT	     5000	     Server port
MONGO_URI	mongodb+srv://user:pass@cluster.mongodb.net/finwise	   MongoDB connection string
FRONTEND_URL	http://localhost:5173	Allowed CORS origin
NODE_ENV	development   	Environment mode

### API Endpoints (Foundation Phase)

GET /api/health
Check if server is running and MongoDB is connected.

Response (200 OK):
{
  "success": true,
  "status": "OK",
  "timestamp": "2026-06-13T10:30:00.000Z",
  "uptime": 2.345,
  "environment": "development",
  "mongoConnected": true
}

GET /api/test
Test frontend-backend connectivity.

Response (200 OK):
{
  "success": true,
  "message": "API connection successful",
  "data": { "backendStatus": "healthy" }
}

Invalid Route (404)
Any non-existent route returns:

{
  "success": false,
  "message": "Route not found: GET /api/unknown"
}

### Testing with Postman

- Open Postman

- Create new request

- Set method to GET

- Enter URL: http://localhost:5000/api/health

- Click Send

- Expected: 200 status with JSON response

###  Folder Structure

backend/
├── config/
│   └── db.js           # MongoDB connection with retry logic
├── middleware/
│   └── errorMiddleware.js  # Global error handler
├── .env                # Environment variables (not committed)
├── .env.example        # Example environment variables
├── package.json        # Dependencies and scripts
├── server.js           # Express server entry point
└── README.md           # This file

### Troubleshooting

#### MongoDB Connection Failed

- Check your internet connection

- Verify MONGO_URI in .env is correct

- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for development)

### Port 5000 Already in Use

#### Kill process on port 5000 (Mac/Linux)
lsof -ti:5000 | xargs kill -9

#### Or change PORT in .env

### CORS Errors

- Ensure FRONTEND_URL matches your frontend URL exactly

- Default: http://localhost:5173

### Related 

* Check out the [Frontend Documentation](../frontend/README.md) for details on the user interface and state management.

### Technical Details

#### Middleware Order (Important!)

* Helmet (security headers)

* CORS (allow frontend)

* Morgan (logging - dev only)

* Rate limiting (100 req/15min)

* JSON parsing

* Routes

* 404 handler

* Error handler

### MongoDB Retry Logic

* 5 maximum retry attempts

* Exponential backoff: 5s, 10s, 20s, 40s, 80s

* Server exits if all retries fail


## Phase 2: Homepage Public API Endpoints

### New Models
- `models/Testimonial.js` - User testimonials
- `models/Feature.js` - Feature cards for homepage

### New Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/public/testimonials` | Get all active testimonials | No |
| GET | `/api/public/features` | Get all active features | No |
| GET | `/api/public/pricing` | Get pricing information | No |

### GET /api/public/testimonials
**Response (200 OK):**

{
  "success": true,
  "count": 3,
  "data": [
    {
      "name": "Sarah Johnson",
      "role": "Freelance Designer",
      "avatarUrl": "https://ui-avatars.com/api/?name=Sarah+Johnson",
      "rating": 5,
      "quote": "Finwise has completely transformed how I manage my finances."
    }
  ]
}

### GET /api/public/features

#### Response (200 OK):

{
  "success": true,
  "count": 6,
  "data": [
    {
      "icon": "FiTrendingUp",
      "title": "Expense Tracking",
      "description": "Log every transaction in seconds."
    }
  ]
}

### New endpoints to your Postman collection:

**Request: GET /api/public/testimonials**
- Method: GET
- URL: `http://localhost:5000/api/public/testimonials`
- Expected Response: 200 with testimonials array

**Request: GET /api/public/features**
- Method: GET
- URL: `http://localhost:5000/api/public/features`
- Expected Response: 200 with features array

**Request: GET /api/public/pricing**
- Method: GET
- URL: `http://localhost:5000/api/public/pricing`
- Expected Response: 200 with pricing data