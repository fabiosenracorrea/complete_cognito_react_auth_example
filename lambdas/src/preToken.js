'https://aws.amazon.com/blogs/mobile/how-to-use-cognito-pre-token-generators-to-customize-claims-in-id-tokens/'
const AWS = require('aws-sdk');

/*
  This login is relative to a cognito bug that switches 'email confirmed'
  back to false on facebook linked users
*/
class PreTokenHandler {
  constructor({ cognitoService }) {
    this.cognitoService = cognitoService;
  }

  async main(event, _context, callback) {
    console.log('PRE_TOKEN', event)

    const {
      userPoolId,
      userName: Username,
      request: { userAttributes: { identities, email_verified } }
    } = event;

    const emailVerified = ['true', true].some(value => value === email_verified);

    if (!identities?.length || emailVerified) return callback(null, event);

    await this.cognitoService.adminUpdateUserAttributes({
      UserPoolId: userPoolId,
      Username,
      UserAttributes: [{ Name: 'email_verified', Value: 'true' }]
    }).promise();

    callback(null, event);
  }
}

const cognitoService = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });

const handler = new PreTokenHandler({ cognitoService });

module.exports = handler.main.bind(handler);
