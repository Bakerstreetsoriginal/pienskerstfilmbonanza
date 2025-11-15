import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminService, movieService } from '../../services'
import ArtyRating from '../../components/ArtyRating'
import '../../styles/AdminDashboard.css'

const AdminDashboard = () => {
  const [reviews, setReviews] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [reviewsData, statsData] = await Promise.all([
        adminService.getAllReviews(),
        movieService.getStats()
      ])
      
      setReviews(reviewsData)
      setStats(statsData)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (reviewId, movieTitle) => {
    if (!window.confirm(`Weet je zeker dat je de review voor "${movieTitle}" wilt verwijderen?`)) {
      return
    }

    try {
      await adminService.deleteReview(reviewId)
      setReviews(reviews.filter(r => r.id !== reviewId))
      alert('Review verwijderd!')
    } catch (error) {
      console.error('Error deleting review:', error)
      alert('Fout bij verwijderen van review')
    }
  }

  if (loading) {
    return <div className="loading">Dashboard laden...</div>
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <header className="dashboard-header">
          <h1>🎄 Admin Dashboard</h1>
          <Link to="/admin/review/new" className="btn btn-primary">
            + Nieuwe Review
          </Link>
        </header>

        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.total_reviews}</div>
              <div className="stat-label">Totaal Reviews</div>
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
        )}

        <div className="reviews-section">
          <h2>Alle Reviews</h2>
          
          {reviews.length === 0 ? (
            <div className="empty-state">
              <p>Nog geen reviews! Begin met het toevoegen van je eerste kerstfilm review.</p>
              <Link to="/admin/review/new" className="btn btn-primary">
                + Eerste Review Toevoegen
              </Link>
            </div>
          ) : (
            <div className="reviews-table">
              {reviews.map(review => (
                <div key={review.id} className="review-row">
                  <div className="review-info">
                    {review.movie.poster_url && (
                      <img 
                        src={review.movie.poster_url} 
                        alt={review.movie.title}
                        className="review-thumbnail"
                      />
                    )}
                    <div className="review-details">
                      <h3>{review.movie.title}</h3>
                      <div className="review-meta">
                        {review.movie.year && <span>{review.movie.year}</span>}
                        <span>•</span>
                        <span>Gekeken: {new Date(review.watched_date).toLocaleDateString('nl-NL')}</span>
                      </div>
                      <ArtyRating rating={review.arty_rating} size="small" />
                    </div>
                  </div>
                  
                  <div className="review-actions">
                    <Link 
                      to={`/reviews/${review.id}`}
                      className="btn btn-secondary btn-small"
                      target="_blank"
                    >
                      👁️ Bekijken
                    </Link>
                    <Link 
                      to={`/admin/review/edit/${review.id}`}
                      className="btn btn-secondary btn-small"
                    >
                      ✏️ Bewerken
                    </Link>
                    <button 
                      onClick={() => handleDelete(review.id, review.movie.title)}
                      className="btn btn-danger btn-small"
                    >
                      🗑️ Verwijderen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

