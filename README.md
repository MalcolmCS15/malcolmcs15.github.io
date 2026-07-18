# Malcolm Grant — Personal Website

The source for my personal portfolio: an interactive, terminal-themed site covering my projects, experience, education, and more.

### 🔗 Live site: **[malcolmcs15.github.io](https://malcolmcs15.github.io/)**

---

## About

I'm a Computer Science & Biology student at Brown University building deep learning and reinforcement learning systems. This repo holds everything that powers my website — the content and the code that renders it.

## Development

```bash
npm install
npm run dev      # local dev server → http://localhost:5173
npm run build    # production build
```

All content lives in the `content/` folder (Markdown + JSON) — edit a file, save, and the browser hot-reloads. Pushing to `main` automatically rebuilds and deploys to GitHub Pages via the workflow in `.github/workflows/pages.yml`.

## Tech

React · TypeScript · Vite · Chakra UI · Framer Motion — deployed on GitHub Pages.

## Credits & License

Built on the open-source **[TermHub](https://github.com/H-Freax/TermHub)** template by [Yaoyao (Freax) Qian](https://h-freax.github.io/), used under the **GPL-3.0** license. See [LICENSE](LICENSE) for details.