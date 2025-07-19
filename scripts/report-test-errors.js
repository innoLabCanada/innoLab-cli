/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import readline from 'readline';

async function processVitestJson() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  let jsonInput = '';
  for await (const line of rl) {
    jsonInput += line;
  }

  try {
    const results = JSON.parse(jsonInput);
    let failedCount = 0;

    console.log('--- Vitest Error Summary ---');

    for (const testFile of results.testResults) {
      const failedTests = testFile.assertionResults.filter(
        (r) => r.status === 'failed',
      );

      if (failedTests.length > 0) {
        console.log(`\n[FAIL] ${testFile.name}`);
        for (const test of failedTests) {
          failedCount++;
          console.log(`  ● ${test.fullName}`);
          // Clean up the error message for better readability
          const errorMessage = test.failureMessages
            .join('\n')
            .replace(/\x1b\[\d+m/g, ''); // Remove ANSI color codes
          console.log(`    ${errorMessage.split('\n')[0]}`); // Show first line of error
        }
      }
    }

    if (failedCount > 0) {
      console.log(`\n--- Total Failed Tests: ${failedCount} ---`);
      process.exit(1);
    } else {
      console.log('All tests passed!');
    }
  } catch (error) {
    console.error('Failed to parse Vitest JSON output:', error);
    process.exit(1);
  }
}

processVitestJson();
