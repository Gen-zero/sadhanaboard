# 🧘‍♀️ SaadhanaBoard 🌟

✨ **SadhanaBoard** is a comprehensive spiritual productivity and mindfulness application designed to help users track their spiritual practices, set intentions, and cultivate deeper awareness through gamified elements and cosmic themes. 🚀

## 📚 Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Theme System](#theme-system)
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Building for Production](#building-for-production)
- [API Documentation](#api-documentation)
- [Admin Panel](#admin-panel)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Features

### 💎 Core Features
- 📈 Track spiritual practices and habits
- 🎯 Set intentions and goals
- 🌌 Cosmic-themed UI with multiple spiritual themes
- 📊 Progress tracking and insights
- 👥 Community features and social sharing
- 🧘 Meditation and mindfulness tools
- 📚 Book reading progress tracking
- 🙏 Group sadhanas and community participation
- 👤 Personal profile management
- ⚙️ Settings customization
- 📈 Analytics and reporting
- 🔔 Real-time notifications
- 🎮 Gamification elements

### 🪔 Spiritual Elements
- **Deity Interfaces**: 🙏 Connect with higher self through deity representations
- **Chakra Visualization**: 🌈 Interactive chakra energy display
- **Sacred Geometry**: ⬣ Sri Yantra and other yantra visualizations
- **Shadow Work**: 🌒 Monitor shadow aspects and light integration
- **Sound System**: 🎵 Divine sounds and ambient background audio
- **Meditation Guidance**: 🤖 AI-powered spiritual guidance

## ⚙️ Technology Stack

### 🖥️ Frontend
- **Framework**: ⚛️ React with TypeScript
- **Build Tool**: ⚡ Vite
- **State Management**: 🔄 React Context API + Custom Hooks
- **UI Components**: 🧩 Radix UI + shadcn-ui
- **Styling**: 🎨 Tailwind CSS
- **Routing**: 🔗 React Router
- **Data Fetching**: 📡 React Query (@tanstack/react-query)
- **Forms**: 📝 React Hook Form + Zod
- **Animations**: 🎬 Framer Motion, Anime.js, GSAP
- **3D Graphics**: 🎮 react-three/fiber + drei
- **Icons**: 🖼️ Lucide React

### 🔧 Backend
- **Framework**: 🟢 Node.js + Express
- **Database**: 🗄️ PostgreSQL
- **Authentication**: 🔐 JWT-based
- **File Storage**: 💾 Local file system
- **Real-time**: ⚡ Socket.IO
- **API Documentation**: 📖 RESTful endpoints

### 🛠️ Development Tools
- **Language**: 📘 TypeScript
- **Package Manager**: 📦 npm
- **Linting**: 🧹 ESLint
- **Testing**: 🧪 Jest (planned for future implementation)

## 🎨 Theme System

🧘‍♀️ SadhanaBoard includes a sophisticated theme system with 17+ spiritual themes:

1. **Default** - 🧼 Clean, minimal theme
2. **Shiva** - ⚡ Cosmic destroyer theme
3. **Mahakali** - 🔱 Powerful goddess theme with animated 3D background
4. **Mystery** - 🌑 Enigmatic dark theme
5. **Earth** - 🌱 Grounding nature theme
6. **Water** - 💧 Flowing aquatic theme
7. **Fire** - 🔥 Energetic flame theme
8. **Bhairava** - ⚔️ Fierce protector theme
9. **Serenity** - ☀️ Peaceful light theme
10. **Ganesha** - 🐘 Remover of obstacles theme
11. **Neon** - ✨ Modern cyber-tech theme with vibrant neon gradients
12. **Lakshmi** - 💰 Golden prosperity theme inspired by Goddess Lakshmi
13. **Mystical Forest** - 🌳 Enchanted woodland theme with nature spirits
14. **Tara** - 💀🌺 Mahavidya theme representing liberation and transformation
15. **Vishnu** - 🌊💙 The Preserver theme with oceanic blue tones
16. **Krishna** - 🎵💚 The Divine Cowherd theme with pastoral green tones
17. **Swamiji** - 🔥🧡 Enlightened masters theme with guru wisdom

### 🔱 Mahakali Theme

The Mahakali theme features a dynamic 3D animated background using Three.js. It requires specific assets to function properly:

- `mahakali-yantra.png` - 🌀 The central yantra texture
- `Skull and Bone Turnaround.gif` - 💀 Theme icon

### 🔄 Theme System Architecture

The theme system is built with the following components:

1. **Theme Registry** - Centralized theme management in `src/themes/index.ts`
2. **Theme Definitions** - Individual theme configurations with metadata, colors, and assets
3. **Theme Provider** - React context provider that applies themes to the application
4. **Theme Utilities** - Helper functions for applying theme colors and CSS
5. **Appearance Settings** - UI component for theme selection and customization

#### Theme Application Process

When a user selects a theme:
1. The ThemeProvider detects the change via useEffect
2. Theme colors are applied as CSS custom properties to the document root
3. Optional theme-specific CSS files are loaded
4. The page automatically reloads to ensure complete theme application
5. A loading indicator is shown during the reload process

#### Theme Structure

Each theme consists of:
- `metadata` - Theme information (id, name, description, deity, category)
- `colors` - Color definitions for all UI elements
- `assets` (optional) - Paths to theme assets (icons, backgrounds, CSS)
- `BackgroundComponent` (optional) - React component for animated backgrounds
- `available` - Whether the theme is available for use
- `createdAt` - Theme creation date

### 📦 Theme Asset Management

Theme assets are managed through a series of npm scripts:

```bash
# Ensure all theme assets are in place
npm run themes:ensure-assets

# Generate theme manifest
npm run themes:generate

# Copy theme icons from root icons/ directory
npm run themes:copy-icons

# Move and optimize assets
npm run assets:move

# Run all setup scripts (used in dev and build)
npm run dev:setup
```

### ❓ Troubleshooting Theme Issues

1. **Missing public/icons directory**: 📁 The `themes:ensure-assets` script will create this directory if missing.

2. **Mahakali theme background not rendering**: 
   - Check that `public/icons/mahakali-yantra.png` exists and is a valid image file
   - Run `npm run dev:setup` to ensure assets are properly copied
   - The system will use a procedural fallback if the texture fails to load

3. **Theme icons not loading**:
   - Run `npm run themes:copy-icons` to copy icons from the root `icons/` directory
   - Check that the source icons exist in the `icons/` directory

4. **Theme switching issues**:
   - Verify that all themes are properly registered in `src/themes/index.ts`
   - Check browser console for theme-related errors

## 📁 Project Structure

```
saadhanaboard/
├── backend/
│   ├── config/          # ⚙️ Database configuration
│   ├── controllers/     # 🎮 Request handlers
│   ├── middleware/      # 🔧 Express middleware
│   ├── models/          # 🗄️ Data models
│   ├── routes/          # 🔗 API routes
│   ├── services/        # 🏭 Business logic
│   ├── utils/           # 🛠️ Utility functions
│   ├── package.json     # 📦 Backend dependencies
│   └── server.js        # 🚀 Entry point
├── public/              # 🌐 Static assets
├── src/
│   ├── components/      # 🧩 React components
│   │   ├── deity/       # 🙏 Deity-related components
│   │   ├── library/     # 📚 Library components
│   │   ├── sadhana/     # 🙏 Sadhana components
│   │   ├── settings/    # ⚙️ Settings components
│   │   └── ui/          # 🎨 Shared UI components
│   ├── hooks/           # 🎣 Custom React hooks
│   ├── lib/             # 📚 Core utilities and context
│   ├── pages/           # 📄 Page components
│   ├── services/        # 📡 API service layer
│   ├── styles/          # 🎨 CSS and styling files
│   ├── themes/          # 🎨 Theme configurations
│   ├── types/           # 📝 TypeScript types
│   └── utils/           # 🛠️ Helper functions
├── supabase/            # 🗄️ Database migrations (reference)
├── package.json         # 📦 Frontend dependencies
└── vite.config.ts       # ⚙️ Vite configuration
```

## 💻 Development Setup

### 📋 Prerequisites
- 🟢 Node.js (v18+)
- 🗄️ PostgreSQL database
- 📦 npm package manager

### 🚀 Installation Steps

1. **Clone Repository** 📥
   ```bash
   git clone <repository-url>
   cd saadhanaboard
   ```

2. **Install Dependencies** 📦
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   npm run backend:install
   ```

## 🌍 Environment Variables

### 🖥️ Frontend (.env)
Create a `.env` file in the root directory:
```
# API Configuration
VITE_API_BASE_URL=http://localhost:3004/api

# Socket base URL (use http(s) here; debug tooling or the app may convert to ws:// when needed)
VITE_SOCKET_BASE_URL=http://localhost:3004

# When true, the frontend will include credentials (cookies) on requests
VITE_API_USE_CREDENTIALS=true

# Admin Configuration
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password

# Development Configuration
VITE_DEV_MODE=true

# WebSocket reconnection strategy
VITE_WS_RECONNECT_ATTEMPTS=5
VITE_WS_RECONNECT_DELAY=1000

# Feature-specific debug flags
VITE_DEBUG_API=false
VITE_DEBUG_AUTH=false

# Notes:
# - Do NOT commit real secrets to source control. Replace values with CI/secret-managed values for production.
# - If your backend runs on a different port, update VITE_API_BASE_URL and VITE_SOCKET_BASE_URL accordingly.
```

### 🔧 Backend (.env)
Create a `.env` file in the `backend/` directory:
```env
# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=saadhanaboard
DB_PASSWORD=your_password_here
DB_PORT=5432

# Alternative: Direct Database URL
# DATABASE_URL=postgresql://user:password@host:port/database

# JWT Configuration
JWT_SECRET=your_jwt_secret_here

# Server Configuration
PORT=3004
BACKEND_URL=http://localhost:3004

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Admin Authentication Configuration
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@saadhanaboard.com
ADMIN_PASSWORD=your_secure_admin_password_here
ADMIN_FORCE_UPDATE=0

# Demo Admin Configuration (for testing)
DEMO_ADMIN_EMAIL=kali@example.com

# Admin JWT Configuration
ADMIN_TOKEN_EXPIRES_IN=7d

# Polling Intervals (in milliseconds)
DASHBOARD_POLL_MS=15000
BI_POLL_MS=20000
SYSTEM_METRICS_POLL_MS=5000

# SSL Configuration (for production)
PGSSL=false

# Notes:
# - Do NOT commit real secrets to source control. Replace values with CI/secret-managed values for production.
```

## 🗄️ Database Setup

1. **Create PostgreSQL Database** 🆕
   ```sql
   CREATE DATABASE saadhanaboard;
   ```

2. **Run Database Initialization** 🏗️
   ```bash
   cd backend
   node utils/initDb.js
   ```

## ▶️ Running the Application

### 🧪 Development Mode
Start both frontend and backend servers:

```bash
# Terminal 1: Start frontend development server
npm run dev

# Terminal 2: Start backend development server
npm run backend:dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3004/api
- Backend WebSocket: http://localhost:3004

### 🏭 Production Build
```bash
# Build frontend
npm run build

# Start backend server
npm start
```

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 📖 Documentation

- [API Documentation](backend/API_DOCUMENTATION.md)
- [Theme System](THEME_SYSTEM_SUMMARY.md)
- [Deployment Guide](DEPLOYMENT.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape Saadhanaboard
- Inspired by the rich traditions of Hindu and Buddhist spiritual practices
- Built with modern web technologies for the best user experience

# Sadhanaboard - A Spiritual Productivity Application

Saadhanaboard is a comprehensive spiritual productivity application designed to help users track their spiritual practices, manage spiritual resources, and connect with a community of like-minded practitioners.

## 🚀 Features

- 📓 Sadhana Tracking: Track daily spiritual practices with customizable templates
- 📚 Spiritual Library: Manage spiritual books, notes, and reading progress
- 👥 Community: Connect with other practitioners and share experiences
- 📊 Analytics: Visualize progress and insights into spiritual journey
- 🎨 Themes: 17+ beautiful spiritual themes for personalized experience
- 📱 Responsive: Works on all devices from mobile to desktop
- 🔒 Secure: JWT-based authentication with role-based access control

## 💻 Development Setup

### 📋 Prerequisites
- 🟢 Node.js (v18+)
- 🗄️ PostgreSQL database
- 📦 npm package manager

### 🚀 Installation Steps

1. **Clone Repository** 📥
   ```bash
   git clone <repository-url>
   cd saadhanaboard
   ```

2. **Install Dependencies** 📦
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   npm run backend:install
   ```

## 🌍 Environment Variables

### 🖥️ Frontend (.env)
Create a `.env` file in the root directory:
```
# API Configuration
VITE_API_BASE_URL=http://localhost:3004/api

# Socket base URL (use http(s) here; debug tooling or the app may convert to ws:// when needed)
VITE_SOCKET_BASE_URL=http://localhost:3004

# When true, the frontend will include credentials (cookies) on requests
VITE_API_USE_CREDENTIALS=true

# Admin Configuration
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password

# Development Configuration
VITE_DEV_MODE=true

# WebSocket reconnection strategy
VITE_WS_RECONNECT_ATTEMPTS=5
VITE_WS_RECONNECT_DELAY=1000

# Feature-specific debug flags
VITE_DEBUG_API=false
VITE_DEBUG_AUTH=false

# Notes:
# - Do NOT commit real secrets to source control. Replace values with CI/secret-managed values for production.
# - If your backend runs on a different port, update VITE_API_BASE_URL and VITE_SOCKET_BASE_URL accordingly.
```

### 🔧 Backend (.env)
Create a `.env` file in the `backend/` directory:
```env
# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=saadhanaboard
DB_PASSWORD=your_password_here
DB_PORT=5432

# Alternative: Direct Database URL
# DATABASE_URL=postgresql://user:password@host:port/database

# JWT Configuration
JWT_SECRET=your_jwt_secret_here

# Server Configuration
PORT=3004
BACKEND_URL=http://localhost:3004

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Admin Authentication Configuration
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@saadhanaboard.com
ADMIN_PASSWORD=your_secure_admin_password_here
ADMIN_FORCE_UPDATE=0

# Demo Admin Configuration (for testing)
DEMO_ADMIN_EMAIL=kali@example.com

# Admin JWT Configuration
ADMIN_TOKEN_EXPIRES_IN=7d

# Polling Intervals (in milliseconds)
DASHBOARD_POLL_MS=15000
BI_POLL_MS=20000
SYSTEM_METRICS_POLL_MS=5000

# SSL Configuration (for production)
PGSSL=false

# Notes:
# - Do NOT commit real secrets to source control. Replace values with CI/secret-managed values for production.
```

## 🗄️ Database Setup

1. **Create PostgreSQL Database** 🆕
   ```sql
   CREATE DATABASE saadhanaboard;
   ```

2. **Run Database Initialization** 🏗️
   ```bash
   cd backend
   node utils/initDb.js
   ```

## ▶️ Running the Application

### 🧪 Development Mode
Start both frontend and backend servers:

```bash
# Terminal 1: Start frontend development server
npm run dev

# Terminal 2: Start backend development server
npm run backend:dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3004/api
- Backend WebSocket: http://localhost:3004

### 🏭 Production Build
```bash
# Build frontend
npm run build

# Start backend server
npm start
```

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 📖 Documentation

- [API Documentation](backend/API_DOCUMENTATION.md)
- [Theme System](THEME_SYSTEM_SUMMARY.md)
- [Deployment Guide](DEPLOYMENT.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape Saadhanaboard
- Inspired by the rich traditions of Hindu and Buddhist spiritual practices
- Built with modern web technologies for the best user experience
