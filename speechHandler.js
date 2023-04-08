const https = require('https');
const dotenv = require("dotenv").config();
const fs = require("fs");

const config = require("./config.json")

module.exports = {
    say
}

const options = {
    hostname: 'api.elevenlabs.io',
    path: `/v1/text-to-speech/${config.elevenLabs.voiceID}`,
    method: 'POST',
    headers: {
        'accept': '*/*',
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
    },
    encoding: 'base64'
};

async function say(text) {
    return new Promise(async (resolve, reject) => {

        const { playAudioFile } = await import("audic");

        const req = https.request(options, async (res) => {
            console.log(`statusCode: ${res.statusCode}`);

            const file = fs.createWriteStream(config.elevenLabs.file);

            res.pipe(file);

            await playAudioFile(config.elevenLabs.file).then(() => {
                resolve();
            })
        });
        
        req.on('error', error => {
            console.error(error);
            reject();
        });

        req.write(JSON.stringify({
            "text": text,
        }));

        req.end();
    });
}