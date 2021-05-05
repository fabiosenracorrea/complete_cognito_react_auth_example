import { BrowserRouter } from 'react-router-dom';

import AppRoutes from './routes';
import AppProvider from './hooks';

import GlobalStyles, { theme } from './styles/global';
import { ThemeProvider } from 'styled-components';

function App() {
  return (
    <BrowserRouter>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
