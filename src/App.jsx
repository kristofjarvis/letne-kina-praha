import { useEffect, useMemo, useState } from 'react'
import './App.css'

const fallbackData = { generatedAt: null, venues: [], screenings: [] }

function formatDate(date) {
  if (!date) return 'bez dátumu'
  return new Intl.DateTimeFormat('sk-SK', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(date))
}

function todayISO() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Prague',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

function scoreScreening(item) {
  const freeBoost = item.price === 0 || item.price === null ? 8 : 0
  const urlBoost = item.url ? 10 : 0
  const soonBoost = item.date ? 8 : 0
  return Math.min(99, 70 + freeBoost + urlBoost + soonBoost)
}

function eventMatchesVibe(item, vibe) {
  const text = `${item.title} ${item.venueName} ${item.area} ${item.district} ${item.place}`.toLowerCase()
  if (vibe === 'rande') return /kampa|sunset|střecha|strecha|voda|žluté|zlute|romant|la la|barbie/i.test(text)
  if (vibe === 'zdarma') return /kinobus|praha 2|meetfactory|zdarma|riegrovy/i.test(text)
  if (vibe === 'u vody') return /žluté|zlute|podolí|vltava|voda/i.test(text)
  if (vibe === 'art') return /meetfactory|dox|kepler|3kino|art|festival/i.test(text)
  if (vibe === 'food') return /tržnice|trznice|manifesto|food|hybernská/i.test(text)
  if (vibe === 'blízko Hájov') return /hájov|haje|chodov|praha 11|průhonice|pruhonice|hostivař|hostivar|praha 15|zahrada/i.test(text)
  return true
}

function venueMatchesVibe(venue, vibe) {
  const text = `${venue.name} ${venue.area} ${venue.district} ${venue.vibe} ${venue.note}`.toLowerCase()
  if (vibe === 'rande') return /sunset|kampa|střecha|strecha|voda|park|romant/i.test(text)
  if (vibe === 'zdarma') return /zdarma|kinobus|praha 2|meetfactory/i.test(text)
  if (vibe === 'u vody') return /žluté|zlute|podolí|voda|vltava/i.test(text)
  if (vibe === 'art') return /dox|meetfactory|kepler|3kino|art|festival/i.test(text)
  if (vibe === 'food') return /tržnice|trznice|hybernská|food/i.test(text)
  if (vibe === 'blízko Hájov') return /hájov|haje|chodov|praha 11|průhonice|pruhonice|hostivař|hostivar|praha 15|zahrada/i.test(text)
  return true
}

