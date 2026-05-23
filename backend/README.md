# HireWave Backend - Production-Ready Job Portal API

🚀 Premium, scalable, production-ready backend for a modern Job Board platform built with Node.js, Express.js, MongoDB, and Docker.

## 📋 Features

### Authentication & Authorization
✅ JWT-based authentication  
✅ Role-based access control (Candidate, Recruiter, Admin)  
✅ Email verification  
✅ Password reset functionality  
✅ Account lockout after failed attempts  
✅ Secure password hashing with bcryptjs  

### Job Management
✅ CRUD operations for jobs  
✅ Advanced search and filtering  
✅ Featured jobs support  
✅ Job analytics and view tracking  
✅ Multi-filter support (location, type, experience, salary)  

### Application Management
✅ Job applications with resume upload  
✅ Application status tracking  
✅ Recruiter review capabilities  
✅ Bulk application management  

### File Management
✅ Resume uploads via Multer + Cloudinary  
✅ Profile image uploads  
✅ Company logo uploads  

### Security
✅ Helmet for security headers  
✅ CORS protection  
✅ Rate limiting  
✅ MongoDB sanitization  
✅ XSS protection  
✅ CSRF tokens  

### Email System
✅ Welcome emails  
✅ Email verification  
✅ Password reset emails  
✅ Application confirmation emails  

### DevOps
✅ Docker containerization  
✅ Docker Compose for development  
✅ GitHub Actions CI/CD  
✅ Health checks  

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18
- **Database**: MongoDB 7.0
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer + Cloudinary
- **Email**: Nodemailer
- **Security**: Helmet, CORS, Rate Limiting
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Logging**: Morgan
- **Code Quality**: ESLint, Prettier

## 📁 Project Structure

```
hirewave-backend/
├── src/
│   ├── app.js                 # Express app setup
│   ├── server.js              # Server entry point
│   ├── config/
│   │   └── database.js        # MongoDB connection
│   ├── controllers/           # Business logic
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   ├── userController.js
│   │   └── ...
│   ├── models/                # Mongoose schemas
│   │   ├── User.js
│   │   └── index.js           # All models
│   ├── routes/                # API routes
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   └── ...
│   ├── middleware/            # Custom middleware
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── utils/                 # Utilities
│   │   ├── email.js
│   │   └── validators.js
│   └── uploads/               # Temporary file storage
├── tests/                     # Unit & integration tests
├── .github/
│   └── workflows/
│       └── backend-ci.yml     # GitHub Actions workflow
├── Dockerfile                 # Docker image
├── docker-compose.yml         # Docker Compose
├── .env.example              # Environment variables
├── package.json              # Dependencies
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 7.0+
- Docker & Docker Compose (optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/hirewave-backend.git
cd hirewave-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. **Start development server**
```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Using Docker

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

## 📚 API Documentation

### Authentication Endpoints

#### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "candidate"  # or "recruiter"
}
```

#### Login
```bash
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Forgot Password
```bash
POST /api/auth/forgot-password
{
  "email": "john@example.com"
}
```

### Job Endpoints

#### Get All Jobs
```bash
GET /api/jobs?page=1&limit=10&search=react&location=New York&category=Frontend

Query Parameters:
- page: Page number (default: 1)
- limit: Items per page (default: 10)
- search: Search term
- location: Job location
- category: Job category
- jobType: Full-time, Part-time, Contract
- experience: Entry, Mid, Senior
- workMode: Remote, On-site, Hybrid
- isFeatured: true/false
```

#### Create Job (Recruiter Only)
```bash
POST /api/jobs
Authorization: Bearer <token>
{
  "title": "Senior Developer",
  "description": "We're hiring...",
  "location": "San Francisco",
  "jobType": "Full-time",
  "experience": "Senior",
  "salary": { "min": 150000, "max": 200000 },
  "skills": ["React", "Node.js"],
  "workMode": "Remote"
}
```

#### Get Job Details
```bash
GET /api/jobs/:id
```

#### Update Job
```bash
PATCH /api/jobs/:id
Authorization: Bearer <token>
```

#### Delete Job
```bash
DELETE /api/jobs/:id
Authorization: Bearer <token>
```

### Application Endpoints

#### Apply for Job
```bash
POST /api/applications/:jobId/apply
Authorization: Bearer <token>
Content-Type: multipart/form-data

resume: <file>
coverLetter: "Optional cover letter"
```

#### Get User Applications
```bash
GET /api/applications/user/applications
Authorization: Bearer <token>
```

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **JWT Secret**: Use strong, random JWT secrets
3. **Password Hashing**: Passwords are hashed with bcryptjs (10 salt rounds)
4. **Rate Limiting**: API endpoints are rate-limited to 100 requests per 15 minutes
5. **CORS**: Configured to allow only trusted origins
6. **MongoDB Sanitization**: Prevents NoSQL injection
7. **Helmet**: Adds security headers

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm test:watch

# With coverage
npm test -- --coverage
```

## 🐳 Docker Deployment

### Build Image
```bash
docker build -t hirewave-backend:latest .
```

### Run Container
```bash
docker run -p 5000:5000 \
  -e MONGODB_URI=mongodb://... \
  -e JWT_SECRET=your-secret \
  hirewave-backend:latest
```

### Docker Compose
```bash
docker-compose up -d
```

## 🔄 CI/CD Pipeline

GitHub Actions workflow automatically:
- ✅ Runs tests on every push
- ✅ Performs code quality checks
- ✅ Builds Docker images
- ✅ Runs security scans
- ✅ Deploys to production (on main branch)

View workflow status: `.github/workflows/backend-ci.yml`

## 📊 Database Models

### User
- Authentication & profile data
- Role-based (candidate, recruiter, admin)
- Email verification
- Password reset functionality

### Company
- Recruiter company information
- Logo and company details
- Verified status

### Job
- Job listings
- Salary, skills, location
- Application tracking
- Featured jobs support

### Application
- Job applications
- Resume uploads
- Status tracking
- Recruiter notes

### SavedJob
- User's bookmarked jobs

### Notification
- System notifications
- Application updates
- Messages

## 🚀 Deployment

### Heroku
```bash
heroku create hirewave-backend
heroku buildpacks:add heroku/nodejs
git push heroku main
```

### AWS/DigitalOcean
```bash
# Build and push Docker image
docker build -t your-registry/hirewave-backend .
docker push your-registry/hirewave-backend

# Deploy using Docker Compose or Kubernetes
```

## 📝 Environment Variables

See `.env.example` for all required variables:

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hirewave
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:3000
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
CLOUDINARY_NAME=your-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 💬 Support

For support, email: support@hirewave.com

## 🙏 Acknowledgments

- Express.js team
- Mongoose team
- MongoDB team
- Node.js community

---

Built with ❤️ by HireWave Team
