import { Switch } from 'react-router-dom';

import CustomRoute from './Route';

import Landing from '../pages/Landing';
import Dashboard from '../pages/Dashboard';
import OtherPage from '../pages/OtherPage';

function AppRoutes() {
  return (
    <Switch>
      <CustomRoute path="/" exact component={Landing} />
      <CustomRoute path="/dashboard" exact component={Dashboard} isPrivate />
      <CustomRoute path="/other" exact component={OtherPage} isPrivate />
    </Switch>
  );
}

export default AppRoutes;
