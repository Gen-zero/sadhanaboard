# SaadhanaBoard Project Overview

SaadhanaBoard is a comprehensive spiritual productivity and self-development application designed to help users engage in guided spiritual practices, meditation, and personal growth journeys. Built with modern web technologies, it combines spiritual elements with practical productivity features.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Core Features](#core-features)
5. [Project Structure](#project-structure)
6. [Key Components](#key-components)
7. [Data Management](#data-management)
8. [Authentication System](#authentication-system)
9. [UI/UX Design](#uiux-design)
10. [Spiritual Elements](#spiritual-elements)
11. [Development Setup](#development-setup)
12. [Deployment](#deployment)

## Project Overview

SaadhanaBoard helps users:
- Track spiritual practices (sadhanas)
- Access a library of spiritual books
- Engage in guided meditation
- Visualize spiritual progress
- Connect with their higher self through deity interfaces
- Practice chakra balancing and yantra visualization

## Technology Stack

### Frontend
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **State Management**: React Context API + Custom Hooks
- **UI Components**: Radix UI + shadcn-ui
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Data Fetching**: React Query (@tanstack/react-query)
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **3D Graphics**: react-three/fiber + drei
- **Icons**: Lucide React

### Backend
- **Framework**: Node.js + Express
- **Database**: PostgreSQL
- **Authentication**: JWT-based
- **File Storage**: Local file system
- **API Documentation**: RESTful endpoints

### Development Tools
- **Language**: TypeScript
- **Package Manager**: npm
- **Linting**: ESLint
- **Testing**: (Planned for future implementation)

## Architecture

### Frontend Architecture
- **Component-Based Structure**: Reusable UI components organized by feature
- **Hook-Based Logic**: Custom hooks for business logic and state management
- **Service Layer**: API communication layer
- **Context API**: Application-wide state management
- **Routing**: Declarative routing with React Router

### Backend Architecture
- **MVC Pattern**: Controllers, services, and models
- **RESTful API**: Standard HTTP methods for CRUD operations
- **Middleware**: Authentication and error handling
- **Database Layer**: PostgreSQL with connection pooling

## Core Features

### 1. Sadhana Management
- Create and track spiritual practices
- Daily progress tracking
- Completion and break functionality
- Practice history and statistics

### 2. Spiritual Library
- Book viewer for spiritual texts
- PDF and text-based book support
- Book upload functionality
- Search and categorization by traditions

### 3. Deity Interface
- Higher self connection through deity representations
- Shadow work and light integration
- AI-powered spiritual guidance (Claude AI)
- Meditation guidance

### 4. Chakra Visualization
- Interactive chakra energy display
- Bija mantra information
- Energy flow visualization

### 5. Sacred Geometry
- Sri Yantra and other yantra visualizations
- Interactive rotating yantras
- Multiple yantra types

### 6. Profile Management
- Detailed spiritual profile
- Progress tracking
- Achievements and goals

### 7. Settings
- Theme customization
- Appearance settings
- Meditation preferences
- Privacy controls

## Project Structure

```
saadhanaboard/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── package.json     # Backend dependencies
│   └── server.js        # Entry point
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── deity/       # Deity-related components
│   │   ├── library/     # Library components
│   │   ├── sadhana/     # Sadhana components
│   │   ├── settings/    # Settings components
│   │   └── ui/          # Shared UI components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Core utilities and context
│   ├── pages/           # Page components
│   ├── services/        # API service layer
│   ├── styles/          # CSS and styling files
│   ├── types/           # TypeScript types
│   └── utils/           # Helper functions
├── supabase/            # Database migrations (reference)
├── package.json         # Frontend dependencies
└── vite.config.ts       # Vite configuration
```

## Key Components

### Frontend Components

#### Layout Components
- **Layout.tsx**: Main application layout with sidebar navigation
- **ThemedBackground.tsx**: Dynamic background animations based on themes

#### Dashboard Components
- **Dashboard.tsx**: Main dashboard with progress overview
- **ProfileCard.tsx**: User profile summary

#### Sadhana Components
- **SaadhanaBoard.tsx**: Main sadhana interface
- **ManifestationForm.tsx**: Form for creating new sadhanas
- **SadhanaContent.tsx**: Content display for sadhanas

#### Library Components
- **SpiritualLibrary.tsx**: Main library interface
- **BookViewer.tsx**: Book reading interface
- **BookShelf.tsx**: Book display component

#### Spiritual Components
- **DeityInterface.tsx**: Deity connection interface
- **ChakraVisualization.tsx**: Chakra energy visualization
- **SacredYantra.tsx**: Sacred geometry visualization
- **ShadowSelfMonitor.tsx**: Shadow work tracking

#### Settings Components
- **Settings.tsx**: Main settings interface
- **GeneralSettings.tsx**: General application settings
- **AppearanceSettings.tsx**: Visual appearance settings

### Backend Components

#### Controllers
- **authController.js**: Authentication endpoints
- **bookController.js**: Book management endpoints
- **profileController.js**: Profile management endpoints
- **sadhanaController.js**: Sadhana management endpoints
- **settingsController.js**: Settings management endpoints

#### Services
- **authService.js**: Authentication business logic
- **bookService.js**: Book business logic
- **profileService.js**: Profile business logic
- **sadhanaService.js**: Sadhana business logic

#### Models
- **User.js**: User data model
- **Profile.js**: Profile data model

## Data Management

### Frontend Data Management
- **React Query**: Server state management
- **LocalStorage**: Client-side data persistence
- **Context API**: Application state sharing

### Backend Data Management
- **PostgreSQL**: Primary database
- **Connection Pooling**: Efficient database connections
- **Data Models**: Structured data representation
- **Services Layer**: Business logic separation

### Database Schema
Key tables include:
- **users**: User accounts
- **profiles**: Detailed user profiles
- **sadhanas**: User-created spiritual practices
- **sadhana_progress**: Daily progress tracking
- **spiritual_books**: Library of spiritual texts

## Authentication System

### JWT-Based Authentication
- **Registration**: User signup with email and password
- **Login**: JWT token generation
- **Protected Routes**: Middleware for authentication verification
- **Token Storage**: localStorage for client-side token storage

### Security Features
- **Password Hashing**: bcrypt for secure password storage
- **Token Expiration**: 7-day token validity
- **Protected Endpoints**: Authentication middleware
- **Role-Based Access**: (Planned for future implementation)

## UI/UX Design

### Design Principles
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliance considerations
- **Performance**: Optimized rendering and loading
- **Consistency**: Unified design language

### UI Components
- **Cards**: Content containers with consistent styling
- **Buttons**: Interactive elements with hover effects
- **Forms**: Input validation and user feedback
- **Navigation**: Intuitive sidebar and routing

### Animations
- **Framer Motion**: Smooth page transitions
- **CSS Animations**: Custom spiritual animations
- **3D Visualizations**: Interactive deity interfaces
- **Background Effects**: Themed particle systems

## Spiritual Elements

### Hindu-Inspired Features
- **Deity Representations**: Theme-specific deity icons
- **Sacred Geometry**: Yantra visualizations
- **Chakra System**: Energy center visualization
- **Bija Mantras**: Seed syllable information
- **Spiritual Themes**: Earth, Water, Fire, Air, Cosmic

### Sound System
- **Divine Sounds**: UI interaction sounds
- **Ambient Background**: Spiritual atmosphere
- **Meditation Audio**: Guided practice sounds

### Visual Elements
- **Lotus Petals**: Floating background animations
- **Mandala Patterns**: Sacred geometric backgrounds
- **Ambient Mantras**: Sanskrit text displays
- **Themed Color Schemes**: Element-specific palettes

## Development Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- npm or yarn package manager

### Installation Steps

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd saadhanaboard
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   npm run backend:install
   ```

4. **Database Setup**
   - Create PostgreSQL database named `saadhanaboard`
   - Update database configuration in `backend/.env`
   - Run database initialization:
     ```bash
     node backend/utils/initDb.js
     ```

5. **Environment Variables**
   Create a `.env` file in the backend directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=saadhanaboard
   DB_USER=your_postgres_username
   DB_PASSWORD=your_postgres_password

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key

   # Server Configuration
   PORT=3001
   ```

### Development Commands

- **Frontend Development Server**
  ```bash
  npm run dev
  ```
  Runs on http://localhost:5173

- **Backend Development Server**
  ```bash
  npm run backend:dev
  ```
  Runs on http://localhost:3001

- **Build for Production**
  ```bash
  npm run build
  ```

- **Preview Production Build**
  ```bash
  npm run preview
  ```

## Deployment

### Production Build
1. Build the frontend:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run preview
   ```

### Server Deployment
- **Backend API**: Runs on port 3001
- **Frontend**: Static files served by backend
- **Database**: PostgreSQL connection required
- **Environment**: Production environment variables

### Hosting Options
- **Self-Hosted**: VPS or dedicated server
- **Cloud Platforms**: AWS, Google Cloud, Azure
- **Container Deployment**: Docker support (planned)
- **Static Hosting**: Frontend files on CDN (with backend API)

## Future Enhancements

### Planned Features
- **Community Features**: User connections and sharing
- **Advanced Analytics**: Detailed progress insights
- **Mobile Application**: Native mobile app (React Native)
- **AI Integration**: Enhanced spiritual guidance
- **Calendar Integration**: Practice scheduling
- **Social Sharing**: Achievement sharing

### Technical Improvements
- **Testing**: Unit and integration tests
- **Performance**: Code splitting and optimization
- **Security**: Enhanced authentication features
- **Documentation**: Comprehensive API documentation
- **Internationalization**: Multi-language support

---

*This document provides a comprehensive overview of the SaadhanaBoard project. For detailed information about specific components or features, please refer to the source code and inline documentation.*