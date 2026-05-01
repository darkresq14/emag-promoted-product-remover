# eMAG Promoted Remover

A browser extension that automatically removes promoted/sponsored product cards from eMAG listings.

Works on **emag.ro**, **emag.bg**, and **emag.hu**.

## Features

- Automatically detects and removes promoted product cards from search results and category pages
- Real-time per-page removal count
- Lifetime statistics tracked across all sessions
- Minimal permissions — only `storage` for persisting stats

## Installation

### Chrome Web Store

*(Link will be added once published)*

### Manual (development)

1. Clone the repo and install dependencies:

```sh
pnpm install
```

2. Build the extension:

```sh
pnpm build
```

3. Open `chrome://extensions` in Chrome, enable **Developer mode**, then click **Load unpacked** and select the `.output/chrome-mv3` directory.

## Development

```sh
pnpm dev          # Start dev server with HMR (Chrome)
pnpm dev:firefox  # Start dev server with HMR (Firefox)
pnpm build        # Production build
pnpm zip          # Build and create store-ready ZIP
pnpm zip:firefox  # Build and create store-ready ZIP (Firefox)
```

## Tech Stack

- [WXT](https://wxt.dev/) — Web extension framework
- [Svelte 5](https://svelte.dev/) — UI components
- TypeScript

## License

[MIT](LICENSE)
