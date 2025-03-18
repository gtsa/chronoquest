import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import eventRoutes from "./routes/events";
import gameAttemptsRoutes from "./routes/gameAttempts";
import path from 'path';

const app = express();

// Enable CORS for frontend requests
const allowedOrigins = ["http://localhost:4173", "http://localhost:5173"];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true // ⬅️ Allow cookies and authentication headers
}));
app.use(express.json());
app.use(cookieParser());

// ✅ Serve images from the public folder
app.use("/images", express.static(path.join(__dirname, "../public/images")));

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the ChronoQuest Backend API");
});

// Register routes
app.use("/api/events", eventRoutes);
app.use("/api/game", gameAttemptsRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Serving images from http://localhost:${port}/images/`);
});
