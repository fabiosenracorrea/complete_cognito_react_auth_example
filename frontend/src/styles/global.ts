import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    primary: '#0d79d6',
    text: '#868686',
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

    img {
      height: 80px;
      margin-bottom: 15px;
    }
  }

  .content > a.btn {
    border-radius: 5px;
    border: none;
    background: #0d79d6;
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
