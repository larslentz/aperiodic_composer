---
name: Zipping files in this environment
description: How to create zip archives when no zip/python3 binary is available in the sandbox.
---

This Replit sandbox has no `zip`, `unzip`, or `python3` binary available, so shelling out to `zip -r` or `python3 -m zipfile` fails.

Use Node's `archiver` package instead, installed standalone (not into the workspace's own package.json — this is a one-off tooling need, not a project dependency):

```bash
npm install --prefix /tmp/zipper archiver@5.3.2
```

**Why pin to v5, not v8+:** `archiver@8` switched to an ESM/class-based API with a different constructor signature and broke when required as `const archiver = require(...)`. `archiver@5.3.2` keeps the classic CommonJS function-call API (`archiver('zip', { zlib: { level: 9 } })`), which works reliably via `require()` from a plain Node script.

**How to apply:** write a small script that does:
```js
const archiver = require('/tmp/zipper/node_modules/archiver');
const output = fs.createWriteStream(destPath);
const archive = archiver('zip', { zlib: { level: 9 } });
archive.pipe(output);
archive.directory(srcDir, false); // or a subfolder name to nest contents
archive.finalize();
```
Run it with plain `node script.js`. Also prefer `cp -r` over `rsync` for copying source trees, since `rsync` is likewise unavailable.
