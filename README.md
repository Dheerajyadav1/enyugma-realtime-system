# Enyugma Real-Time Registration System

A real-time registration system for event stalls where people can register as volunteers, mentors, or donors. The system displays welcome messages and statistics on a connected screen in real-time.

## Features

- 📝 Registration form for volunteers, mentors, and donors
- 📊 Real-time dashboard with statistics (mentor/volunteer/donor counts)
- 🎉 Welcome messages displayed automatically when someone registers
- 🔄 WebSocket-based real-time updates
- 🎨 Modern, responsive UI

## Prerequisites

- **Docker & Docker Compose** (recommended), OR
- **Python 3.11+** and **Node.js 18+** (for local development)
- **PostgreSQL** (if running locally without Docker)

## Quick Start with Docker (Recommended)

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Start the services:**
   ```bash
   docker-compose up -d
   ```
   This will start:
   - PostgreSQL database on port 5432
   - FastAPI backend on port 8000

3. **Navigate to the frontend directory:**
   ```bash
   cd ../frontend
   ```

4. **Install frontend dependencies (first time only):**
   ```bash
   npm install
   ```

5. **Start the frontend development server:**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173` (or the port Vite assigns)

6. **Access the application:**
   - **Registration Page:** http://localhost:5173/
   - **Dashboard (Display Screen):** http://localhost:5173/dashboard

## Local Development (Without Docker)

### Backend Setup

1. **Install PostgreSQL** and create a database:
   ```sql
   CREATE DATABASE festdb;
   CREATE USER festuser WITH PASSWORD 'festpass';
   GRANT ALL PRIVILEGES ON DATABASE festdb TO festuser;
   ```

2. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

3. **Create a virtual environment (recommended):**
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Linux/Mac:
   source venv/bin/activate
   ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Update database URL** in `app/database.py`:
   ```python
   DATABASE_URL = "postgresql://festuser:festpass@localhost:5432/festdb"
   ```

6. **Start the backend server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Update API base URL** in `src/api/client.js` if needed:
   ```javascript
   baseURL: "http://localhost:8000"
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## Usage

### Registration Page (`/`)
- Fill out the registration form with:
  - Name, Phone, Email (optional)
  - Role: Mentor, Volunteer, or Donor
  - Address, Gender, Registered By
  - Notes (optional)
- Click "Register" to submit
- The form will reset after successful registration

### Dashboard Page (`/dashboard`)
- Displays real-time statistics:
  - Number of Mentors registered
  - Number of Volunteers registered
  - Number of Donors registered
  - Total registrations
- Shows welcome message when a new registration comes in:
  - "Welcome [Name] to Unnati as [Role]"
- Connection status indicator (green = connected, red = disconnected)

## API Endpoints

- `POST /register/` - Create a new registration
- `GET /register/` - Get all registrations
- `GET /register/statistics` - Get registration statistics
- `WS /ws` - WebSocket endpoint for real-time updates

## Project Structure

```
enyugma-realtime-system/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application
│   │   ├── models.py            # Database models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── crud.py              # Database operations
│   │   ├── database.py          # Database configuration
│   │   ├── websocket_manager.py # WebSocket connection manager
│   │   └── routes/
│   │       └── registration.py  # Registration endpoints
│   ├── docker-compose.yml       # Docker services
│   ├── Dockerfile              # Backend Docker image
│   └── requirements.txt        # Python dependencies
└── frontend/
    ├── src/
    │   ├── App.jsx              # Main app component with routing
    │   ├── api/
    │   │   └── client.js        # Axios API client
    │   ├── components/
    │   │   └── RegistrationForm.jsx
    │   └── pages/
    │       ├── Dashboard.jsx    # Display screen
    │       └── RegistrationForm.jsx
    ├── package.json
    └── vite.config.js
```

## Troubleshooting

### Backend Issues

- **Database connection error:** Make sure PostgreSQL is running and credentials match
- **Port 8000 already in use:** Change the port in `uvicorn` command or docker-compose.yml
- **CORS errors:** CORS is configured to allow all origins. For production, update `app/main.py`

### Frontend Issues

- **WebSocket connection fails:** 
  - Check if backend is running on port 8000
  - Verify CORS is enabled in backend
  - Check browser console for errors
- **API calls fail:** 
  - Verify backend is running
  - Check `src/api/client.js` baseURL matches backend URL

### Docker Issues

- **Container won't start:** Check logs with `docker-compose logs`
- **Database not accessible:** Wait a few seconds after starting for PostgreSQL to initialize

## Production Deployment

For production deployment:

1. **Update CORS origins** in `backend/app/main.py` to specific domains
2. **Use environment variables** for database credentials
3. **Build frontend:** `cd frontend && npm run build`
4. **Serve frontend** with a web server (nginx, Apache, etc.)
5. **Use a production WSGI server** like Gunicorn for the backend

## License

This project is for event use at Unnati.
