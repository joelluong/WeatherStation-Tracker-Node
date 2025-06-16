# Backend API

A simple Express.js backend with PostgreSQL database connection.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Update the `.env` file with your PostgreSQL database credentials.

4. Run the development server:
   ```bash
   npm run dev
   ```

   Or for production:
   ```bash
   npm start
   ```

## API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/users` - Get all users (limited to 10)
- `GET /api/users/:id` - Get user by ID

## Project Structure

```
backend/
├── config/
│   └── database.js     # Database configuration
├── routes/
│   ├── health.js       # Health check routes
│   └── users.js        # User routes
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore file
├── index.js            # Main application file
├── package.json        # NPM dependencies
└── README.md           # This file
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port (default: 5432)
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password