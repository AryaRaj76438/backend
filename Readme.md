# Backend Project

This backend project includes features for user registration, login/logout, commenting, tweeting, video uploading, subscriptions, and subscriber management. It utilizes technologies such as JavaScript, Express, Multer, Cloudinary, MongoDB, Mongoose, and JWT for authentication.

## Features

- **User Registration**
- **Login/Logout**
- **Commenting**
- **Tweeting**
- **Video Uploading**
- **Subscriptions**
- **Subscriber Management**

## Technologies Used

- **JavaScript**
- **Express**
- **Multer**
- **Cloudinary**
- **MongoDB**
- **Mongoose**
- **JWT (JSON Web Token)**

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- Cloudinary Account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/backend-project.git
cd backend-project

2. Install Dependencies
npm install

3. Create a `.env` file in the root directory and add the following environment variables:
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

Running the project:
npm start
The server will start on `http://localhost:PORT`

API Endpoints

Auth
- POST /api/auth/register: Register a new user
- POST /api/auth/login: Login a user
- POST /api/auth/logout: Logout a user

Users
- GET /api/users/:id: Get user details
- PUT /api/users/:id: Update user details
- DELETE /api/users/:id: Delete a user

Comments
- POST /api/comments: Add a comment
- GET /api/comments/:id: Get comments for a specific post
- DELETE /api/comments/:id: Delete a comment

Tweets
- POST /api/tweets: Add a tweet
- GET /api/tweets/:id: Get tweets for a specific user
- DELETE /api/tweets/:id: Delete a tweet

Videos
- POST /api/videos: Upload a video
- GET /api/videos/:id: Get videos for a specific user
- DELETE /api/videos/:id: Delete a video

Subscriptions
- POST /api/subscriptions: Subscribe to a user
- DELETE /api/subscriptions/:id: Unsubscribe from a user

Subscriber Management
- GET /api/subscribers/:id: Get subscribers for a specific user


### Project Structure
backend-project/
│
├── controllers/
│   ├── userController.js
|
├── models/
│   ├── user.model.js
│   ├── comment.model.js
│   ├── like.model.js
│   ├── video.model.js
│   ├── subscription.model.js
│   └── tweet.model.js
|   └── playlist.model.js
│
├── routes/
│   ├── authRoutes.js
│   ├── commentRoutes.js
│   ├── tweetRoutes.js
│   ├── userRoutes.js
│   ├── videoRoutes.js
│   ├── subscriptionRoutes.js
│   └── subscriberRoutes.js
│
├── middleware/
│   ├── auth.middleware.js
│   └── multer.middleware.js
│
├── .env
├── .gitignore
├── package.json
└── README.md

