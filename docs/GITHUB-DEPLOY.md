# 🚀 One-Click GitHub Deployment — HMG StoreForge v3

v3 can deploy a generated store **directly to GitHub** from the generator — it creates the repository,
uploads every file, and enables GitHub Pages automatically. No manual uploading. **100% free.**

This uses the official **GitHub REST API** from your browser with a **Personal Access Token (PAT)**.
The token never leaves your browser (it only talks to `api.github.com`).

---

## Step 1 — Create a GitHub Personal Access Token (one-time, ~3 minutes)

You can use either a **fine-grained** token (recommended) or a **classic** token.

### Option A — Fine-grained token (recommended, more secure)
1. Go to **https://github.com/settings/tokens?type=beta** (GitHub → Settings → Developer settings →
   Personal access tokens → **Fine-grained tokens**).
2. Click **Generate new token**.
3. **Token name:** `StoreForge Deploy`. **Expiration:** 90 days (or your choice).
4. **Repository access:** choose **All repositories** (needed because we create new repos).
5. **Permissions → Repository permissions:** set these to **Read and write**:
   - **Administration** (needed to create the repo + enable Pages)
   - **Contents** (to upload files)
   - **Pages** (to enable GitHub Pages)
6. Click **Generate token** and **copy it** (starts with `github_pat_…`). You won't see it again.

### Option B — Classic token (simpler)
1. Go to **https://github.com/settings/tokens** → **Generate new token (classic)**.
2. **Note:** `StoreForge Deploy`. **Expiration:** your choice.
3. **Select scopes:** tick **`repo`** (full control of private repositories) and **`workflow`** is not
   needed. The `repo` scope covers create + push + Pages for your own repos.
4. **Generate token** and **copy it** (starts with `ghp_…`).

> 🔒 Treat the token like a password. You can revoke it anytime from the same settings page.

---

## Step 2 — Deploy from the generator

1. Open `generator/index.html` (locally or your hosted generator).
2. Fill in the client's details (Store name, **Store ID** = the repo name, WhatsApp, etc.).
3. Scroll to **🚀 One-Click Deploy to GitHub**.
4. Paste your token into **GitHub Personal Access Token**.
5. (Optional) tick **Make repository private**.
6. Click **🚀 Generate & Deploy to GitHub**.
7. Watch the log: it verifies your token, creates the repo, uploads files, and enables Pages.
8. When done you'll see:
   - **Live store:** `https://<your-username>.github.io/<store-id>/` (ready in 1–2 minutes)
   - **Repository:** the GitHub repo link
   - **Admin link + passcode**

That's it — the store is live. Send the client the live link, admin link, and passcode.

---

## Step 3 (optional) — Prettier URL with Cloudflare Pages

GitHub Pages serves under `username.github.io/store-id/`. For a cleaner `store-id.pages.dev` URL:
1. Go to https://dash.cloudflare.com → Pages → **Connect to Git** → select the new repo.
2. Framework preset **None**, build command **empty**, output dir **`/`** → **Save and Deploy**.
3. Live at `https://<store-id>.pages.dev`. (See DEPLOYMENT.md.)

---

## Troubleshooting

| Message | Fix |
|--------|-----|
| `Bad credentials` | Token is wrong/expired. Generate a new one. |
| `Resource not accessible by personal access token` | Fine-grained token is missing **Administration / Contents / Pages** write permissions, or repo access isn't "All repositories". |
| `name already exists` | A repo with that Store ID already exists; StoreForge will update it instead. Use a new Store ID for a fresh repo. |
| Pages not enabling | The log will say so — enable manually: repo **Settings → Pages → Branch: main → /root → Save**. |
| Blank page after deploy | Wait 1–2 minutes for the first Pages build, then hard-refresh (Ctrl/Cmd+Shift+R). |

---

## Why this is safe & free
- **Free:** GitHub repos + GitHub Pages are free. No server, no paid API.
- **Safe:** the token is used only in your browser session to call GitHub. It is **not** saved by
  StoreForge, not sent to HMG, and not embedded in any generated store.
- **Revocable:** delete the token anytime in GitHub settings.

💬 Need help? WhatsApp HMG Technologies: https://wa.me/2348100866322
