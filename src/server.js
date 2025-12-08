const express = require('express');

const app = express();

const PORT = 5001;

app.get('/hello', (req, res) => {
  res.json({ message: 'Hello, World!' });
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})


// we know that there are methods like GET, POST, PUT, DELETE, PATCH

// This project is gonna be a movie watchlist app and it is going to have the following features:

// AUTH - SIGNUP, SignIN

// MOVIES - Getting all movies

// USER - Profile

// WATCHLIST - Add movie to watchlist, Get all movies in watchlist, Remove movie from watchlist