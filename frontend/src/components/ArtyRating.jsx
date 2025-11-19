import '../styles/ArtyRating.css'

const ArtyRating = ({ rating, size = 'medium', interactive = false, onChange }) => {
  const handleClick = (value) => {
    if (interactive && onChange) {
      onChange(value)
    }
  }

  // Determine if this is an extreme rating
  const isExtreme = rating < 0 || rating > 10
  const isNegative = rating < 0
  const isInsanelyHigh = rating > 100
  
  // Format the rating display
  const formatRating = (r) => {
    if (Math.abs(r) >= 1000) {
      return r.toLocaleString('nl-NL')
    }
    return r % 1 === 0 ? r : r.toFixed(1)
  }

  // For extreme ratings, show special display
  if (isExtreme && !interactive) {
    return (
      <div className={`arty-rating arty-rating-${size} arty-rating-extreme ${isNegative ? 'negative' : 'insane'}`}>
        <div className="extreme-rating-display">
          {isNegative && <span className="extreme-icon">💩</span>}
          {isInsanelyHigh && <span className="extreme-icon">🌟✨🎉</span>}
          <span className="extreme-rating-value">{formatRating(rating)}/10</span>
          {isNegative && <span className="extreme-label">Verschrikkelijk!</span>}
          {rating > 10 && rating <= 100 && <span className="extreme-label">Fenomenaal!</span>}
          {isInsanelyHigh && <span className="extreme-label">LEGENDARISCH!</span>}
        </div>
      </div>
    )
  }

  // Normal rating display (1-10) with cat heads
  const clampedRating = Math.max(0, Math.min(10, rating))
  
  return (
    <div className={`arty-rating arty-rating-${size} ${interactive ? 'interactive' : ''}`}>
      {[...Array(10)].map((_, index) => {
        const value = index + 1
        const isFilled = value <= Math.floor(clampedRating)
        const isHalf = value === Math.ceil(clampedRating) && clampedRating % 1 !== 0
        
        return (
          <span
            key={value}
            className={`arty-icon ${isFilled ? 'filled' : isHalf ? 'half' : 'empty'}`}
            onClick={() => handleClick(value)}
            role={interactive ? 'button' : undefined}
            tabIndex={interactive ? 0 : undefined}
            title={`${value} Arty${value !== 1 ? "'s" : ''}`}
          >
            🐱
          </span>
        )
      })}
      <span className="rating-text">{formatRating(rating)}/10 Arty's</span>
    </div>
  )
}

export default ArtyRating

