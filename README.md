# Studio Booking Assistant

A comprehensive web application for recording studios to manage bookings, coordinate with staff, and distribute preparation materials to clients.

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🎵 Overview

The Studio Booking Assistant is designed to streamline the process of managing recording studio bookings, coordinating with staff, and distributing preparation materials to clients. The system aims to optimize studio utilization, reduce administrative overhead, and enhance the client experience through automation and intuitive interfaces.

## ⚙️ Features

- **User Authentication & Profiles**: Secure login for studio admins, staff, and clients with role-based access control
- **Real-time Booking Calendar**: Interactive calendar showing availability across multiple studio rooms
- **Automated Booking Management**: Self-service booking with custom rules and recurring booking support
- **Payment Processing**: Secure payment integration with customizable rate structures
- **Staff Coordination**: Engineer/staff assignment to sessions with availability tracking
- **Client Communication**: Automated confirmations, reminders, and prep materials distribution
- **Equipment Management**: Inventory tracking and equipment reservation alongside bookings
- **Reporting & Analytics**: Comprehensive metrics on studio utilization and revenue

## 🔧 Technology Stack

### Frontend
- React.js with React Router
- Redux for state management
- Material-UI components
- FullCalendar.js for booking calendar
- Formik with Yup for form validation
- Axios for API communication

### Backend
- Node.js with Express.js
- JWT authentication
- Swagger/OpenAPI documentation

### Database
- MongoDB for data storage
- Redis for caching and session management

### DevOps
- Docker for containerization
- GitHub Actions for CI/CD
- AWS/Heroku for deployment
- Sentry for error tracking

### Third-party Services
- Stripe for payments
- SendGrid for emails
- Twilio for SMS notifications
- AWS S3 for file storage

## 🏗️ Architecture

The application follows a microservices-based architecture with:

1. **Client Layer**: React SPA with responsive design
2. **API Gateway**: Express.js REST API with security measures
3. **Service Layer**: Specialized services for bookings, users, payments, notifications, and equipment
4. **Data Layer**: MongoDB, Redis, and S3
5. **External Integrations**: Payment processing, email, SMS, and calendar systems

## 🚀 Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (v4+)
- Redis
- npm or yarn

### Setup Steps

1. Clone the repository
   ```bash
   git clone https://github.com/dxaginfo/studio-booking-assistant-20250625.git
   cd studio-booking-assistant-20250625
   ```

2. Install dependencies for both frontend and backend
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables
   ```bash
   # In the server directory, create a .env file
   cp .env.example .env
   # Edit the .env file with your configuration
   ```

4. Initialize the database
   ```bash
   # In the server directory
   npm run db:init
   ```

5. Start the development servers
   ```bash
   # Start backend server (from server directory)
   npm run dev

   # Start frontend server (from client directory)
   npm start
   ```

6. The application should now be running:
   - Backend: http://localhost:5000
   - Frontend: http://localhost:3000

## 🐳 Docker Deployment

For containerized deployment, use Docker:

```bash
# Build and start all services
docker-compose up -d

# Stop all services
docker-compose down
```

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
```

## 📝 API Documentation

API documentation is available at `/api-docs` when running the server.

## 🗄 Database Schema

The database is designed with the following main collections:
- Users (admins, staff, clients)
- Studios
- Bookings
- Equipment
- Payments
- Notifications

Detailed schema information is available in the [database schema documentation](./docs/database-schema.md).

## 🔒 Security Considerations

- All passwords are hashed using bcrypt
- JWT tokens with limited lifespan for authentication
- HTTPS required for production deployment
- Input validation on all endpoints
- Rate limiting to prevent abuse
- Regular security audits

## 🚀 Deployment

The application can be deployed to:
- AWS (EC2, ECS, or EKS)
- Heroku
- DigitalOcean
- Any platform supporting Docker containers

Detailed deployment instructions are available in the [deployment guide](./docs/deployment.md).

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ⚡ Acknowledgements

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Material-UI](https://material-ui.com/)
- [FullCalendar](https://fullcalendar.io/)