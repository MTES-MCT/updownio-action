# updownio-action

Github action that fetches updown.io checks from API and report results as JSON.

## Usage

First, you need to store your updown.io read-only api key in repo secrets as `UPDOWNIO_API_KEY`.

```yaml
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: "MTES-MCT/updownio-action@master"
        with:
          apiKey: ${{ secrets.UPDOWNIO_API_KEY }}
          url: http://www.dossierfacile.fr
          output: updownio.json
```
