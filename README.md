🎨 Atelier — Premium Digital Art Marketplace
Atelier is a premium, full-stack e-commerce platform designed for art lovers to discover, purchase, and list original artwork. The entire application runs on a State-Driven Architecture and features a minimalist, luxury glassmorphism user interface.

🔗 Live Links
Live Demo: https://atelier-marketplace.netlify.app

Backend API Gateway: https://atelier-api-k8si.onrender.com (Deployed on Render)

🛠️ Tech Stack & Dependencies
Backend Core (Node.js & Express)
Framework: Express.js (^4.19.2)

Database & ODM: MongoDB Cloud Cluster with Mongoose (^8.3.4)

Security & Auth: bcryptjs for password hashing, jsonwebtoken for secure session APIs.

Media Upload Pipeline: multer and multer-storage-cloudinary for handling multipart form data and streaming assets directly to the cloud.

Environment Configuration: dotenv for secure credential management.

Frontend & Hosting
Frontend: Modern ES6+ JavaScript, HTML5, Custom CSS3 Luxury Variables.

Hosting: Netlify (Frontend) & Render (Backend Containers).

✨ Key Backend Architecture Features
🔒 Security & API Access
Production-Ready CORS Filtering: Engineered a custom Regex CORS policy (/\.netlify\.app$/) that securely allows cross-origin requests from any Netlify domain while blocking unauthorized third-party domains, alongside local development (localhost:5500) support.

JWT Session Integrity: Passwords are cryptographically salted. Upon valid authentication via the /user routes, the server dispenses a secure JSON Web Token held in the browser's localStorage.

Privileged Admin Portal: Protected inventory routes ensure that only authenticated administrators can trigger the multer pipeline to upload new artwork directly to Cloudinary.

🚀 Performance & Cloud Optimization
Resilient Startup Logic: Designed specifically to prevent boot timeouts on cloud providers like Render. The Express server binds to the dynamic PORT immediately, while the Mongoose database connection (mongoose.connect) initiates asynchronously in the background.

Graceful Failure Handling: Configured serverSelectionTimeoutMS: 5000 and disabled Mongoose buffering to provide instant, clear error logging if the database IP whitelist or network drops.

Optimized Atomic Syncing: Shopping carts sync changes instantly back to user profiles using MongoDB atomic operations ($set), bypassing heavy transaction overhead.

📂 Project Structure (Backend)
Plaintext
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
⚙️ Local Setup Instructions
If you want to clone and execute this backend architecture locally:

1. Install Dependencies
Bash
cd backend
npm install
2. Environment Variables
Create a secure .env file in your root backend folder and supply your corresponding keys:

Plaintext
PORT=5001
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_custom_cryptographic_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
3. Start the Server Engine
For development with live-reloading (uses nodemon):

Bash
npm run dev
For standard production execution:

Bash
npm start
The server will immediately bind to port 5001 and connect to MongoDB in the background.

🚀 Future Product Roadmap
[ ] Phase 6 Gateway Launch: Transition the simulated checkout workflow into a live Stripe / Razorpay gateway bridge to capture active digital transactions securely.

[ ] Automated Optimization Engine: Setup Cloudinary upload transformations to serve auto-converted modern WebP graphics formats for faster asset loading on mobile devices.

📝 Note for Recruiters & Engineers:
Cloud-Native Design: This backend is explicitly coded to handle cloud container lifecycles (like Render's port binding rules) smoothly.

Secure File Handling: Demonstrates competency in handling multi-part form data via multer rather than relying solely on base64 JSON strings.
