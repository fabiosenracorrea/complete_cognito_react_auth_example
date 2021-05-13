/* eslint no-console: "off", @typescript-eslint/no-explicit-any: "off" */
import React, { createContext, useCallback, useState, useContext, useEffect } from 'react';
import Amplify, { Auth } from 'aws-amplify';
import { useLoading } from "./Loading";

export interface UserAttributes {
  email: string;
  email_verified: boolean;
  sub: string;
  name: string;
  'custom:CPF'?: string;
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
  name: string;
  cpf?: string;
}

export interface ResetPasswordCredentials {
  newPassword: string;
  confirmationCode: string;
  email: string;
}

export interface ChangePasswordCredentials {
  newPassword: string;
}

export type tLoginActions = 'login' | 'change password' | 'reset password' | 'validate cpf' | 'forgot password' | 'register' | 'confirm email' | null;

export interface LoginActionsMapping {
  login: 'login';
  changePassword: 'change password';
  resetPassword: 'reset password';
  validateCPF: 'validate cpf';
  forgotPw: 'forgot password';
  register: 'register';
  confirmEmail: 'confirm email';
}

export interface AuthContextProps {
  user: User;
  loginAction: tLoginActions;
  signIn(credentials: SignInCredentials): Promise<boolean | undefined>;
  signUp: (credentials: SignUpCredentials) => Promise<boolean | undefined | void>
  resetPassword(credentials: ResetPasswordCredentials): Promise<boolean | undefined>;
  changePassword(credentials: ChangePasswordCredentials): Promise<boolean | undefined>;
  sendResetPasswordCode(userEmail: string): Promise<boolean>;
  confirmUserEmail: (confirmData: ConfirmEmail) => Promise<boolean>
  signOut(): void;
  saveCPF: (cpf: string) => void;
  forgotPassword: () => void;
  navigateToRegister: () => void;
  navigateToLogin: () => void;
  reSendConfirmationCode: (email: string) => Promise<boolean>;
}


Amplify.configure({
  aws_project_region: 'us-east-1',
  aws_cognito_region: 'us-east-1',
  aws_user_pools_id: 'us-east-1_DS4ZryIzt',
  aws_user_pools_web_client_id: '4u5jca9iaajr1lgvus59i008e5',
});

Auth.configure({
  oauth: {
    domain: "oncoclinicasdemo.auth.us-east-1.amazoncognito.com",
    scope: [
      "phone",
      "email",
      "openid",
      "aws.cognito.signin.user.admin",
      "profile"
    ],
    redirectSignIn: "http://localhost:3000",
    redirectSignOut: "http://localhost:3000",
    responseType: "token"
  },
});

export const localStorageKeys = {
  user: '@user/info',
  validityCheck: 'lastValidityCheck',
  userCPF: '@user/cpf',
};

const loginActions: LoginActionsMapping = {
  login: 'login',
  changePassword: 'change password',
  resetPassword: 'reset password',
  validateCPF: 'validate cpf',
  forgotPw: 'forgot password',
  register: 'register',
  confirmEmail: 'confirm email',
};

function parseAwsUserData(user: AwsUser): User {
  const { attributes, username, userDataKey, signInUserSession } = user;

  const userGroups = signInUserSession.accessToken.payload['cognito:groups'] || [];

  const userInfo = {
    ...attributes,
    username,
    userDataKey,
    userGroups,
  };

  return userInfo;
}

