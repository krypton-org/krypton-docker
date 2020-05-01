import express from 'express';
import KryptonAuth from '@krypton-org/krypton-auth';
import cors from 'cors';
import fs from 'fs';
const app = express();

// Set Cross-Origin Resource Sharing
if (process.env.ALLOWED_ORIGINS 
        && process.env.ALLOWED_ORIGINS !== '') {
    // White list set as allowed origins (CORS)
    const whiteList = process.env.ALLOWED_ORIGINS.split(' ')
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
    // All hosts set as allowed origins (CORS)
    app.use(cors({
        origin: function (origin, callback) {
            return callback(null, true);
        },
        credentials: true,
    }));
}

// If it exists, load configuration from /krypton-vol
let config = {};
if (fs.existsSync('/krypton-vol/krypton.config')) {
    config = require('/krypton-vol/krypton.config');
}

// Set `dbAdress` from env. if available
if (process.env.MONGODB_URI !== undefined) {
    config['dbAddress'] = process.env.MONGODB_URI;
}

// Ensure that `dbAddress` is set
if (config['dbAddress'] === undefined) {
    throw new Error('`dbAddress` is not set, please set the `MONGODB_URI` environment variable, or the `dbAddress` property in the configuration.');
}

// Setup Krypton Authentication
app.use(KryptonAuth({ 
    privateKeyFilePath: '/krypton-vol/private-key',
    publicKeyFilePath: '/krypton-vol/public-key',
    ...config
}));

// Start server
app.listen(5000, () => { console.log('Listening on port 5000') });
