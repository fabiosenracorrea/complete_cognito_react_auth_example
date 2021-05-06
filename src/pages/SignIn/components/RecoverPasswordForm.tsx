import React, { FormEvent, useCallback, useState } from 'react';

import { useAuth } from '../../../hooks/Auth';

import { Form, Loader, FormButton } from '../styles';

interface RecoverPasswordProps {
  email: string;
  setEmail: (email: string) => void;
}

const RecoverPassword: React.FC<RecoverPasswordProps> = ({ email, setEmail }) => {
  const [loadingReset, setLoadingReset] = useState(false);

  const { sendResetPasswordCode } = useAuth();

  const handlePasswordReset = useCallback(
    async (formEvent: FormEvent) => {
      formEvent.preventDefault();

      if (!email) return;

      setLoadingReset(true);

      const success = await sendResetPasswordCode(email);

      if (success) return;

      alert('Ocorreu um erro ao enviar o seu código')

      setLoadingReset(false);
    },
    [sendResetPasswordCode, email],
  );

  return (
    <Form onSubmit={handlePasswordReset}>
      <h3>Esqueceu sua senha?</h3>

      <p>
        Informe o seu <span>e-mail</span> que vamos lhe ajudar com isso.
      </p>

      <input
        type="text"
        name="email"
        placeholder="email"
        value={email}
        onChange={({ target }) => setEmail(target.value)}
        required
      />

      <FormButton
        type="submit"
        disabled={!email}
        $loading={loadingReset}
      >
        {loadingReset && <div />}
        Reset
        {loadingReset && <Loader />}
      </FormButton>
    </Form>
  );
};

export default RecoverPassword;
