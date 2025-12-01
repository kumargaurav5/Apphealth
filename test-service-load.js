const cds = require('@sap/cds');
try {
    require('./srv/service.js');
    console.log('✅ Service loaded successfully');
} catch (e) {
    console.error('❌ Failed to load service:', e);
}
