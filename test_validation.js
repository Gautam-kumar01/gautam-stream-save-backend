const ytdl = require('@distube/ytdl-core');

const urls = [
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://youtu.be/dQw4w9WgXcQ',
    'https://m.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://www.youtube.com/shorts/dQw4w9WgXcQ',
    'https://youtube.com/watch?v=dQw4w9WgXcQ&feature=share',
    'invalid-url',
    'https://google.com'
];

console.log('Testing URL Validation:');
urls.forEach(url => {
    const isValid = ytdl.validateURL(url);
    console.log(`${url}: ${isValid}`);
});
