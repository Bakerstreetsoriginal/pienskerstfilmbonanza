import { useEffect, useState } from 'react'
import { movieService } from '../services/movieService'
import MovieCard from '../components/MovieCard'
import FilterPanel from '../components/FilterPanel'
import '../styles/ReviewsPage.css'

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([])
  const [filters, setFilters] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReviews()
  }, [filters])

  const loadReviews = async () => {
    setLoading(true)
    try {
      const data = await movieService.getMovies(filters)
      setReviews(data)
    } catch (error) {
      console.error('Error loading reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="reviews-page">
      <div className="container">
        <header className="page-header">
          <h1>🎬 Alle Kerstfilm Reviews</h1>
          <p>Ontdek wat Pien vond van al deze prachtige (en soms minder prachtige) kerstfilms!</p>
        </header>

        <FilterPanel filters={filters} onFilterChange={setFilters} />

        {loading ? (
          <div className="loading">Reviews laden...</div>
        ) : reviews.length > 0 ? (
          <>
            <div className="results-count">
              {reviews.length} review{reviews.length !== 1 ? 's' : ''} gevonden
            </div>
            <div className="movies-grid">
              {reviews.map(review => (
                <MovieCard key={review.id} review={review} />
              ))}
            </div>
          </>
        ) : (
          <div className="no-results">
            <h3>Geen reviews gevonden</h3>
            <p>Probeer andere filters of zoektermen!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewsPage

