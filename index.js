require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/orca-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();
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
Coding Joke: /orca-codingjoke

AI Commands:
Orca AI (ask Orca a question): /orca-ai
Orca AI Image (generate an image with Orca): /orca-ai-image
`
  });
});
