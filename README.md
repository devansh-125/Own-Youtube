# 🎬 Own-Youtube

A full-stack YouTube clone built with the MERN stack (MongoDB, Express.js, React.js, Node.js). This project includes user authentication, video uploading capabilities, and more.

## ✨ Features

* **User Authentication**: Secure user registration and login using JWT (JSON Web Tokens).
* **Password Encryption**: Hashing user passwords with bcrypt for enhanced security.
* **Video Uploads**: Seamless video file uploads to Cloudinary, handled by Multer for server-side processing.
* **Database Management**: MongoDB with Mongoose for robust data modeling and management of users, videos, etc.
* **API Communication**: Axios for making asynchronous HTTP requests from the client to the server.

## 🛠️ Technology Stack

### Backend
* **[Node.js](https://nodejs.org/)**: JavaScript runtime environment.
* **[Express.js](https://expressjs.com/)**: Web application framework for Node.js.
* **[MongoDB](https://www.mongodb.com/)**: NoSQL database for storing data.
* **[Mongoose](https://mongoosejs.com/)**: Object Data Modeling (ODM) library for MongoDB.
* **[JWT (JSON Web Token)](https://jwt.io/)**: For secure user authentication.
* **[Bcrypt](https://www.npmjs.com/package/bcrypt)**: Library for hashing passwords.
* **[Multer](https://github.com/expressjs/multer)**: Middleware for handling `multipart/form-data` (file uploads).
* **[Cloudinary](https://cloudinary.com/)**: Cloud platform for image and video management.

### Frontend
* **[React.js](https://reactjs.org/)**: JavaScript library for building user interfaces.
* **[Axios](https://axios-http.com/)**: Promise-based HTTP client for the browser and Node.js.
* (You can add other frontend libraries like Tailwind CSS, Redux, etc. here)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have the following installed on your machine:
* Node.js (v18.x or higher)
* npm or yarn
* A MongoDB database (you can get a free one from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/devansh-125/Own-Youtube.git](https://github.com/devansh-125/Own-Youtube.git)
    cd Own-Youtube
    ```

2.  **Setup the Backend:**
    ```bash
    cd Backend
    npm install
    ```
    Create a `.env` file in the `Backend` directory and add the following environment variables:
    ```env
    PORT=8000
    MONGODB_URI=your_mongodb_connection_string
    CORS_ORIGIN=*
    ACCESS_TOKEN_SECRET=your_access_token_secret
    REFRESH_TOKEN_SECRET=your_refresh_token_secret
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```

3.  **Setup the Frontend:**
    ```bash
    cd ../Frontend
    npm install
    ```

### Running the Application

1.  **Start the Backend Server:**
    ```bash
    # From the Backend directory
    npm run dev
    ```

2.  **Start the Frontend Development Server:**
    ```bash
    # From the Frontend directory
    npm run dev
    ```

Your application should now be running, with the frontend available at `http://localhost:5173` (or another port specified by Vite/React) and the backend server at `http://localhost:8000`.