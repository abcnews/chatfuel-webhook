const moment = require('moment');
const request = require('request');
const fbcdn = require('./fbcdn');
const chatfuel = require('./chatfuel');

const slackModule = {
  /**
   * Send a slack message with the specified options
   * @param  {Object}   config  Config specified from the Chatfuel admin
   * @param  {Object}   body    Body sent from the user's inputs
   * @param  {Object}   options Any other options
   * @param  {String}   options.webhook The URL to post the Slack config to
   * @param  {Function} callback
   */
  send(config, body, options, callback) {
    const { webhook } = options;
    request.post(webhook, {
      json: slackModule.render(config, body),
    }, callback);
  },
  /**
   * Render a Slack message from the user's inputs
   * @param  {Object}   config  Config specified from the Chatfuel admin
   * @param  {Object}   values  Body sent from the user's inputs
   * @return {Object}           Message body to send to Slack https://api.slack.com/incoming-webhooks
   */
  render(config, values) {
    const qs = Object.assign({}, values);
    const fullName = `${qs['first name'] || 'Unknown name'} ${qs['last name'] || ''}`;
    let image;
    const fallbackTexts = [];

    const localTime = qs.timezone ? moment().utcOffset(qs.timezone * 60).format('HH:mm ZZ') : '-';

    // Some fields from ChatFuel
    const shortFields = [
      ['City', qs.city ? `${qs.city}, ${qs.country}` : '-'],
      ['Locale', qs.locale || '-'],
      ['Gender', qs.gender || '-'],
      ['Last visited block', qs['last visited block name'] || '-'],
      ['Last button clicked', qs['last clicked button name'] || '-'],
      ['Local Time', localTime],
    ].map(field => ({
      title: field[0],
      value: field[1],
      short: true,
    }));

    chatfuel.defaultVars.forEach(key => (delete qs[key]));

    // Pick the remaining keys after we've removed the default ChatFuel ones
    const keysRemaining = Object.keys(qs);
    const keysToCheck = keysRemaining.length ? keysRemaining : ['last user freeform input'];

    // Include any fields that were added in that aren't Chatfuel fields
    const mainFields = keysToCheck
      .filter(field => values[field])
      .map((field) => {
        // If this is an image, show it large inline
        if (fbcdn.isImage(values[field])) image = values[field];
        fallbackTexts.push(`*${field}*: “${values[field]}”`);
        return {
          title: field,
          value: values[field] || '-',
          short: false,
        };
      });

    return {
      attachments: [{
        fallback: `Messenger user _${fullName}_ said ${fallbackTexts.join()}`,
        color: '#36a64f',
        author_name: fullName,
        author_link: values['profile pic url'],
        author_icon: values['profile pic url'],
        title: config.title,
        fields: [].concat(mainFields, shortFields),
        image_url: image,
        thumb_url: image,
      }],
    };
  },
};

module.exports = slackModule;
