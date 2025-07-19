/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { spawn } from 'child_process';
import process from 'process';

const child = spawn(
  'node',
  [
    '--loader',
    'ts-node/esm',
    './node_modules/ts-node/dist/bin.js',
    '--project',
    './tsconfig.dev.json',
    './packages/cli/src/gemini.tsx',
    ...process.argv.slice(2),
  ],
  {
    stdio: 'inherit',
    shell: true,
  },
);

child.on('close', (code) => {
  process.exit(code);
});
