import { useEffect, useRef } from 'react'
import '../styles/Snowfall.css'

const Snowfall = () => {
  const snowfallRef = useRef(null)

  useEffect(() => {
    const createSnowflake = () => {
      const snowflake = document.createElement('div')
      snowflake.classList.add('snowflake')
      snowflake.innerHTML = '❄'
      
      // Random starting position
      snowflake.style.left = Math.random() * 100 + '%'
      
      // Random animation duration (slower/faster falling)
      const duration = Math.random() * 3 + 5 // 5-8 seconds
      snowflake.style.animationDuration = duration + 's'
      
      // Random size
      const size = Math.random() * 0.7 + 0.5 // 0.5-1.2em
      snowflake.style.fontSize = size + 'em'
      
      // Random horizontal drift
      const drift = (Math.random() - 0.5) * 100
      snowflake.style.setProperty('--drift', drift + 'px')
      
      snowfallRef.current?.appendChild(snowflake)
      
      // Remove after animation completes
      setTimeout(() => {
        snowflake.remove()
      }, duration * 1000)
    }

    // Create snowflakes at intervals
    const interval = setInterval(createSnowflake, 200)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return <div ref={snowfallRef} className="snowfall-container" aria-hidden="true"></div>
}

export default Snowfall

