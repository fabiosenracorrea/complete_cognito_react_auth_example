import { useAuth } from '../../hooks/Auth';

import logo from '../../assets/logo-generic.svg';

import { HeaderContainer } from './styles'

const Header = () => {
  const { signOut } = useAuth();

  return (
    <HeaderContainer className="app-header">
      <img src={logo} alt="Generic Logo"/>

      <button type="button" onClick={signOut}>
        Logout
      </button>
    </HeaderContainer>
  );
}

export default Header;
