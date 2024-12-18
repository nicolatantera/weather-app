import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
dotenv.config();

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse JSON bodies

// Use port 3000 or an environment-provided port
const PORT = process.env.PORT || 3000;

const API_KEY = process.env.API_KEY; // Load API key from .env

// Example route to act as a proxy
app.post("/api/data", async (req, res) => {
  const { location } = req.body; // Extract location from request body

  if (!location) {
    return res.status(400).json({ error: "Location is required" });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`;
    const response = await axios.get(url, {
      params: {
        api_key: API_KEY,
        location,
      },
    });
    res.json(response.data); // Forward the data to the frontend
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send("An error occurred");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});

//module.exports = app; // Export for Vercel
