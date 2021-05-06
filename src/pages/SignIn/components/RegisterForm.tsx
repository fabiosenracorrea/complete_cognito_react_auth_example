import React, { FormEvent, useCallback, useEffect, useState } from 'react';

import { useAuth, localStorageKeys } from '../../../hooks/Auth';

import { Form, Loader, FormButton, RegisterBtn } from '../styles';
import { checkPasswordValidity, PasswordStrengthVisualizer } from '../utils';

export interface RegisterFormProps {
  email: string;
  setEmail: (email: string) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ email, setEmail }) => {
  useEffect(() => setEmail(''), []); // eslint-disable-line react-hooks/exhaustive-deps

  const [name, setName] = useState('');
  const [cpf, setCpf] = useState<string | undefined>();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCPF = localStorage.getItem(localStorageKeys.userCPF);

    if (savedCPF) setCpf(savedCPF);
  }, [])

  const { signUp, navigateToLogin } = useAuth();

  const passwordIsValid = checkPasswordValidity(password);

  const handleRegister = useCallback(
    async (formEvent: FormEvent) => {
      formEvent.preventDefault();

      if (!email || !password || !name) return;

      setLoading(true);

      const success = await signUp({ email, password, cpf, name });

      if (!success) setLoading(false);
    },
    [email, password, signUp, name, cpf],
  );

  return (
    <Form onSubmit={handleRegister}>
      <h3>Faça seu Registro</h3>

      <input
        type="text"
        name="name"
        placeholder="Nome"
        value={name}
        onChange={({ target }) => setName(target.value)}
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
        Registrar
        {loading && <Loader />}
      </FormButton>

      <RegisterBtn type="button" onClick={navigateToLogin}>
        <div />
        Voltar ao Login
        <div />
      </RegisterBtn>

    </Form>
  );
};

export default RegisterForm;
