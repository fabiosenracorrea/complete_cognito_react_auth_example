import React, { useState } from 'react';

import SignInForm from './components/SignInForm';
import ChangePasswordForm from './components/ChangePasswordForm';
import ResetPasswordForm from './components/ResetPasswordForm';

import { useAuth } from '../../hooks/Auth';

import OWAnalyticsLogo from '../../assets/analytics-logo.svg';
import { Container, Content } from './styles';

import { SignInFormProps } from './types';

const RenderForm: React.FC<SignInFormProps> = ({ email, setEmail }) => {
  const { loginAction } = useAuth();

  switch (loginAction) {
    case 'login':
      return <SignInForm email={email} setEmail={setEmail} />;
    case 'change password':
      return <ChangePasswordForm />;
    case 'reset password':
      return <ResetPasswordForm email={email} />;
    default:
      return null;
  }
};

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');

  return (
    <Container>
      <Content>
        <img src={OWAnalyticsLogo} alt="OW Analytics" />
        <RenderForm email={email} setEmail={setEmail} />
      </Content>
    </Container>
  );
};

export default Auth;
