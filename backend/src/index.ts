import express from "express";
import cors from "cors";

const app = express();

// 🚀 Enable CORS for frontend requests
app.use(cors({
  origin: "http://localhost:4173", // Allow frontend to access backend
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type"
}));

app.use(express.json());

// Example route
app.get("/events", (req, res) => {
  res.json([{ id: 1, title: "Sample Event", year: 2023 }]);
});

// Start server
app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
