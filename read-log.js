const fs = require('fs');

try {
    const content = fs.readFileSync('startup_debug.md', 'utf16le'); // Try UTF-16LE first
    const lines = content.split('\n');
    let found = false;
    lines.forEach(line => {
        if (line.includes('Error') || line.includes('Exception') || line.includes('Failed')) {
            console.log(line.trim());
            found = true;
        }
    });
    if (!found) {
        // Fallback to UTF-8 if it looked like garbage or nothing found
        const content8 = fs.readFileSync('startup_debug.md', 'utf8');
        const lines8 = content8.split('\n');
        lines8.forEach(line => {
            if (line.includes('Error') || line.includes('Exception') || line.includes('Failed')) {
                console.log(line.trim());
            }
        });
    }
} catch (e) {
    console.error(e);
}
