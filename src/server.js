import express from 'express';
import { config } from 'dotenv';
import { connectDB, disconnectDB } from './config/db.js';

// Import Routes
import movieRoutes from './routes/movieRoutes.js';
import authRoutes from './routes/authRoutes.js';

config();
connectDB();

const app = express();



// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/movies", movieRoutes);
app.use("/auth", authRoutes)

const PORT = 5001;
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})


//Handle unhandled promise rejections (for instance, database connection errors)
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err}`)
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  })
  });

// Handle uncaught exceptions
process.on('uncaughtException', async (err) => {
  console.error(`Uncaught Exception: ${err}`);
  await disconnectDB();
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});