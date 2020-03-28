import express from 'express';
import KryptonAuth from '@krypton-org/krypton-auth';
import cors from 'cors';
const app = express();

//Set Cross-Origin Resource Sharing
if (process.env.ALLOWED_ORIGINS 
        && process.env.ALLOWED_ORIGINS !== "") {
    //White list set as allowed origins (CORS)
    const whiteList = process.env.ALLOWED_ORIGINS.split(";")
    const whileSet = new Set<string>(whiteList);
    app.use(cors({
        origin: function (origin, callback) {
            if (whileSet.has(origin)) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        },
        credentials: true,
    }));
} else {
    //All hosts set as allowed origins (CORS)
    app.use(cors({
        origin: function (origin, callback) {
            return callback(null, true);
        },
        credentials: true,
    }));
}

//Import possible krypton configuration from /krypton-vol
let config;
try {
    config = require(process.env.VOLUME+"/krypton.config.js");
} catch(err) {
    config = {}
}

//Set Krypton Authentication
app.use(KryptonAuth({ 
    dbAddress: process.env.MONGODB_URI, 
    privateKeyFilePath: process.env.KEYS_PATH+"/private-key",
    publicKeyFilePath: process.env.KEYS_PATH+"/public-key",
    ...config
}));

//Start server
app.listen(process.env.PORT, () => { console.log("Listening on port " + process.env.PORT) });
