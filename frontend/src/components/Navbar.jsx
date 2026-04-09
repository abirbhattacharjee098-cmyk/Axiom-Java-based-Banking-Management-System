import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="text-gradient">Axiom</span> Bank
      </Link>
      
      <div className="navbar-links">
        {user ? (
          <>
            <span>Welcome, {user.username}</span>
            {user.role === 'ROLE_ADMIN' ? (
              <Link to="/admin">Admin Hub</Link>
            ) : (
              <>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/transfer">Transfer</Link>
              </>
            )}
            <button onClick={handleLogout} className="btn btn-danger" style={{ marginLeft: '16px' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
