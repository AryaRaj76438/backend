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
- Express

### Installation

1. Clone the repository:
-git clone https://github.com/AryaRaj76438/backend.git
cd backend-project 

2. Install Dependencies
`npm install`

3. Create a `.env` file in the root directory and add the following environment variables:
PORT=5000
- MONGO_URI=your_mongodb_uri
- JWT_SECRET=your_jwt_secret
- CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
- CLOUDINARY_API_KEY=your_cloudinary_api_key
- CLOUDINARY_API_SECRET=your_cloudinary_api_secret

Running the project:
- npm start
##### The server will start on [http://localhost:PORT]

## API Endpoints
- [Initial] (http://localhost:8000/api/v1/)
#### Auth
- POST /api/v1/register: Register a new user
- POST /api/auth/login: Login a user
- POST /api/auth/logout: Logout a user

#### Users
- GET /api/v1/users/:id: Get user details
- PUT /api/v1/users/:id: Update user details
- DELETE /api/v1/users/:id: Delete a user

#### Comments
- POST /api/v1/comments: Add a comment
- GET /api/v1/comments/:id: Get comments for a specific post
- DELETE /api/v1/comments/:id: Delete a comment

#### Tweets
- POST /api/v1/tweets: Add a tweet
- GET /api/v1/tweets/:id: Get tweets for a specific user
- DELETE /api/v1/tweets/:id: Delete a tweet

#### Videos
- POST /api/v1/videos: Upload a video
- GET /api/v1/videos/:id: Get videos for a specific user
- DELETE /api/v1/videos/:id: Delete a video

#### Subscriptions
- POST /api/v1/subscriptions: Subscribe to a user
- DELETE /api/v1/subscriptions/:id: Unsubscribe from a user

#### Subscriber Management
- GET /api/v1/subscribers/:id: Get subscribers for a specific user


## Project Structure
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


## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Express](https://expressjs.com/)
- [Multer](https://github.com/expressjs/multer)
- [Cloudinary](https://cloudinary.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/)


