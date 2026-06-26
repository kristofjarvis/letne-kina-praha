# Letné kiná Praha

React/Vite prototype for browsing real Prague summer/open-air cinema venues and screenings.

## Run

```bash
npm install
npm run dev -- --host 127.0.0.1 --port 5174
```

Local URL:

```text
http://127.0.0.1:5174
```

## Daily data update

The app reads this generated JSON file:

```text
public/data/letni-kina-praha.json
```

Manual update:

```bash
npm run update-cinemas
```

System cron job:

- Name: `Denná aktualizácia letných kín Praha`
- Job ID: `248acef4f036`
- Schedule: `0 6 * * *` — every day at 06:00
- Script: `/Users/jarvis/.hermes/scripts/update-letne-kina-praha.sh`

## Data sources

The updater combines official/static sources and fallback links. Current venue list includes:

- Kinobus DPP
- Kasárna Karlín
- MeetFactory
- Sunset Cinema
- Žluté lázně
- Letní kino u Keplera
- Letní 3Kino / Kampus Hybernská
- DOX
- Holešovická tržnice
- Praha 2 Letní kino pod hvězdami
- Letní kino Kinská
- Cross Club / Biokáf
- Stalin Letná
- Letní kino Zahrada (Praha 11 / Chodov, blízko Hájov)
- Letní kino Průhonice
- Letní kino Hostivařská přehrada

## GitHub Pages deploy

The repo is ready for GitHub Pages via `.github/workflows/deploy-pages.yml`.

Steps after pushing to GitHub:

1. Create a GitHub repository.
2. Push this project to the `main` branch.
3. In GitHub: Settings → Pages → Source → **GitHub Actions**.
4. The workflow builds `dist/` and deploys it to `https://<user>.github.io/<repo>/`.

The Vite config uses `base: './'` so assets work on GitHub project pages regardless of repository name.

## Verification

```bash
npm run lint
npm run build
curl -I http://127.0.0.1:5174
```

## Notes

- Some sources are dynamic, PDF-based, or protected by cookies. The updater therefore combines live scraping with curated official links.
- Every venue has `sourceUrl` and `programUrl` so users can click through to the official or practical program page.
- Screenings older than today's Prague date are filtered out during generation and also hidden in the UI as a safety net.
- Nearby Háje sources are included as venues even when they currently have no future 2026 program, but old events are not shown.
- Some venue entries have lower confidence where the official current film schedule is not consistently available.
