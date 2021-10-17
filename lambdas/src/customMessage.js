const AWS = require('aws-sdk');

class CustomMessageHandler {
  constructor({ cognitoService }) {
    this.cognitoService = cognitoService;
  }

  async main(event, context, callback) {
    if (event.triggerSource === "CustomMessage_ForgotPassword") {
      const msg = `Recover your password with the code ${event.request.codeParameter}`;

      event.response.smsMessage = msg;
      event.response.emailSubject = "Password Recovery";
      event.response.emailMessage = msg;
      console.log('EVENT RESPONSE', event.response)
    }

    callback(null, event)
  }
}

const cognitoService = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });

const handler = new CustomMessageHandler({ cognitoService });

module.exports = handler.main.bind(handler);
