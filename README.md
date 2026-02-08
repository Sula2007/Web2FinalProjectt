# TaskMaster - Task Management System

A comprehensive task management system with role-based access control, email notifications, and advanced features.

## Development Team

- **Participant 1** - Backend Foundation, Authentication, User Management
- **Participant 2** - Task Management, Validation, Error Handling, Search
- **Participant 3** - RBAC, Email Service, Deployment, Documentation

---

## Key Features

### Core Functionality (Required)
- ✅ Registration and Authentication (JWT)
- ✅ User Profile Management
- ✅ Task CRUD Operations
- ✅ Task Categories and Priorities
- ✅ Filtering and Sorting
- ✅ Data Validation (Joi)
- ✅ Error Handling
- ✅ MongoDB + Mongoose
- ✅ Deployment on Render

### Additional Features (Project Enhancement)

#### Selected Features (6 total):

**1. Task Sharing (Collaborative Tasks)** - Feature #2
- Assign tasks to other users
- `assignedTo` field in Task model
- Email notifications on assignment
- Users can see tasks assigned to them

**2. Comments on Tasks** - Feature #3
- Task discussion via comments
- Separate Comment collection
- Only task participants can comment
- Delete own comments

**3. Search** - Feature #7
- Full-text search across tasks
- Search by title and description
- GET /api/tasks/search?q=query
- Regex search with case-insensitive flag

**4. Dashboard / Analytics** - Feature #8
- Overall task statistics
- Statistics by status, priority, category
- Task completion rate
- Upcoming deadlines
- Overdue tasks
- Recent activity
- Weekly productivity

**5. User Preferences** - Feature #13
- UI theme (light/dark/auto)
- Language (en/ru/kk)
- Timezone settings
- Email notification management
- Reminder configuration
- Weekly digest option

**6. Rate Limiting** - Feature #14
- Protection against spam and DDoS
- 5 different limit types:
  - General API: 100 requests / 15 min
  - Authentication: 5 attempts / hour
  - Task creation: 30 tasks / hour
  - Email: 10 emails / hour
  - Admin operations: 50 requests / hour
- Premium/Admin users have increased limits

#### Advanced Features for Bonus Points:

**7. RBAC - Role-Based Access Control** (+5 points)
- 3 roles with different permissions:
  - **User**: 20 tasks maximum, basic functionality
  - **Premium**: unlimited tasks, all categories
  - **Admin**: full system control
- Middleware for role verification
- Automatic limit checking
- Admin panel for management

**8. 📧 SMTP Email Service Integration** (+5 points)
- Nodemailer + Brevo (SendinBlue)
- 5 types of automated notifications:
  1. Welcome email (on registration)
  2. Task assignment (when someone assigns a task)
  3. Deadline reminder (1 day before)
  4. Overdue task (daily)
  5. Role upgrade (Premium/Admin)
- Cron jobs for automated sending
- Notification settings in user profile

---

## Technologies

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs
- **Email**: Nodemailer + Brevo (SendinBlue)
- **Validation**: Joi
- **Scheduler**: node-cron
- **Rate Limiting**: express-rate-limit

---

## Installation and Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd taskmaster
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Fill in the `.env` file:

```env
PORT=5000
NODE_ENV=development

# MongoDB (register at https://cloud.mongodb.com)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager

# JWT Secret (generate a random string)
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d

# Email (Brevo - https://app.brevo.com)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_smtp_password
SMTP_FROM=noreply@taskmaster.com

FRONTEND_URL=http://localhost:3000
ADMIN_EMAIL=admin@taskmaster.com
```

### 4. Run the Project

```bash
# Development
npm run dev

# Production
npm start
```

Server will start on `http://localhost:5000`

---

## Roles and Access Rights

### User (Regular User)
- ✅ Create up to 20 tasks
- ✅ Edit own tasks
- ✅ View own tasks
- ❌ Delete others' tasks

### Premium
- ✅ Unlimited tasks
- ✅ All categories available
- ✅ Priority support
- ✅ Extended analytics

### Admin
- ✅ Full system access
- ✅ User management
- ✅ Change user roles
- ✅ Delete any tasks
- ✅ View system statistics

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

---

