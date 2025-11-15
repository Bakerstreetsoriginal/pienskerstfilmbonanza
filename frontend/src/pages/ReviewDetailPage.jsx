import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { movieService } from '../services/movieService'
import ArtyRating from '../components/ArtyRating'
import '../styles/ReviewDetailPage.css'

const ReviewDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [review, setReview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadReview()
  }, [id])

  const loadReview = async () => {
    try {
      const data = await movieService.getMovie(id)
      setReview(data)
    } catch (error) {
      console.error('Error loading review:', error)
      setError('Review niet gevonden')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Review laden...</div>
  }

  if (error || !review) {
    return (
      <div className="container">
        <div className="error-message">
          <h2>Oeps! 🎄</h2>
          <p>{error || 'Review niet gevonden'}</p>
          <button onClick={() => navigate('/reviews')} className="btn btn-primary">
            Terug naar Reviews
          </button>
        </div>
      </div>
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="review-detail-page">
      <div className="container">
        <button onClick={() => navigate('/reviews')} className="btn-back">
          ← Terug naar alle reviews
        </button>

        <div className="review-header">
          {review.movie.poster_url && (
            <div className="review-poster">
              <img src={review.movie.poster_url} alt={review.movie.title} />
            </div>
          )}
          
          <div className="review-header-info">
            <h1>{review.movie.title}</h1>
            {review.movie.original_title && review.movie.original_title !== review.movie.title && (
              <p className="original-title">({review.movie.original_title})</p>
            )}
            
            <div className="movie-meta">
              {review.movie.year && <span className="meta-item">📅 {review.movie.year}</span>}
              {review.movie.runtime && <span className="meta-item">⏱️ {review.movie.runtime} min</span>}
              {review.movie.director && <span className="meta-item">🎬 {review.movie.director}</span>}
            </div>

            <ArtyRating rating={review.arty_rating} size="large" />

            <div className="watched-info">
              <strong>Gekeken op:</strong> {formatDate(review.watched_date)}
            </div>

            {review.genres && review.genres.length > 0 && (
              <div className="review-genres">
                {review.genres.map((genre) => (
                  <span key={genre.id} className="genre-badge">{genre.name}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {review.movie.plot && (
          <div className="movie-plot">
            <h2>📖 Plot</h2>
            <p>{review.movie.plot}</p>
          </div>
        )}

        {review.movie.cast && (
          <div className="movie-cast">
            <h2>🎭 Cast</h2>
            <p>{review.movie.cast}</p>
          </div>
        )}

        <div className="review-content">
          <h2>✍️ Review door Pien</h2>
          <div className="review-text">
            {review.review_text.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        {review.movie.backdrop_url && (
          <div className="review-backdrop">
            <img src={review.movie.backdrop_url} alt={`${review.movie.title} backdrop`} />
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewDetailPage

