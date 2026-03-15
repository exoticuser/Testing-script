const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(path.join(dataDir, 'database.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS movies (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT DEFAULT 'movie',
    imdb_id TEXT,
    year TEXT,
    rating TEXT,
    plot TEXT,
    poster TEXT,
    backdrop TEXT,
    screenshots TEXT,
    cast TEXT,
    genres TEXT,
    download_links TEXT,
    featured INTEGER DEFAULT 0,
    trending INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed admin user
const adminUser = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
if (!adminUser) {
  const { v4: uuidv4 } = require('uuid');
  const passwordHash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)').run(
    uuidv4(), 'admin', passwordHash, 'admin'
  );
  console.log('Default admin user created');
}

// Seed some sample movies
const movieCount = db.prepare('SELECT COUNT(*) as count FROM movies').get();
if (movieCount.count === 0) {
  const { v4: uuidv4 } = require('uuid');
  const sampleMovies = [
    {
      id: uuidv4(),
      title: 'The Dark Knight',
      type: 'movie',
      imdb_id: 'tt0468569',
      year: '2008',
      rating: '9.0',
      plot: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
      poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
      backdrop: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
      screenshots: JSON.stringify([]),
      cast: 'Christian Bale, Heath Ledger, Aaron Eckhart, Michael Caine',
      genres: JSON.stringify(['Action', 'Crime', 'Drama']),
      download_links: JSON.stringify([
        { quality: '480p', url: '#', size: '700MB' },
        { quality: '720p', url: '#', size: '1.2GB' },
        { quality: '1080p', url: '#', size: '2.5GB' }
      ]),
      featured: 1,
      trending: 1
    },
    {
      id: uuidv4(),
      title: 'Inception',
      type: 'movie',
      imdb_id: 'tt1375666',
      year: '2010',
      rating: '8.8',
      plot: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
      poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
      backdrop: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
      screenshots: JSON.stringify([]),
      cast: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page, Tom Hardy',
      genres: JSON.stringify(['Action', 'Adventure', 'Sci-Fi']),
      download_links: JSON.stringify([
        { quality: '480p', url: '#', size: '750MB' },
        { quality: '720p', url: '#', size: '1.3GB' },
        { quality: '1080p', url: '#', size: '2.8GB' }
      ]),
      featured: 1,
      trending: 1
    },
    {
      id: uuidv4(),
      title: 'Breaking Bad',
      type: 'tv',
      imdb_id: 'tt0903747',
      year: '2008',
      rating: '9.5',
      plot: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family\'s future.',
      poster: 'https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDdmLWJjOTUtYjc2OGY3ZjdiMTk3XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_SX300.jpg',
      backdrop: 'https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDdmLWJjOTUtYjc2OGY3ZjdiMTk3XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_SX300.jpg',
      screenshots: JSON.stringify([]),
      cast: 'Bryan Cranston, Aaron Paul, Anna Gunn, Betsy Brandt',
      genres: JSON.stringify(['Crime', 'Drama', 'Thriller']),
      download_links: JSON.stringify([
        { quality: '480p', url: '#', size: '300MB' },
        { quality: '720p', url: '#', size: '600MB' },
        { quality: '1080p', url: '#', size: '1.2GB' }
      ]),
      featured: 1,
      trending: 1
    },
    {
      id: uuidv4(),
      title: 'Interstellar',
      type: 'movie',
      imdb_id: 'tt0816692',
      year: '2014',
      rating: '8.7',
      plot: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
      poster: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
      backdrop: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
      screenshots: JSON.stringify([]),
      cast: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain, Michael Caine',
      genres: JSON.stringify(['Adventure', 'Drama', 'Sci-Fi']),
      download_links: JSON.stringify([
        { quality: '480p', url: '#', size: '800MB' },
        { quality: '720p', url: '#', size: '1.5GB' },
        { quality: '1080p', url: '#', size: '3.0GB' }
      ]),
      featured: 0,
      trending: 1
    },
    {
      id: uuidv4(),
      title: 'Game of Thrones',
      type: 'tv',
      imdb_id: 'tt0944947',
      year: '2011',
      rating: '9.2',
      plot: 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.',
      poster: 'https://m.media-amazon.com/images/M/MV5BYTRiNDQwYzAtMzVlZS00NTI5LWJjYjUtMzkwNTUzMWMxZTllXkEyXkFqcGdeQXVyNDIzMzcwNjc@._V1_SX300.jpg',
      backdrop: 'https://m.media-amazon.com/images/M/MV5BYTRiNDQwYzAtMzVlZS00NTI5LWJjYjUtMzkwNTUzMWMxZTllXkEyXkFqcGdeQXVyNDIzMzcwNjc@._V1_SX300.jpg',
      screenshots: JSON.stringify([]),
      cast: 'Emilia Clarke, Peter Dinklage, Kit Harington, Lena Headey',
      genres: JSON.stringify(['Action', 'Adventure', 'Drama']),
      download_links: JSON.stringify([
        { quality: '480p', url: '#', size: '350MB' },
        { quality: '720p', url: '#', size: '700MB' },
        { quality: '1080p', url: '#', size: '1.4GB' }
      ]),
      featured: 0,
      trending: 1
    }
  ];

  const insertMovie = db.prepare(`
    INSERT INTO movies (id, title, type, imdb_id, year, rating, plot, poster, backdrop, screenshots, cast, genres, download_links, featured, trending)
    VALUES (@id, @title, @type, @imdb_id, @year, @rating, @plot, @poster, @backdrop, @screenshots, @cast, @genres, @download_links, @featured, @trending)
  `);

  for (const movie of sampleMovies) {
    insertMovie.run(movie);
  }
  console.log('Sample movies seeded');
}

module.exports = db;
