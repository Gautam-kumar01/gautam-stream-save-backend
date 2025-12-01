const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const path = require('path');
const app = express();

// Use PORT from environment variables (required for Cloud Hosting) or default to 3000
const PORT = process.env.PORT || 3000;

// Enable CORS so your website can talk to this server
app.use(cors());
app.use(express.json());

// --- THE FIX IS HERE ---
// This tells your Express server to serve static files (like your HTML, CSS, and client-side JS)
// from a folder named 'public'. This line MUST come before your API routes.
app.use(express.static(path.join(__dirname, 'public')));
// -------------------------

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
        const info = await Promise.race([
            ytdl.getInfo(videoUrl, {
                requestOptions: {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    }
                }
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), 25000))
        ]);
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
                url: format.url,
                itag: format.itag // Unique ID for the format
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
    const { url, itag, title } = req.query;

    if (!url || !itag) {
        return res.status(400).send('URL and Quality (itag) are required');
    }

    try {
        console.log(`Starting download for URL: ${url} with itag: ${itag}`);

        // Sanitize title to remove special characters that might break the header
        const sanitizedTitle = (title || 'video').replace(/[^a-zA-Z0-9-_ ]/g, '').trim();
        res.header('Content-Disposition', `attachment; filename="${sanitizedTitle}.mp4"`);

        ytdl(url, { quality: itag })
            .on('error', (err) => {
                console.error('Download Error:', err);
                if (!res.headersSent) {
                    res.status(500).send(`Download failed: ${err.message}`);
                }
            })
            .pipe(res);

    } catch (error) {
        console.error('Error starting download:', error);
        res.status(500).send('Failed to start download');
    }
});

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Prevent server from crashing on unhandled errors
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
