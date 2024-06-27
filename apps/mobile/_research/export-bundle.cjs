#!/usr/bin/env node
"use strict";

const { execSync } = require('child_process');
const path = require('path');
const { argv } = require('process');
const { mkdir } = require('fs/promises');

const EXPO_CLI = require.resolve('@expo/cli', { paths: [require.resolve('expo/package.json')] });
const PROJECT_ROOT = path.resolve(__dirname, '..');
const debug = (...args) => console.log('[RESEARCH]', ...args);

debug(`Command invoked! Lets start the reasearch experiment`);

(async () => {
  // Extract the node binary and command to run
  const [nodeBinary, _researchCli] = argv;
  const args = [
    'export:embed',
    '--platform',
    'android',
    '--dev',
    'false',
    '--reset-cache',
    '--entry-file',
    path.join(PROJECT_ROOT, './index.js'),
    '--bundle-output',
    path.join(PROJECT_ROOT, './android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle'),
    '--assets-dest',
    path.join(PROJECT_ROOT, './android/app/build/generated/res/createBundleReleaseJsAndAssets'),
    '--sourcemap-output',
    path.join(PROJECT_ROOT, './android/app/build/intermediates/sourcemaps/react/release/index.android.bundle.packager.map'),
    '--minify',
    'false',
    '--verbose',
    // '--max-workers',
    // '2',
  ];

  // Prepare the folders
  await mkdir(path.join(PROJECT_ROOT, './android/app/build/generated/assets/createBundleReleaseJsAndAssets'), { recursive: true });
  await mkdir(path.join(PROJECT_ROOT, './android/app/build/generated/res/createBundleReleaseJsAndAssets'), { recursive: true });
  await mkdir(path.join(PROJECT_ROOT, './android/app/build/intermediates/sourcemaps/react/release'), { recursive: true });

  debug('Executing command, this causes EAS to hang:');
  debug('>', [nodeBinary, EXPO_CLI, ...args].join(' '));

  // Execute the command
  execSync([nodeBinary, EXPO_CLI, ...args].join(' '), { stdio: 'inherit' });

  // Output the results
  debug('All done!');

  // Mark this build as failed so that CI stops executing
  // process.exit(1);
})();
