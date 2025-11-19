import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Layout.css'

const Layout = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path ? 'active' : ''

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            🎄 Pien's Kerstfilm Bonanza ❄️
          </Link>
          
          <nav className="nav">
            <Link to="/" className={isActive('/')}>Home</Link>
            <Link to="/reviews" className={isActive('/reviews')}>Reviews</Link>
            <Link to="/about" className={isActive('/about')}>Over Pien</Link>
            
            {isAuthenticated && (
              <>
                <Link to="/admin" className={isActive('/admin')}>Dashboard</Link>
                <button onClick={logout} className="btn btn-logout">Uitloggen</button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="main">
        {children}
      </main>

      <footer className="footer">
        <div className="container">
          <p>🎅 © 2025 Pien's Kerstfilm Bonanza by Dizzyman • Made with ❤️ and ❄️</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout

