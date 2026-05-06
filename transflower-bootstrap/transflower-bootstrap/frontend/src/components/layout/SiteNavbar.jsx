import { useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAppState } from '../../contexts/AppStateContext.jsx';
import { logoutUser } from '../../services/transflowerApi.js';

function navClass({ isActive }) {
  return `nav-link${isActive ? ' active' : ''}`;
}

export function SiteNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, cartCount } = useAppState();

  const isHome = location.pathname === '/';
  const isDashboard = location.pathname === '/dashboard';
  const hideCartLink = location.pathname === '/login' || location.pathname === '/register';

  useEffect(() => {
    if (!isHome) return undefined;
    const nav = document.getElementById('mainNav');
    if (!nav) return undefined;

    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  function handleLogout(event) {
    event.preventDefault();
    logoutUser();
    alert('Logged out successfully!');
    navigate('/');
  }

  return (
    <nav className={`navbar navbar-expand-lg${isHome ? ' fixed-top' : ''}`} id={isHome ? 'mainNav' : undefined}>
      <div className="container">
        <Link className="navbar-brand" to="/">
          Transflower
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-3">
            <li className="nav-item">
              <NavLink className={navClass} to="/" end>
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className={navClass} to="/products">
                Products
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className={navClass} to="/about">
                About
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className={navClass} to="/contact">
                Contact
              </NavLink>
            </li>

            {!hideCartLink ? (
              <li className="nav-item">
                <NavLink className={navClass} to="/cart" style={{ position: 'relative' }}>
                  <i className="bi bi-cart3"></i> Cart
                  {cartCount > 0 ? (
                    <span
                      className="badge bg-danger position-absolute"
                      style={{ top: '-5px', right: '-10px' }}
                    >
                      {cartCount}
                    </span>
                  ) : null}
                </NavLink>
              </li>
            ) : null}

            {isDashboard ? (
              <>
                <li className="nav-item">
                  <NavLink className={navClass} to="/dashboard">
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#" id="logoutBtn" onClick={handleLogout}>
                    Logout
                  </a>
                </li>
              </>
            ) : (
              <>
                {!user ? (
                  <li className="nav-item">
                    <NavLink className={navClass} to="/register">
                      Register
                    </NavLink>
                  </li>
                ) : null}

                {!user ? (
                  <li className="nav-item">
                    <NavLink className={navClass} to="/login">
                      Login
                    </NavLink>
                  </li>
                ) : (
                  <li className="nav-item">
                    <a className="nav-link" href="#" onClick={handleLogout}>
                      {user.name} (Logout)
                    </a>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
