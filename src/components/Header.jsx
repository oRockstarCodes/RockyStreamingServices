import './Header.css';
import { Link } from 'react-router-dom';

function Header({ showAuthButtons = true }) {

  return (
    <div className="header">
      <h1 id="title">Rocky Streaming Services</h1>
      <nav className="right-nav">
        <a href="#">Latest</a>
        <a href="#">Popular</a>
        <a href="#">Movies</a>
        <a href="#">TV Shows</a>
        <a href="#">About</a>
        <a href="#">Support</a>
        {showAuthButtons && (
          <div className="buttons">
            <Link to={`/register`} className="button">Register</Link>
            <Link to={`/login`} className="button">Login</Link>
          </div>
        )}
      </nav>
    </div>
  );
}

export default Header;
