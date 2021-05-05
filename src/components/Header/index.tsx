import { useAuth } from '../../hooks/Auth';

import oncoImg from '../../assets/logos-unidades-oc-recife.png';
import './styles.css';

const Header = () => {
  const { signOut } = useAuth();

  return (
    <header className="app-header">
      <img src={oncoImg} alt="onco clinicas"/>

      <button type="button" onClick={signOut}>
        Sair
      </button>
    </header>
  );
}

export default Header;
