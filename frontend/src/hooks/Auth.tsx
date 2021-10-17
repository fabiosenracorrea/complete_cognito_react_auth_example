/* eslint no-console: "off", @typescript-eslint/no-explicit-any: "off" */
import React, { createContext, useCallback, useState, useContext, useEffect } from 'react';
import Amplify, { Auth } from 'aws-amplify';

import { useLoading } from "./Loading";
import { useHashParams } from './hashParams';

export interface UserAttributes {
  email: string;
  email_verified: boolean;
  sub: string;
  name: string;
  'custom:CPF': string;
}

export interface AwsUser {
  Session: null;
  attributes: UserAttributes;
  username: string;
  userDataKey: string;
  authenticationFlowType: string;
  keyPrefix: string;
  storage: {
    [localStorageKey: string]: string;
  };

  signInUserSession: {
    accessToken: {
      payload: {
        'cognito:groups'?: string[]; // used to validate private users
      };
    };
  };

  challengeName?: string;
}

export interface TempUserData extends AwsUser {
  challengeParam: {
    requiredAttributes: Array<object>;
    useAttributes: any;
    CODE_DELIVERY_DESTINATION?: string;
  };
}

export interface User extends UserAttributes {
  [key: string]: any;
  username: string;
  userDataKey: string;
  userGroups: string[]
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface ConfirmEmail {
  email: string;
  code: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  phoneNumber: string;
  name: string;
  cpf: string;
}

export interface ResetPasswordCredentials {
  newPassword: string;
  confirmationCode: string;
  email: string;
}

export interface ChangePasswordCredentials {
  newPassword: string;
}

interface UserCredentials {
  email: string;
  password: string;
}

export type tLoginActions =
  | 'login'
  | 'change password'
  | 'reset password'
  | 'forgot password'
  | 'register'
  | 'confirm email'
  | 'confirm phone'
  | 'confirm MFA'
  | null;

export interface LoginActionsMapping {
  login: 'login';
  changePassword: 'change password';
  resetPassword: 'reset password';
  // validateCPF: 'validate cpf';
  forgotPw: 'forgot password';
  register: 'register';
  confirmEmail: 'confirm email';
  confirmPhone: 'confirm phone';
  confirmMFA: 'confirm MFA';
}

export interface AuthContextProps {
  user: User;
  loginAction: tLoginActions;
  userCredentials: UserCredentials | null;
  userPhone: string | null;
  signIn(credentials: SignInCredentials): Promise<boolean | undefined>;
  signUp: (credentials: SignUpCredentials) => Promise<boolean | undefined | void>
  resetPassword(credentials: ResetPasswordCredentials): Promise<boolean | undefined>;
  changePassword(credentials: ChangePasswordCredentials): Promise<boolean | undefined>;
  sendResetPasswordCode(userEmail: string): Promise<boolean>;
  requestUserEmailConfirmation(userEmail: string): Promise<boolean>;
  confirmUserPhone: (confirmData: ConfirmEmail) => Promise<boolean>;
  confirmUserEmail: (confirmData: ConfirmEmail) => Promise<boolean>;
  completeMFA: (confirmData: ConfirmEmail) => Promise<boolean>;
  retryMFA: () => Promise<boolean>;
  signOut(): void;
  forgotPassword: () => void;
  navigateToRegister: () => void;
  navigateToLogin: () => void;
  reSendConfirmationCode: (email: string) => Promise<boolean>;
}

Amplify.configure({
  aws_project_region: process.env.REACT_APP_AWS_REGION,
  aws_cognito_region: process.env.REACT_APP_AWS_REGION,
  aws_user_pools_id: process.env.REACT_APP_COGNITO_POOL,
  aws_user_pools_web_client_id: process.env.REACT_APP_COGNITO_CLIENT,
});

Auth.configure({
  oauth: {
    domain: "oc-identity.auth.us-east-1.amazoncognito.com",
    scope: [
      "phone",
      "email",
      "openid",
      "aws.cognito.signin.user.admin",
      "profile"
    ],
    redirectSignIn: process.env.REACT_APP_REDIRECT_SIGN_IN,
    redirectSignOut: process.env.REACT_APP_REDIRECT_SIGN_OUT,
    responseType: "token"
  },
});

export const localStorageKeys = {
  user: '@user/info',
  validityCheck: 'lastValidityCheck',
  userCPF: '@user/cpf',
  providerSignIn: '@provider',
};

const loginActions: LoginActionsMapping = {
  login: 'login',
  changePassword: 'change password',
  resetPassword: 'reset password',
  // validateCPF: 'validate cpf',
  forgotPw: 'forgot password',
  register: 'register',
  confirmEmail: 'confirm email',
  confirmPhone: 'confirm phone',
  confirmMFA: 'confirm MFA',
};

function parseAwsUserData(user: AwsUser): User {
  const { attributes, username, userDataKey, signInUserSession } = user;

  const userGroups = signInUserSession?.accessToken?.payload?.['cognito:groups'] || [];

  const userInfo = {
    ...attributes,
    username,
    userDataKey,
    userGroups,
  };

  return userInfo;
}

// async function addCpfToUser(user: AwsUser): Promise<void> {
//   const cpf = localStorage.getItem(localStorageKeys.userCPF);

//   if (!cpf || user.attributes['custom:CPF']) return;

//   await Auth.updateUserAttributes(user, {
//     'custom:CPF': cpf,
//   });
// }

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

const AuthProvider: React.FC = ({ children }) => {
  const { setLoading } = useLoading();

  const hashParams = useHashParams();

  /*
    When you link a FB/Google user to an existing cognito user using the pre-signUp lambda
    the sdk throws an error. It only happens the first time, so we can just re-call the federated
    login and the user will get in.
  */
  useEffect(() => {
    const providerRedirect = localStorage.getItem(localStorageKeys.providerSignIn);
    const hasError = 'error' in hashParams;

    if (!hasError || !providerRedirect) return;

    const errorDescription = hashParams.error_description || '';
    const userLinkErrorRegex = /^already found an entry for username (facebook|google)_/i
    const shouldRecallFederatedSignIn = userLinkErrorRegex.test(errorDescription);

    if (!shouldRecallFederatedSignIn) return;

    localStorage.removeItem(localStorageKeys.providerSignIn);

    Auth.federatedSignIn({ provider: providerRedirect as any })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [userData, setUserData] = useState<User>(() => {
    const user = localStorage.getItem(localStorageKeys.user);

    if (user) return JSON.parse(user);

    return {} as User;
  });

  const [userCredentials, setUserCredentials] = useState<UserCredentials | null>(null);
  const [userPhone, setUserPhone] = useState<string | null>(null);

  const [tempUserData, setTempUserData] = useState<TempUserData | null>(null);

  const [loginAction, setLoginAction] = useState<tLoginActions>(() => {
    if (userData.sub) return null;

    return loginActions.login
  });

  const parseUserForEmailConfirmation = useCallback((awsUser: AwsUser) => {
    const user = parseAwsUserData(awsUser);

    const { email_verified, email } = user;

    console.log('user', user)

    setUserData(user);
    localStorage.setItem(localStorageKeys.user, JSON.stringify(user));

    setUserCredentials(email_verified ? null : { email, password: '' })
    setLoginAction(email_verified ? null : loginActions.confirmEmail);
    setTempUserData(email_verified ? null : awsUser as TempUserData);
  }, [])

  const signIn = useCallback(
    async ({ email, password }) => {
      try {
        const user = (await Auth.signIn(email, password)) as AwsUser;

        const credentials = { email, password };
        setUserCredentials(credentials);

        if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
          setLoginAction(loginActions.changePassword);
          setTempUserData(user as TempUserData);

          return;
        }

        if (user.challengeName === 'SMS_MFA') {
          setLoginAction(loginActions.confirmMFA);
          setTempUserData(user as TempUserData);
          setUserPhone((user as TempUserData)?.challengeParam?.CODE_DELIVERY_DESTINATION || null)

          return;
        }

        parseUserForEmailConfirmation(user)

        return true;
      } catch (err) {
        console.log(err)

        if (err.code === 'PasswordResetRequiredException') {
          setLoginAction(loginActions.resetPassword);

          return;
        }

        if (err.code === 'UserNotConfirmedException') {
          alert('Please confirm your phone')
          setLoginAction(loginActions.confirmPhone);

          return;
        }

        alert('Sign-in error, please check your credentials and try again');
        setUserCredentials(null);
      }
    },
    [parseUserForEmailConfirmation],
  );

  const signUp = useCallback(async ({ name, email, password, cpf, phoneNumber }) => {
    const phoneNumberFormatted = `+55${phoneNumber}`; // this should be validated before sending in!

    try {
      const pre = await Auth.signUp({
        username: email,
        password,
        attributes: {
          name,
          email,
          'custom:CPF': cpf,
          phone_number: phoneNumberFormatted,
        },
        validationData: {
          password,
        }
      });

      console.log('SIGNUP', pre)

      const credentials = { email, password };
      setUserCredentials(credentials);

      setLoginAction(loginActions.confirmPhone)

      return true;
    } catch (err) {
      console.log(err);

      const BAD_PASSWORD = /Password Compromised/ig;

      if (BAD_PASSWORD.test(err.message)) return alert('It seems your password does not pass our security checks. Please review it and try again');

      if (err.code === 'UsernameExistsException') return alert('Theres an user with this email already!');

      alert('Sign-up error, please check your credentials and try again');
    }
  }, [])

  const changePassword = useCallback(
    async ({ newPassword }) => {
      if (!tempUserData) return false;

      try {
        const updatedUserData = await Auth.completeNewPassword(
          tempUserData,
          newPassword,
          tempUserData.challengeParam.requiredAttributes,
        );

        setTempUserData(null);

        parseUserForEmailConfirmation(updatedUserData)

        return true;
      } catch (err) {
        console.log(err);

        alert('Error while changing your password');
      }

      return false;
    },
    [tempUserData, parseUserForEmailConfirmation],
  );

  const sendResetPasswordCode = useCallback(
    async (email) => {
      let status = true;

      try {
        await Auth.forgotPassword(email);

        alert('Confirmation code sent! Please check your email');

        setLoginAction(loginActions.resetPassword);

      } catch (err) {
        alert('Confirmation code not sent');

        status = false;
      }

      return status;
    },
    [],
  );

  const resetPassword = useCallback(
    async ({ newPassword, confirmationCode, email }) => {
      try {
        await Auth.forgotPasswordSubmit(email, confirmationCode, newPassword);

        alert('Password successfully reset. You can now login');

        setLoginAction(loginActions.login);

        return true;
      } catch (err) {
        console.log(err);

        alert('Error while resetting password');
      }

      return false;
    },
    [],
  );

  const confirmUserPhone = useCallback(async ({ email, code }) => {
    let success = false;

    try {
      await Auth.confirmSignUp(email, code);

      alert('Success! Phone Confirmed. You can now login');

      setLoginAction(loginActions.login);

      success = true;
    } catch (err) {
      if (err.code === 'CodeMismatchException') alert('Code Mismatch');

      console.log('confirm error', err)

      success = false;
    }

    return success;
  }, []);

  const requestUserEmailConfirmation = useCallback(async (email) => {
    let sent = true;

    try {
      await Auth.verifyUserAttribute(tempUserData, 'email');
    } catch (err) {
      console.log(err)
      sent = false
    }

    return sent;
  }, [tempUserData])

  const confirmUserEmail = useCallback(async ({ email, code }) => {
    let success = false;

    try {
      await Auth.verifyUserAttributeSubmit(tempUserData, 'email', code)

      alert('Success! Email verified');

      setLoginAction(null)
      setUserCredentials(null)
      setTempUserData(null);
    } catch (err) {
      if (err.code === 'CodeMismatchException') alert('Code Mismatch');

      alert('Error verifying email')

      console.log(err)

      success = false;
    }

    return success;
  }, [tempUserData]);

  const reSendConfirmationCode = useCallback(async (email: string) => {
    let sent = true;

    try {
      await Auth.resendSignUp(email);

      alert('Confirmation Code sent! Check your phone')
    } catch (err) {
      alert('Confirmation Code not sent')
      sent = false;
    }

    return sent;
  }, []);

  const retryMFA = useCallback(async () => {
    let sent = true;

    try {
      await signIn(userCredentials)

      alert('Code sent! Check your phone')
    } catch (err) {
      alert('Confirmation Code not sent')
      sent = false;
    }

    return sent;
  }, [userCredentials, signIn]);

  const completeMFA = useCallback(async ({ code }) => {
    let success = false;

    try {
      await Auth.confirmSignIn(tempUserData, code, 'SMS_MFA');

      alert('MFA Completed with success');

      const awsUser = await Auth.currentAuthenticatedUser();

      parseUserForEmailConfirmation(awsUser)

      success = true;
    } catch (err) {
      console.log('MFA COMPLETION ERROR', err);

      alert('It was not possible to complete MFA. Check your code and try again')
    }

    return success;
  }, [tempUserData, parseUserForEmailConfirmation])

  const forgotPassword = useCallback(() => setLoginAction(loginActions.forgotPw), []);

  const navigateToRegister = useCallback(() => setLoginAction(loginActions.register), []);

  const navigateToLogin = useCallback(() => setLoginAction(loginActions.login), []);

  const signOut = useCallback(async () => {
    await Auth.signOut();

    localStorage.removeItem(localStorageKeys.user);

    setLoginAction(loginActions.login);
    setUserData({} as User);
  }, []);

  useEffect(() => {
    async function reCheckUser() {
      try {
        setLoading(true)

        const awsUser = await Auth.currentAuthenticatedUser();
        parseUserForEmailConfirmation(awsUser)

      } catch (error) {
        signOut();
      } finally {
        setLoading(false)
      }
    }

    reCheckUser();
  }, []); // eslint-disable-line

  return (
    <AuthContext.Provider
      value={{
        loginAction,
        user: userData,
        userPhone,
        userCredentials,
        signIn,
        signOut,
        changePassword,
        resetPassword,
        sendResetPasswordCode,
        forgotPassword,
        navigateToRegister,
        signUp,
        navigateToLogin,
        confirmUserPhone,
        confirmUserEmail,
        reSendConfirmationCode,
        requestUserEmailConfirmation,
        completeMFA,
        retryMFA,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextProps {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
