const { Configuration, OpenAIApi } = require("openai");
const readlineSync = require("readline-sync");
const dotenv = require("dotenv").config();

const voice = require("./whisperHandler.js");
const commandHandler = require("./commandHandler.js");
const speechHandler = require("./speechHandler.js");
const config = require("./config.json");

speechHandler.say(commandHandler.parseString("The time is {getTime()}"));

/*
(async () => {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const history = [[config.gpt.prompt, config.gpt.promptResponse]];

    while (true) {
        const input = readlineSync.question("> ");

        if (input === "exit") {
            break;
        }

        const messages = [];
        for (const [input_text, competion_text] of history) {
            messages.push({role: "user", content: input_text});
            messages.push({role: "assistant", content: competion_text});
        }

        messages.push({role: "user", content: input});

        try {
            const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: messages
            });

            const completion_text = completion.data.choices[0].message.content;
            console.log(completion_text);
            let output = commandHandler.parseString(completion_text);
            console.log(`> ${output}`);

            history.push([input, completion_text]);
        } catch (error) {
            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
            } else {
                console.log(error);
            }
        }
    }
})();

*/