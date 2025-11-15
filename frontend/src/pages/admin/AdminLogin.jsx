import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import '../../styles/AdminLogin.css'

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/admin')
    } catch (err) {
      console.error('Login error:', err)
      setError('Ongeldige email of wachtwoord')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="login-container">
        <div className="login-card">
          <h1>🎄 Admin Login</h1>
          <p className="login-subtitle">Welkom terug, Pien! ❄️</p>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="pien@kerstfilms.nl"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Wachtwoord</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? 'Inloggen...' : 'Inloggen'}
            </button>
          </form>

          <div className="login-footer">
            <a href="/">← Terug naar home</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin

