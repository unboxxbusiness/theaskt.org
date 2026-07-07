const fs = require('fs');
const path = require('path');

const ENV_PATH = path.join(__dirname, '..', '.env');
console.log('ENV_PATH resolved to:', ENV_PATH);
console.log('Exists:', fs.existsSync(ENV_PATH));

let envConfig = {};
if (fs.existsSync(ENV_PATH)) {
  const envContent = fs.readFileSync(ENV_PATH, 'utf-8');
  const lines = envContent.split('\n');
  console.log('Total lines:', lines.length);
  
  lines.forEach((line, index) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?$/);
    if (match) {
      let key = match[1];
      let value = match[2] ? match[2].trim() : '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      envConfig[key] = value;
      console.log(`Line ${index + 1}: Matched key: "${key}", value length: ${value.length}`);
    }
  });
}

console.log('Parsed Keys:', Object.keys(envConfig));
console.log('SANITY_API_WRITE_TOKEN exists:', !!envConfig.SANITY_API_WRITE_TOKEN);
if (envConfig.SANITY_API_WRITE_TOKEN) {
  console.log('Token length:', envConfig.SANITY_API_WRITE_TOKEN.length);
}
