# 🎬 video-sharing-api

A scalable, robust RESTful backend API for a video sharing and streaming platform (YouTube-like), built with Node.js, Express, MongoDB, and Cloudinary. Designed with enterprise-grade Controller-Service-Repository layered architecture.

## 🌟 Key Features

- 🔐 **Authentication & Authorization**
  - Secure registration & login with Bcrypt password hashing.
  - JWT token strategy with short-lived Access Tokens and long-lived Refresh Tokens stored in secure, `httpOnly` cookies.
  - Automatic token refresh rotation endpoint.

- 📹 **Video Management**
  - Video and thumbnail uploads processed via Multer and uploaded to Cloudinary.
  - Paginated video feeds with custom search queries, sorting (`sortBy`, `sortType`), and user filtering.
  - Watch history integration, video detail inspection, metadata updating, and soft publish/unpublish toggling.

- 💬 **Comments System**
  - Add, edit, and delete comments on published videos.
  - Paginated comments fetching using `mongoose-aggregate-paginate-v2`.

- ❤️ **Likes System**
  - Polymorphic toggle likes on videos and comments.
  - Strict database-level mutual exclusivity validation (prevents liking both a video and comment simultaneously in a single record).
  - Paginated retrieval of user-liked videos.

- ⚙️ **Resilient Architecture & Error Handling**
  - **Controller-Service-Repository Pattern:** Clean separation between routing, business logic, and database operations.
  - **Automated Local File Cleanup:** If an API error or network failure occurs during media upload, temporary local files are automatically unlinked to avoid disk leaks.
  - **Standardized API wrappers:** `ApiResponse` and `ApiError`.

## 🛠️ Tech Stack

- **Runtime:** [Node.js](https://nodejs.org/) (ES Modules)
- **Framework:** [Express.js](https://expressjs.com/) (v5.x)
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Media Storage:** [Cloudinary](https://cloudinary.com/)
- **File Handling:** [Multer](https://github.com/expressjs/multer)
- **Authentication:** [JSON Web Tokens (JWT)](https://jwt.io/) & [Bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- **Pagination:** `mongoose-aggregate-paginate-v2`

## 📁 Project Architecture

```text
src/
├── controllers/      # Request handling & HTTP response mapping
├── db/               # Database connection setup
├── middlewares/      # Multer, JWT authentication & error handling
├── models/           # Mongoose schemas (User, Video, Comment, Like)
├── repositories/     # Direct database access & query abstraction
├── routes/           # REST API routes definition
├── services/         # Core business logic & validations
├── utils/            # ApiError, ApiResponse, asyncHandler, Cloudinary helper
├── app.js            # Express app configuration & middleware pipeline
└── index.js          # Server entry point & DB connection initialization
```