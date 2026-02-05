const express = require('express');
const cors = require('cors');
const YTDlpWrap = require('yt-dlp-wrap').default;
const ytDlpWrap = new YTDlpWrap();
const path = require('path');
const fs = require('fs');
// Fallback library
const ytdl = require('@distube/ytdl-core');

// Ensure yt-dlp binary is available
const binaryName = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp';
const binaryPath = path.join(__dirname, binaryName);

// Download or Update binary
(async () => {
    try {
        if (!fs.existsSync(binaryPath)) {
            console.log(`Downloading ${binaryName}...`);
            await YTDlpWrap.downloadFromGithub(binaryPath);
            console.log(`${binaryName} downloaded successfully`);

            // Ensure executable permissions on Linux/Mac
            if (process.platform !== 'win32') {
                fs.chmodSync(binaryPath, '755');
            }
        } else {
            // Attempt to update existing binary
            console.log(`${binaryName} exists. Checking for updates...`);
            // We can't easily use -U via the wrapper class methods directly effectively if we want to keep it simple, 
            // but we can just run the command. However, on read-only filesystems this might fail. 
            // Failsafe: just set path.
            console.log('Skipping auto-update to avoid permissions issues in some envs, utilizing existing binary.');
        }

        ytDlpWrap.setBinaryPath(binaryPath);

        const version = await ytDlpWrap.execPromise(['--version']);
        console.log(`yt-dlp version: ${version.trim()}`);
    } catch (err) {
        console.error(`Failed to initialize ${binaryName}:`, err);
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

// Helper to format ytdl-core formats to match yt-dlp output structure
const formatYtdlQualities = (formats) => {
    return formats
        .filter(f => f.hasVideo && f.hasAudio) // Filter for ones with both if possible, or we can adapt to separate streams later
        .map(f => ({
            label: f.qualityLabel || 'Unknown',
            size: f.contentLength ? (parseInt(f.contentLength) / 1024 / 1024).toFixed(2) + ' MB' : 'Unknown', // ytdl uses contentLength string
            hd: (f.height || 0) >= 720,
            url: f.url,
            itag: f.itag
        }));
};

// API Endpoint to get video info
app.get('/api/video-info', async (req, res) => {
    const videoUrl = req.query.url;
    console.log(`Received request for URL: ${videoUrl}`);

    if (!videoUrl) {
        return res.status(400).json({ error: 'URL is required' });
    }

    let errorLog = [];

    // STRATEGY 1: Try yt-dlp (Primary)
    if (fs.existsSync(ytDlpWrap.getBinaryPath())) {
        try {
            console.log(`[Strategy 1] Fetching metadata using yt-dlp...`);

            const stdout = await ytDlpWrap.execPromise([
                videoUrl,
                '--dump-json',
                '--no-playlist',
                '--extractor-args', 'youtube:player_client=default',
                '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            ]);

            const metadata = JSON.parse(stdout);

            const qualities = metadata.formats
                .filter(format => format.vcodec !== 'none' && format.acodec !== 'none')
                .map(format => ({
                    label: format.format_note || format.resolution || 'Unknown',
                    size: format.filesize ? (format.filesize / 1024 / 1024).toFixed(2) + ' MB' : 'Unknown',
                    hd: format.height >= 720,
                    url: format.url,
                    itag: format.format_id
                }));

            const videoData = {
                title: metadata.title,
                duration: new Date(metadata.duration * 1000).toISOString().substr(11, 8),
                thumbnail: metadata.thumbnail,
                qualities
            };

            console.log(`[Strategy 1] Success: ${metadata.title}`);
            return res.json(videoData);

        } catch (error) {
            console.error('[Strategy 1] Failed:', error.message);
            errorLog.push({ strategy: 'yt-dlp', error: error.message, stderr: error.stderr });
        }
    } else {
        console.warn('[Strategy 1] Skipped: yt-dlp binary missing');
    }

    // STRATEGY 2: Try @distube/ytdl-core (Fallback)
    try {
        console.log(`[Strategy 2] Attempting fallback with @distube/ytdl-core...`);

        const info = await ytdl.getInfo(videoUrl);

        // formats with both audio and video
        let formats = ytdl.filterFormats(info.formats, 'audioandvideo');

        // If no mixed formats, try all formats and let frontend decide (or just video)
        if (formats.length === 0) {
            formats = info.formats;
        }

        const qualities = formats.map(format => ({
            label: format.qualityLabel || 'Unknown',
            size: format.contentLength ? (parseInt(format.contentLength) / 1024 / 1024).toFixed(2) + ' MB' : 'Unknown',
            hd: (format.height || 0) >= 720,
            url: format.url,
            itag: format.itag
        }));

        const videoData = {
            title: info.videoDetails.title,
            duration: new Date(info.videoDetails.lengthSeconds * 1000).toISOString().substr(11, 8),
            thumbnail: info.videoDetails.thumbnails[0]?.url,
            qualities
        };

        console.log(`[Strategy 2] Success: ${info.videoDetails.title}`);
        return res.json(videoData);

    } catch (error) {
        console.error('[Strategy 2] Failed:', error.message);
        errorLog.push({ strategy: 'ytdl-core', error: error.message });
    }

    // If both failed
    console.error('All strategies failed for URL:', videoUrl);
    res.status(500).json({
        error: 'Unable to retrieve video details',
        details: 'All retrieval methods failed.',
        logs: errorLog
    });
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