export default function App() {
  const [data, setData] = useState(fallbackData)
  const [status, setStatus] = useState('Načítavam reálne dáta...')
  const [filters, setFilters] = useState({ search: '', area: 'Všetky časti', vibe: 'Akýkoľvek vibe', sort: 'date', view: 'screenings' })
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetch('./data/letni-kina-praha.json', { cache: 'no-store' })
      .then((res) => res.json())
      .then((json) => {
        setData(json)
        setSelected(json.screenings?.[0] || null)
        setStatus(`Aktualizované ${json.generatedAt ? new Date(json.generatedAt).toLocaleString('sk-SK') : 'neznámo'}`)
      })
      .catch((error) => setStatus(`Nepodarilo sa načítať dáta: ${error.message}`))
  }, [])

  const areas = useMemo(() => ['Všetky časti', ...Array.from(new Set((data.venues || []).map((venue) => venue.area).filter(Boolean))).sort()], [data.venues])
  const vibes = ['Akýkoľvek vibe', 'blízko Hájov', 'rande', 'zdarma', 'u vody', 'art', 'food']

  const enrichedScreenings = useMemo(() => {
    const today = todayISO()
    return (data.screenings || [])
      .filter((item) => !item.date || item.date >= today)
      .map((item) => ({ ...item, score: scoreScreening(item) }))
  }, [data.screenings])

  const filteredScreenings = useMemo(() => {
    const q = filters.search.toLowerCase()
    return enrichedScreenings
      .filter((item) => {
        const haystack = `${item.title} ${item.venueName} ${item.area} ${item.district} ${item.place}`.toLowerCase()
        if (q && !haystack.includes(q)) return false
        if (filters.area !== 'Všetky časti' && item.area !== filters.area) return false
        if (filters.vibe !== 'Akýkoľvek vibe' && !eventMatchesVibe(item, filters.vibe)) return false
        return true
      })
      .sort((a, b) => filters.sort === 'score' ? b.score - a.score : `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
  }, [enrichedScreenings, filters])

  const filteredVenues = useMemo(() => {
    const q = filters.search.toLowerCase()
    return (data.venues || [])
      .filter((venue) => {
        const haystack = `${venue.name} ${venue.area} ${venue.district} ${venue.vibe} ${venue.note}`.toLowerCase()
        if (q && !haystack.includes(q)) return false
        if (filters.area !== 'Všetky časti' && venue.area !== filters.area) return false
        if (filters.vibe !== 'Akýkoľvek vibe' && !venueMatchesVibe(venue, filters.vibe)) return false
        return true
      })
      .sort((a, b) => (a.district || '').localeCompare(b.district || '') || a.name.localeCompare(b.name))
  }, [data.venues, filters])

  const dateGroups = Array.from(new Set(filteredScreenings.map((item) => item.date))).sort()
  const best = filteredScreenings[0]

  return (
    <div className="app-shell">
      <header className="hero">
        <nav className="nav">
          <div className="brand"><span>☀️</span> Praha Open‑Air Cinema</div>
          <div className="nav-pills"><span>{filteredScreenings.length} premietaní</span><span>{filteredVenues.length} kín</span><span>daily update</span></div>
        </nav>
        <div className="hero-grid">
          <div>
            <p className="eyebrow">Reálne letné kiná v Prahe · oficiálne prekliky</p>
            <h1>Nájdi letné kino, program a rovno sa preklikni na lístky.</h1>
            <p className="lead">Denný dátový feed kombinuje oficiálne programy kín, mestské stránky a záložné zdroje. Každé kino má link na oficiálnu stránku alebo program.</p>
            <div className="hero-actions">
              <button onClick={() => setFilters({ ...filters, view: 'screenings' })}>Program</button>
              <button className="ghost" onClick={() => setFilters({ ...filters, view: 'venues' })}>Všetky kiná</button>
              <button className="ghost" onClick={() => setFilters({ ...filters, vibe: 'rande', view: 'screenings' })}>Rande filter</button>
            </div>
          </div>
          <aside className="hero-card">
            <span className="card-label">Top najbližší tip</span>
            <h2>{best?.title || 'Načítavam program'}</h2>
            {best && <>
              <p>{best.venueName} · {formatDate(best.date)} · {best.time}</p>
              <a className="open-link" href={best.url} target="_blank" rel="noreferrer">Otvoriť stránku ↗</a>
              <div className="score-ring">{best.score}<small>/100</small></div>
            </>}
          </aside>
        </div>
      </header>

      <section className="filters">
        <input value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} placeholder="Hľadať kino, film, časť Prahy..." />
        <select value={filters.area} onChange={(e) => setFilters({ ...filters, area: e.target.value })}>{areas.map((a) => <option key={a}>{a}</option>)}</select>
        <select value={filters.vibe} onChange={(e) => setFilters({ ...filters, vibe: e.target.value })}>{vibes.map((v) => <option key={v}>{v}</option>)}</select>
        <select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}><option value="date">Podľa dátumu</option><option value="score">Najlepší match</option></select>
        <select value={filters.view} onChange={(e) => setFilters({ ...filters, view: e.target.value })}><option value="screenings">Premietania</option><option value="venues">Kiná</option></select>
      </section>

      <main className="content">
        <section className="stats-row">
          <div><strong>{data.venues?.length || 0}</strong><span>reálnych miest</span></div>
          <div><strong>{data.screenings?.length || 0}</strong><span>premietaní vo feede</span></div>
          <div><strong>{dateGroups.length}</strong><span>dní v timeline</span></div>
          <div><strong>{data.sourceChecks?.filter(s => s.ok).length || 0}</strong><span>zdrojov overených dnes</span></div>
        </section>

        <div className="status-bar">{status}</div>

        {filters.view === 'screenings' ? (
          <section className="layout">
            <div className="cards">
              {filteredScreenings.map((item) => (
                <article key={item.id} className={`movie-card ${selected?.id === item.id ? 'active' : ''}`} onClick={() => setSelected(item)}>
                  <div className="movie-top"><span>{item.district}</span><strong>{item.score}/100</strong></div>
                  <h3>{item.title}</h3>
                  <p>{item.venueName} · {item.area}</p>
                  <div className="meta"><span>{formatDate(item.date)}</span><span>{item.time}</span><span>{item.price === null ? 'cena podľa zdroja' : `${item.price} Kč`}</span></div>
                  <a className="inline-link" href={item.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>Program / lístky ↗</a>
                </article>
              ))}
            </div>

            <aside className="detail-panel">
              <span className="card-label">Detail premietania</span>
              <h2>{selected?.title || 'Vyber premietanie'}</h2>
              {selected && <>
                <p className="detail-place">{selected.venueName}</p>
                <div className="detail-grid">
                  <div><span>Kedy</span><strong>{formatDate(selected.date)} · {selected.time}</strong></div>
                  <div><span>Kde</span><strong>{selected.place || selected.area}</strong></div>
                  <div><span>Časť</span><strong>{selected.district}</strong></div>
                  <div><span>Zdroj</span><strong>{selected.source}</strong></div>
                </div>
                <a className="open-link wide" href={selected.url} target="_blank" rel="noreferrer">Otvoriť oficiálny program ↗</a>
              </>}
            </aside>
          </section>
        ) : (
          <section className="venue-grid">
            {filteredVenues.map((venue) => (
              <article className="venue-card" key={venue.id}>
                <div className="movie-top"><span>{venue.district}</span><strong>{venue.confidence}</strong></div>
                <h3>{venue.name}</h3>
                <p>{venue.area} · {venue.vibe}</p>
                <p className="venue-note">{venue.note}</p>
                <div className="venue-actions">
                  <a className="inline-link" href={venue.programUrl} target="_blank" rel="noreferrer">Program ↗</a>
                  <a className="inline-link muted" href={venue.sourceUrl} target="_blank" rel="noreferrer">Web ↗</a>
                </div>
              </article>
            ))}
          </section>
        )}

        <section className="timeline">
          <div className="section-head"><h2>Timeline premietaní</h2><p>Automaticky z denného JSON feedu.</p></div>
          {dateGroups.map((date) => (
            <div className="day-row" key={date}>
              <div className="day-label">{formatDate(date)}</div>
              <div className="time-items">
                {filteredScreenings.filter((item) => item.date === date).map((item) => (
                  <a key={item.id} className="time-pill" href={item.url} target="_blank" rel="noreferrer">
                    <strong>{item.time}</strong><span>{item.title}</span><em>{item.venueName}</em>
                  </a>
                ))}
              </div>
            </div>
          ))}
          {!dateGroups.length && <p className="empty">Pre aktuálne filtre nie je žiadne premietanie. Skús zobraziť všetky kiná.</p>}
        </section>
      </main>
    </div>
  )
}
