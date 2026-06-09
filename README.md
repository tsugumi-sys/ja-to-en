# ja-to-en

Static Japanese-to-English practice page.

## Local Verification

Start a local server with `miniserve` from the repository root:

```sh
miniserve public --index index.html --port 4173
```

Open:

```text
http://localhost:4173
```

Verify the My Life episode data:

1. Select `My Life` in the Drama dropdown.
2. Select `Season 1`.
3. Select `Episode 1`.
4. Confirm the header shows `15 lines`.
5. Scroll to the lines after id 9 and confirm the newer entries are visible.
6. Click a line to reveal and hide its English translation.

## Data Update Check

After editing an episode YAML file, refresh the browser page:

```text
public/data/episodes/mylife/s01e01.yaml
```

The app fetches YAML with cache bypassing, so a normal page reload should show the latest data. If the browser still shows old content, use a hard reload.

## Quick Data Count

To confirm the local YAML contains all expected entries:

```sh
node -e "const fs=require('fs'); const text=fs.readFileSync('public/data/episodes/mylife/s01e01.yaml','utf8'); console.log(text.match(/^  - id:/gm)?.length || 0)"
```
