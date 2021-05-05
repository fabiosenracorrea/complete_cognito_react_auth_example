import { Link } from 'react-router-dom';

import Header from '../../components/Header';

function GenericPage() {

  return (
    <div>
      <Header />
      <div className="content">
        <h2>Dashboard depois do Login</h2>
        <Link to="/other">Navegar para outra página</Link>
      </div>
    </div>
  )
}

export default GenericPage;
