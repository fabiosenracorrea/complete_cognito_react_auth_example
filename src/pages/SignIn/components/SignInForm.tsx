import React, { FormEvent, useCallback, useState } from 'react';

import { useAuth } from '../../../hooks/Auth';

import { Form, Loader, FormButton } from '../styles';

import { SignInFormProps } from '../types';

const SignInForm: React.FC<SignInFormProps> = ({ email, setEmail }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();

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

  return (
    <Form onSubmit={handleLogIn}>
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
      <FormButton type="submit" disabled={loading} $loading={loading}>
        {loading && <div />}
        Login
        {loading && <Loader />}
      </FormButton>
    </Form>
  );
};

export default SignInForm;
