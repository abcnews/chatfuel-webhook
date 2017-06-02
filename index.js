const querystring = require('querystring');
const async = require('async');
const slack = require('./lib/slack');

module.exports = {
  handler(event, context, callback) {
    const config = event.queryStringParameters;
    const body = querystring.parse(event.body);
    const env = process.env;
    const tasks = [];

    // slack webhook task
    if (config && config.slackChannel) {
      const keyName = `SLACK_WEBHOOK_${config.slackChannel.toUpperCase()}`;
      const webhook = env[keyName];
      if (!webhook) {
        console.error(`chatfuel-webhook: webhook not configured: slack channel ${keyName}`);
      } else {
        tasks.push((done) => {
          slack.send(config, body, {
            webhook,
          }, done);
        });
      }
    }

    if (!tasks.length) {
      console.error('chatfuel-webhook: no tasks specified');
    }

    async.each(
      tasks,
      (task, done) => task(done),
      (error) => {
        if (error) {
          console.error('chatfuel-webhook: error sending', error);
        }
      }
    );

    // return a blank callback because we don't need to block user input here
    return callback(null, { statusCode: 200 });
  },
};
