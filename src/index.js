const Basch = require('./bash');
const { RTMClient } = require('@slack/client');

// An access token (from your Slack app or custom integration - usually xoxb)
const token = process.env.SLACK_TOKEN;
const deviceId = process.env.DEVICE_ID || null;

// The client is initialized and then started to get an active connection to the platform
const rtm = new RTMClient(token);
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

    if (deviceId) {
      if (deviceId === text[0]) {
        text.shift();
      } else {
        return;
      }
    }

    Basch.execute(text.join(' '))
      .then(stdout => {
        return rtm.sendMessage(stdout, message.channel)
      })
      .catch(err => {
        return rtm.sendMessage(JSON.stringify(err), message.channel)
      });
  }

  // Log the message
  console.log(`(channel:${message.channel}) ${message.user} says: ${message.text}`);
});