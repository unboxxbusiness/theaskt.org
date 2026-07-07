const fs = require('fs');
const line = 'SANITY_API_WRITE_TOKEN=skqqjkgh\r';
const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?$/);
fs.writeFileSync('e:/apps/askt/test_regex.txt', 'Match: ' + JSON.stringify(match) + '\nCRLF: ' + line.endsWith('\r'), 'utf-8');
