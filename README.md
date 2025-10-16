# GitHub Repo Popularity Scorer

A backend service that fetches repositories from the GitHub Search API, computes a **popularity score** per repo, and returns the list sorted by that score.  
The score uses **stars**, **forks**, and **recency of updates**.

---

## 🚀 Features

- Fetch repos via GitHub’s **Search Repositories** API  
- Filter by **language** and **earliest created date**  
- Compute popularity with a **weighted log + decay** formula  
- Return results ranked by score  
---

## 🧮 How the Score Works

**Formula**

```
score = w_stars * ln(1 + stars)
      + w_forks * ln(1 + forks)
      + w_recency * exp(- days_since_update / HALF_LIFE_DAYS)
```

- `ln(1+x)` — tames huge values so mega-repos don’t dominate  
- `exp(-d/H)` — gives a smooth “freshness” bonus that fades over time  
- Weights and half-life are configurable

**Default values (can be overridden via env):**
```
W_STARS=1
W_FORKS=1
W_RECENCY=20
HALF_LIFE_DAYS=30
```

---

## 📡 API

### `GET /repositories`

**Query parameters**
| Name | Type | Description |
|------|------|--------------|
| `language` | string (required) | e.g. `TypeScript` |
| `since` | ISO date (required) | earliest created date, e.g. `2024-01-01` |
| `page` | number (optional) | page number (default `1`) |
| `per_page` | number (optional) | results per page (default `30`, max `100`) |

**Response Example**
```json
{
  "items": [
    {
      "id": 155220641,
      "name": "transformers",
      "fullName": "huggingface/transformers",
      "htmlUrl": "https://github.com/huggingface/transformers",
      "description": "🤗 Transformers: the model-definition framework for state-of-the-art machine learning models in text, vision, audio, and multimodal models, for both inference and training. ",
      "owner": {
        "login": "huggingface",
        "id": 25720743
      },
      "language": "Python",
      "stargazersCount": 151202,
      "forksCount": 30809,
      "createdAt": "2018-10-29T13:56:00.000Z",
      "updatedAt": "2025-10-16T19:34:17.000Z",
      "pushedAt": "2025-10-16T19:48:33.000Z",
      "daysSinceUpdate": 0,
      "score": 42.2619731753913
    }
  ],
  "totalCount": 19828543,
  "pageNumber": 1,
  "pageSize": 1,
  "hasNextPage": true
}
```

**Example cURL**
```bash
curl "http://localhost:3000/repositories?language=python&createdAt=2014-01-01&pageSize=1&pageNumber=1"
```

---

## ⚙️ Requirements

- Node.js 18+ (or 20+ recommended)  
- npm / pnpm / yarn  
- (Optional) Docker & Docker Compose  
- GitHub token (recommended for higher rate limits)

---

## 🔧 Configuration

Create a `.env` file:

```
PORT=4000
LOG_LEVEL=info
GITHUB_BASE_URL=https://api.github.com
GITHUB_TOKEN=xxxx
STAR_WEIGHT=1
FORK_WEIGHT=1
RECENCY_WEIGHT=20
HALF_LIFE_DAYS=30
```

> If `GITHUB_TOKEN` is not set, GitHub’s rate limit will be very low.

---

## 🧰 Scripts

### Common commands
```bash
npm run dev          # start in watch mode
npm run build        # compile TypeScript
npm start            # run server (no watch)
npm test             # run tests (Vitest)
npm run lint         # check lint
npm run lint:fix     # fix lint errors
npm run format       # format code with Prettier
npm run format:check # verify formatting
```

---

## 🐳 Docker

### Build & run with Docker
```bash
docker build -t redcare-ha:prod .
docker run --rm -p 4000:4000 redcare-ha:prod
```

### Or with Docker Compose
```bash
docker compose up --build
```

---

## 🧩 To-Do / Enhancements

- [ ] **Caching:** add Redis/in-memory cache per query  
- [ ] **Error handling:** error handling could be further improved
- [ ] **OpenAPI Docs:** Swagger UI at `/docs`   
- [ ] **Alternative scoring:** switch between alternate scoring methods  
- [ ] **Rate limiting:** local & per-IP throttling  
- [ ] **CI/CD:** GitHub Actions for lint, test, and Docker build  
- [ ] **Retries:** retry GitHub API with exponential backoff and circuit break

---