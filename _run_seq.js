const { execSync } = require('child_process');

try {
  const result = execSync('node scripts/_import_seq.js', {
    cwd: 'E:\\novatech-store',
    encoding: 'utf-8',
    timeout: 600000,
  });
  console.log(result);
} catch (err) {
  console.log('STDERR:', err.stderr);
  console.log('STDOUT:', err.stdout);
  console.log('EXIT CODE:', err.status);
}
