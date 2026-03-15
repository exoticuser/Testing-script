require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const moviesRoutes = require('./routes/movies');
const categoriesRoutes = require('./routes/categories');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/movies', moviesRoutes);
app.use('/api/categories', categoriesRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'StreamFlix API is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`StreamFlix backend running on port ${PORT}`);
});

module.exports = app;
