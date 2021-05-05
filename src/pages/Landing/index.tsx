import { Link } from 'react-router-dom';

import oncoImg from '../../assets/logos-unidades-oc-recife.png';

function GenericPage() {
  return (
    <div className="content">
      <img src={oncoImg} alt="onco clinicas"/>

      <h2>LANDING PAGE</h2>

      <Link to="/login" className="btn">Fazer login</Link>
    </div>
  )
}

export default GenericPage;
