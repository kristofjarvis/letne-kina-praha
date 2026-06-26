import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outPath = join(root, 'public', 'data', 'letni-kina-praha.json')

const venues = [
  {
    id: 'dpp-kinobus',
    name: 'Kinobus DPP',
    area: 'Různé části Prahy',
    district: 'Praha 1–22',
    vibe: 'zdarma / putovní',
    address: 'různé lokality podľa programu',
    sourceUrl: 'https://www.dpp.cz/zabava-a-zazitky/kinobus',
    programUrl: 'https://www.dpp.cz/cs/data/Aktuality/Kinobus/Kinobus_2026_program.pdf',
    confidence: 'high',
    note: 'Oficiálny DPP Kinobus, voľný vstup, program v PDF.'
  },
  {
    id: 'kasarna-karlin',
    name: 'Kasárna Karlín – letní kino',
    area: 'Karlín',
    district: 'Praha 8',
    vibe: 'kultúrny dvor',
    address: 'Prvního pluku 20/2, Praha 8',
    sourceUrl: 'https://kasarnakarlin.cz/',
    programUrl: 'https://kasarnakarlin.cz/program/',
    confidence: 'high',
    note: 'Oficiálny program Kasární, udalosti označené LETNÍ KINO.'
  },
  {
    id: 'meetfactory',
    name: 'MeetFactory – letní kino',
    area: 'Smíchov',
    district: 'Praha 5',
    vibe: 'indie / art',
    address: 'Ke Sklárně 3213/15, Praha 5',
    sourceUrl: 'https://www.meetfactory.cz/',
    programUrl: 'https://www.meetfactory.cz/cs/letni-kino-26',
    confidence: 'high',
    note: 'Oficiálna stránka Letní kino 2026.'
  },
  {
    id: 'sunset-cinema',
    name: 'Sunset Cinema',
    area: 'Pankrác',
    district: 'Praha 4',
    vibe: 'strecha / rande',
    address: 'Na Pankráci 86, Praha 4',
    sourceUrl: 'https://sunsetcinema.cz/',
    programUrl: 'https://sunsetcinema.cz/location/summer/',
    confidence: 'high',
    note: 'Strešné letné kino s online lístkami.'
  },
  {
    id: 'zlute-lazne',
    name: 'Žluté lázně – letní kino',
    area: 'Podolí',
    district: 'Praha 4',
    vibe: 'u vody',
    address: 'Podolské nábřeží 3/1184, Praha 4',
    sourceUrl: 'https://www.zlutelazne.cz/',
    programUrl: 'https://www.zlutelazne.cz/program/letni-kino-ve-zlutych-laznich',
    confidence: 'high',
    note: 'Oficiálna stránka letného kina vo Žlutých lázních.'
  },
  {
    id: 'kepler',
    name: 'Letní kino u Keplera',
    area: 'Hradčany / Střešovice',
    district: 'Praha 6',
    vibe: 'komunitné / park',
    address: 'Park Maxe van der Stoela, Praha 6',
    sourceUrl: 'https://letnikinoukeplera.cz/',
    programUrl: 'https://letnikinoukeplera.cz/cs/uvod',
    confidence: 'high',
    note: 'Oficiálny program s dátumami a časmi.'
  },
  {
    id: '3kino-hybernska',
    name: 'Letní 3Kino – Kampus Hybernská',
    area: 'Nové Město',
    district: 'Praha 1',
    vibe: 'festival / stred Európy',
    address: 'Hybernská 4, Praha 1',
    sourceUrl: 'https://www.3kino.cz/',
    programUrl: 'https://www.3kino.cz/program/',
    confidence: 'high',
    note: 'Oficiálny 3Kino program, letné premietania v Kampuse Hybernská.'
  },
  {
    id: 'dox',
    name: 'Letní kino DOX',
    area: 'Holešovice',
    district: 'Praha 7',
    vibe: 'galéria / strecha',
    address: 'Poupětova 1, Praha 7',
    sourceUrl: 'https://www.dox.cz/',
    programUrl: 'https://www.dox.cz/program/letni-kino-dox-2026',
    confidence: 'medium-high',
    note: 'Oficiálny DOX program Letní kino DOX 2026.'
  },
  {
    id: 'holesovicka-trznice',
    name: 'Letní kino v Holešovické tržnici',
    area: 'Holešovice',
    district: 'Praha 7',
    vibe: 'food / tržnice',
    address: 'Bubenské nábř. 306/13, Praha 7',
    sourceUrl: 'https://www.holesovickatrznice.cz/',
    programUrl: 'https://www.holesovickatrznice.cz/program',
    confidence: 'high',
    note: 'Oficiálny program tržnice, udalosti LETNÍ KINO V TRŽNICI.'
  },
  {
    id: 'praha2-pod-hvezdami',
    name: 'Letní kino pod hvězdami – Praha 2',
    area: 'Vinohrady',
    district: 'Praha 2',
    vibe: 'mestské / zdarma',
    address: 'Riegrovy sady a náměstí Míru, Praha 2',
    sourceUrl: 'https://dvojka.praha2.cz/',
    programUrl: 'https://dvojka.praha2.cz/blog/2694-letni-kino-pod-hvezdami-2026',
    confidence: 'high',
    note: 'Oficiálny portál Prahy 2 s rozpisom premietaní.'
  },
  {
    id: 'letni-kino-kinska',
    name: 'Letní kino Kinská',
    area: 'Smíchov / Kinského zahrada',
    district: 'Praha 5',
    vibe: 'park / centrum',
    address: 'Kinského zahrada, Praha 5',
    sourceUrl: 'https://goout.net/cs/letni-kino-kinska/vzhgqe',
    programUrl: 'https://goout.net/cs/letni-kino-kinska/vzhgqe',
    confidence: 'medium',
    note: 'Oficiálna doména mala TLS problém, preto používam GoOut ako praktický zdroj programu.'
  },
  {
    id: 'cross-club',
    name: 'Cross Club / Biokáf open air',
    area: 'Holešovice',
    district: 'Praha 7',
    vibe: 'alternatívne',
    address: 'Plynární 23, Praha 7',
    sourceUrl: 'https://www.crossclub.cz/',
    programUrl: 'https://www.crossclub.cz/cs/program/',
    confidence: 'medium',
    note: 'Program treba filtrovať na film/letní kino; nie vždy má pravidelné premietania.'
  },
  {
    id: 'stalin-letna',
    name: 'Stalin Letná',
    area: 'Letná',
    district: 'Praha 7',
    vibe: 'open air / kultúra',
    address: 'Letenské sady, Praha 7',
    sourceUrl: 'https://www.stalinletna.cz/',
    programUrl: 'https://www.stalinletna.cz/',
    confidence: 'low-medium',
    note: 'Kultúrny open-air priestor; filmové eventy treba overovať v aktuálnom programe.'
  },
  {
    id: 'letni-kino-zahrada',
    name: 'Letní kino Zahrada',
    area: 'Praha 11 / Chodov',
    district: 'Praha 11',
    vibe: 'blízko Hájov / komunitné',
    address: 'Malenická 1784, Praha 11',
    sourceUrl: 'https://letnaky.cz/zahrada',
    programUrl: 'https://letnaky.cz/zahrada',
    confidence: 'medium-high',
    note: 'Najbližší letňák k Hájom. Zdroj Letňáky.cz aktuálne uvádza, že o programe 2026 zatiaľ nevie; staré ročníky zámerne nepridávam do premietaní.'
  },
  {
    id: 'pruhonice-obec',
    name: 'Letní kino Průhonice',
    area: 'Průhonice / okolie Hájov',
    district: 'Praha-východ',
    vibe: 'blízko Hájov / obecné premietanie',
    address: 'Průhonice, podľa akcie obce',
    sourceUrl: 'https://www.pruhonice-obec.cz/letni-kino/a-1576',
    programUrl: 'https://www.pruhonice-obec.cz/letni-kino/a-1576',
    confidence: 'high',
    note: 'Oficiálna stránka obce Průhonice. Posledná nájdená akcia bola 25. 6. 2026, preto ju po dnešku už neukazujem v programe.'
  },
  {
    id: 'hostivar-prehrada',
    name: 'Letní kino Hostivařská přehrada',
    area: 'Hostivař / okolie Hájov',
    district: 'Praha 15',
    vibe: 'blízko Hájov / pri vode / zdarma',
    address: 'Hostivařská přehrada, Praha 15',
    sourceUrl: 'https://hostivarskaprehrada.cz/letni-kino-zdarma',
    programUrl: 'https://hostivarskaprehrada.cz/letni-kino-zdarma',
    confidence: 'medium',
    note: 'Blízko Hájov a pri vode; aktuálny program treba overovať na stránke, staré premietania sa do feedu nepridávajú.'
  }
]

