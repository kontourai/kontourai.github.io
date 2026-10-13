# Kontour docs hub

Source for <https://kontourai.github.io/>, the index of every Kontour product's
documentation.

Each product publishes its own site and `docs-bundle.json` to
`https://kontourai.github.io/<repo>/` with
[`@kontourai/corpus`](https://github.com/kontourai/corpus) and the shared
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
claude mcp add kontour-docs -- npx -y github:kontourai/corpus#b978eed765a52335183386d7996fa295bbfd821f corpus mcp
```

Use `corpus mcp --workspace <dir-with-checkouts>` instead to read unpublished
docs from local checkouts.

## Build and legacy paths

```bash
npx -y github:kontourai/corpus#b978eed765a52335183386d7996fa295bbfd821f corpus hub --products products.json --out dist-hub
cp -R legacy/docs-kit dist-hub/docs-kit
```

The hub and aggregate MCP resolve bundle URLs by **product**, so the Corpus
entry fetches `/corpus/docs-bundle.json` and links to `/corpus/`.

The build copies committed HTML redirects from `legacy/docs-kit/` into
`dist-hub/docs-kit/`. These cover the old landing page and all three published
document pages. Each has a meta refresh, canonical link, and ordinary link to
the corresponding Corpus page; JavaScript preserves query strings and fragments.

Old MCP pins in hub mode read the live `products.json` and then fetch each
product's bundle. Once this list names `corpus`, they fetch
`/corpus/docs-bundle.json`; nothing requests `/docs-kit/docs-bundle.json`.
Old pins reject the schema v2 bundle and lose Corpus. They must move to
`github:kontourai/corpus#b978eed765a52335183386d7996fa295bbfd821f corpus mcp`,
as shown in the install command above. The legacy paths redirect HTML pages
only.

**Merge order:** merge the Corpus own-manifest v2 PR first, wait for its Pages
deploy, and confirm `/corpus/docs-bundle.json` declares `product: corpus` and
`repo: kontourai/corpus`. Then merge and deploy this hub change. The new
aggregate MCP validates product identity and rejects the transitional docs-kit
bundle when fetched for `corpus`, even though the browser card can display it.
