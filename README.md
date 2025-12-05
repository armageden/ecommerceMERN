# E-Commerce MERN Stack Project

A full-stack e-commerce application built with MongoDB, Express.js, React, and Node.js.

## 🚀 Features

### Backend API

#### User Management
- User registration with email verification
- JWT-based authentication (login/logout)
- Password hashing with bcrypt
- User profile management (CRUD)
- Admin authorization middleware
- Ban/unban user functionality

#### Category Management
- Full CRUD operations for categories
- URL-friendly slug generation
- Category image upload support
- Input validation middleware

### Security
- Rate limiting
- XSS protection
- Input validation with express-validator
- Secure cookie handling

## 📁 Project Structure

```
server/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── helper/          # Helper functions
│   ├── middlewares/     # Custom middlewares
│   ├── models/          # Mongoose models
│   ├── routers/         # API routes
│   ├── services/        # Business logic
│   ├── validators/      # Input validation
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
```

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer
- **Email**: Nodemailer
- **Validation**: express-validator

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users (admin) |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users/process-register` | Register new user |
| POST | `/api/users/verify` | Verify email |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| GET | `/api/categories/:slug` | Get category by slug |
| POST | `/api/categories` | Create category (admin) |
| PUT | `/api/categories/:slug` | Update category (admin) |
| DELETE | `/api/categories/:slug` | Delete category (admin) |

## 🏃 Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   cd server
   npm install
   ```
3. Create `.env` file with required variables
4. Start development server:
   ```bash
   npm run dev
   ```

## 📝 Environment Variables

```
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_ACTIVATION_KEY=your_secret
JWT_ACCESS_KEY=your_secret
SMTP_USERNAME=your_email
SMTP_PASSWORD=your_password
CLIENT_URL=http://localhost:3000
```

## 🔜 Upcoming Features

- [ ] Product management
- [ ] Shopping cart
- [ ] Order processing
- [ ] Payment integration
- [ ] React frontend
