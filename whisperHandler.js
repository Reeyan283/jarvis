const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const mic = require("mic");
const { Readable } = require("stream");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const { Configuration, OpenAIApi } = require("openai");

const config = require("./config.json");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
ffmpeg.setFfmpegPath(config.path.ffmpeg);

async function micToTranscription() {
    //await recordAudio(config.path.recording);
    const transcription = await transcribeAudio(config.path.recording);
    console.log('Transcription:', transcription);
}

function recordAudio(filename) {
    return new Promise((resolve, reject) => {
        const micInstance = mic({
            rate: "16000",
            channels: "1",
            fileType: "wav",
        });

        const micInputStream = micInstance.getAudioStream();
        const output = fs.createWriteStream(filename);
        const writable = new Readable().wrap(micInputStream);

        console.log("Recording audio...");

        writable.pipe(output);

        micInstance.start();

        process.on("SIGINT", () => {
            micInstance.stop();
            console.log("Stopped recording audio.");
            resolve();
        });

        micInputStream.on("error", (err) => {
            reject(err);
        });
    });
}

async function transcribeAudio(filename) {
    return new Promise((resolve, reject) => {
        ffmpeg(filename)
            .output(`${filename}.mp3`)
            .on("end", async () => {
                const transcript = await openai.createTranscription(
                    fs.createReadStream(filename+".mp3"),
                    "whisper-1"
                );
                console.log(transcript.data.text)
                resolve(transcript.data.text);
            })
            .on("error", (err) => {
                console.error(err);
                reject(err);
            }).run();
    });
}