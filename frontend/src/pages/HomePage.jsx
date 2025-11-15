import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { movieService } from '../services/movieService'
import MovieCard from '../components/MovieCard'
import '../styles/HomePage.css'

const HomePage = () => {
  const [recentReviews, setRecentReviews] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [reviews, statsData] = await Promise.all([
        movieService.getMovies(),
        movieService.getStats()
      ])
      
      setRecentReviews(reviews.slice(0, 3))
      setStats(statsData)
    } catch (error) {
      console.error('Error loading homepage data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Laden...</div>
  }

  return (
    <div className="home-page">
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">
            🎄 Welkom bij Pien's Kerstfilm Bonanza! ❄️
          </h1>
          <p className="hero-subtitle">
            De meest hippe 90's-stijl website voor kerstfilm reviews!
            <br />
            Met exclusieve Arty-ratings! 🐱
          </p>
          <Link to="/reviews" className="btn btn-primary btn-large">
            Bekijk Alle Reviews
          </Link>
        </div>
      </section>

      {stats && stats.total_reviews > 0 && (
        <section className="stats-section">
          <div className="container">
            <h2>📊 Statistieken</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{stats.total_reviews}</div>
                <div className="stat-label">Reviews</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.average_rating}</div>
                <div className="stat-label">Gemiddelde Rating</div>
              </div>
              {stats.highest_rated && (
                <div className="stat-card">
                  <div className="stat-value">{stats.highest_rated.rating}/10</div>
                  <div className="stat-label">Hoogste Rating</div>
                  <div className="stat-extra">{stats.highest_rated.title}</div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {recentReviews.length > 0 && (
        <section className="recent-reviews">
          <div className="container">
            <h2>🎬 Recente Reviews</h2>
            <div className="movies-grid">
              {recentReviews.map(review => (
                <MovieCard key={review.id} review={review} />
              ))}
            </div>
            <div className="text-center">
              <Link to="/reviews" className="btn btn-secondary">
                Zie Alle Reviews →
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="about-preview">
        <div className="container">
          <h2>🎅 Over Deze Site</h2>
          <p>
            Welkom bij mijn persoonlijke collectie kerstfilm reviews!
            Elk jaar kijk ik tientallen kerstfilms en geef ze een rating
            met Arty-koppen (mijn kat natuurlijk! 🐱).
          </p>
          <Link to="/about" className="btn btn-secondary">
            Meer Over Pien →
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage

