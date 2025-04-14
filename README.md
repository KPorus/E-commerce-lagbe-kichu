# 🚀 Full Stack Website — NestJS Backend & Next.js Frontend

This is a full-stack web application built using **NestJS** for the backend and **Next.js** with **Chakra UI** for the frontend. The backend handles API logic, authentication, and file uploads (via Cloudinary), while the frontend offers a modern, only available for dasktop.

---

## 🛠️ Tech Stack

- **Backend:** NestJS (Node.js + TypeScript)
- **Frontend:** Next.js + Chakra UI
- **Database:** MongoDB
- **Cloud Storage:** Cloudinary
- **Authentication:** JWT

---

## ⚡ Environment Variables

Before running the project, create a `.env` file in your **backend** root directory and add the following variables:

```env
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```
Before running the project, create a `.env` file in your **frontend** root directory and add the following variables:

```env
NEXT_PUBLIC_API_URL= Local Api url
```

Replace the values with your actual credentials.

---
## 💻 Database — Setup

1. Import the dummy data from **Dummy Data** folder from **mongo atlas** or **compass**
   
## 💻 Backend — NestJS Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/KPorus/E-commerce-lagbe-kichu.git
   cd backend
   ```

2. **Install Dependencies**
   ```bash
   yarn
   ```

3. **Set Up Environment Variables**
   - Create a `.env` file as `.env.example` shown in backend folder.

4. **Run Development Server**
   ```bash
   yarn start:dev
   ```

5. **Build for Production**
   ```bash
   yarn run build
   yarn run start:prod
   ```

---

## 💻 Frontend — Next.js Setup

1. **Navigate to Frontend Directory**
   ```bash
   cd frontend
   ```

2. **Install Dependencies**
   ```bash
   yarn
   ```
3. **Set Up Environment Variables**
   - Create a `.env` file as `.env.example` shown in frontend folder.

4. **Run Development Server**
   ```bash
   yarn run dev
   ```

5. **Build for Production**
   ```bash
   yarn run build
   yarn start
   ```

---

## 📂 Project Structure

```
root/
├── backend/       # NestJS Backend
│   └── src/
|     ------
├── frontend/      # Next.js Frontend
│   └── src/
|     ------
├── Dummy Data/
│   ├── orders.json
│   ├── products.json
│   └── users.json
└── README.md
```

---

## 📌 Notes

- Ensure MongoDB is running and accessible.
- Ensure Cloudinary credentials are valid for media uploads.
- Use proper JWT secret management for production security.
