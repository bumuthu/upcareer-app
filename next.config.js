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
};
