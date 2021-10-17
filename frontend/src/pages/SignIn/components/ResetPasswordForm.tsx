import React, { FormEvent, useCallback, useState } from 'react';

import Check from '@material-ui/icons/Check';

import { useAuth } from '../../../hooks/Auth';

import { PasswordStrengthVisualizer, checkPasswordValidity } from '../utils';

import { Form, ResendButton, Loader, FormButton } from '../styles';

interface ResetPasswordProps {
  email: string;
}

const ResetPasswordForm: React.FC<ResetPasswordProps> = ({ email }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [loadingCodeSending, setLoadingCodeSending] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);
  const [codeSentSuccess, setCodeSentSuccess] = useState(false);

  const passwordIsValid = checkPasswordValidity(newPassword);

  const { resetPassword, sendResetPasswordCode } = useAuth();

  const handlePasswordReset = useCallback(
    async (formEvent: FormEvent) => {
      formEvent.preventDefault();

      if (!newPassword) return;

      setLoadingReset(true);

      const success = await resetPassword({ newPassword, confirmationCode, email });

      if (!success) setLoadingReset(false);
    },
    [newPassword, resetPassword, confirmationCode, email],
  );

  const handleCodeResending = useCallback(async () => {
    setLoadingCodeSending(true);

    const codeSent = await sendResetPasswordCode(email);

    setLoadingCodeSending(false);
    setCodeSentSuccess(codeSent);
  }, [email, sendResetPasswordCode]);

  return (
    <Form onSubmit={handlePasswordReset}>
      <h3>Welcome back!</h3>

      <p>Your password needs to be changed</p>
      <p>
        Check your <span>e-mail</span> for the confirmation code.
      </p>

      <input
        type="text"
        name="confirmation-code"
        placeholder="Confirmation code"
        value={confirmationCode}
        onChange={({ target }) => setConfirmationCode(target.value)}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="New password"
        value={newPassword}
        onChange={({ target }) => setNewPassword(target.value)}
        required
      />

      <PasswordStrengthVisualizer password={newPassword} />

      <ResendButton type="button" onClick={handleCodeResending} disabled={codeSentSuccess}>
        {(loadingCodeSending || codeSentSuccess) && <div />}
        Re-send code
        {codeSentSuccess && <Check />}
        {loadingCodeSending && <Loader />}
      </ResendButton>

      <FormButton
        type="submit"
        className={passwordIsValid ? undefined : 'is-disable'}
        disabled={!passwordIsValid}
        $loading={loadingReset}
      >
        {loadingReset && <div />}
        Reset
        {loadingReset && <Loader />}
      </FormButton>
    </Form>
  );
};

export default ResetPasswordForm;
