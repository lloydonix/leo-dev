const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'lloyd_portfolio',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

app.use(express.static(path.join(__dirname)));
app.use(express.json());

app.post('/api/blogs', async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO blog_posts (title, content) VALUES (?, ?)',
      [title, content]
    );

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('DB error:', error);
    res.status(500).json({ error: 'Unable to save blog post.' });
  }
});

app.get('/api/blogs', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, title, content, created_at FROM blog_posts ORDER BY created_at DESC LIMIT 20'
    );
    res.json(rows);
  } catch (error) {
    console.error('DB error:', error);
    res.status(500).json({ error: 'Unable to retrieve blog posts.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
