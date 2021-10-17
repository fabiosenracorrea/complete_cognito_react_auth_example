import React, { FormEvent, useCallback, useState } from 'react';

import Check from '@material-ui/icons/Check';

import { useAuth } from '../../../hooks/Auth';

import { Form, ResendButton, Loader, FormButton } from '../styles';
import { useEffect } from 'react';

interface ResetPasswordProps {
  email: string;
}

const ConfirmEmailForm: React.FC<ResetPasswordProps> = ({ email }) => {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [loadingCodeSending, setLoadingCodeSending] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);
  const [codeSentSuccess, setCodeSentSuccess] = useState(false);

  const { confirmUserEmail, requestUserEmailConfirmation, userCredentials } = useAuth();

  useEffect(() => {
    /*
      BE AWARE! THERE'S VALIDATION NEEDED HERE TO ENSURE THIS IS NOT SENT TO EXTERNAL_PROVIDER USERS!
    */
    requestUserEmailConfirmation(email);
  }, []) // eslint-disable-line

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

    const sent = await requestUserEmailConfirmation(email);

    setLoadingCodeSending(false);
    setCodeSentSuccess(sent);
  }, [email, requestUserEmailConfirmation]);

  const userEmail = email || userCredentials?.email;

  return (
    <Form onSubmit={handleEmailConfirmation}>
      <h3>Confirm your e-mail</h3>

      <p>
        Check your <span>e-mail</span> for the verification code.{' '}
        {userEmail && (<>It was sent to <span>{userEmail}</span></>)}
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
        Resend code
        {codeSentSuccess && <Check />}
        {loadingCodeSending && <Loader />}
      </ResendButton>

      <FormButton
        type="submit"
        disabled={!confirmationCode}
        $loading={loadingReset}
      >
        {loadingReset && <div />}
          Confirm
        {loadingReset && <Loader />}
      </FormButton>
    </Form>
  );
};

export default ConfirmEmailForm;
