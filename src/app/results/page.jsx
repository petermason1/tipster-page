'use client'
import { useEffect, useState } from 'react'

// Bookie-style place logic
function getPlacesAllowed(numRunners, raceType = '') {
  const isHandicap = raceType.toLowerCase().includes('handicap')
  if (isHandicap && numRunners >= 16) return 4
  if (numRunners >= 8) return 3
  if (numRunners >= 5) return 2
  return 1
}

export default function ResultsPage() {
  const [races, setRaces] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    const fetchData = () => {
      fetch('/api/results')
        .then(res => res.json())
        .then(data => {
          const raceList = data?.results?.results || []
          setRaces(raceList)
          setLastUpdated(new Date().toLocaleTimeString())
        })
        .catch(err => {
          console.error(err)
          setError('Failed to load results.')
        })
        .finally(() => setLoading(false))
    }

    fetchData() // initial fetch
    const interval = setInterval(fetchData, 60000) // every 1 min
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>📊 Today’s Results</h1>
      {lastUpdated && (
        <p style={{ fontSize: '0.85rem', color: '#666' }}>
          Last updated: {lastUpdated}
        </p>
      )}
      <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.25rem' }}>
        Standard bookmaker place terms applied. Some bookies may have paid extra places.
      </p>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !races.length && <p>No results available yet.</p>}

      {races.map((race, i) => {
        const places = getPlacesAllowed(race.runners.length, race.race_name)

        return (
          <div
            key={i}
            style={{
              marginBottom: '2.5rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid #ddd'
            }}
          >
            <h3 style={{ marginBottom: '0.25rem' }}>
              {race.course} – {race.race_name}
            </h3>
            <p style={{ margin: '0.3rem 0', fontSize: '0.9rem', color: '#444' }}>
              <strong>{race.time}</strong> | {race.class} | {race.dist} | Going: {race.going}
            </p>

            {race.runners.map((runner, idx) => {
              const pos = parseInt(runner.position)
              const isWinner = pos === 1
              const isPlaced = pos && pos <= places

              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    marginBottom: '0.75rem',
                    backgroundColor: isWinner
                      ? '#d1ffc8'
                      : isPlaced
                      ? '#fff8c4'
                      : 'transparent',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    border: '1px solid #eee'
                  }}
                >
                  {runner.silk_url && (
                    <img
                      src={runner.silk_url}
                      alt={`${runner.horse} silks`}
                      style={{
                        width: '40px',
                        height: '40px',
                        objectFit: 'contain',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        background: '#fff'
                      }}
                    />
                  )}

                  <div>
                    <strong>{runner.position || '❓'}.</strong>{' '}
                    {runner.horse} – SP: {runner.sp || 'N/A'}
                    {runner.comment && (
                      <p style={{
                        margin: '0.25rem 0 0',
                        fontStyle: 'italic',
                        fontSize: '0.85rem',
                        color: '#555'
                      }}>
                        {runner.comment}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
