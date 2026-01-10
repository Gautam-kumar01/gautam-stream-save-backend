const YTDlpWrap = require('yt-dlp-wrap').default;
const ytDlpWrap = new YTDlpWrap();
const path = require('path');
const fs = require('fs');

// Ensure yt-dlp binary is available
const binaryName = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp';
const binaryPath = path.join(__dirname, binaryName);

async function testVideoRetrieval(videoUrl) {
    if (!fs.existsSync(binaryPath)) {
        console.log(`Downloading ${binaryName}...`);
        try {
            await YTDlpWrap.downloadFromGithub(binaryPath);
            console.log(`${binaryName} downloaded successfully`);
            if (process.platform !== 'win32') {
                fs.chmodSync(binaryPath, '755');
            }
        } catch (err) {
            console.error(`Failed to download ${binaryName}:`, err);
            return;
        }
    }
    ytDlpWrap.setBinaryPath(binaryPath);

    try {
        console.log(`Fetching metadata for: ${videoUrl}`);
        const stdout = await ytDlpWrap.execPromise([
            videoUrl,
            '--dump-json',
            '--no-playlist',
            '--extractor-args', 'youtube:player_client=default',
            '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ]);

        const metadata = JSON.parse(stdout);
        console.log(`Successfully retrieved metadata for: ${metadata.title}`);
    } catch (error) {
        console.error('Error fetching video info:', error);
        if (error.stderr) {
            console.error('yt-dlp stderr:', error.stderr);
        }
    }
}

// Test with a known working video URL (e.g., a YouTube video)
testVideoRetrieval('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
