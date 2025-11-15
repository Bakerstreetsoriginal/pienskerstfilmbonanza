import '../styles/ArtyRating.css'

const ArtyRating = ({ rating, size = 'medium', interactive = false, onChange }) => {
  const handleClick = (value) => {
    if (interactive && onChange) {
      onChange(value)
    }
  }

  return (
    <div className={`arty-rating arty-rating-${size} ${interactive ? 'interactive' : ''}`}>
      {[...Array(10)].map((_, index) => {
        const value = index + 1
        const isFilled = value <= rating
        
        return (
          <span
            key={value}
            className={`arty-icon ${isFilled ? 'filled' : 'empty'}`}
            onClick={() => handleClick(value)}
            role={interactive ? 'button' : undefined}
            tabIndex={interactive ? 0 : undefined}
            title={`${value} Arty${value !== 1 ? "'s" : ''}`}
          >
            🐱
          </span>
        )
      })}
      <span className="rating-text">{rating}/10 Arty's</span>
    </div>
  )
}

export default ArtyRating

