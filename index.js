const express = require('express');
const cors = require('cors');
const app = express();

// Use PORT from environment variables (required for Cloud Hosting) or default to 3000
const PORT = process.env.PORT || 3000;

// Enable CORS so your website can talk to this server
app.use(cors());
app.use(express.json());

// Root endpoint to check if server is running
app.get('/', (req, res) => {
    res.send('Gautam Stream Save Backend is Running!');
});

// Mock database of video info
const MOCK_VIDEO_DATA = {
    title: "Cinematic Travel Video - 4K HDR 60FPS",
    duration: "12:45",
    thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2070&auto=format&fit=crop",
    qualities: [
        { label: '4K Ultra HD', size: '845.2 MB', hd: true },
        { label: '1080p Full HD', size: '245.5 MB', hd: true },
        { label: '720p HD', size: '124.1 MB', hd: true },
        { label: '480p', size: '62.4 MB', hd: false }
    ]
};

// API Endpoint to get video info
app.get('/api/video-info', (req, res) => {
    const videoUrl = req.query.url;
    console.log(`Received request for URL: ${videoUrl}`);

    if (!videoUrl) {
        return res.status(400).json({ error: 'URL is required' });
    }

    // Simulate processing delay
    setTimeout(() => {
        res.json(MOCK_VIDEO_DATA);
    }, 1500);
});

// API Endpoint to trigger download
app.get('/download', (req, res) => {
    const quality = req.query.quality;
    console.log(`Downloading video in ${quality}...`);
    res.send(`Simulated download of video in ${quality} started!`);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
