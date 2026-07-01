require("dotenv").config();

const axios = require("axios");
const { App } = require("@slack/bolt");
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

// Register all command handlers BEFORE starting the app
app.command("/orca-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

app.command("/orca-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`- Available Commands -
Validation Commands:
Orca Ping (make sure Orca is online): /orca-ping
Orca Help (get a list of available commands): /orca-help

Random API Commands:
Orca Cat Fact: /orca-catfact
Orca Dog Fact: /orca-dogfact
Orca Joke: /orca-joke
Orca Astronomy Picture of the Day: /orca-apod
`
  });
});

app.command("/orca-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});

app.command("/orca-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text:
`${response.data.setup}

${response.data.punchline}`
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
});
app.command("/orca-dogfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://dogapi.dog/api/v1/facts", {
      params: { limit: 1 }
    });
    const dogFact = response.data.facts[0];
    await respond({ text: `Dog Fact:\n${dogFact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a dog fact." });
  }
});
app.command("/orca-apod", async ({ ack, respond }) => {
  await ack();

  if (!process.env.NASA_API_KEY) {
    await respond({ text: "NASA API key not configured. Please set NASA_API_KEY in .env" });
    return;
  }

  try {
    const response = await axios.get("https://api.nasa.gov/planetary/apod", {
      params: {
        api_key: process.env.NASA_API_KEY
      }
    });
    
    await respond({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${response.data.title}*\n\n${response.data.explanation}`
          }
        },
        {
          type: "image",
          image_url: response.data.url,
          alt_text: response.data.title
        }
      ]
    });
  } catch (err) {
    console.error("APOD Error:", err.message);
    await respond({ text: `Failed to fetch APOD: ${err.message}` });
  }
});
// Everything above this line should be registered before starting the app
(async () => {
  await app.start();
  console.log("bot is running!");
})();