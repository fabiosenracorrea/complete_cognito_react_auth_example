const AWS = require('aws-sdk');

const ORIGINS = {
  FACEBOOK: 'facebook',
  GOOGLE: 'google',
}

const PROVIDER_ID_SEPARATOR = '_';

class UserLinkHandler {
  constructor({ cognitoService }) {
    this.cognitoService = cognitoService;
  }

  determineIfExternalOriginIsFBorGoogle(username) {
    const externalOrigins = Object.values(ORIGINS)

    const isExternal = externalOrigins.some(origin => username.includes(origin));

    return isExternal;
  }

  parseProviderName(username) {
    const isFacebook = username.toLowerCase().includes(ORIGINS.FACEBOOK);

    return isFacebook ? 'Facebook' : 'Google';
  }

  getUserLinkParams({ externalId, username, userPoolId, externalProvider }) {
    const LinkParams = {
      DestinationUser: {
        ProviderAttributeValue: username,
        ProviderName: 'Cognito'
      },

      SourceUser: {
        ProviderAttributeValue: externalId,
        ProviderAttributeName: 'Cognito_Subject',
        ProviderName: externalProvider,
      },

      UserPoolId: userPoolId,
    };

    return LinkParams;
  }

  determineIfProviderHasBeenLinked({ UserAttributes }, provider) {
    const providerLinked = UserAttributes.find(({ Name, Value }) => {
      const isIdentityAttribute = Name === 'identities';

      if (!isIdentityAttribute) return false;

      const identitiesArray = JSON.parse(Value);

      const hasProvider = identitiesArray.find(({ providerName }) => providerName === provider);

      return hasProvider;
    });

    return Boolean(providerLinked);
  }

  getUpdatedEventWithEmailVerified(event) {
    const updatedEvent = {
      ...event,
      request: {
        ...event.request,
        userAttributes: {
          ...event.request.userAttributes,
          email_verified: 'true',
        }
      },

      response: {
        autoConfirmUser: true,
        autoVerifyEmail: true,
        autoVerifyPhone: false,
      }
    };

    return updatedEvent;
  }

  async main(event, _context, callback) {
    const updatedEvent = this.getUpdatedEventWithEmailVerified(event);

    const {
      userPoolId,
      userName,
      request: { userAttributes: { email } }
    } = updatedEvent;

    const externalIsFromGoogleOrFacebook = this.determineIfExternalOriginIsFBorGoogle(userName);

    if (!externalIsFromGoogleOrFacebook) return callback(null, updatedEvent);

    console.log('EXTERNAL SIGNUP', updatedEvent);

    const getUserParams = {
      UserPoolId: userPoolId,
      Username: email
    };

    try {
      const user =  await this.cognitoService.adminGetUser(getUserParams).promise();

      console.log('user!', user)

      const [provider, externalId] = userName.split(PROVIDER_ID_SEPARATOR);
      const externalProvider = this.parseProviderName(provider);

      const isLinked = this.determineIfProviderHasBeenLinked(user, externalProvider);

      if (isLinked) return callback('LINKED!');

      const LinkParams = this.getUserLinkParams({ username: user.Username, externalId, userPoolId, externalProvider });

      await this.cognitoService.adminLinkProviderForUser(LinkParams).promise();

      callback(null, updatedEvent);
    } catch (err) {
      console.log('external signup error', err);

      callback('External Signup Error - User E-mail not registered');
    }
  }
}

const cognitoService = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });

const handler = new UserLinkHandler({ cognitoService });

module.exports = handler.main.bind(handler);
