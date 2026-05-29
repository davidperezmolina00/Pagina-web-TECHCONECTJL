const dns = require('dns');

const hostToResolve = process.env.DB_HOST ? process.env.DB_HOST.trim() : 'NO_HOST';

console.log("--- TEST DE DNS ---");
console.log("Host a resolver:", hostToResolve);

dns.lookup(hostToResolve, (err, address, family) => {
    if (err) {
        console.error("❌ ERROR DNS: Render no puede encontrar este host:", err.message);
    } else {
        console.log("✅ DNS EXITOSO: El host apunta a la IP:", address);
    }
});