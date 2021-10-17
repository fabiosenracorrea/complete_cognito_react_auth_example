import React, { FormEvent, useEffect, useState } from 'react';

import { useAuth } from '../../../hooks/Auth';

import { Form, Loader, FormButton, RegisterBtn } from '../styles';
import { checkPasswordValidity, PasswordStrengthVisualizer } from '../utils';

export interface RegisterFormProps {
  email: string;
  setEmail: (email: string) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ email, setEmail }) => {
  useEffect(() => setEmail(''), []); // eslint-disable-line react-hooks/exhaustive-deps

  const [name, setName] = useState('');
  const [cpf, setCpf] = useState<string>('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const { signUp, navigateToLogin } = useAuth();

  const passwordIsValid = checkPasswordValidity(password);

  const handleRegister = async (formEvent: FormEvent): Promise<void> => {
    formEvent.preventDefault();

    if (!email || !password || !name || !phoneNumber || !cpf) return;

    setLoading(true);

    const success = await signUp({ email, password, cpf, name, phoneNumber });

    if (!success) setLoading(false);
  }

  return (
    <Form onSubmit={handleRegister}>
      <h3>Register</h3>

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={name}
        onChange={({ target }) => setName(target.value)}
        required
      />

      <input
        type="text"
        name="cpf"
        placeholder="CPF (numbers)"
        value={cpf}
        onChange={({ target }) => setCpf(target.value)}
        required
      />

      <input
        type="text"
        name="email"
        placeholder="E-mail"
        value={email}
        onChange={({ target }) => setEmail(target.value)}
        required
      />

      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={phoneNumber}
        onChange={({ target }) => setPhoneNumber(target.value)}
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

      <PasswordStrengthVisualizer password={password} />

      <FormButton type="submit" disabled={loading || !passwordIsValid} $loading={loading}>
        {loading && <div />}
        Register
        {loading && <Loader />}
      </FormButton>

      <RegisterBtn type="button" onClick={navigateToLogin}>
        <div />
        Back to Login
        <div />
      </RegisterBtn>

    </Form>
  );
};

export default RegisterForm;
