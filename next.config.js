/** @type {import('next').NextConfig} */

const path = require('path');

module.exports = {
    webpack: (config, { dev, isServer }) => {
        config.module.rules.forEach(rule => {
            if (rule.test && rule.test.toString().includes('tsx|ts')) {
                rule.use = [{
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                        configFile: path.resolve('./tsconfig.json')
                    }
                }];
            }
        });
        config.resolve.fallback = {
            fs: false,
            net: false,
            dns: false,
            child_process: false,
            tls: false,
        };

        return config;
    },
    env: {
        KINDE_CLIENT_ID: process.env.KINDE_CLIENT_ID || "<client id>",
        KINDE_CLIENT_SECRET: process.env.KINDE_CLIENT_SECRET || "<client secret>",
        KINDE_ISSUER_URL: process.env.KINDE_ISSUER_URL || "https://<app name>.us.kinde.com",
        KINDE_SITE_URL: process.env.KINDE_SITE_URL || "http://localhost:3000",
        MONGO_PATH: process.env.MONGO_PATH || "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority"
    }
};
