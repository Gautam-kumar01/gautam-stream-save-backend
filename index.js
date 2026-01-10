const express = require('express');
const cors = require('cors');
const YTDlpWrap = require('yt-dlp-wrap').default;
const ytDlpWrap = new YTDlpWrap();
const path = require('path');
const fs = require('fs');

// Ensure yt-dlp binary is available
const binaryName = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp';
const binaryPath = path.join(__dirname, binaryName);

// Download binary if not present
(async () => {
    if (!fs.existsSync(binaryPath)) {
        console.log(`Downloading ${binaryName}...`);
        try {
            await YTDlpWrap.downloadFromGithub(binaryPath);
            console.log(`${binaryName} downloaded successfully`);

            // Ensure executable permissions on Linux/Mac
            if (process.platform !== 'win32') {
                fs.chmodSync(binaryPath, '755');
            }

            ytDlpWrap.setBinaryPath(binaryPath);
        } catch (err) {
            console.error(`Failed to download ${binaryName}:`, err);
        }
    } else {
        console.log(`${binaryName} already exists`);
        ytDlpWrap.setBinaryPath(binaryPath);
    }

    try {
        const version = await ytDlpWrap.execPromise(['--version']);
        console.log(`yt-dlp version: ${version.trim()}`);
    } catch (err) {
        console.error('Failed to get yt-dlp version:', err);
    }
})();

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

    // Check if binary exists before attempting to use it
    if (!fs.existsSync(ytDlpWrap.getBinaryPath())) {
        console.error(`yt-dlp binary not found at: ${ytDlpWrap.getBinaryPath()}`);
        return res.status(500).json({ error: 'Server configuration error: yt-dlp binary missing' });
    }

    try {
        console.log(`Fetching metadata using binary at: ${ytDlpWrap.getBinaryPath()}`);

        // Use execPromise to pass custom arguments
        // --dump-json: Get metadata as JSON
        // --no-playlist: Ensure we only get the video, not a whole playlist
        // --extractor-args "youtube:player_client=default": Fix "No supported JavaScript runtime" warning
        // --user-agent: Mimic a real browser to avoid some blocks
        const stdout = await ytDlpWrap.execPromise([
            videoUrl,
            '--dump-json',
            '--no-playlist',
            '--extractor-args', 'youtube:player_client=default',
            '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ]);

        const metadata = JSON.parse(stdout);

        const title = metadata.title;
        const duration = metadata.duration; // in seconds
        const thumbnail = metadata.thumbnail;

        // Map formats
        // yt-dlp formats are slightly different
        const qualities = metadata.formats
            .filter(format => format.vcodec !== 'none' && format.acodec !== 'none') // Video + Audio
            .map(format => ({
                label: format.format_note || format.resolution || 'Unknown',
                size: format.filesize ? (format.filesize / 1024 / 1024).toFixed(2) + ' MB' : 'Unknown',
                hd: format.height >= 720,
                url: format.url,
                itag: format.format_id // yt-dlp uses format_id
            }));

        const videoData = {
            title,
            duration: new Date(duration * 1000).toISOString().substr(11, 8),
            thumbnail,
            qualities
        };

        console.log(`Successfully retrieved metadata for: ${title}`);
        res.json(videoData);
    } catch (error) {
        console.error('Error fetching video info:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        if (error.stderr) {
            console.error('yt-dlp stderr:', error.stderr);
        }
        res.status(500).json({
            error: 'Unable to retrieve video details',
            details: error.message,
            stderr: error.stderr || 'No stderr available'
        });
    }
});

// API Endpoint to trigger download
app.get('/download', (req, res) => {
    const { url, itag, title } = req.query;

    if (!url || !itag) {
        return res.status(400).send('URL and Quality (itag) are required');
    }

    try {
        console.log(`Starting download for URL: ${url} with format: ${itag}`);

        const sanitizedTitle = (title || 'video').replace(/[^a-zA-Z0-9-_ ]/g, '').trim();
        res.header('Content-Disposition', `attachment; filename="${sanitizedTitle}.mp4"`);

        // Stream the download
        const stream = ytDlpWrap.execStream([
            url,
            '-f', itag
        ]);

        stream.pipe(res);

        stream.on('error', (err) => {
            console.error('Download Error:', err);
            if (!res.headersSent) {
                res.status(500).send(`Download failed: ${err.message}`);
            }
        });

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
