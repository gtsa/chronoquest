## ChronoQuest & Otterverse — Dev ➜ Prod Transition Checklist

---

### 1. `.env` Configuration

* [ ] `PROTOCOL=https`
* [ ] `DOMAIN=chronoquest.otter-verse.com`
* [ ] `VITE_PUBLIC_URL=https://chronoquest.otter-verse.com`
* [ ] `VITE_API_BASE_URL=https://chronoquest.otter-verse.com/api`
* [ ] `NODE_ENV=production`
* [ ] Confirm: **no leftover dev URLs or test credentials**

---

### 2. Docker Compose (`docker-compose.yml`)

* [ ] Uses correct `.env`

* [ ] `frontend` service exposes **port 80** (NOT 4173:4173):

  ```yaml
  ports:
    - "4173:80"
  ```

---

### 3. `gameConfig.ts`

Update for production:

* [ ] `maxAttempts = 3`
* [ ] `restrictedNumberGamesPerDayMode = true`
* [ ] `httpsOn = true`
* [ ] `levelDefault = "easy"`
* [ ] `sameDateModeDefault = false`

Validate compiled config reflects these settings.
To check final build config inside Docker:

```bash
docker exec -it chronoquest-backend-1 sh 
# Once inside the container:
cat dist/game_config/gameConfig.js
```

---

### 4. 🔥 Nginx Proxy (Otterverse) — **Critical ChronoQuest Port Switch**

#### 🔴 MUST CHANGE:

```nginx
proxy_pass http://chronoquest-frontend:4173/;
```

⬇️

#### TO PRODUCTION:

```nginx
proxy_pass http://chronoquest-frontend:80/;
```

* [ ] Reload/restart proxy:

```bash
docker restart otterverse-proxy
```