Below is an **extended Security Note** for our ChronoQuest documentation, now including how and **why** to update `pg_hba.conf` alongside our other firewall and Docker-binding measures.

---

# ChronoQuest Database Security Note

This guide shows how to secure our ChronoQuest Postgres database both via firewall rules (UFW) and by **updating** Postgres’ `pg_hba.conf` so that only trusted connections and roles are allowed. By combining **IP-level restrictions** with **non-superuser roles**, we greatly reduce the risk of a malicious attack.

---

## 1. Locking Down Port 5432 with UFW

### 1.1 Default UFW Setup

UFW typically allows SSH (22), HTTP (80), and HTTPS (443). Verify:
```bash
sudo ufw status
```
Any other port (e.g., 5432) is blocked *unless* Docker publishes it or our UFW rules explicitly open it. Docker can sometimes override UFW with its own iptables rules, so **double-check** our Docker Compose configuration.

### 1.2 Deny 5432 to the World

```bash
sudo ufw deny 5432/tcp
sudo ufw status
```
Now we should see:
```
5432/tcp  DENY  Anywhere
5432/tcp (v6)  DENY  Anywhere (v6)
```
This ensures nobody can connect to port 5432 unless we **whitelist** specific IPs.

### 1.3 Whitelisting IPs (and Changing IPs Later)

If we need remote access from a **specific** IP, for example **185.44.146.116**, do:
```bash
sudo ufw allow from 185.44.146.116 to any port 5432
```
For IPv6, something like:
```bash
sudo ufw allow from 2001:4860:7:211::f8 to any port 5432
```

#### Important: Changing IPs
Anytime our public IP changes (e.g. new ISP, traveling, tethering), we must update the rule:

1. Remove the old IP:
   ```bash
   sudo ufw delete allow from <old_IP> to any port 5432
   ```
2. Allow the new IP:
   ```bash
   sudo ufw allow from <new_IP> to any port 5432
   ```
3. Confirm:
   ```bash
   sudo ufw status
   ```

**If** our IP changes often, consider an **SSH tunnel** or **VPN** so we don’t have to keep updating UFW rules.

---

## 2. Binding Postgres to 127.0.0.1 in Docker

If we want Postgres to **only** listen locally, edit `docker-compose.yml`:

```diff
services:
  db:
    image: postgres:13
-   ports:
-     - "${DATABASE_PORT}:5432"
+   ports:
+     - "127.0.0.1:5432:${DATABASE_PORT}:5432"
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
```

This ensures Postgres listens **only** on `127.0.0.1`. If we omit the `ports` section entirely, Postgres is only accessible from other containers on the same Docker network—not from external clients at all.

---

## 3. pg_hba.conf Changes — Rationale & Example

Even if we lock down port 5432 at the OS level, it’s still good practice to harden **Postgres’ own** authentication rules in `pg_hba.conf`. This file controls **who** can connect, **from where**, and **how** they must authenticate.

Below is a recommended configuration snippet:

```conf
# 1) Reject malicious roles
host all pgg_superadmins all reject
host all postgres_superadmins all reject

# 2) Local domain socket: trust
local   all             all                                     trust

# 3) IPv4 loopback range
host all all 127.0.0.0/8 trust

# 4) IPv6 loopback
host all all ::1/128 trust

# 5) Local replication
local   replication     all                                     trust
host    replication     all             127.0.0.1/32            trust
host    replication     all             ::1/128                 trust

# 6) Catch-all external IP: md5
host all all all md5
```

### Explanation:

1. **Reject malicious roles**:  
   Denies any connections for `pgg_superadmins` or `postgres_superadmins`. If you’ve seen attackers using these, it ensures they can’t log in, no matter what.

2. **Local domain socket: trust**:  
   `local all all trust` means if we connect via Unix sockets (rather than TCP), no password is needed. This is convenient if we trust local OS users.

3. **IPv4 loopback**: `127.0.0.0/8 trust` covers the entire 127.x.x.x range. If we only want `127.0.0.1`, use `/32`.

4. **IPv6 loopback**: `::1/128 trust` is the IPv6 localhost. Same concept as IPv4 loopback.

5. **Local replication**:  
   Typically local only, so we allow trust. If we replicate from other servers, you’d add specific lines for those IPs.

6. **Catch-all external IP**: `host all all all md5`  
   Means any IP not matched above has to provide an MD5 password. Combine this with our firewall rules so that only whitelisted IPs can even attempt to connect.

> **Note**: The first matching pg_hba.conf line takes precedence. So if `pgg_superadmins` tries to connect, it hits “reject” line #1 first, ignoring line #6.

### Reloading Postgres

After editing `pg_hba.conf`, we must **reload** Postgres. Inside the container, we can do:

```bash
psql -U postgres -c "SELECT pg_reload_conf();"
```

or simply restart the container:

```bash
docker restart <container_name>
```

---

## 4. Verifying Success

1. **Port scan** from a non-whitelisted IP:
   ```bash
   nmap -p 5432 our_server_ip
   ```
   Should show `closed` or `filtered`.

2. **Check logs** for malicious attempts. If the firewall and pg_hba.conf are properly configured, we shouldn’t see suspicious authentication failures from random IPs.

3. **Ensure our whitelisted IP** or local containers can still connect. If we see “connection refused” from our legitimate IP, verify our UFW rules or our Docker ports.

---

## 5. Use a Non-Superuser Role

Finally, avoid letting our ChronoQuest application connect as the **postgres** superuser. Instead:

1. Create a limited role:  
   ```sql
   CREATE ROLE chronoquest_user WITH LOGIN PASSWORD 'someStrongPass!';
   GRANT CONNECT ON DATABASE chronoquest TO chronoquest_user;
   ```
2. Update our `.env` or `DATABASE_URL` to reference `chronoquest_user` and that strong password.

Now if attackers steal our app’s credentials, they can’t drop entire databases or create new roles.

---

## 6. Summary of Key Points

1. **Deny port 5432** system-wide, only **allow** specific IPs.  
2. If our IP changes, update our UFW rules or use an SSH tunnel/VPN.  
3. In Docker Compose, consider **binding** Postgres to `127.0.0.1` or removing the `ports:` line if we don’t need external access.  
4. **Harden pg_hba.conf** to limit what addresses and roles can connect, using `trust` only for local loopback and `md5` for all else.  
5. Use a **non-superuser** role for the ChronoQuest app, so losing credentials doesn’t grant an attacker the ability to drop our entire database.

By following these steps, we keep our ChronoQuest Postgres instance secure from brute force attempts and malicious queries.