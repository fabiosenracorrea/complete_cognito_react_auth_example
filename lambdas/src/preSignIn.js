const AWS = require('aws-sdk');

class PreSignInHandler {
  constructor({ cognitoService }) {
    this.cognitoService = cognitoService;
  }

  async main(event, context, callback) {
    console.log('PRE-SIGN-IN', event);

    callback(null, event);
  }
}

const cognitoService = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });

const handler = new PreSignInHandler({ cognitoService });

module.exports = handler.main.bind(handler);
