import { Link } from 'react-router-dom';

import Header from '../../components/Header';

function GenericPage() {

  return (
    <div>
      <Header />
      <div className="content">
        <h2>Dashboard after successful login</h2>
        <Link to="/other">Go to another logged in page</Link>
      </div>
    </div>
  )
}

export default GenericPage;