const curatedScreenings = [
  // Praha 2 official article
  ['praha2-pod-hvezdami', 'Karavan', '2026-07-09', '21:15', 'Riegrovy sady', 'https://dvojka.praha2.cz/akce/2686-letni-kino-pod-hvezdami-2026-karavan'],
  ['praha2-pod-hvezdami', 'Ztraceno v překladu', '2026-07-16', '21:15', 'Riegrovy sady', 'https://dvojka.praha2.cz/blog/2694-letni-kino-pod-hvezdami-2026'],
  ['praha2-pod-hvezdami', 'Letní škola, 2001', '2026-07-23', '21:15', 'Riegrovy sady', 'https://dvojka.praha2.cz/blog/2694-letni-kino-pod-hvezdami-2026'],
  ['praha2-pod-hvezdami', 'Grandhotel Budapešť', '2026-07-30', '21:15', 'Riegrovy sady', 'https://dvojka.praha2.cz/blog/2694-letni-kino-pod-hvezdami-2026'],
  ['praha2-pod-hvezdami', 'Poslední Viking', '2026-08-06', '20:30', 'Riegrovy sady', 'https://dvojka.praha2.cz/blog/2694-letni-kino-pod-hvezdami-2026'],
  ['praha2-pod-hvezdami', 'Zámek v oblacích', '2026-08-13', '20:30', 'Riegrovy sady', 'https://dvojka.praha2.cz/blog/2694-letni-kino-pod-hvezdami-2026'],
  ['praha2-pod-hvezdami', 'Čelisti', '2026-08-20', '20:30', 'Riegrovy sady', 'https://dvojka.praha2.cz/blog/2694-letni-kino-pod-hvezdami-2026'],
  ['praha2-pod-hvezdami', 'Obecná škola', '2026-08-27', '20:30', 'náměstí Míru', 'https://dvojka.praha2.cz/blog/2694-letni-kino-pod-hvezdami-2026'],
  // Holešovická tržnice from official program snapshot
  ['holesovicka-trznice', 'Mamma Mia!', '2026-07-02', '21:30', 'Holešovická tržnice', 'https://www.holesovickatrznice.cz/program'],
  ['holesovicka-trznice', 'Samotáři', '2026-07-09', '21:30', 'Holešovická tržnice', 'https://www.holesovickatrznice.cz/program'],
  ['holesovicka-trznice', 'Barbie', '2026-07-16', '21:30', 'Holešovická tržnice', 'https://www.holesovickatrznice.cz/program'],
  ['holesovicka-trznice', 'Grandhotel Budapešť', '2026-07-23', '21:30', 'Holešovická tržnice', 'https://www.holesovickatrznice.cz/program'],
  ['holesovicka-trznice', 'Trhák', '2026-07-30', '21:30', 'Holešovická tržnice', 'https://www.holesovickatrznice.cz/program'],
]

