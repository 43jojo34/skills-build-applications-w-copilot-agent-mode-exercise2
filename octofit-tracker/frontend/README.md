# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## API configuration

In GitHub Codespaces, define `VITE_CODESPACE_NAME` in `octofit-tracker/frontend/.env.local` so the frontend can reach the forwarded API:

```env
VITE_CODESPACE_NAME=your-codespace-name
```

Use the Codespaces name only (not the full URL), then restart the Vite server after changing the file. The frontend calls `https://<VITE_CODESPACE_NAME>-8000.app.github.dev/api/<resource>/`. If the variable is omitted, requests use the same-origin `/api/` path, which the local Vite configuration proxies to `http://127.0.0.1:8000`.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
