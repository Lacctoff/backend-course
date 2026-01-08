import { prisma } from "../config/db.js";


const addToWatchlist = async (req, res) => {
  const { movieId, status, rating, notes } = req.body;

  //Verify if movie exists
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
  });

  if (!movie) {
    return res.status(404).json({
      error: "Movie not found"
    });
  };

  // check if the movie is already added
  const existingWatchlist = await prisma.watchlistItem.findUnique({
    where: { userId_movieId: {
      userId: req.user.id,
      movieId: movieId,
    }, },
  });
  if (existingWatchlist) {
    return res.status(400).json({
      error: "Movie already in the watchlist"
    });
  };

  // create and send data to the database
  const watchlistItem = await prisma.watchlistItem.create({
    data: {
      userId: req.user.id,
      movieId,
      status: status || "PLANNED",
      rating,
      notes,
    },
  });

  res.status(201).json({
    status: "Success",
    data: {
      watchlistItem,
    }
  })
};


/**
 * Update watchlist item
 * Updates status, rating, or notes
 * Ensures only owner can update
 * Requires protect middleware
 */
const updateWatchlistItem = async (req, res) => {
  const { status, rating, notes } = req.body;

  // Find watchlist item and verify ownership
  const watchlistItem = await prisma.watchlistItem.findUnique({
    where: { id: req.params.id },
  });

  if (!watchlistItem) {
    return res.status(404).json({ error: "Watchlist item not found" });
  }

  // Ensure only owner can update
  if (watchlistItem.userId !== req.user.id) {
    return res
      .status(403)
      .json({ error: "Not allowed to update this watchlist item" });
  }

  // Build update data
  const updateData = {};
  if (status !== undefined) updateData.status = status.toUpperCase();
  if (rating !== undefined) updateData.rating = rating;
  if (notes !== undefined) updateData.notes = notes;

  // Update watchlist item
  const updatedItem = await prisma.watchlistItem.update({
    where: { id: req.params.id },
    data: updateData,
  });

  res.status(200).json({
    status: "success",
    data: {
      watchlistItem: updatedItem,
    },
  });
};

/** 
* Remove movie from watchlist
* Deletes watchlist item
* Ensures only Owner can delete
* Requires protect middleware 
**/

const removeFromWatchlist = async (req, res) => {
  //find watchlist item and verify ownership
  const watchlistItem = await prisma.watchlistItem.findUnique({
    where: { id: req.params.id },
  });

  if (!watchlistItem) {
    return res.status(404).json({ error: "Watchlist item not found" });
  }

  // ensure only the owner can delete
  if (watchlistItem.userId !== req.user.id) {
    return res.status(403).json({
      error: "Not allowed to update this watchlist item"
    });
  };

  // if it has fulfilled all prerequisites move forward.
  await prisma.watchlistItem.delete({
    where: { id: req.params.id }
  });

  // A response
  res.status(200).json({
    status: "Success",
    message: "Movie removed from watchlist",
  });
}

export { addToWatchlist, removeFromWatchlist, updateWatchlistItem }