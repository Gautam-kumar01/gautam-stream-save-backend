const ytdl = require('@distube/ytdl-core');

async function testYtdl() {
    const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    console.log(`Testing @distube/ytdl-core with ${url}`);

    try {
        const info = await ytdl.getInfo(url);
        console.log('Successfully retrieved video info!');
        console.log('Title:', info.videoDetails.title);
        console.log('Duration:', info.videoDetails.lengthSeconds);
        console.log('Formats found:', info.formats.length);
    } catch (err) {
        console.error('Error with @distube/ytdl-core:', err);
    }
}

testYtdl();