async function addCpfToUser(user: AwsUser): Promise<void> {
  const cpf = localStorage.getItem(localStorageKeys.userCPF);

  if (!cpf || user.attributes['custom:CPF']) return;

  await Auth.updateUserAttributes(user, {
    'custom:CPF': cpf,
  });
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

const AuthProvider: React.FC = ({ children }) => {
  const { setLoading } = useLoading();

  const [userData, setUserData] = useState<User>(() => {
    const user = localStorage.getItem(localStorageKeys.user);

    if (user) {
      return JSON.parse(user);
    }

    return {} as User;
  });

  const [tempUserData, setTempUserData] = useState<TempUserData | null>(null);

  const [loginAction, setLoginAction] = useState<tLoginActions>(() => {
    const userInfoIsPresent = Object.keys(userData).length > 0;

    if (userInfoIsPresent) return null;

    return loginActions.validateCPF;
  });

  const saveCPF = useCallback((cpf: string) => {
    localStorage.setItem(localStorageKeys.userCPF, cpf);
    setLoginAction('login')
  }, [])

  const signIn = useCallback(
    async ({ email, password }) => {
      try {
        const user = (await Auth.signIn(email, password)) as AwsUser;

        console.log(user);

        if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
          setLoginAction(loginActions.changePassword);
          setTempUserData(user as TempUserData);

          return;
        }

        const dataToStore = parseAwsUserData(user);

        addCpfToUser(user);

        setUserData(dataToStore);
        localStorage.setItem(localStorageKeys.user, JSON.stringify(dataToStore));
        setLoginAction(null);

        return true;
      } catch (err) {
        if (err.code === 'PasswordResetRequiredException') {
          setLoginAction(loginActions.resetPassword);

          return;
        }

        if (err.code === 'UserNotConfirmedException') {
          alert('Please confirm your email')
          setLoginAction(loginActions.confirmEmail);

          return;
        }

        alert('Sign-in error, please check your credentials and try again');
      }
    },
    [],
  );

  const signUp = useCallback(async ({ name, email, password, cpf }) => {
    try {
      await Auth.signUp({
        username: email,
        password,
        attributes: {
          name,
          email,
          'custom:CPF': cpf,
        },
        validationData: {
          password,
        }
      });

      setLoginAction(loginActions.confirmEmail)

      return true;
    } catch (err) {
      console.log(err);

      const BAD_PASSWORD = /Password Compromised/ig;

      if (BAD_PASSWORD.test(err.message)) return alert('It seems your password does not pass our security checks. Please review it and try again');

      if (err.code === 'UsernameExistsException') return alert('Theres an user with this email already!');

      alert('Sign-un error, please check your credentials and try again');
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

        const dataToStore = parseAwsUserData(updatedUserData);
        setUserData(dataToStore);
        localStorage.setItem(localStorageKeys.user, JSON.stringify(dataToStore));
        setLoginAction(null);
        setTempUserData(null);

        return true;
      } catch (err) {
        console.log(err);

        alert('Error while changing your password');
      }

      return false;
    },
    [tempUserData],
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

  const confirmUserEmail = useCallback(async ({ email, code }) => {
    let success = false;

    try {
      await Auth.confirmSignUp(email, code);

      alert('Success! You can now login');

      setLoginAction(loginActions.login)
    } catch (err) {
      if(err.code === 'CodeMismatchException') alert('Code Mismatch')

      success = false;
    }

    return success;
  }, []);

  const reSendConfirmationCode = useCallback(async (email: string) => {
    let sent = true;

    try {
      await Auth.resendSignUp(email);

      alert('Confirmation Code sent! Check your e-mail')
    } catch (err) {
      alert('Confirmation Code not sent')
      sent = false;
    }

    return sent;
  }, [])

  const forgotPassword = useCallback(() => setLoginAction(loginActions.forgotPw), []);

  const navigateToRegister = useCallback(() => setLoginAction(loginActions.register), []);

  const navigateToLogin = useCallback(() => setLoginAction(loginActions.login), []);

  const signOut = useCallback(async () => {
    await Auth.signOut();

    localStorage.removeItem(localStorageKeys.user);

    setLoginAction(loginActions.validateCPF);
    setUserData({} as User);
  }, []);

  useEffect(() => {
    async function reCheckUser() {
      try {
        setLoading(true);
        const currentUser = await Auth.currentAuthenticatedUser();

        addCpfToUser(currentUser);

        setUserData(currentUser);
        setLoginAction(null)
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
        signIn,
        signOut,
        changePassword,
        resetPassword,
        sendResetPasswordCode,
        saveCPF,
        forgotPassword,
        navigateToRegister,
        signUp,
        navigateToLogin,
        confirmUserEmail,
        reSendConfirmationCode,
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
