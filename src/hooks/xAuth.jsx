import { createContext, useCallback, useContext, useEffect, useState } from "react";
import Amplify, { Auth } from 'aws-amplify'
import { useLoading } from "./Loading";

Amplify.configure({
  aws_project_region: 'us-east-1',
  aws_cognito_region: 'us-east-1',
  aws_user_pools_id: 'us-east-1_DS4ZryIzt',
  aws_user_pools_web_client_id: '48j6mdglkb571n74fin8a3ge8k',
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


const authContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState();
  const { setLoading } = useLoading();

  const logout = useCallback(async () => {
    await Auth.signOut();

    setUser(null);
  }, []);

  useEffect(() => {
    async function reCheckUser() {
      try {
        setLoading(true);
        const currentUser = await Auth.currentAuthenticatedUser();

        console.log(currentUser)

        setUser(currentUser)
      } catch (error) {
        logout();
      } finally {
        setLoading(false)
      }
    }

    reCheckUser();
  }, []); // eslint-disable-line

  return (
    <authContext.Provider value={{ user, logout }}>
      {children}
    </authContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(authContext);

  return context;
}
