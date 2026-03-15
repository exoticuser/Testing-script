# StreamFlix

A full-stack streaming website for movies and TV shows with admin panel, built with Next.js and Express.

## Features

- 🎬 Browse movies and TV shows
- 🔍 Search functionality with filters
- 🌟 Featured and trending content
- 📱 Responsive design with Tailwind CSS
- 👤 Admin authentication and dashboard
- ✏️ Add, edit, and delete content (admin)
- 🎭 Category management
- 📊 Movie ratings and details
- 🖼️ Image galleries and backdrops
- 💾 SQLite database

## Technology Stack

### Frontend
- **Framework:** Next.js 15.5.12
- **UI Library:** React 18
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Icons:** React Icons

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite (better-sqlite3)
- **Authentication:** JWT + bcrypt
- **File Upload:** Multer

## Project Structure

```
streamflix/
├── frontend/          # Next.js frontend application
│   ├── pages/        # Next.js pages
│   ├── components/   # React components
│   ├── styles/       # CSS styles
│   └── public/       # Static assets
├── backend/          # Express.js backend API
│   ├── src/
│   │   ├── index.js  # Server entry point
│   │   ├── routes/   # API routes
│   │   ├── db/       # Database setup
│   │   └── middleware/ # Express middleware
│   └── data/         # SQLite database files
└── package.json      # Root package file
```

## Local Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/exoticuser/Testing-script.git
cd Testing-script
```

2. Install dependencies for both frontend and backend:
```bash
npm run install:all
```

Or install separately:
```bash
cd backend && npm install
cd ../frontend && npm install
```

3. Configure backend environment variables:
```bash
cd backend
cp .env.example .env
```

Edit `.env` and update the following:
```env
PORT=5000
JWT_SECRET=your_strong_secret_here_change_in_production
OMDB_API_KEY=your_omdb_api_key
```

Get your OMDb API key at: https://www.omdbapi.com/apikey.aspx

4. Start the backend server:
```bash
npm run backend
# or for development with auto-reload:
cd backend && npm run dev
```

The backend will run on `http://localhost:5000`

5. Start the frontend (in a new terminal):
```bash
npm run frontend
```

The frontend will run on `http://localhost:3000`

### Default Admin Credentials

- **Username:** admin
- **Password:** admin123

**Important:** Change these credentials in production!

## API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `GET /api/movies` - Get all movies with pagination
- `GET /api/movies/featured` - Get featured movies
- `GET /api/movies/trending` - Get trending movies
- `GET /api/movies/:id` - Get movie by ID
- `GET /api/categories` - Get all categories

### Protected Endpoints (Require JWT)
- `POST /api/auth/login` - Admin login
- `POST /api/movies` - Add new movie
- `PUT /api/movies/:id` - Update movie
- `DELETE /api/movies/:id` - Delete movie
- `POST /api/categories` - Add category
- `DELETE /api/categories/:id` - Delete category

## Deployment

### Deploy to Vercel

Vercel is the recommended platform for deploying this application as it's optimized for Next.js.

#### Deploying Both Frontend and Backend

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy Backend First:**
```bash
cd backend
vercel
```

Follow the prompts and note your backend URL (e.g., `https://your-backend.vercel.app`)

3. **Configure Backend Environment Variables in Vercel:**

Go to your Vercel project dashboard and add:
- `PORT=5000`
- `JWT_SECRET=your_strong_secret_here`
- `OMDB_API_KEY=your_omdb_api_key`

4. **Deploy Frontend:**
```bash
cd ../frontend
vercel
```

5. **Configure Frontend Environment Variables:**

In Vercel dashboard for frontend project, add:
- `NEXT_PUBLIC_API_URL=https://your-backend.vercel.app`

6. **Redeploy frontend with environment variable:**
```bash
vercel --prod
```

#### Using Vercel Configuration File

A `vercel.json` file is included in the repository for easy deployment. See the configuration section below.

### Deploy to Railway

