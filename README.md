# Kontour docs hub

Source for <https://kontourai.github.io/>, the index of every Kontour product's
documentation.

Each product publishes its own site and `docs-bundle.json` to
`https://kontourai.github.io/<repo>/` with
[`@kontourai/docs-kit`](https://github.com/kontourai/docs-kit) and the shared
`docs-gate.yml` and `docs-pages.yml` workflows in
[`kontourai/.github`](https://github.com/kontourai/.github#product-docs-gate-and-pages).
The hub page reads those bundles in the browser, so it shows each product's
published commit, whether that commit is the current `main`, and whether the
docs are still thin, without rebuilding here.

## Add a product

Add `{ "product": "<repo>", "repo": "kontourai/<repo>" }` to
[`products.json`](products.json). Until the product's first docs deploy
finishes, the hub shows it as unpublished.

## Ask the docs from an agent

The aggregate docs MCP serves every product listed here:

```bash
claude mcp add kontour-docs -- npx -y github:kontourai/docs-kit#27cd43ded8c6e2e591d85d1d65bff31b3ae92e24 docs-kit mcp
```

Use `docs-kit mcp --workspace <dir-with-checkouts>` instead to read unpublished
docs from local checkouts.