const sourceChecks = []

async function fetchText(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 15000)
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { 'user-agent': 'Mozilla/5.0 letne-kina-praha-updater' } })
    const text = await res.text()
    sourceChecks.push({ url, ok: res.ok, status: res.status, bytes: text.length })
    return res.ok ? text : ''
  } catch (error) {
    sourceChecks.push({ url, ok: false, status: 0, error: error.message })
    return ''
  } finally {
    clearTimeout(timer)
  }
}

function stripTags(html = '') {
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#8211;|&ndash;/g, '–').replace(/\s+/g, ' ').trim()
}

function makeEvent({ venueId, title, date, time, place = '', url = '', price = null, source = 'curated' }) {
  const venue = venues.find(v => v.id === venueId)
  return {
    id: `${venueId}-${date}-${time}-${title}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    venueId,
    venueName: venue?.name || venueId,
    area: venue?.area || '',
    district: venue?.district || '',
    title: title.trim(),
    date,
    time,
    place: place || venue?.address || '',
    price,
    url: url || venue?.programUrl || venue?.sourceUrl || '',
    source,
  }
}

function todayInPrague() {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Prague',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  return formatter.format(new Date())
}

function isUpcoming(event, today = todayInPrague()) {
  return event.date >= today
}

async function scrapeKasarna() {
  const html = await fetchText('https://kasarnakarlin.cz/program/')
  const events = []
  const linkRe = /<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi
  let match
  while ((match = linkRe.exec(html))) {
    const href = match[1].startsWith('http') ? match[1] : `https://kasarnakarlin.cz${match[1]}`
    const text = stripTags(match[2])
    if (!/LETN[IÍ]\s+KINO/i.test(text + ' ' + href)) continue
    const dateMatch = text.match(/(\d{1,2})\.\s*(\d{1,2})\.\s*(2026)/)
    const title = text.replace(/LETN[IÍ]\s+KINO\s*[—-]?/i, '').replace(/\d{1,2}\.\s*\d{1,2}\.\s*2026.*/i, '').trim() || text
    if (dateMatch) {
      const [, d, m, y] = dateMatch
      events.push(makeEvent({ venueId: 'kasarna-karlin', title, date: `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`, time: '21:30', url: href, source: 'scraped:kasarna' }))
    }
  }
  return events
}

