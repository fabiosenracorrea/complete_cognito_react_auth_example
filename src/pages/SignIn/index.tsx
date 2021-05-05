import React, { useState } from 'react';

import SignInForm from './components/SignInForm';
import ChangePasswordForm from './components/ChangePasswordForm';
import ResetPasswordForm from './components/ResetPasswordForm';
import CpfForm from './components/CpfFrom';

import { useAuth } from '../../hooks/Auth';

import oncoImg from '../../assets/logos-unidades-oc-recife.png';
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
    case 'validate cpf':
      return <CpfForm />;
    default:
      return null;
  }
};

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');

  return (
    <Container>
      <Content>
        <img src={oncoImg} alt="Onco Clínicas" />
        <RenderForm email={email} setEmail={setEmail} />
      </Content>
    </Container>
  );
};

export default Auth;
