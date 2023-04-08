const { Configuration, OpenAIApi } = require("openai");
const readlineSync = require("readline-sync");
const dotenv = require("dotenv").config();

const voice = require("whisperHandler");

(async () => {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const history = [];

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

            const competion_text = completion.data.choices[0].message.content;
            console.log(`> ${competion_text}`);

            history.push([input, competion_text]);
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