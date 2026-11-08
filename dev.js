const { spawn } = require('child_process');
const path = require('path');

console.log('========================================================');
console.log('  EMPOWAY - Launching Backend & Frontend Services');
console.log('========================================================\n');

// Start Backend Server
const backend = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  shell: true
});

backend.on('error', (err) => {
  console.error('[Backend Error]:', err);
});

// Start Frontend Dev Server
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  shell: true
});

frontend.on('error', (err) => {
  console.error('[Frontend Error]:', err);
});

process.on('SIGINT', () => {
  backend.kill();
  frontend.kill();
  process.exit();
});

