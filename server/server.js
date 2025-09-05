const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const USGS_URL =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

const app = express();
const PORT = process.env.PORT || 4000;

// Allow local dev CORS (React dev server)
app.use(
  cors({
    origin: [/http:\/\/localhost:\d+/, /http:\/\/127.0.0.1:\d+/],
  })
);

// Serve React build files if available
const clientDistPath = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientDistPath));

// Cache config
let cache = { data: null, ts: 0 };
const CACHE_MS = 60 * 1000; // 1 minute cache

// API Route — fetch earthquake data
app.get("/api/earthquakes", async (req, res) => {
  try {
    const now = Date.now();

    // Serve from cache if recent
    if (cache.data && now - cache.ts < CACHE_MS) {
      return res.json({ cached: true, ...cache.data });
    }

    // Fetch fresh data from USGS
    const response = await fetch(USGS_URL, {
      headers: { accept: "application/geo+json" },
    });

    if (!response.ok) {
      throw new Error(`USGS responded with ${response.status}`);
    }

    const data = await response.json();
    cache = { data, ts: now };

    res.json({ cached: false, ...data });
  } catch (err) {
    console.error("Error fetching USGS data:", err);
    res.status(500).json({ error: "Failed to fetch earthquake data" });
  }
});

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Serve index.html for React Router
app.get("*", (req, res) => {
  const indexFile = path.join(clientDistPath, "index.html");
  if (fs.existsSync(indexFile)) {
    res.sendFile(indexFile);
  } else {
    res
      .status(404)
      .send(
        "Client build not found. Please run `npm run build` inside client/ or start the dev server at http://localhost:5173"
      );
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
