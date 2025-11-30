const ytdl = require('@distube/ytdl-core');

const url = 'https://youtube.com/shorts/XClk6ZFewDQ?si=UKUinC-WAsoXbys2';

async function testShorts() {
    try {
        console.log(`Testing URL: ${url}`);
        const isValid = ytdl.validateURL(url);
        console.log(`Is Valid: ${isValid}`);

        if (isValid) {
            console.log('Fetching info...');
            const info = await ytdl.getInfo(url);
            console.log('Title:', info.videoDetails.title);
            console.log('Success!');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testShorts();
