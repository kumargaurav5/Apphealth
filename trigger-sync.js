const http = require('http');
const fs = require('fs');

const options = {
    hostname: 'localhost',
    port: 4004,
    path: '/odata/v4/cf/SyncAllAccounts',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let data = '';
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log('Response received.');
        fs.writeFileSync('sync-response.json', data);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write('{}');
req.end();
