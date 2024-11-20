# Pets Adoption API

A RESTful API for managing pet adoptions, built with Node.js, Express, and MongoDB.

## 🚀 Features

- User authentication and authorization
- Pet management (CRUD operations)
- Adoption process handling
- Mock data generation for testing
- File uploads for pet images
- JWT-based session management

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## 🛠️ Installation

1. Clone the repository:

```bash
git clone https://github.com/Bzzmn/pets-adoption-api.git
cd pets-adoption-api
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with your configuration:

```bash
env
PORT=8080
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## 🚦 Running the Application

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Run tests:

```bash
npm test
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/sessions/register` - Register new user
- `POST /api/sessions/login` - User login
- `GET /api/sessions/current` - Get current user

### Pets Endpoints

- `GET /api/pets` - Get all pets
- `POST /api/pets` - Create new pet
- `POST /api/pets/withimage` - Create pet with image
- `PUT /api/pets/:pid` - Update pet
- `DELETE /api/pets/:pid` - Delete pet

### Adoptions Endpoints

- `GET /api/adoptions` - Get all adoptions
- `GET /api/adoptions/:aid` - Get specific adoption
- `POST /api/adoptions/:uid/:pid` - Create adoption

### Mock Data Endpoints

- `GET /api/mocks/mockingpets?num=100` - Generate 100 mock pets
- `GET /api/mocks/mockingusers?num=50` - Generate 50 mock users
- `POST /api/mocks/generateData` - Generate and save mock data to the database

**To use the POST /api/mocks/generateData endpoint, you have to sent the request with a json fomat like this:**

```json
{
  "numPets": 100,
  "numUsers": 50
}
```

## 🏗️ Project Structure

```bach
src/
├── controllers/ # Request handlers
├── dao/ # Data Access Objects
├── dto/ # Data Transfer Objects
├── models/ # Database models
├── repository/ # Repository pattern implementation
├── routes/ # API routes
├── services/ # Business logic
└── utils/ # Utility functions
```

## 🔐 Security

The API implements several security measures:

- Password hashing using bcrypt
- JWT token authentication
- Cookie-based session management
- Role-based access control

## 📝 Error Handling

The API uses a centralized error handling system with predefined error messages for common scenarios such as:

- User not found
- Pet not found
- Incomplete values
- User already exists
- Incorrect password
- Pet already adopted

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.
