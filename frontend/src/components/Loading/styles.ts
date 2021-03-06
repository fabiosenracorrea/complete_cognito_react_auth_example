import styled from 'styled-components';

export const LoadingContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  z-index: 999;
  background: rgb(0, 0, 0);

  display: grid;
  place-content: center;
`;

export const Loader = styled.div`
  border: 12px solid #c1c4c9; /* Light grey */
  border-top: 12px solid #04b4ac; /* Blue */
  border-radius: 50%;
  width: 100px;
  height: 100px;
  animation: spin 1.6s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
