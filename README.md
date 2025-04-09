# 📝 Task Management API

A backend-only RESTful API for user authentication and task management using **TypeScript**, **Express**, **Prisma**, and **PostgreSQL**.

## 🚀 Features

- ✅ User Registration & Login (JWT-based auth)
- 🔐 Protected Task Routes
- 🧾 CRUD Operations on Tasks
- 🛠️ Input validation using Zod
- 🌐 RESTful API design
- 📦 PostgreSQL with Prisma ORM
- 🌍 Deployed on [Render/Railway/Vercel] (add your link here)

---

## 📁 Project Structure

src/
├── controllers/
├── middlewares/
├── routes/
├── schema/
├── utils/
├── prisma/ # Prisma schema
├── generated/ # Prisma Client
└── index.ts # Entry point


---

## 🔧 Tech Stack

- **Backend**: Node.js, Express
- **Language**: TypeScript
- **ORM**: Prisma
- **DB**: PostgreSQL
- **Auth**: JWT
- **Validation**: Zod
- **Deployment**: Render, Railway, or Vercel

---

## 🧪 API Testing

### 🔐 Auth Endpoints

**POST** `/api/auth/register`

{
"name": "John Doe",
"email": "john@example.com",
"password": "securepassword"
}


**POST** `/api/auth/login`

{
"email": "john@example.com",
"password": "securepassword"
}


### 📋 Task Endpoints (Authorization: Bearer <token>)

**POST** `/api/tasks`


{
"title": "Complete project",
"description": "Finish API integration",
"status": "pending"
}


**GET** `/api/tasks`

**PATCH** `/api/tasks/:id`

{
"title": "Updated title",
"status": "completed"
}


**DELETE** `/api/tasks/:id`

---

## 🛠️ Setup

git clone https://github.com/yourusername/task-api.git
cd task-api
npm install


Copy `.env.local` to `.env` file:

DATABASE_URL=your_db_url
JWT_SECRET=your_jwt_secret_here


Start development server:


npm run dev


## ✅ TODOs

- [x] Auth (Register/Login)
- [x] Task CRUD Operations
- [x] JWT Middleware
- [x] Zod Validation
- [x] Prisma/PostgreSQL Setup


---

## 📄 License

MIT © 2025

---

🔗 **Need help?**  
Let me know if you want me to:
1. Generate a Postman collection
2. Add deployment configuration files
3. Create sample environment variables
4. Add error code documentation
