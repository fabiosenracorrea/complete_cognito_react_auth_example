import React from 'react';

import CheckBox from '@material-ui/icons/CheckBox';

import { PasswordOpsContainer } from './styles';

interface PasswordAnalyzerProps {
  password: string;
}

interface PasswordValidations {
  [key: string]: boolean;
}

const uppercaseRegex = /[A-Z]+/;
const lowerCaseRegex = /[a-z]+/;
const specialCharRegex = /(\W)+/;

export const passOptionValidators = {
  '8+ chars': (pw: string) => pw.length > 8,

  Uppercase: (pw: string) => uppercaseRegex.test(pw),

  Lowercase: (pw: string) => lowerCaseRegex.test(pw),

  'Special char': (pw: string) => specialCharRegex.test(pw),
};

function getUpdatedConditions(password: string): PasswordValidations {
  const passwordValidators = Object.keys(passOptionValidators)
    .map((option) => {
      const validate = passOptionValidators[option as keyof typeof passOptionValidators];

      const isValid = validate(password);

      return { [option]: isValid };
    })
    .reduce((a, b) => ({ ...a, ...b }), {});

  return passwordValidators;
}

export function checkPasswordValidity(password: string): boolean {
  const isValid = Object.keys(passOptionValidators)
    .map((option) => {
      const validate = passOptionValidators[option as keyof typeof passOptionValidators];

      const ruleIsValid = validate(password);

      return ruleIsValid;
    })
    .every((rule) => rule);

  return isValid;
}

export const PasswordStrengthVisualizer: React.FC<PasswordAnalyzerProps> = ({ password }) => {
  const passwordValidators = getUpdatedConditions(password);

  return (
    <PasswordOpsContainer>
      {Object.keys(passOptionValidators).map((option, index) => (
        <div className={passwordValidators[option] ? 'valid' : undefined} key={option}>
          {index % 2 === 0 && <CheckBox />}
          <span>{option}</span>
          {index % 2 === 1 && <CheckBox />}
        </div>
      ))}
    </PasswordOpsContainer>
  );
};
