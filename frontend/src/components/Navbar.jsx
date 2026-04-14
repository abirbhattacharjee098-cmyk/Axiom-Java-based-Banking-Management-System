import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
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
      
      <div className="navbar-links" style={{ display: 'flex', alignItems: 'center' }}>
        <button onClick={toggleTheme} className="btn" style={{ background: 'transparent', color: 'var(--text-main)', padding: '8px', marginRight: '16px' }}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {user ? (
          <>
            <span style={{ marginRight: '16px' }}>Welcome, {user.username}</span>
            {user.role === 'ROLE_ADMIN' ? (
              <Link to="/admin" style={{ marginLeft: 0 }}>Admin Hub</Link>
            ) : (
              <>
                <Link to="/dashboard" style={{ marginLeft: 0, marginRight: '16px' }}>Dashboard</Link>
                <Link to="/transfer" style={{ marginLeft: 0, marginRight: '16px' }}>Transfer</Link>
                <Link to="/loans" style={{ marginLeft: 0 }}>Loans</Link>
              </>
            )}
            <button onClick={handleLogout} className="btn btn-danger" style={{ marginLeft: '16px' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginLeft: 0, marginRight: '16px' }}>Login</Link>
            <Link to="/register" className="btn btn-primary" style={{ marginLeft: 0 }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
