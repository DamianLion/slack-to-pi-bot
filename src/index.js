const Bash = require('./bash');
const { RTMClient, WebClient } = require('@slack/client');

// An access token (from your Slack app or custom integration - usually xoxb)
const token = process.env.SLACK_TOKEN;
const deviceId = process.env.DEVICE_ID || null;

const rtm = new RTMClient(token);
const web = new WebClient(token);

rtm.start();

rtm.on('message', (message) => {
  // Skip messages that are from a bot or my own user ID
  if ( (message.subtype && message.subtype === 'bot_message') ||
    (!message.subtype && message.user === rtm.activeUserId) ) {
    return;
  }

  const iam_marked = `<@${rtm.activeUserId}>`;
  const text = message.text.split(' ');

  if (text && text.length > 0 && text[0] === iam_marked) {
    text.shift();
    hanldeMessage(text)
  } else if (message.channel.startsWith('D')) {
    hanldeMessage(text, message)
  } else {
    return;
  }

  // Log the message
  console.log(`(channel:${message.channel}) ${message.user} says: ${message.text}`);
});

function hanldeMessage(text, message) {
  switch (text[0].toLowerCase()) {
    case "help":
      web.chat.postEphemeral({
        channel: message.channel,
        as_user: true,
        user: message.user,
        text: 'Always here for you !',
        attachments: [
          {
            "title": "list",
            "text": "with the list parameter you can either list channels or devices"
          },
          {
            "title": "play",
            "text": `
play youtube _[youtube url]_ on _[device id]_ 
play twitch _[stream url]_ on _[device id]_
play m3u _[m3u stream url]_ on _[device id]_
`
          }
        ]
      })
        .then((sentMsg) => {})
        .catch(console.error);
      break;
    case "list":
      console.log("Apples are $0.32 a pound.");
      break;
    case "play":
      console.log("Bananas are $0.48 a pound.");
      break;
    case "Cherries":
      console.log("Cherries are $3.00 a pound.");
      break;
    case "Mangoes":
    case "Papayas":
      console.log("Mangoes and papayas are $2.79 a pound.");
      break;
    default:
      rtm.sendMessage('Sorry I did not understand you', message.channel)
        .then(sentMsg => {})
        .catch(err => console.log(err));
  }
}