import { Link } from 'react-router-dom'
import ArtyRating from './ArtyRating'
import '../styles/MovieCard.css'

const MovieCard = ({ review }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <Link to={`/reviews/${review.id}`} className="movie-card">
      <div className="movie-poster">
        {review.poster_url ? (
          <img src={review.poster_url} alt={review.movie_title} />
        ) : (
          <div className="poster-placeholder">
            🎄
            <span>Geen poster</span>
          </div>
        )}
      </div>
      
      <div className="movie-info">
        <h3 className="movie-title">{review.movie_title}</h3>
        {review.movie_year && <p className="movie-year">{review.movie_year}</p>}
        
        <ArtyRating rating={review.arty_rating} size="small" />
        
        <p className="movie-watched">Gekeken: {formatDate(review.watched_date)}</p>
        
        {review.genres && review.genres.length > 0 && (
          <div className="movie-genres">
            {review.genres.map((genre, index) => (
              <span key={index} className="genre-tag">{genre}</span>
            ))}
          </div>
        )}
        
        <p className="movie-preview">{review.review_preview}</p>
      </div>
    </Link>
  )
}

export default MovieCard

