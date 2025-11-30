const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
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

// API Endpoint to get video info
app.get('/api/video-info', async (req, res) => {
    const videoUrl = req.query.url;
    console.log(`Received request for URL: ${videoUrl}`);

    if (!videoUrl) {
        return res.status(400).json({ error: 'URL is required' });
    }

    if (!ytdl.validateURL(videoUrl)) {
        return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    try {
        const info = await ytdl.getInfo(videoUrl);
        const title = info.videoDetails.title;
        const duration = info.videoDetails.lengthSeconds;
        const thumbnail = info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url; // Highest quality

        // Map formats to the expected structure
        const qualities = info.formats
            .filter(format => format.hasVideo && format.hasAudio) // Filter for combined formats for simplicity
            .map(format => ({
                label: format.qualityLabel || 'Unknown',
                size: 'Unknown', // ytdl doesn't always provide content length for all formats immediately
                hd: (format.qualityLabel && (format.qualityLabel.includes('720') || format.qualityLabel.includes('1080') || format.qualityLabel.includes('4K'))),
                url: format.url
            }));

        const videoData = {
            title,
            duration: new Date(duration * 1000).toISOString().substr(11, 8), // Convert seconds to HH:MM:SS
            thumbnail,
            qualities
        };

        res.json(videoData);
    } catch (error) {
        console.error('Error fetching video info:', error.message);
        res.status(500).json({ error: 'Failed to fetch video info' });
    }
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
