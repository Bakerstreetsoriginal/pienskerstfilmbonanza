import { useState, useEffect } from 'react'
import { movieService, adminService } from '../services'
import '../styles/FilterPanel.css'

const FilterPanel = ({ filters, onFilterChange }) => {
  const [years, setYears] = useState([])
  const [months, setMonths] = useState([])
  const [genres, setGenres] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    loadFilterOptions()
  }, [])

  const loadFilterOptions = async () => {
    try {
      const [yearsData, monthsData, genresData] = await Promise.all([
        movieService.getYears(),
        movieService.getMonths(),
        adminService.getGenres()
      ])
      
      setYears(yearsData)
      setMonths(monthsData)
      setGenres(genresData)
    } catch (error) {
      console.error('Error loading filter options:', error)
    }
  }

  const handleChange = (filterName, value) => {
    onFilterChange({ ...filters, [filterName]: value })
  }

  const resetFilters = () => {
    onFilterChange({})
  }

  const activeFilterCount = Object.values(filters).filter(v => v).length

  return (
    <div className="filter-panel">
      <button 
        className="filter-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        🔍 Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
      </button>

      <div className={`filter-content ${isOpen ? 'open' : ''}`}>
        <div className="filter-group">
          <label>Jaar</label>
          <select 
            value={filters.year || ''} 
            onChange={(e) => handleChange('year', e.target.value)}
          >
            <option value="">Alle jaren</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Minimale Rating</label>
          <select 
            value={filters.rating || ''} 
            onChange={(e) => handleChange('rating', e.target.value)}
          >
            <option value="">Alle ratings</option>
            {[10, 9, 8, 7, 6, 5].map(rating => (
              <option key={rating} value={rating}>{rating}+ Arty's</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Genre</label>
          <select 
            value={filters.genre || ''} 
            onChange={(e) => handleChange('genre', e.target.value)}
          >
            <option value="">Alle genres</option>
            {genres.map(genre => (
              <option key={genre.id} value={genre.slug}>{genre.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Bekeken in</label>
          <select 
            value={filters.watched_month || ''} 
            onChange={(e) => handleChange('watched_month', e.target.value)}
          >
            <option value="">Alle maanden</option>
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Zoeken</label>
          <input
            type="text"
            placeholder="Zoek op titel..."
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </div>

        {activeFilterCount > 0 && (
          <button className="btn btn-reset" onClick={resetFilters}>
            ↺ Reset filters
          </button>
        )}
      </div>
    </div>
  )
}

export default FilterPanel

