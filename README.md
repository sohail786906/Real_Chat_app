**********Real-Time Chat Application**********
A real-time chat application built with Node.js, Express, and React, utilizing MongoDB for data storage and featuring user authentication via Google.

**Table of Contents**
**Features
Technologies Used
Installation
Usage
API Endpoints
Environment Variables
License
Features
User authentication with Google**
**Real-time messaging between users
Group chat functionality
User profiles with customizable settings
Responsive UI built with React
Technologies Used
Frontend: React, Tailwind CSS
Backend: Node.js, Express
Database: MongoDB Atlas**
Authentication: Google OAuth
Real-time Communication: Socket.IO
Installation
**Clone the repository:**
**********git clone https://github.com/sohail786906/Real_Chat_app.git**********
**Navigate to the project directory:**

**cd Real-Chat
Install server dependencies:**

**cd server
npm install
Install client dependencies:**

******cd ../clients******
**npm install**
Create a .env file in both the server and clients directories based on the provided examples and your setup.

**Usage**
**Start the server:**

******cd server******
npm start
Start the client:

******cd ../clients******
npm start
Open your browser and navigate to http://localhost:3000 to access the application.

****API Endpoints****
**Authentication**
**POST /api/auth/login: Login a user
POST /api/auth/logout: Logout a user
POST /api/auth/register: Register a new user**
****Chat****
**GET /api/chat: Get all chats for a user
POST /api/chat: Create a new chat
GET /api/chat/:id: Get chat by ID**
****Messages****
**GET /api/messages/:chatId: Get all messages for a chat
POST /api/messages: Send a new message**
****Environment Variables****
Create a .env file in the server directory with the following variables:

**plaintext**
Copy code
PORT=8000
URL=mongodb+srv://<your-mongodb-username>:<your-mongodb-password>@cluster0.72c5y.mongodb.net/
SECRET=<your-secret>
CLIENT_ID=<your-google-client-id>
BASE_URL=http://localhost:3000
Make sure to replace <your-mongodb-username>, <your-mongodb-password>, <your-secret>, and <your-google-client-id> with your actual values.

License
This project is licensed under the MIT License. See the LICENSE file for details.
