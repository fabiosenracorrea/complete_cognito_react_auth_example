import React, { FormEvent, useCallback, useState } from 'react';
import { Auth } from 'aws-amplify'

import FacebookIcon from '@material-ui/icons/Facebook';
import { FaGoogle, FaLock, FaSignInAlt } from 'react-icons/fa';

import { localStorageKeys, useAuth } from '../../../hooks/Auth';

import { Form, Loader, FormButton, FacebookBtn, GoogleBtn, PrivateBtn, ForgotPasswordBtn, RegisterBtn } from '../styles';

import { SignInFormProps } from '../types';

const SignInForm: React.FC<SignInFormProps> = ({ email, setEmail }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, forgotPassword, navigateToRegister } = useAuth();

  const handleLogIn = useCallback(
    async (formEvent: FormEvent) => {
      formEvent.preventDefault();

      if (!email || !password) return;


      setLoading(true);

      const success = await signIn({ email, password });

      if (!success) setLoading(false);
    },
    [email, password, signIn],
  );

  const handleProviderLogin = useCallback((provider: 'Google' | 'Facebook' | 'Rede-Corporativa') => {
    localStorage.setItem(localStorageKeys.providerSignIn, provider);

    Auth.federatedSignIn({ provider: provider as any });
  }, [])

  return (
    <Form onSubmit={handleLogIn}>
      <h3>Faça seu Login</h3>

      <input
        type="text"
        name="email"
        placeholder="e-mail"
        value={email}
        onChange={({ target }) => setEmail(target.value)}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="password"
        value={password}
        onChange={({ target }) => setPassword(target.value)}
        required
      />

      <ForgotPasswordBtn className="forgot" type="button" onClick={forgotPassword}>
        Esqueci minha senha
      </ForgotPasswordBtn>

      <FormButton type="submit" disabled={loading} $loading={loading}>
        {loading && <div />}
        Login
        {loading && <Loader />}
      </FormButton>

      <RegisterBtn type="button" onClick={navigateToRegister}>
        <FaSignInAlt />
        Cadastre-se
        <div />
      </RegisterBtn>

      <FacebookBtn type="button" onClick={() => handleProviderLogin('Facebook')}>
        <FacebookIcon />
        Facebook Login
        <div />
      </FacebookBtn>

      <GoogleBtn type="button" onClick={() => handleProviderLogin('Google')}>
        <FaGoogle />
        Google Login
        <div />
      </GoogleBtn>

      <PrivateBtn type="button" onClick={() => handleProviderLogin('Rede-Corporativa')}>
        <FaLock />
        Private Network
        <div />
      </PrivateBtn>

    </Form>
  );
};

export default SignInForm;
