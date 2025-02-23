import express from "express";
import cors from "cors";
import eventRoutes from "./routes/events";

const app = express();

// Enable CORS for frontend requests
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the ChronoQuest Backend API');
});

// Register the existing events route
app.use("/events", eventRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
