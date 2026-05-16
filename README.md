# Build Failure Theater

Animated SVG README widget for GitHub Actions drama.

```md
![Build Failure Theater](https://build-failure-theater.hozorica.com/owner/repo.svg)
```

The widget reads the latest public GitHub Actions run for a repository and renders a small animated scene where two characters talk about the build.

## Examples

```md
![CI Theater](https://build-failure-theater.hozorica.com/facebook/react.svg)
```

Optional style parameter:

```md
![CI Theater](https://build-failure-theater.hozorica.com/facebook/react.svg?theme=dark)
```

## States

- `success`: no drama today
- `failure`: the build failed
- `in_progress`: the build is still running
- `unknown`: GitHub did not return a usable Actions state

## Development

```bash
npm install
npm test
npm run dev
```

The Worker route is:

```txt
GET /:owner/:repo.svg
```

For higher GitHub API limits, set `GITHUB_TOKEN` in the Worker environment.

## Deploy

The included Worker config targets:

```txt
build-failure-theater.hozorica.com
```

Deploy locally:

```bash
CLOUDFLARE_API_TOKEN=... npm run deploy
```

Deploy from GitHub Actions by setting:

- repository variable `CLOUDFLARE_ACCOUNT_ID`
- repository secret `CLOUDFLARE_API_TOKEN`
