import { Link } from 'react-router-dom';
import Header from '../../components/Header';

function GenericPage() {
  return (
    <div>
      <Header />
      <div className="content">
        <h2>Another page</h2>
        <Link to="/dashboard">Go to Dashboard</Link>
      </div>
    </div>
  );
}

export default GenericPage;
