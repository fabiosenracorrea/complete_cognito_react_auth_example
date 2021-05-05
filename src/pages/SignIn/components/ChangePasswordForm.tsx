import React, { FormEvent, useCallback, useState } from 'react';

import { useAuth } from '../../../hooks/Auth';

import { PasswordStrengthVisualizer, checkPasswordValidity } from '../utils';

import { Form, Loader, FormButton } from '../styles';

const ChangePasswordForm: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [loadingChange, setLoadingChange] = useState(false);

  const passwordIsValid = checkPasswordValidity(newPassword);

  const { changePassword } = useAuth();

  const handleChangeOfPassword = useCallback(
    async (formEvent: FormEvent) => {
      formEvent.preventDefault();

      if (!newPassword) return;

      setLoadingChange(true);

      const success = await changePassword({ newPassword });

      if (!success) setLoadingChange(false);
    },
    [newPassword, changePassword],
  );

  return (
    <Form onSubmit={handleChangeOfPassword}>
      <h3>Welcome back!</h3>

      <p>Change your password to something secure</p>

      <input
        type="password"
        name="password"
        placeholder="New password"
        value={newPassword}
        onChange={({ target }) => setNewPassword(target.value)}
        required
      />

      <PasswordStrengthVisualizer password={newPassword} />

      <FormButton
        type="submit"
        className={passwordIsValid ? undefined : 'is-disable'}
        disabled={!passwordIsValid}
        $loading={loadingChange}
      >
        {loadingChange && <div />}
        Change
        {loadingChange && <Loader />}
      </FormButton>
    </Form>
  );
};

export default ChangePasswordForm;
