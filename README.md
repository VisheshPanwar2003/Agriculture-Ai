# 🌱 AgriSense AI – Smart Agriculture Assistant     [🚀 Live Demo](https://agriculture-ai-frontend.vercel.app/) 


AgriSense AI is an AI-powered agriculture platform designed to help farmers make informed decisions through crop analysis, disease detection, weather insights, agricultural guidance, and intelligent chatbot support.

The platform combines Google's Gemini AI with modern web technologies to provide real-time agricultural assistance through an intuitive user interface.

---

## 🚀 Features

### 🤖 AI Agriculture Chatbot

* Agriculture-specific AI assistant
* Crop management guidance
* Pest and disease recommendations
* Farming best practices
* Fertilizer and irrigation suggestions

### 🌿 Crop Disease Analysis

* Upload crop or plant images
* AI-powered disease detection
* Plant health assessment
* Severity analysis
* Treatment recommendations

### 🌦 Weather Intelligence

* Real-time weather information
* Farming-specific weather insights
* Agricultural recommendations based on weather conditions

### 📅 Agricultural Almanac

* Seasonal farming guidance
* Crop planning support
* Agricultural calendar assistance

### 🔐 Authentication System

* User registration
* Secure login system
* JWT-based authentication
* Personalized user experience

### 📊 Smart Analysis Tools

* Crop health analysis
* Agricultural recommendations
* AI-generated farming insights

---

## 🛠 Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React Router DOM
* Framer Motion

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Express Validator
* Multer (File Uploads)
* CORS
* Dotenv

### AI & Machine Learning

* Google Gemini 2.5 Flash
* Google GenAI SDK
* Sharp (Image Processing)

### Deployment

* Vercel (Frontend)
* Vercel (Backend)
* GitHub

---

## 📁 Project Structure

```bash
AgriSense-AI/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── models/
│   │   ├── config/
│   │   ├── utils/
│   │   └── app.js
│   │
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── vercel.json
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/your-username/agrisense-ai.git

cd agrisense-ai
```

---

### Backend Setup

```bash
cd backend

npm install
```

### Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key

WEATHER_API_KEY=your_weather_api_key
```

### Run Backend

Development Mode:

```bash
npm run dev
```

Production Mode:

```bash
npm start
```

Backend URL:

```text
http://localhost:5000
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

## 📡 API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```

### Chatbot

```http
POST /api/chatbot
```

### Vision Analysis

```http
POST /api/vision/analyze
```

### Weather

```http
GET /api/weather
```

### Almanac

```http
GET /api/almanac
```

### Smart Analysis

```http
POST /api/analysis
```

---

## 📸 Vision AI Workflow

1. Upload crop image
2. Image processed using Multer + Sharp
3. Gemini Vision analyzes the image
4. Detects diseases and plant issues
5. Provides severity assessment
6. Generates treatment recommendations

---

## 🔒 Security

* JWT Authentication
* Password hashing using bcryptjs
* Environment variables for API keys
* Secure Express middleware
* CORS protection
* Sensitive credentials excluded using `.gitignore`

---

## 🌍 Future Enhancements

* Multi-language support
* Voice-enabled farming assistant
* Crop yield prediction
* Market price forecasting
* Farm management dashboard
* Mobile application
* IoT sensor integration

---

## 👨‍💻 Author

**Vishesh Panwar**

AI & Full Stack Developer

---

## 📜 License

This project is developed for educational, research, and portfolio purposes.
