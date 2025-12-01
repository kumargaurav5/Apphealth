console.log('--- VCAP_SERVICES START ---');
console.log(JSON.stringify(JSON.parse(process.env.VCAP_SERVICES || '{}'), null, 2));
console.log('--- VCAP_SERVICES END ---');

const http = require('http');
http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Debug Server Running');
}).listen(process.env.PORT || 4004, () => {
    console.log('Debug server listening...');
});
