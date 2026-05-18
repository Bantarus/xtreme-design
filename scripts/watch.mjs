#!/usr/bin/env node
// Watch DESIGN.md and re-run the pipeline on every change. Debounce 400 ms so
// editor batched writes coalesce. On pipeline failure, print findings but DO
// NOT crash — the watcher keeps running so the user's next save is picked up.
//
// This is the local-dev sibling of the Stop hook: same pipeline.mjs, fired
// continuously instead of once per assistant turn.

import { spawn } from 'node:child_process';
import chokidar from 'chokidar';

const TARGET = 'DESIGN.md';
const DEBOUNCE_MS = 400;

let pending;
let running = false;
let rerunQueued = false;

function runPipeline() {
  if (running) {
    rerunQueued = true;
    return;
  }
  running = true;
  process.stdout.write('\n— DESIGN.md changed → running pipeline —\n');
  const child = spawn('node', ['scripts/pipeline.mjs'], { stdio: 'inherit' });
  child.on('exit', (code) => {
    running = false;
    if (code !== 0) {
      process.stderr.write(`watch: pipeline exited ${code}. Fix and save again.\n`);
    }
    if (rerunQueued) {
      rerunQueued = false;
      runPipeline();
    }
  });
}

function debouncedRun() {
  clearTimeout(pending);
  pending = setTimeout(runPipeline, DEBOUNCE_MS);
}

const watcher = chokidar.watch(TARGET, {
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: { stabilityThreshold: 200, pollInterval: 50 },
});

watcher
  .on('change', debouncedRun)
  .on('add', debouncedRun)
  .on('ready', () => {
    process.stdout.write(`watch: watching ${TARGET}. Edit and save to trigger the pipeline.\n`);
  })
  .on('error', (err) => {
    process.stderr.write(`watch: chokidar error: ${err?.message ?? err}\n`);
  });

process.on('SIGINT', () => {
  watcher.close().then(() => process.exit(0));
});
