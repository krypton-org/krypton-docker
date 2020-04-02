import express from 'express';
import KryptonAuth from '@krypton-org/krypton-auth';
import cors from 'cors';
import fs from 'fs';
const app = express();

//Set Cross-Origin Resource Sharing
if (process.env.ALLOWED_ORIGINS 
        && process.env.ALLOWED_ORIGINS !== "") {
    //White list set as allowed origins (CORS)
    const whiteList = process.env.ALLOWED_ORIGINS.split(" ")
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
    if (fs.existsSync('/krypton-vol/krypton.config.js')){
        config = require('/krypton-vol/krypton.config.js');
    } else if (fs.existsSync('/krypton-vol/krypton.config.json')){
        config = require('/krypton-vol/krypton.config.json');
    }
} catch(err) {
    config = {}
}

//Set Krypton Authentication
app.use(KryptonAuth({ 
    dbAddress: process.env.MONGODB_URI, 
    privateKeyFilePath: "/krypton-vol/private-key",
    publicKeyFilePath: "/krypton-vol/public-key",
    ...config
}));

//Start server
app.listen(5000, () => { console.log("Listening on port 5000") });
