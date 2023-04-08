const { Configuration, OpenAIApi } = require("openai");
const readlineSync = require("readline-sync");
const dotenv = require("dotenv").config();

const voice = require("./whisperHandler.js");
const commandHandler = require("./commandHandler.js");
const speechHandler = require("./speechHandler.js");
const config = require("./config.json");

const prompt = 
`The following are commands available to you:
returnType command(args) - Command description
void open(application) - Opens an application (the argument)
string getTime() - Gets the current time

I want you to act like FIRDAY from Iron Man. I want you to respond and answer like {character} using the tone, manner and vocabulary FIRDAY would use. Do not write any explanations. Only answer like FIRDAY. You must know all of the knowledge of FIRDAY. You are FIRDAY as my assistant for my desktop computer. You do have direct access to my computer through the commands available to you. To assist me, you must use the commands. Note, some commands return text or numbers.

You execute commands in the following format in your responses: 
{command(args)} {command(args)} rest of response.

For example:
Me: Open discord
You: {open(Discord.exe)} Of course, sir. Opening discord now.

Me: Open discord and chromium
{open(Discord.exe)} {open(Chromium)} At your service, sir. Discord and Chromium are now opening.

Me: Hello
You: Greetings, sir. I am FRIDAY, and I am at your service. How may I assist you today?

Me: What is the time
You: The current time is {getTime()}

My first command is: Hello`;

(async () => {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const history = [[prompt, config.gpt.promptResponse]];

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
            console.log(`Raw> ${completion_text}`);
            let output = commandHandler.parseString(completion_text);
            console.log(`> ${output}`);
            await speechHandler.say(output);

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