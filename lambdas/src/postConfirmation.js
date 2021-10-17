const AWS = require('aws-sdk');

class PostConfirmationHandler {
  constructor({ cognitoService }) {
    this.cognitoService = cognitoService;
  }

  async main(event, context, callback) {
    console.log('POST CONFIRMATION', event)

    callback(null, event);
  }
}

const cognitoService = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });

const handler = new PostConfirmationHandler({ cognitoService });

module.exports = handler.main.bind(handler);
