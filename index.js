const dotenv = require("dotenv").config();
const fs = require("fs");

const voice = require("./whisperHandler.js");
const commandHandler = require("./commandHandler.js");
const speechHandler = require("./speechHandler.js");
const gptHandler = require("./gptHandler.js");
const record = require("./emmiters.js");
const config = require("./config.json");

record.on("start", async () => {   
    let input = await voice.micToTranscription();
    let output = await gptHandler.getGPTResponse(input);
    output = await commandHandler.parseString(output);
    await speechHandler.say(output);
});

fs.watchFile("./translator.txt", {
    persistant: true,
    interval: 500
    }, (curr, prev) => {

    if (curr.mtime > prev.mtime) {   

        fs.readFile("./translator.txt", (err, data) => {
            if (err) {
                console.error(err);
            }

            if (data == "1") {
                record.emit("start");
            } else {
                record.emit("end");
            }
        });
    }
});