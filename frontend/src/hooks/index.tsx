import { FC } from 'react';
import { AuthProvider } from './Auth';
import { LoadingProvider } from './Loading';

const AppProvider: FC = ({ children }) => {
  return (
    <LoadingProvider>
      <AuthProvider>{children}</AuthProvider>
    </LoadingProvider>
  )
}

export default AppProvider;
