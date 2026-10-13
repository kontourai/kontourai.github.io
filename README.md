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
node scripts/add-legacy-paths.mjs
```

The hub and aggregate MCP resolve bundle URLs by **product**, so the Corpus
entry fetches `/corpus/docs-bundle.json` and links to `/corpus/`.

The build copies committed HTML redirects from `legacy/docs-kit/` into
`dist-hub/docs-kit/`. These cover the old landing page and all three published
document pages. Each has a meta refresh, canonical link, and ordinary link to
the corresponding Corpus page; JavaScript preserves query strings and fragments.

JSON fetch clients cannot follow an HTML meta refresh. The build therefore
fetches the live Corpus bundle and writes a compatibility snapshot at
`/docs-kit/docs-bundle.json`: it projects to schema v1 and retains the legacy `docs-kit` product/repo
identity required by older aggregate MCP product lists, while pointing page
URLs to `/corpus/`. Content, source revision, and digest stay as published.
Schema v2-only `purpose` and `builtOn` metadata is omitted from the legacy
snapshot. Older CLI pins do not support v2 bundles; upgrade to the install pin
above to consume the new product list. This snapshot supports clients still
using the old docs-kit product list and refreshes on hub builds, not on every
Corpus deployment. During
the transition the script also accepts the published v1 docs-kit identity at
`/corpus/` and rewrites its page URLs to the canonical path.

**Merge order:** merge the Corpus own-manifest v2 PR first, wait for its Pages
deploy, and confirm `/corpus/docs-bundle.json` declares `product: corpus` and
`repo: kontourai/corpus`. Then merge and deploy this hub change. The new
aggregate MCP validates product identity and rejects the transitional docs-kit
bundle when fetched for `corpus`, even though the browser card can display it.
