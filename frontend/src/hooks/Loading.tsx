import { createContext, useContext, useState, FC, Dispatch, SetStateAction } from "react";

import Loading from '../components/Loading';

interface LoadingProps {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const loadingContext = createContext<LoadingProps>({} as LoadingProps);

export const LoadingProvider: FC = ({ children }) => {
  const [loading, setLoading] = useState(true);

  return (
    <loadingContext.Provider value={{ loading, setLoading }}>
      {loading && <Loading />}

      {children}
    </loadingContext.Provider>
  )
}

export function useLoading(): LoadingProps {
  const context = useContext(loadingContext);

  return context;
}
