import { Link } from 'react-router-dom';

import logo from '../../assets/logo-generic.svg';

function GenericPage() {
  return (
    <div className="content">
      <img src={logo} alt="Generic Logo"/>

      <h2>LANDING PAGE</h2>

      <Link to="/login" className="btn">Login</Link>
    </div>
  )
}

export default GenericPage;