### Public Endpoints (No Authentication Required)

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### Private Endpoints (Authentication Required)

**Header for all private requests:**
```
Authorization: Bearer <your_jwt_token>
```

---

### User Profile

#### Get Profile
```http
GET /users/profile
```

#### Update Profile
```http
PUT /users/profile
Content-Type: application/json

{
  "username": "new_username",
  "email": "newemail@example.com"
}
```

---

### Task Management

#### Create Task
```http
POST /tasks
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish backend part",
  "status": "todo",
  "priority": "high",
  "category": "work",
  "dueDate": "2025-02-15",
  "assignedTo": "user_id"
}
```

#### Get All Tasks (with filters)
```http
GET /tasks
GET /tasks?status=completed
GET /tasks?priority=high
GET /tasks?category=work
GET /tasks?sort=dueDate
GET /tasks?page=1&limit=10
```

#### Get Task by ID
```http
GET /tasks/:id
```

#### Update Task
```http
PUT /tasks/:id
Content-Type: application/json

{
  "status": "completed",
  "priority": "medium"
}
```

#### Delete Task
```http
DELETE /tasks/:id
```

#### Search Tasks
```http
GET /tasks/search?q=project
```

#### Task Statistics
```http
GET /tasks/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 15,
    "byStatus": {
      "todo": 5,
      "in-progress": 3,
      "completed": 7
    },
    "byPriority": {
      "low": 2,
      "medium": 8,
      "high": 5
    }
  }
}
```

---

### Task Comments

#### Add Comment
```http
POST /tasks/:taskId/comments
Content-Type: application/json

{
  "text": "Great work!"
}
```

#### Get Comments
```http
GET /tasks/:taskId/comments
```

#### Delete Comment
```http
DELETE /comments/:commentId
```

---

### Dashboard

#### Get Dashboard Data
```http
GET /dashboard
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tasks": {
      "total": 15,
      "completed": 7,
      "inProgress": 3,
      "todo": 5
    },
    "productivity": {
      "thisWeek": 12,
      "lastWeek": 8,
      "completionRate": 46.67
    },
    "upcomingDeadlines": [...],
    "recentActivity": [...]
  }
}
```

---

### User Preferences

#### Get Preferences
```http
GET /preferences
```

#### Update Preferences
```http
PUT /preferences
Content-Type: application/json

{
  "theme": "dark",
  "language": "en",
  "emailNotifications": true,
  "deadlineReminders": true
}
```

**Available options:**
- `theme`: "light" | "dark" | "auto"
- `language`: "en" | "ru" | "kk"
- `timezone`: timezone string (e.g., "America/New_York")
- `emailNotifications`: boolean
- `deadlineReminders`: boolean
- `taskAssignmentNotifications`: boolean
- `weeklyDigest`: boolean

#### Reset Preferences
```http
POST /preferences/reset
```

---

### Admin Endpoints (Admin Only)

#### Get All Users
```http
GET /admin/users
GET /admin/users?role=premium
GET /admin/users?search=john
```

#### Get User by ID
```http
GET /admin/users/:id
```

#### Change User Role
```http
PUT /admin/users/:id/role
Content-Type: application/json

{
  "role": "premium"
}
```

#### Delete User
```http
DELETE /admin/users/:id
```

#### Get All Tasks (All Users)
```http
GET /admin/tasks
```

#### Delete Any Task
```http
DELETE /admin/tasks/:id
```

#### System Statistics
```http
GET /admin/stats
```

---

## Email Notifications

The system automatically sends the following emails:

### 1. Welcome Email
- Sent upon registration
- Contains information about features

### 2. Task Assignment
- When someone assigns you a task
- Contains task name and who assigned it

### 3. Deadline Reminder
- 1 day before deadline (9:00 AM)
- Only for incomplete tasks

### 4. Overdue Task
- Daily at 10:00 AM for overdue tasks
- Sent only once per task

### 5. Role Upgrade
- When role is changed to Premium or Admin

---

## Rate Limiting

System is protected against spam:

| Endpoint | Limit | Period |
|----------|-------|--------|
| General API | 100 requests | 15 minutes |
| Auth endpoints | 5 attempts | 1 hour |
| Task creation | 30 tasks | 1 hour |
| Email | 10 emails | 1 hour |
| Admin operations | 50 requests | 1 hour |

