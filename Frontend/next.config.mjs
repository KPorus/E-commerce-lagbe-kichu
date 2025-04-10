/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    sassOptions: {
        includePaths: [path.join(__dirname, './src')],
    },
    webpack: (config, { dev }) => {
        if (dev) {
            config.cache = {
                type: 'memory', // use in-memory cache instead of filesystem
            };
        }
        return config;
    },
};

export default nextConfig;