async function scrapeKepler() {
  const html = await fetchText('https://letnikinoukeplera.cz/cs/uvod')
  const events = []
  const itemRe = /<div[^>]+class="[^"]*page__team-item[^"]*"[\s\S]*?<\/div>\s*<\/div>/gi
  const items = html.match(itemRe) || []
  for (const item of items) {
    const date = stripTags((item.match(/page__team-date[\s\S]*?<\/[^>]+>/i) || [''])[0])
    const time = stripTags((item.match(/page__team-time[\s\S]*?<\/[^>]+>/i) || [''])[0])
    const title = stripTags((item.match(/page__team-name[\s\S]*?<\/[^>]+>/i) || [''])[0])
    const hrefMatch = item.match(/href="([^"]+)"/i)
    if (!date || !time || !title) continue
    const [d, m] = date.split('/').map(s => s.padStart(2, '0'))
    events.push(makeEvent({ venueId: 'kepler', title, date: `2026-${m}-${d}`, time, url: hrefMatch ? new URL(hrefMatch[1], 'https://letnikinoukeplera.cz/cs/uvod').href : 'https://letnikinoukeplera.cz/cs/uvod', source: 'scraped:kepler' }))
  }
  return events
}

async function scrapeNearbySourceChecks() {
  await Promise.allSettled([
    fetchText('https://letnaky.cz/zahrada'),
    fetchText('https://www.pruhonice-obec.cz/letni-kino/a-1576'),
    fetchText('https://hostivarskaprehrada.cz/letni-kino-zdarma'),
  ])
}

async function main() {
  const scrapedGroups = await Promise.allSettled([scrapeKasarna(), scrapeKepler(), scrapeNearbySourceChecks()])
  const scraped = scrapedGroups.flatMap(r => r.status === 'fulfilled' && Array.isArray(r.value) ? r.value : [])
  const curated = curatedScreenings.map(([venueId, title, date, time, place, url]) => makeEvent({ venueId, title, date, time, place, url }))
  const today = todayInPrague()
  const byId = new Map()
  for (const event of [...curated, ...scraped].filter((item) => isUpcoming(item, today))) byId.set(event.id, event)
  const screenings = [...byId.values()].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))

  const data = {
    generatedAt: new Date().toISOString(),
    version: 1,
    venues,
    screenings,
    sourceChecks,
    notes: [
      'Oficiálne stránky sú prioritné; GoOut/Kudy z nudy používam len ako zálohu pri problematických zdrojoch.',
      'Niektoré zdroje sú dynamické alebo PDF, preto updater kombinuje scraping a kurátorované oficiálne odkazy.',
      `Premietania staršie než ${today} sa pri dennej aktualizácii automaticky vyhadzujú.`,
      'Průhonice, KC Zahrada a Hostivař sú zahrnuté ako blízke zdroje pri Hájoch, ale bez starých premietaní.',
    ]
  }
  await mkdir(dirname(outPath), { recursive: true })
  await writeFile(outPath, JSON.stringify(data, null, 2), 'utf8')
  console.log(`Letné kiná Praha updated: ${venues.length} venues, ${screenings.length} screenings -> ${outPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
