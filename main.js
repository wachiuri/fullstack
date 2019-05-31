const config = require('config');

if (!config.get("jwtPrivateKey")) {
    console.error("FATAL ERROR : Environment variable sc_jwtPrivateKey is not set");
    process.exit(1);
}

require("./controller");