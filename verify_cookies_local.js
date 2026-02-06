const YTDlpWrap = require('yt-dlp-wrap').default;
const path = require('path');
const fs = require('fs');

const ytDlpWrap = new YTDlpWrap();
const binaryPath = path.join(__dirname, process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp');
ytDlpWrap.setBinaryPath(binaryPath);

const cookiesPath = path.join(__dirname, 'cookies.txt');
const videoUrl = 'https://www.youtube.com/watch?v=jNQXAC9IVRw'; // Simple video

async function testCookies() {
    if (!fs.existsSync(cookiesPath)) {
        console.error('ERROR: cookies.txt not found!');
        return;
    }

    console.log('Testing cookies.txt locally...');

    try {
        const args = [
            videoUrl,
            '--dump-json',
            '--no-playlist',
            '--cookies', cookiesPath,
            '--extractor-args', 'youtube:player_client=default'
        ];

        console.log('Running yt-dlp with cookies...');
        const stdout = await ytDlpWrap.execPromise(args);
        const data = JSON.parse(stdout);
        console.log('SUCCESS! Cookies are working locally.');
        console.log('Video Title:', data.title);
    } catch (error) {
        console.error('FAILURE: Cookies might be invalid or IP restricted.');
        console.error('Error Message:', error.message);
    }
}

testCookies();
