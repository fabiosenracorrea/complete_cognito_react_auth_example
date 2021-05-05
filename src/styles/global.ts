import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    primary: '#0cb2aa',
    secondary: '#2832B2',
    text: '#868686',
    button: '#3f51b5',
    buttonBorder: 'rgba(63, 81, 181, 0.5)',
    valid: '#4CAF50',
  },

  fonts: {
    primary: 'Roboto, sans-serif',
  },
};

const GlobalStyle = createGlobalStyle`
  /* standard rules */

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
  }

  /* general global styles */

  button {
    cursor: pointer;
  }

  body {
    min-height: 100vh;
    display: flex;
    align-items: stretch;
  }

  #root {
    width: 100%;
  }

  a {
    text-decoration: none;
    color: #94989c;
    font-weight: 600;
  }

  .content {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .app-header button, .content > a.btn {
    border-radius: 5px;
    border: none;
    background: #0cb2aa;
    color: #fff;
    font-weight: 600;
    font-size: 15px;
    height: 40px;
    width: 120px;
    text-transform: uppercase;
    margin-top: 20px;
    display: grid;
    place-content: center;
  }

`;

export default GlobalStyle;
