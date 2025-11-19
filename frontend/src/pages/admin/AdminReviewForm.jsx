import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { adminService } from '../../services/adminService'
import ArtyRating from '../../components/ArtyRating'
import '../../styles/AdminReviewForm.css'

const AdminReviewForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  // Form state
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  
  // Movie search
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)
  
  // Review data
  const [reviewText, setReviewText] = useState('')
  const [artyRating, setArtyRating] = useState(5)
  const [watchedDate, setWatchedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedGenres, setSelectedGenres] = useState([])
  
  // Available genres
  const [genres, setGenres] = useState([])

  useEffect(() => {
    loadGenres()
    
    if (isEdit) {
      loadReview()
    }
  }, [id])

  // Auto-search when user types (debounced)
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSearchResults([])
      return
    }

    // Debounce: wait 500ms after last keystroke
    const timeoutId = setTimeout(() => {
      performSearch()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const loadGenres = async () => {
    try {
      const data = await adminService.getGenres()
      setGenres(data)
    } catch (err) {
      console.error('Error loading genres:', err)
    }
  }

  const loadReview = async () => {
    try {
      const reviews = await adminService.getAllReviews()
      const review = reviews.find(r => r.id === parseInt(id))
      
      if (!review) {
        setError('Review niet gevonden')
        return
      }

      setSelectedMovie(review.movie)
      setReviewText(review.review_text)
      setArtyRating(review.arty_rating)
      setWatchedDate(review.watched_date)
      setSelectedGenres(review.genres.map(g => g.id))
    } catch (err) {
      console.error('Error loading review:', err)
      setError('Kon review niet laden')
    } finally {
      setLoading(false)
    }
  }

  const performSearch = async () => {
    if (!searchQuery.trim()) return

    setSearching(true)
    try {
      const results = await adminService.searchTMDB(searchQuery)
      setSearchResults(results.results || [])
    } catch (err) {
      console.error('Error searching TMDB:', err)
      // Don't show alert for auto-search
    } finally {
      setSearching(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    performSearch()
  }

  const handleSelectMovie = async (tmdbMovie) => {
    try {
      // Create movie from TMDB data
      const movie = await adminService.createMovieFromTMDB(tmdbMovie.tmdb_id)
      setSelectedMovie(movie)
      setSearchResults([])
      setSearchQuery('')
    } catch (err) {
      console.error('Error creating movie:', err)
      alert('Fout bij ophalen van film data')
    }
  }

  const handleGenreToggle = (genreId) => {
    setSelectedGenres(prev => 
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedMovie) {
      alert('Selecteer eerst een film!')
      return
    }

    if (reviewText.length < 10) {
      alert('Review moet minimaal 10 characters bevatten!')
      return
    }

    setSaving(true)
    setError('')

    try {
      const reviewData = {
        movie_id: selectedMovie.id,
        review_text: reviewText,
        arty_rating: artyRating,
        watched_date: watchedDate,
        genre_ids: selectedGenres
      }

      if (isEdit) {
        await adminService.updateReview(id, reviewData)
        alert('Review bijgewerkt!')
      } else {
        await adminService.createReview(reviewData)
        alert('Review toegevoegd!')
      }

      navigate('/admin')
    } catch (err) {
      console.error('Error saving review:', err)
      setError(err.response?.data?.detail || 'Fout bij opslaan van review')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="loading">Review laden...</div>
  }

  return (
    <div className="admin-review-form">
      <div className="container">
        <header className="form-header">
          <h1>{isEdit ? '✏️ Review Bewerken' : '+ Nieuwe Review'}</h1>
          <button onClick={() => navigate('/admin')} className="btn btn-secondary">
            ← Terug
          </button>
        </header>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Movie Selection */}
          {!isEdit && !selectedMovie && (
            <div className="form-section">
              <h2>1. Zoek Film op TMDB</h2>
              <p className="search-hint">💡 Type minimaal 3 letters, zoeken gebeurt automatisch</p>
              <div className="search-box">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Bijv. Love Actually, Home Alone..."
                  className="search-input"
                  autoFocus
                />
                {searching && <span className="search-loading">🔍 Zoeken...</span>}
              </div>

              {searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map(movie => (
                    <div 
                      key={movie.tmdb_id} 
                      className="search-result-item"
                      onClick={() => handleSelectMovie(movie)}
                    >
                      {movie.poster_url && (
                        <img src={movie.poster_url} alt={movie.title} />
                      )}
                      <div className="result-info">
                        <h3>{movie.title}</h3>
                        {movie.year && <p>{movie.year}</p>}
                        {movie.overview && <p className="overview">{movie.overview.substring(0, 150)}...</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Selected Movie Preview */}
          {selectedMovie && (
            <div className="form-section">
              <h2>Geselecteerde Film</h2>
              <div className="selected-movie">
                {selectedMovie.poster_url && (
                  <img src={selectedMovie.poster_url} alt={selectedMovie.title} />
                )}
                <div>
                  <h3>{selectedMovie.title}</h3>
                  {selectedMovie.year && <p>{selectedMovie.year}</p>}
                  {!isEdit && (
                    <button 
                      type="button"
                      onClick={() => setSelectedMovie(null)}
                      className="btn btn-secondary btn-small"
                    >
                      Andere film kiezen
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Review Form */}
          {selectedMovie && (
            <>
              <div className="form-section">
                <h2>{isEdit ? '2' : '2'}. Review Schrijven</h2>
                
                <div className="form-group">
                  <label htmlFor="reviewText">Review Tekst *</label>
                  <textarea
                    id="reviewText"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={10}
                    required
                    placeholder="Schrijf hier je uitgebreide review..."
                  />
                  <small>{reviewText.length} characters</small>
                </div>

                <div className="form-group">
                  <label>Arty Rating *</label>
                  <ArtyRating 
                    rating={artyRating}
                    size="large"
                    interactive={true}
                    onChange={setArtyRating}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="watchedDate">Datum Gekeken *</label>
                  <input
                    type="date"
                    id="watchedDate"
                    value={watchedDate}
                    onChange={(e) => setWatchedDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Genres</label>
                  <div className="genres-checkboxes">
                    {genres.map(genre => (
                      <label key={genre.id} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedGenres.includes(genre.id)}
                          onChange={() => handleGenreToggle(genre.id)}
                        />
                        {genre.name}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary btn-large"
                  disabled={saving}
                >
                  {saving ? 'Opslaan...' : (isEdit ? 'Review Bijwerken' : 'Review Toevoegen')}
                </button>
                <button 
                  type="button"
                  onClick={() => navigate('/admin')}
                  className="btn btn-secondary"
                  disabled={saving}
                >
                  Annuleren
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  )
}

export default AdminReviewForm

