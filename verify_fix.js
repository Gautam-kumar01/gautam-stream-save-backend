const http = require('http');

const url = 'http://localhost:3000/api/video-info?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ';

console.log(`Requesting ${url}...`);

http.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode === 200) {
            try {
                const json = JSON.parse(data);
                console.log('Success! Response received:');
                console.log('Title:', json.title);
                console.log('Duration:', json.duration);
                console.log('Qualities count:', json.qualities ? json.qualities.length : 0);
                if (json.qualities && json.qualities.length > 0) {
                    console.log('First quality label:', json.qualities[0].label);
                }
            } catch (e) {
                console.error('Failed to parse JSON:', e);
                console.log('Raw response:', data);
            }
        } else {
            console.error(`Request failed. Status Code: ${res.statusCode}`);
            console.log('Response:', data);
        }
    });

}).on('error', (err) => {
    console.error('Error making request:', err.message);
});
