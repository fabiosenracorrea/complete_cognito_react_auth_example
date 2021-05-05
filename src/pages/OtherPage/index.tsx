import { Link } from 'react-router-dom';
import Header from '../../components/Header';

function GenericPage() {
  return (
    <div>
      <Header />
      <div className="content">
        <h2>Outra página</h2>
        <Link to="/dashboard">Ir para o Dashboard</Link>
      </div>
    </div>
  );
}

export default GenericPage;
