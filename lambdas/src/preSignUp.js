const axios = require('axios');

const userLinkVerification = require('./userLink');

async function preSignUp(event, context, callback) {
  event.response.autoConfirmUser = false;
  event.response.autoVerifyEmail = false
  event.response.autoVerifyPhone = false;

  const isExternalProviderSignUp = event.triggerSource === 'PreSignUp_ExternalProvider';

  if (isExternalProviderSignUp) return userLinkVerification.apply(this, [event, context, callback]);

  console.log('pre SIGNUP', event)

  const {
    // validationData: { password },
    userName,
    userAttributes: { phone_number },
  } = event.request;

  /*
    You can use this lambda to validate A LOT of stuff! Even pw security.
  */

  // if (!password) return callback('Missing Password for Validation');
  if (!phone_number) return callback('Phone number is required');

  // const passwordError = await validatePassword(password);
  const passwordError = ''; // placeholder

  passwordError ? callback(passwordError) : callback(null, event);
}

module.exports = preSignUp
