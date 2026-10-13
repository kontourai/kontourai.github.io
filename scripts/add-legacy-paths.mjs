import { cpSync, writeFileSync } from 'node:fs';

const canonicalBase = 'https://kontourai.github.io/corpus/';
const response = await fetch(new URL('docs-bundle.json', canonicalBase));
if (!response.ok) throw new Error(`Corpus bundle fetch failed: HTTP ${response.status}`);
const bundle = await response.json();
if (![1, 2].includes(bundle.schemaVersion) || !['corpus', 'docs-kit'].includes(bundle.product)
    || !Array.isArray(bundle.documents) || !Array.isArray(bundle.topics)) {
  throw new Error('Expected a published Corpus documentation bundle');
}

// Older aggregate MCP pins accept only schema v1 and the legacy identity.
const { purpose, builtOn, ...v1 } = bundle;
const legacy = {
  ...v1,
  schemaVersion: 1,
  product: 'docs-kit',
  repo: 'kontourai/docs-kit',
  siteUrl: canonicalBase,
  documents: bundle.documents.map(canonicalPage),
  topics: bundle.topics.map(canonicalPage),
};
function canonicalPage(entry) {
  return { ...entry, url: entry.url.replace('https://kontourai.github.io/docs-kit/', canonicalBase) };
}

cpSync('legacy/docs-kit', 'dist-hub/docs-kit', { recursive: true });
writeFileSync('dist-hub/docs-kit/docs-bundle.json', JSON.stringify(legacy, null, 2) + '\n');
console.log(`Added legacy docs-kit pages and bundle from ${bundle.sha}`);
