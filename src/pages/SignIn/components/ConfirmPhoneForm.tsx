import React, { FormEvent, useCallback, useState } from 'react';

import Check from '@material-ui/icons/Check';

import { useAuth } from '../../../hooks/Auth';

import { Form, ResendButton, Loader, FormButton } from '../styles';

interface ResetPasswordProps {
  email: string;
}

const ConfirmEmailForm: React.FC<ResetPasswordProps> = ({ email }) => {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [loadingCodeSending, setLoadingCodeSending] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);
  const [codeSentSuccess, setCodeSentSuccess] = useState(false);

  const { confirmUserPhone, reSendConfirmationCode, loginAction, completeMFA, userPhone, retryMFA } = useAuth();

  const isMFA = loginAction === 'confirm MFA';

  const handleEmailConfirmation = useCallback(
    async (formEvent: FormEvent) => {
      formEvent.preventDefault();

      if (!confirmationCode) return;

      setLoadingReset(true);

      const callback = isMFA ? completeMFA : confirmUserPhone;

      const success = await callback({ code: confirmationCode, email });

      if (!success) setLoadingReset(false);
    },
    [confirmUserPhone, confirmationCode, email, isMFA, completeMFA],
  );

  const handleCodeResending = useCallback(async () => {
    setLoadingCodeSending(true);

    const callback = isMFA ? retryMFA : reSendConfirmationCode;

    const sent = await callback(email);

    setLoadingCodeSending(false);
    setCodeSentSuccess(sent);
  }, [email, reSendConfirmationCode, retryMFA, isMFA]);

  return (
    <Form onSubmit={handleEmailConfirmation}>
      <h3>{isMFA ? 'Complete seu login' : 'Confirme seu telefone'}</h3>

      <p>
        Cheque seu <span>telefone</span> para o código de confirmação.
        {userPhone ? (
          <>
            Foi enviado para o telefone de final <span>{userPhone}</span>
          </>
        ) : ''}
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

export default ConfirmEmailForm;
