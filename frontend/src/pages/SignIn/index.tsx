import React, { useState } from 'react';

import SignInForm from './components/SignInForm';
import ChangePasswordForm from './components/ChangePasswordForm';
import ResetPasswordForm from './components/ResetPasswordForm';
import RecoverPasswordForm from './components/RecoverPasswordForm';
import RegisterForm from './components/RegisterForm';
// import CpfForm from './components/CpfFrom';
import ConfirmPhoneForm from './components/ConfirmPhoneForm';
import ConfirmEmailForm from './components/ConfirmEmailForm';

import { useAuth } from '../../hooks/Auth';

import logo from '../../assets/logo-generic.svg';
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
    // case 'validate cpf':
    //   return <CpfForm />;
    case 'forgot password':
      return <RecoverPasswordForm email={email} setEmail={setEmail} />;
    case 'register':
      return <RegisterForm email={email} setEmail={setEmail} />
    case 'confirm phone':
      return <ConfirmPhoneForm email={email} />
    case 'confirm MFA':
      return <ConfirmPhoneForm email={email} />
    case 'confirm email':
      return <ConfirmEmailForm email={email} />
    default:
      return null;
  }
};

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');

  return (
    <Container>
      <Content>
        <img src={logo} alt="Generic Logo" />
        <RenderForm email={email} setEmail={setEmail} />
      </Content>
    </Container>
  );
};

export default Auth;
