import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/', label: 'Catalogue' },
  { to: '/add', label: 'Add book' },
];

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <NavLink to="/" className="brand">
          <span className="brand__mark" aria-hidden>
            ❦
          </span>
          <span className="brand__name">The Eldoria Library</span>
        </NavLink>

        <nav aria-label="Main">
          <ul className="site-nav">
            {LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end className="site-nav__link">
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