**Note:** Premium and Admin users have increased limits for task creation.

---

## Project Structure

```
taskmaster/
├── config/
│   ├── database.js          # MongoDB connection
│   └── email.js             # Email configuration
├── controllers/
│   ├── authController.js    # Authentication
│   ├── userController.js    # Users
│   ├── taskController.js    # Tasks
│   ├── commentController.js # Comments
│   ├── dashboardController.js # Dashboard
│   ├── preferencesController.js # Preferences
│   └── adminController.js   # Admin functions
├── middleware/
│   ├── auth.js              # JWT verification
│   ├── roleCheck.js         # RBAC
│   ├── validation.js        # Data validation
│   ├── errorHandler.js      # Error handling
│   └── rateLimiter.js       # Rate limiting
├── models/
│   ├── User.js              # User model
│   ├── Task.js              # Task model
│   └── Comment.js           # Comment model
├── routes/
│   ├── auth.js              # Auth routes
│   ├── users.js             # User routes
│   ├── tasks.js             # Task routes
│   ├── comments.js          # Comment routes
│   ├── dashboard.js         # Dashboard routes
│   ├── preferences.js       # Settings routes
│   └── admin.js             # Admin routes
├── utils/
│   └── emailScheduler.js    # Cron jobs for email
├── .env                     # Environment variables
├── .env.example             # Example env file
├── .gitignore
├── server.js                # Entry point
├── package.json
└── README.md
```

---

## Deployment on Render

### 1. Preparation

Ensure that:
- Code is on GitHub
- `.env` is in `.gitignore`
- `package.json` has `start` script

### 2. Create Web Service

1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repository
4. Settings:
   - **Name**: taskmaster-api
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 3. Environment Variables

Add all variables from `.env` in Render:

```
PORT=5000
NODE_ENV=production
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASSWORD=your_password
SMTP_FROM=noreply@taskmaster.com
```

### 4. Deploy

- Click "Create Web Service"
- Wait for deployment (~5 minutes)
- Get URL: `https://taskmaster-api.onrender.com`

---

## Screenshots

### 1. User Registration
![Registration](screenshots/registration.png)
*Postman request POST /api/auth/register*

### 2. Create Task
![Create Task](screenshots/create-task.png)
*Postman request POST /api/tasks*

### 3. Dashboard
![Dashboard](screenshots/dashboard.png)
*Postman request GET /api/dashboard*

### 4. Admin Panel
![Admin Panel](screenshots/admin-panel.png)
*Postman request GET /api/admin/stats*

### 5. Email Notification
![Email](screenshots/email-notification.png)
*Welcome email in email client*

---

## Testing

### Postman Collection

Import `TaskMaster.postman_collection.json` into Postman.

Collection includes:
- ✅ Auth endpoints
- ✅ User endpoints
- ✅ Task CRUD
- ✅ Comments
- ✅ Dashboard
- ✅ Admin endpoints
- ✅ Preferences

### Test Data

**Admin user:**
```
Email: admin@taskmaster.com
Password: admin123
```

**Regular user:**
```
Email: user@taskmaster.com
Password: user123
```

---

## Performance

- **Response time**: <100ms for most endpoints
- **Database queries**: Optimized with indexes
- **Rate limiting**: DDoS protection
- **Caching**: Ready for Redis integration

---

## Security

- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens for authentication
- ✅ CORS configured
- ✅ Rate limiting
- ✅ Input validation
- ✅ MongoDB injection protection
- ✅ Environment variables

---

## Future Improvements

- [ ] WebSocket for real-time notifications
- [ ] File uploads for tasks
- [ ] Recurring tasks
- [ ] Export to PDF/CSV
- [ ] Mobile application
- [ ] Two-factor authentication
- [ ] Redis caching
- [ ] Elasticsearch for search

---

## Authors

Project developed by a team of 3 students as a final Backend Development project.

---

## License

MIT License

---

## Support

If you have questions:

1. Check documentation above
2. Check Issues on GitHub
3. Create a new Issue
4. Contact development team
