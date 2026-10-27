# Route Posts

A social posting app built with React JSX, Vite, React Router, and Tailwind CSS. It connects to the Route Posts API at `https://route-posts.routemisr.com/`.

## Live demo

After the GitHub Pages workflow finishes its first successful deployment, the app will be available at <https://yuossef-ashry.github.io/Media_App/>.

## Run locally

Requires Node.js 22 or newer.

```bash
npm ci
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

The production files are written to `dist/`.

## API configuration

The app uses the Route Posts API by default. To use another API, create a `.env` file in the project root:

```env
VITE_API_BASE_URL=https://your-api.example/
```

## GitHub Pages deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, builds the app, and publishes `dist/` to GitHub Pages. If Pages has not been enabled for this repository, open **Settings → Pages** and select **GitHub Actions** as the source. You can also run the workflow manually from the Actions tab.

GitHub Pages hosts the frontend only. Account, post, and upload features depend on the API being available.