[Railway](https://railway.app) provides an easy way to deploy full-stack applications.

1. **Sign up at railway.app**

2. **Deploy Backend:**
   - Create new project → Deploy from GitHub
   - Select this repository
   - Set root directory to `backend`
   - Add environment variables:
     - `PORT=5000`
     - `JWT_SECRET=your_strong_secret_here`
     - `OMDB_API_KEY=your_omdb_api_key`
   - Railway will auto-detect Node.js and deploy

3. **Deploy Frontend:**
   - Add new service in same project
   - Select same repository
   - Set root directory to `frontend`
   - Add environment variable:
     - `NEXT_PUBLIC_API_URL=https://your-backend.railway.app`
   - Deploy

### Deploy to Render

[Render](https://render.com) offers free hosting for web services.

1. **Sign up at render.com**

2. **Deploy Backend:**
   - Create new Web Service
   - Connect GitHub repository
   - Configure:
     - Name: `streamflix-backend`
     - Root Directory: `backend`
     - Build Command: `npm install`
     - Start Command: `npm start`
   - Add environment variables:
     - `PORT=5000`
     - `JWT_SECRET=your_strong_secret_here`
     - `OMDB_API_KEY=your_omdb_api_key`
   - Create Web Service

3. **Deploy Frontend:**
   - Create new Web Service
   - Connect GitHub repository
   - Configure:
     - Name: `streamflix-frontend`
     - Root Directory: `frontend`
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`
   - Add environment variable:
     - `NEXT_PUBLIC_API_URL=https://streamflix-backend.onrender.com`
   - Create Web Service

### Deploy to Heroku

1. **Install Heroku CLI:**
```bash
npm install -g heroku
```

2. **Login to Heroku:**
```bash
heroku login
```

3. **Deploy Backend:**
```bash
cd backend
heroku create streamflix-backend
heroku config:set JWT_SECRET=your_strong_secret_here
heroku config:set OMDB_API_KEY=your_omdb_api_key
git subtree push --prefix backend heroku main
```

4. **Deploy Frontend:**
```bash
cd ../frontend
heroku create streamflix-frontend
heroku config:set NEXT_PUBLIC_API_URL=https://streamflix-backend.herokuapp.com
git subtree push --prefix frontend heroku main
```

### Deploy with Docker

#### Docker Compose (Recommended for Production)

1. **Build and run with Docker Compose:**
```bash
docker-compose up -d
```

This will start both frontend and backend services.

#### Manual Docker Deployment

**Backend:**
```bash
cd backend
docker build -t streamflix-backend .
docker run -p 5000:5000 \
  -e JWT_SECRET=your_secret \
  -e OMDB_API_KEY=your_key \
  streamflix-backend
```

**Frontend:**
```bash
cd frontend
docker build -t streamflix-frontend .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://backend:5000 \
  streamflix-frontend
```

### Environment Variables

#### Backend Environment Variables
- `PORT` - Server port (default: 5000)
- `JWT_SECRET` - Secret key for JWT tokens (required)
- `OMDB_API_KEY` - OMDb API key for movie data (optional)

#### Frontend Environment Variables
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:5000)

## Production Considerations

### Security
- Change default admin credentials immediately
- Use strong JWT_SECRET (minimum 32 characters)
- Enable HTTPS in production
- Configure CORS properly for your domain
- Keep dependencies updated

### Database
- SQLite is suitable for small to medium applications
- For larger scale, consider migrating to PostgreSQL or MySQL
- Regular backups of the SQLite database file

### Performance
- Enable Next.js production optimizations
- Use CDN for static assets
- Implement caching strategies
- Consider Redis for session storage

## Troubleshooting

### Frontend can't connect to backend
- Ensure backend is running and accessible
- Check `NEXT_PUBLIC_API_URL` is set correctly
- Verify CORS settings in backend

### Database errors
- Ensure `backend/data` directory exists
- Check file permissions for SQLite database
- Verify better-sqlite3 is installed correctly

### Build errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Next.js cache: `cd frontend && rm -rf .next`
- Check Node.js version compatibility

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing issues for solutions

## Acknowledgments

- Movie data provided by [OMDb API](https://www.omdbapi.com)
- Built with Next.js, React, Express, and SQLite
