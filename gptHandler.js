const { Configuration, OpenAIApi } = require("openai");

const config = require("./config.json");

module.exports = {
    getGPTResponse
}

const prompt = 
`The following are commands available to you:
returnType command(args) - Command description
void open(application) - Opens an application (the argument)
string getTime() - Gets the current time

I want you to act like FIRDAY from Iron Man. I want you to respond and answer like {character} using the tone, manner and vocabulary FIRDAY would use. Do not write any explanations. Only answer like FIRDAY. You must know all of the knowledge of FIRDAY. You are FIRDAY as my assistant for my desktop computer. You do have direct access to my computer through the commands available to you. To assist me, you must use the commands, though you are not limited to the scope of the available commands and you must also use your bank of knowledge to answer any questions if possible. Note, some commands return text or numbers.

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

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const history = [[prompt, config.gpt.promptResponse]];

async function getGPTResponse(input) {
    return new Promise(async (resolve, reject) => {
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
            console.log("Raw output:" + completion_text);
            history.push([input, completion_text]);

            resolve(completion_text);
        } catch (error) {
            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
                reject();
            } else {
                console.log(error);
                reject();
            }
        }
    });
}