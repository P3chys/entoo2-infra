# Entoo2 Quick Setup

Deploy Entoo2 to Hetzner in 5 steps.

## Step 1: Generate SSH Key

```bash
ssh-keygen -t ed25519 -f ~/.ssh/entoo2_deploy
cat ~/.ssh/entoo2_deploy.pub
```

Copy the output.

## Step 2: Add Key to Server

In Hetzner console:
```bash
echo 'PASTE_YOUR_PUBLIC_KEY' >> ~/.ssh/authorized_keys
```

## Step 3: Add GitHub Secrets

Add to **entoo2-infra**, **entoo2-api**, and **entoo2-web**:

Settings → Secrets → Actions → New secret:

- `SSH_HOST` = `YOUR_SERVER_IP`
- `SSH_USER` = `root`
- `SSH_PRIVATE_KEY` = `cat ~/.ssh/entoo2_deploy` (full output)

Also enable: Settings → Actions → "Read and write permissions" → Save

## Step 4: Run Setup

1. Go to https://github.com/P3chys/entoo2-infra/actions
2. Click "Setup Hetzner Server" → "Run workflow"
3. Enter server IP → "Run workflow"
4. Wait ~10 minutes

## Step 5: Access

- **App**: http://YOUR_SERVER_IP
- **API**: http://YOUR_SERVER_IP:8000

Login: `admin@entoo2.local` / `AdminPass123!`

---

## Deploy Updates

**API**: https://github.com/P3chys/entoo2-api/actions → "Deploy to Hetzner"

**Web**: https://github.com/P3chys/entoo2-web/actions → "Deploy to Hetzner"

---

## Common Commands

```bash
# SSH
ssh -i ~/.ssh/entoo2_deploy root@YOUR_IP

# Logs
cd /opt/entoo2 && docker compose logs -f

# Restart
cd /opt/entoo2 && docker compose restart

# Status
cd /opt/entoo2 && docker compose ps
```

Full docs: `SETUP.md`
