/* eslint no-console: "off", @typescript-eslint/no-explicit-any: "off" */
import React, { createContext, useCallback, useState, useContext, useEffect } from 'react';
import Amplify, { Auth } from 'aws-amplify'
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
        'cognito:groups'?: string[];
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
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface ResetPasswordCredentials {
  newPassword: string;
  confirmationCode: string;
  email: string;
}

export interface ChangePasswordCredentials {
  newPassword: string;
}

export type tLoginActions = 'login' | 'change password' | 'reset password' | 'validate cpf' | null;

export interface LoginActionsMapping {
  login: 'login';
  changePassword: 'change password';
  resetPassword: 'reset password';
  validateCPF: 'validate cpf';
}

export interface AuthContextProps {
  user: User;
  loginAction: tLoginActions;
  signIn(credentials: SignInCredentials): Promise<boolean | undefined>;
  resetPassword(credentials: ResetPasswordCredentials): Promise<boolean | undefined>;
  changePassword(credentials: ChangePasswordCredentials): Promise<boolean | undefined>;
  sendResetPasswordCode(userEmail: string): Promise<boolean>;
  signOut(): void;
  saveCPF: (cpf: string) => void;
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

        alert('Sign-in error, please check your credentials and try again');
      }
    },
    [],
  );

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
      try {
        await Auth.forgotPassword(email);

        alert('Confirmation code sent! Please check your email');

        return true;
      } catch (err) {
        alert('Confirmation code not sent');
      }
      return false;
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

        setUserData(currentUser)
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
