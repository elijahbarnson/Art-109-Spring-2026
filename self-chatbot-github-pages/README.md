# Self Chatbot Builder - GitHub Pages Version

This is a static, GitHub Pages-compatible version of the self-chatbot idea.

It lets a visitor:

1. answer onboarding questions
2. generate a personal corpus in their browser
3. chat with a simple simulated version of themselves

No API key is needed. No backend is needed. The corpus is stored in the visitor's browser using `localStorage`.

## Run locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Build for GitHub Pages

```bash
npm run build
```

Next.js will generate a static site in:

```text
out/
```

That static output is what GitHub Pages can host.

## Deploy to GitHub Pages

Recommended simple deployment:

1. Push this project to a GitHub repository.
2. In GitHub, go to Settings > Pages.
3. Use GitHub Actions as the source.
4. Add the workflow file below at `.github/workflows/deploy.yml`.

```yml
name: Deploy Next.js static site to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - name: Install dependencies
        run: npm ci
      - name: Build static site
        run: npm run build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Why this version is static

GitHub Pages cannot securely run a private backend API route. This project intentionally avoids exposing any OpenAI API key in client-side code.

For a production AI version, use:

- GitHub Pages for frontend
- Vercel, Render, Netlify Functions, or another backend for the AI endpoint
- OpenAI API key stored only on the backend

## Files to look at

```text
app/page.tsx              Landing page
app/onboarding/page.tsx   Corpus builder
app/chat/page.tsx         Chat interface
lib/questions.ts          Onboarding questions
lib/corpus.ts             Corpus creation and localStorage
lib/chatbot.ts            Retrieval and local reply generation
next.config.ts            Static export config
```
