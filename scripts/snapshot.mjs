#!/usr/bin/env node
// Snapshot stub. Phase 4 will implement the .dsx/versions/<id>/ store, the
// _index.json schema, --auto and --name modes, and the palette-thumbnail
// computation. Today this script only prints what it would do, so the
// pipeline contract is exercised end-to-end before the real implementation
// lands.

import { argv } from 'node:process';

const args = argv.slice(2);
const isAuto = args.includes('--auto');
const nameIdx = args.indexOf('--name');
const name = nameIdx >= 0 ? args[nameIdx + 1] : undefined;
const briefIdx = args.indexOf('--brief');
const brief = briefIdx >= 0 ? args[briefIdx + 1] : undefined;
const mode = isAuto ? 'auto' : nameIdx >= 0 ? 'name' : 'unknown';

process.stdout.write(
  `snapshot stub: mode=${mode}${name ? ` name="${name}"` : ''}${brief ? ` brief="${brief}"` : ''} (Phase 4 will persist this to .dsx/versions/)\n`,
);
process.exit(0);
