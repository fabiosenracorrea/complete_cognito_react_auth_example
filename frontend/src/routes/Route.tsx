import { FC, ComponentType } from 'react'
import {
  Route as ReactDOMRoute,
  Redirect,
  RouteProps
} from 'react-router-dom';

import { useAuth } from '../hooks/Auth';

interface CustomRouteProps extends RouteProps {
  isPrivate?: boolean;
  component: ComponentType;
}

const Route: FC<CustomRouteProps> = ({ isPrivate = false, component: Component, ...rest }) => {
  const { loginAction } = useAuth();

  const isSigned = !loginAction;

  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        return isPrivate === isSigned ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: isPrivate ? '/' : '/dashboard',
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export default Route;
