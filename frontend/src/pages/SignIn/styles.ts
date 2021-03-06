import styled, { css } from 'styled-components';
import { shade } from 'polished';

interface FormButtonProps {
  $loading?: boolean;
}

export const Container = styled.div`
  height: 100vh;
  width: 100vw;
  padding: 0 20px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Content = styled.div`
  text-align: center;

  img {
    margin: 0 auto 20px;
    height: 8rem;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;

  margin: 0 auto;
  max-width: 340px;
  width: 100%;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};

  h3 {
    font-size: 2rem;
    margin-bottom: 20px;
  }

  h4 {
    margin-bottom: 20px;
    font-size: 1.4rem;
  }

  > p {
    margin: 20px 0;

    span {
      color: ${({ theme }) => theme.colors.primary};
    }
  }

  > p + p {
    margin-top: 0;
  }

  > div {
    margin-bottom: 25px;
  }

  > input,
  button:not(.forgot) {
    height: 40px;
  }

  input {
    border: 1px solid ${({ theme }) => theme.colors.text};
    margin-bottom: 15px;
  }

  input,
  button {
    padding: 8px;
    border-radius: 10px;
    outline: none;
  }
`;

export const FormButton = styled.button<FormButtonProps>`
  color: white;
  background-color: ${({ theme }) => theme.colors.primary};
  border: none;
  outline: none;
  font-size: 1.2rem;

  transition: background-color 0.2s;

  display: flex;
  align-items: center;
  justify-content: center;

  div {
    width: 20px;
  }

  ${({ $loading }) =>
    $loading &&
    css`
      justify-content: space-between;
    `}

  &:not(:disabled):hover {
    background-color: ${({ theme }) => shade(0.15, theme.colors.primary)};
  }

  &.is-disable:disabled {
    cursor: default;
    background-color: ${({ theme }) => shade(0.45, theme.colors.primary)};
  }
`;

export const BaseBaseIdentityButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: none;
  outline: none;
  color: #fff;
  font-size: 1.2rem;
  margin-top: 12px;
`;

export const ForgotPasswordBtn = styled.button`
  background: transparent;
  border: none;
  text-align: end;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors.text};
  width: fit-content;
  margin-left: auto;
`;

export const RegisterBtn = styled(BaseBaseIdentityButton)`
  background-color: ${({ theme }) => theme.colors.text};
`;

export const FacebookBtn = styled(BaseBaseIdentityButton)`
  background-color: #4267b2;
`;

export const GoogleBtn = styled(BaseBaseIdentityButton)`
  background-color: #4285F4;
`;

export const PrivateBtn = styled(BaseBaseIdentityButton)`
  background-color: ${({ theme }) => shade(0.45, theme.colors.primary)};
`;

export const ResendButton = styled(FormButton)`
  margin-bottom: 10px;
`;

export const PasswordOpsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  div {
    display: flex;
    align-items: center;

    font-size: 80%;
    color: ${({ theme }) => theme.colors.text};

    svg {
      width: 20px;
      height: 20px;
      margin-right: 4px;
    }

    &.valid {
      color: ${({ theme }) => theme.colors.valid};
    }

    & + div {
      margin-top: 6px;
    }

    &:nth-child(2),
    &:nth-child(4) {
      svg {
        margin: 0 0 0 4px;
      }

      justify-self: end;
    }
  }
`;

export const Loader = styled.div`
  font-size: 10px;
  text-indent: -9999em;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ffffff;
  background: -moz-linear-gradient(left, #ffffff 10%, rgba(255, 255, 255, 0) 42%);
  background: -webkit-linear-gradient(left, #ffffff 10%, rgba(255, 255, 255, 0) 42%);
  background: -o-linear-gradient(left, #ffffff 10%, rgba(255, 255, 255, 0) 42%);
  background: -ms-linear-gradient(left, #ffffff 10%, rgba(255, 255, 255, 0) 42%);
  background: linear-gradient(to right, #ffffff 10%, rgba(255, 255, 255, 0) 42%);
  position: relative;
  -webkit-animation: load3 1.4s infinite linear;
  animation: load3 1.4s infinite linear;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);

  &:before {
    width: 50%;
    height: 50%;
    background: #ffffff;
    border-radius: 100% 0 0 0;
    position: absolute;
    top: 0;
    left: 0;
    content: '';
  }
  &:after {
    background: ${({ theme }) => theme.colors.primary};
    width: 75%;
    height: 75%;
    border-radius: 50%;
    content: '';
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  @-webkit-keyframes load3 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes load3 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
`;
