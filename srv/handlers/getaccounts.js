const { getDestination } = require('@sap-cloud-sdk/connectivity');
const { executeHttpRequest } = require('@sap-cloud-sdk/http-client');

const DEST_NAME = process.env.ACC_DEST_NAME || 'AccountService';

async function accGet(path) {
    const dest = await getDestination({ destinationName: DEST_NAME });
    if (!dest) throw new Error(`Destination "${DEST_NAME}" not found/bound`);
    const res = await executeHttpRequest(dest, {
        method: 'GET',
        url: path,
        headers: { Accept: 'application/json' }
    });
    return res.data;
}

module.exports = { accGet };
