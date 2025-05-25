#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const nextDir = path.join(rootDir, '.next');
const standaloneDir = path.join(nextDir, 'standalone');
const staticSrcDir = path.join(nextDir, 'static');
const staticDestDir = path.join(standaloneDir, '.next', 'static');
const publicSrcDir = path.join(rootDir, 'public');
const publicDestDir = path.join(standaloneDir, 'public');

console.log('Setting up standalone Next.js server...');

// Create destination directories
if (!fs.existsSync(path.join(standaloneDir, '.next'))) {
  fs.mkdirSync(path.join(standaloneDir, '.next'), { recursive: true });
}

if (!fs.existsSync(staticDestDir)) {
  fs.mkdirSync(staticDestDir, { recursive: true });
}

if (!fs.existsSync(publicDestDir)) {
  fs.mkdirSync(publicDestDir, { recursive: true });
}

// Copy static files
console.log('Copying static files to standalone build...');
execSync(`xcopy "${staticSrcDir}" "${staticDestDir}" /E /I /Y`);
console.log('Copying public files to standalone build...');
execSync(`xcopy "${publicSrcDir}" "${publicDestDir}" /E /I /Y`);

console.log('Starting standalone server...');
const port = process.env.PORT || 3000;
execSync(`node ${path.join(standaloneDir, 'server.js')} -p ${port}`, { stdio: 'inherit' }); 