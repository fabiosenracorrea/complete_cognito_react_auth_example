import React, { FormEvent, useCallback, useState } from 'react';

import Check from '@material-ui/icons/Check';

import { useAuth } from '../../../hooks/Auth';

import { Form, ResendButton, Loader, FormButton } from '../styles';

interface ResetPasswordProps {
  email: string;
}

const ResetPasswordForm: React.FC<ResetPasswordProps> = ({ email }) => {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [loadingCodeSending, setLoadingCodeSending] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);
  const [codeSentSuccess, setCodeSentSuccess] = useState(false);

  const { confirmUserEmail, reSendConfirmationCode } = useAuth();

  const handleEmailConfirmation = useCallback(
    async (formEvent: FormEvent) => {
      formEvent.preventDefault();

      if (!confirmationCode) return;

      setLoadingReset(true);

      const success = await confirmUserEmail({ code: confirmationCode, email });

      if (!success) setLoadingReset(false);
    },
    [confirmUserEmail, confirmationCode, email],
  );

  const handleCodeResending = useCallback(async () => {
    setLoadingCodeSending(true);

    const sent = await reSendConfirmationCode(email);

    setLoadingCodeSending(false);
    setCodeSentSuccess(sent);
  }, [email, reSendConfirmationCode]);

  return (
    <Form onSubmit={handleEmailConfirmation}>
      <h3>Confirme seu email</h3>

      <p>
        Cheque seu <span>e-mail</span> para o código de confirmação. Foi enviado para <span>{email}</span>
      </p>

      <input
        type="text"
        name="confirmation-code"
        placeholder="Confirmation code"
        value={confirmationCode}
        onChange={({ target }) => setConfirmationCode(target.value)}
        required
      />

      <ResendButton type="button" onClick={handleCodeResending} disabled={codeSentSuccess}>
        {(loadingCodeSending || codeSentSuccess) && <div />}
        Reenviar código
        {codeSentSuccess && <Check />}
        {loadingCodeSending && <Loader />}
      </ResendButton>

      <FormButton
        type="submit"
        disabled={!confirmationCode}
        $loading={loadingReset}
      >
        {loadingReset && <div />}
          Confirmar
        {loadingReset && <Loader />}
      </FormButton>
    </Form>
  );
};

export default ResetPasswordForm;
