import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import eventRoutes from "./routes/events";
import gameAttemptsRoutes from "./routes/gameAttempts";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const PROTOCOL = process.env.PROTOCOL
const DOMAIN = process.env.DOMAIN

// Enable CORS for frontend requests
const allowedOrigins = [
  `${PROTOCOL}://${DOMAIN}:4173`, 
  `${PROTOCOL}://${DOMAIN}:5173`,
  `${PROTOCOL}://${DOMAIN}`];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true // Allow cookies and authentication headers
}));

app.use(express.json());
app.use(cookieParser());

// Serve images from the public folder
app.use("/images", express.static(path.join(__dirname, "../shared/images")));

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the ChronoQuest Backend API");
});

// Register routes
app.use("/api/events", eventRoutes);
app.use("/api/game", gameAttemptsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on ${PROTOCOL}://${DOMAIN}:${PORT}`);
  console.log(`Serving images from ${PROTOCOL}://${DOMAIN}:${PORT}/images/`);
});
