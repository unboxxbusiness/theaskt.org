const fs = require('fs');

console.log('Starting copy script...');

const src = 'C:/Users/Admin/.gemini/antigravity-ide/brain/73dc7f41-d1ae-496d-aceb-116cb1e2fa54/theaskt_logo_1782967715550.png';
const dst1 = 'e:/askt/public/icon-192.png';
const dst2 = 'e:/askt/public/icon-512.png';

try {
  if (!fs.existsSync(src)) {
    console.error('Source file does not exist:', src);
    process.exit(1);
  }

  console.log('Source file exists. Size:', fs.statSync(src).size);

  fs.copyFileSync(src, dst1);
  console.log('Copied to dst1 successfully.');

  fs.copyFileSync(src, dst2);
  console.log('Copied to dst2 successfully.');
} catch (err) {
  console.error('Error during copying:', err.message);
  process.exit(1);
}
