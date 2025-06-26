# 🏖️ Guidora Tourism App - Backend (Node.js & Express)

This is the backend service for **Guidora**, a tourism platform that connects **tourists** and **tourism companies** to discover, book, and manage amazing tourism offers across **Egypt**.

The API enables tourists to browse and book travel offers, while companies can post their own deals. The system supports secure authentication, real-time updates, and media handling — all built on a scalable and modern backend stack.

---

## 🛠️ Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB** + **Mongoose**
- **GraphQL**
- **Socket.io**
- **Cloudinary** + **Multer** (Image/File Uploads)
- **Bcrypt** & **Crypto** (Password Security)
- **Nodemailer** (Email Notifications)
- **JWT** (Authentication)
- **Google OAuth** (Social Login)
- **Pagination & Filtering**
- **Rate Limiter**, **Helmet**, **CORS** (Security)

---

## 🌟 Features

### 🧳 Tourists
- Register and log in securely (Email/Google)
- Browse all available tourism offers
- Filter offers by destination, price, duration, or type
- Apply to/book tourism offers with one click
- Cancel or manage existing bookings
- Chat in real-time with tourism companies
- Save favorite offers for later

### 🏨 Tourism Companies
- Create and manage travel offers
- Add media and details (pricing, duration, location)
- View and manage incoming bookings
- Accept or reject tourist applications
- Chat with tourists directly
- Modify or deactivate offers

### 🌍 General
- Includes a full database of **all tourism places in Egypt**
- Users can explore offers by place or category (beaches, history, adventure, etc.)

### 👮 Admin Panel
- Manage all users, offers, and companies
- View system statistics and booking analytics
- Handle reported offers or user abuse

---

## 🔐 Security & Authentication

- Passwords hashed using **Bcrypt**
- Secure **JWT**-based access tokens for both tourists and companies
- Optional login using **Google OAuth**
- API routes protected using **Helmet**, **Rate Limiter**, and **CORS**

---

## 📤 File & Media Uploads

- Company can upload images for offers via **Multer**
- Images and media are stored securely using **Cloudinary**

---

## 🔎 Filters & Search

Tourists can:
- Filter offers by **destination**, **price range**, **duration**, **offer type**
- Search by **tourism place name**, **company name**, or **offer title**
- Use pagination to browse large lists efficiently

---

## 🚀 API Access

- RESTful APIs for core actions like booking, offers, and users
- **GraphQL** for optimized and flexible queries across offers, users, and bookings
- **Pagination and sorting** for all listing endpoints

---

## 📬 Realtime Communication

- **Socket.io** enables instant chat between tourists and tourism companies
- Typing indicators, unread messages, and conversation history included

---

## 🧪 Setup & Run

```bash
# 1. Clone the repository
git clone https://github.com/your-username/guidora-tourism-backend.git

# 2. Install dependencies
cd guidora-tourism-backend
npm install

# 3. Create a .env file based
# Server
PORT=3000

# Database
DB_URI=mongodb://localhost:27017/jobSearchApp

# Hashing & Encryption
HASH_ROUNDS=8
ENCRYPTION_KEY=your_encryption_key_here

# JWT Token Signatures
ADMIN_ACCESS_TOKEN=your_admin_access_token_secret
ADMIN_REFRESH_TOKEN=your_admin_refresh_token_secret

USER_ACCESS_TOKEN=your_user_access_token_secret
USER_REFRESH_TOKEN=your_user_refresh_token_secret

# Cloudinary
CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

# Google OAuth
CLIENT_ID=your_google_oauth_client_id

# Email Credentials (for sending emails)
EMAIL=your_email@example.com
PASSWORD=your_email_app_password
# 4. Start the development server
npm run dev

