const toTs = (v) => {
    if (v == null) return null;
    if (v instanceof Date) return v;
    if (typeof v === 'number') return new Date(v); // epoch ms
    if (typeof v === 'string') return new Date(v); // ISO
    return null;
};

const toStrBool = (v) => (v == null ? null : String(!!v)); // "true"/"false"

module.exports = { toTs, toStrBool };
