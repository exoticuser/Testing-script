const express = require('express');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

function getMockData(title) {
  return {
    title: title || 'Unknown Title',
    type: 'movie',
    imdb_id: '',
    year: '2024',
    rating: 'N/A',
    plot: 'No plot available for this title.',
    poster: 'https://via.placeholder.com/300x450/1a1a2e/ffffff?text=' + encodeURIComponent(title || 'Movie'),
    backdrop: 'https://via.placeholder.com/1280x720/1a1a2e/ffffff?text=' + encodeURIComponent(title || 'Movie'),
    cast: '',
    genres: []
  };
}

router.get('/', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const type = req.query.type;
    const genre = req.query.genre;
    const search = req.query.search;

    let query = 'SELECT * FROM movies WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM movies WHERE 1=1';
    const params = [];
    const countParams = [];

    if (type) {
      query += ' AND type = ?';
      countQuery += ' AND type = ?';
      params.push(type);
      countParams.push(type);
    }
    if (search) {
      query += ' AND (title LIKE ? OR "cast" LIKE ? OR genres LIKE ?)';
      countQuery += ' AND (title LIKE ? OR "cast" LIKE ? OR genres LIKE ?)';
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
      countParams.push(searchParam, searchParam, searchParam);
    }
    if (genre) {
      query += ' AND genres LIKE ?';
      countQuery += ' AND genres LIKE ?';
      params.push(`%${genre}%`);
      countParams.push(`%${genre}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const movies = db.prepare(query).all(...params);
    const { total } = db.prepare(countQuery).get(...countParams);

    const parsedMovies = movies.map(m => ({
      ...m,
      genres: safeJsonParse(m.genres, []),
      download_links: safeJsonParse(m.download_links, []),
      screenshots: safeJsonParse(m.screenshots, [])
    }));

    res.json({
      movies: parsedMovies,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

router.get('/featured', (req, res) => {
  try {
    const movies = db.prepare('SELECT * FROM movies WHERE featured = 1 ORDER BY created_at DESC LIMIT 5').all();
    res.json(movies.map(m => ({
      ...m,
      genres: safeJsonParse(m.genres, []),
      download_links: safeJsonParse(m.download_links, []),
      screenshots: safeJsonParse(m.screenshots, [])
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch featured movies' });
  }
});

router.get('/trending', (req, res) => {
  try {
    const movies = db.prepare('SELECT * FROM movies WHERE trending = 1 ORDER BY created_at DESC LIMIT 10').all();
    res.json(movies.map(m => ({
      ...m,
      genres: safeJsonParse(m.genres, []),
      download_links: safeJsonParse(m.download_links, []),
      screenshots: safeJsonParse(m.screenshots, [])
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch trending movies' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const movie = db.prepare('SELECT * FROM movies WHERE id = ?').get(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json({
      ...movie,
      genres: safeJsonParse(movie.genres, []),
      download_links: safeJsonParse(movie.download_links, []),
      screenshots: safeJsonParse(movie.screenshots, [])
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch movie' });
  }
});

router.post('/fetch-imdb', authenticateToken, async (req, res) => {
  try {
    const { title, imdb_id } = req.body;
    let url;
    if (imdb_id) {
      const sanitizedId = String(imdb_id).replace(/[^a-zA-Z0-9]/g, '');
      url = `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY || 'trilogy'}&i=${sanitizedId}`;
    } else if (title) {
      url = `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY || 'trilogy'}&t=${encodeURIComponent(title)}`;
    } else {
      return res.status(400).json({ error: 'Title or IMDb ID required' });
    }

    let data;
    try {
      const response = await axios.get(url, { timeout: 5000 });
      data = response.data;
    } catch (apiError) {
      return res.json(getMockData(title));
    }

    if (data.Response === 'False' || !data.Title) {
      return res.json(getMockData(title));
    }

    const genres = data.Genre ? data.Genre.split(', ') : [];
    res.json({
      title: data.Title,
      type: data.Type === 'series' ? 'tv' : 'movie',
      imdb_id: data.imdbID,
      year: data.Year,
      rating: data.imdbRating,
      plot: data.Plot,
      poster: data.Poster !== 'N/A' ? data.Poster : 'https://via.placeholder.com/300x450/1a1a2e/ffffff?text=' + encodeURIComponent(data.Title),
      backdrop: data.Poster !== 'N/A' ? data.Poster : 'https://via.placeholder.com/1280x720/1a1a2e/ffffff?text=' + encodeURIComponent(data.Title),
      cast: data.Actors,
      genres
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch IMDb data' });
  }
});

router.post('/', authenticateToken, (req, res) => {
  try {
    const { title, type, imdb_id, year, rating, plot, poster, backdrop, cast, genres, download_links, screenshots, featured, trending } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const id = uuidv4();
    db.prepare(`
      INSERT INTO movies (id, title, type, imdb_id, year, rating, plot, poster, backdrop, screenshots, cast, genres, download_links, featured, trending)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, title, type || 'movie', imdb_id || '', year || '', rating || '',
      plot || '', poster || '', backdrop || '',
      JSON.stringify(screenshots || []),
      cast || '',
      JSON.stringify(genres || []),
      JSON.stringify(download_links || []),
      featured ? 1 : 0,
      trending ? 1 : 0
    );
    const movie = db.prepare('SELECT * FROM movies WHERE id = ?').get(id);
    res.status(201).json({
      ...movie,
      genres: safeJsonParse(movie.genres, []),
      download_links: safeJsonParse(movie.download_links, []),
      screenshots: safeJsonParse(movie.screenshots, [])
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create movie' });
  }
});

router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { title, type, imdb_id, year, rating, plot, poster, backdrop, cast, genres, download_links, screenshots, featured, trending } = req.body;
    const existing = db.prepare('SELECT * FROM movies WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    db.prepare(`
      UPDATE movies SET title=?, type=?, imdb_id=?, year=?, rating=?, plot=?, poster=?, backdrop=?, screenshots=?, cast=?, genres=?, download_links=?, featured=?, trending=?, updated_at=CURRENT_TIMESTAMP
      WHERE id=?
    `).run(
      title || existing.title,
      type || existing.type,
      imdb_id !== undefined ? imdb_id : existing.imdb_id,
      year || existing.year,
      rating || existing.rating,
      plot || existing.plot,
      poster || existing.poster,
      backdrop || existing.backdrop,
      JSON.stringify(screenshots || safeJsonParse(existing.screenshots, [])),
      cast || existing.cast,
      JSON.stringify(genres || safeJsonParse(existing.genres, [])),
      JSON.stringify(download_links || safeJsonParse(existing.download_links, [])),
      featured !== undefined ? (featured ? 1 : 0) : existing.featured,
      trending !== undefined ? (trending ? 1 : 0) : existing.trending,
      req.params.id
    );
    const movie = db.prepare('SELECT * FROM movies WHERE id = ?').get(req.params.id);
    res.json({
      ...movie,
      genres: safeJsonParse(movie.genres, []),
      download_links: safeJsonParse(movie.download_links, []),
      screenshots: safeJsonParse(movie.screenshots, [])
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update movie' });
  }
});

router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM movies WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    db.prepare('DELETE FROM movies WHERE id = ?').run(req.params.id);
    res.json({ message: 'Movie deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete movie' });
  }
});

function safeJsonParse(str, fallback) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

module.exports = router;
