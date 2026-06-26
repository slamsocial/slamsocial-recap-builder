# SlamSocial Recap Builder Launch Runbook

This is the clean path from the current prototype to a real production setup.

## 1. GitHub

Create a private GitHub repo named:

```txt
slamsocial-recap-builder
```

If the GitHub CLI is available locally, run:

```bash
gh repo create slamsocial-recap-builder --private --source=. --remote=origin --push
```

If not, create the repo in GitHub, then connect this folder:

```bash
git remote add origin git@github.com:YOUR_ORG/slamsocial-recap-builder.git
git push -u origin main
```

Keep the existing `sites` remote. It is only for the current OpenAI Sites deployment.

## 2. Supabase

Create a Supabase project named:

```txt
SlamSocial Recap Builder
```

In Supabase SQL Editor, run:

```txt
supabase/migrations/20260626000000_initial_recap_builder.sql
```

This creates:

- recaps
- metrics
- platform splits
- live upload/post links
- content tiles
- organic activity
- Pink58 topline metrics via the metric group
- a public `recap-media` storage bucket
- public read access for published client recaps
- server-only write access through the Supabase service role key

## 3. Environment Variables

Copy `.env.example` to `.env.local` for local work and fill in:

```txt
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RECAP_ADMIN_PASSWORD
NEXT_PUBLIC_APP_URL
```

For production, add the same values in Vercel Project Settings > Environment Variables.

Do not commit `.env.local`.

## 4. Vercel

In Vercel:

1. Import the GitHub repo.
2. Set the framework to Next.js if Vercel does not detect it automatically.
3. Add the Supabase environment variables.
4. Deploy.

The current app is built with vinext for Sites, so the Vercel migration step may need a small framework cleanup before final production deployment. Keep Sites live while Vercel is being wired.

## 5. Domain

Recommended domain:

```txt
recaps.slamsocial.biz
```

In Vercel, add that domain to the project. Then update DNS wherever `slamsocial.biz` is managed:

```txt
Type: CNAME
Name: recaps
Value: cname.vercel-dns.com
```

After the domain is verified, set:

```txt
NEXT_PUBLIC_APP_URL=https://recaps.slamsocial.biz
```

## 6. Application Migration

The current live app still uses browser storage. The next implementation pass should:

1. Load dashboard recap records from Supabase.
2. Save builder edits to Supabase.
3. Upload client logos and content files to Supabase Storage.
4. Load client pages from Supabase by slug, e.g. `/p/minions`.
5. Keep public client pages read-only and only expose published recaps.
