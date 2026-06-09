# 🎨 Atelier — Premium Digital Art Marketplace

<div align="center">
  
  ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
  ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
  ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
  ![JWT](https://img.shields.io/badge/JSON_Web_Tokens-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)
  ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
  ![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

</div>

> **Atelier** is a premium, full-stack e-commerce platform designed for art lovers to discover, purchase, and list original artwork. The entire application runs on a **State-Driven Architecture** and features a minimalist, luxury glassmorphism user interface.

<img width="1278" height="763" alt="Screenshot 2026-06-10 at 12 31 32 AM" src="https://github.com/user-attachments/assets/a35b3c27-ba6b-41de-8688-b865a21f28fb" />
<img width="1280" height="767" alt="Screenshot 2026-06-10 at 12 32 40 AM" src="https://github.com/user-attachments/assets/3c49866b-e89e-4122-be08-7be22204ce23" />
<img width="1280" height="763" alt="Screenshot 2026-06-10 at 12 32 14 AM" src="https://github.com/user-attachments/assets/4c624449-975f-4871-a8a7-aae3c5f9560c" />
<img width="1280" height="764" alt="Screenshot 2026-06-10 at 12 31 59 AM" src="https://github.com/user-attachments/assets/724082dd-3116-439b-aa28-82e295fa1899" />
<img width="1279" height="762" alt="Screenshot 2026-06-10 at 12 32 27 AM" src="https://github.com/user-attachments/assets/f3549c2d-ca9f-43f2-8bf3-e7ca6ebbbcc3" />






### 🔗 Live Links
* **Live Demo:** [https://atelier-marketplace.netlify.app](https://atelier-marketplace.netlify.app/index.html)
* **Backend API Gateway:** [https://atelier-api-k8si.onrender.com](https://atelier-api-k8si.onrender.com) *(Deployed on Render)*

---

## 🛠️ Tech Stack & Dependencies

### **Backend Core (Node.js & Express)**
* **Framework:** Express.js (`^4.19.2`)
* **Database & ODM:** MongoDB Cloud Cluster with Mongoose (`^8.3.4`)
* **Security & Auth:** `bcryptjs` for password hashing, `jsonwebtoken` for secure session APIs.
* **Media Upload Pipeline:** `multer` and `multer-storage-cloudinary` for handling multipart form data and streaming assets directly to the cloud.
* **Environment Configuration:** `dotenv` for secure credential management.

### **Frontend & Hosting**
* **Frontend:** Modern ES6+ JavaScript, HTML5, Custom CSS3 Luxury Variables.
* **Hosting:** Netlify (Frontend) & Render (Backend Containers).

---

## ✨ Key Backend Architecture Features

### 🔒 Security & API Access
* **Production-Ready CORS Filtering:** Engineered a custom Regex CORS policy (`/\.netlify\.app$/`) that securely allows cross-origin requests from any Netlify domain while blocking unauthorized third-party domains, alongside local development (`localhost:5500`) support.
* **JWT Session Integrity:** Passwords are cryptographically salted. Upon valid authentication via the `/user` routes, the server dispenses a secure JSON Web Token held in the browser's `localStorage`.
* **Privileged Admin Portal:** Protected inventory routes ensure that only authenticated administrators can trigger the `multer` pipeline to upload new artwork directly to Cloudinary.

### 🚀 Performance & Cloud Optimization
* **Resilient Startup Logic:** Designed specifically to prevent boot timeouts on cloud providers like Render. The Express server binds to the dynamic `PORT` immediately, while the Mongoose database connection (`mongoose.connect`) initiates asynchronously in the background.
* **Graceful Failure Handling:** Configured `serverSelectionTimeoutMS: 5000` and disabled Mongoose buffering to provide instant, clear error logging if the database IP whitelist or network drops.
* **Optimized Atomic Syncing:** Shopping carts sync changes instantly back to user profiles using MongoDB atomic operations (`$set`), bypassing heavy transaction overhead.

---

## 📂 Project Structure (Backend)

```plaintext
├── config/          # Cloudinary media and database configurations
├── middleware/      # JWT validation checkpoints & Admin access guards
├── models/          # Mongoose Schemas (product.model.js, user.model.js)
├── routes/          
│   ├── auth.js      # User authentication, registration, and login
│   ├── products.js  # CRUD operations for the marketplace inventory
│   └── user.js      # User profile and historical order syncing
├── server.js        # Master initialization, CORS, and Express routing
├── seed.js          # Database population script
└── package.json     # Project dependencies & scripts
