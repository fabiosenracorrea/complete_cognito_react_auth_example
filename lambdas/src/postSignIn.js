const AWS = require('aws-sdk');

class PostSignInHandler {
  constructor({ cognitoService }) {
    this.cognitoService = cognitoService;
  }

  async main(event, context, callback) {
    console.log('POST SIGN IN', event)

    callback(null, event);
  }
}

const cognitoService = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });

const handler = new PostSignInHandler({ cognitoService });

module.exports = handler.main.bind(handler);
