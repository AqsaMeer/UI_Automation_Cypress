const { IncomingWebhook } = require('@slack/webhook');
Cypress.Commands.add("sendSlackNotification", (title, stack) => {
    // Read a url from the environment variables
    const url = 'https://hooks.slack.com/services/****************L';

    // Initialize
    const webhook = new IncomingWebhook(url);
    var message = ''
    if (Cypress.config().baseUrl.includes('uae')) {
        message = "\n>`First Region`\n>`TestCase Title: " + title + "`"
    } else {
        message = "\n>`Second Region`\n>`TestCase Title: " + title + "`"
    }
    if (Cypress.env('ci_status') == true) {
        webhook.send({
            username: "UI Web Test",
            text: message + "\n>`Failure Exception: `\n>" + "`" + stack + "`",
            icon_emoji: ":zap:"
        });
    }
})