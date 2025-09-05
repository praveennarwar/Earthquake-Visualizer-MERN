# Server (Express) for Earthquake Visualizer

This server proxies the USGS 'All Day' GeoJSON feed and provides a small cache.

Run:
```
cd server
npm install
npm start
```

The server runs on port 4000 by default.

It will also serve the client `dist/` if you build the client (`npm run build` in `client`).
