const AWS = require('aws-sdk');

async function createUser() {
  const cognitoService = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });

  await cognitoService.adminCreateUser({
    UserPoolId: 'us-east-1_ZPYjZUOnJ',
    Username: '13483144609',
    TemporaryPassword: 'fabio@FABIO1',
    UserAttributes: [
      {
        Name: 'email',
        Value: 'fabiosenracorrea@gmail.com',
      },
      {
        Name: 'phone_number',
        Value: '+5531983165230',
      },
      {
        Name: 'email_verified',
        Value: 'true',
      },
      {
        Name: 'phone_number_verified',
        Value: 'true',
      },
    ],
  }).promise();
}

module.exports = createUser;
