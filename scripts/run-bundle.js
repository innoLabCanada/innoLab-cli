/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { spawn } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, '..');

const nodeArgs = ['./bundle/gemini.js', ...process.argv.slice(2)];

const child = spawn('node', nodeArgs, {
  stdio: ['pipe', 'inherit', 'inherit'],
  cwd: root,
});

child.stdin.write('\n');
child.stdin.end();

child.on('close', (code) => {
  process.exit(code);
});
