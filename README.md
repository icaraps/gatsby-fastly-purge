# Gatsby Fastly purge action

Purge Gatsby public HTML and JSON files from the Fastly cache.

## Inputs

### `fastly-token`

**Required** Token used to call the Fastly purge API.

### `fastly-url`

**Required** Fastly base URL.

## Example usage

```yaml
uses: icaraps/gatsby-fastly-purge-action@master
with:
  fastly-token: ${{ secrets.FASTLY_TOKEN }}
  fastly-url: ${{ secrets.FASTLY_URL }}
```