const https = require('https');

const API_URL = 'https://gautam-stream-save-backend.onrender.com/api/video-info?url=https://www.youtube.com/watch?v=jNQXAC9IVRw';
const ROOT_URL = 'https://gautam-stream-save-backend.onrender.com/';

function checkUrl(url, label) {
    console.log(`Checking ${label}: ${url}`);
    https.get(url, (res) => {
        console.log(`${label} Status: ${res.statusCode}`);
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
            console.log(`${label} Length: ${data.length}`);
            if (res.statusCode !== 200) console.log(`${label} Body Preview: ${data.substring(0, 200)}`);
        });
    }).on('error', e => console.error(`${label} Error:`, e.message));
}

checkUrl(ROOT_URL, 'ROOT');
checkUrl(API_URL, 'API');

