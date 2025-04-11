/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
    // output: 'standalone',
    reactStrictMode: true,
    sassOptions: {
        includePaths: [path.join(__dirname, './src')],
    },
    webpack: (config, { dev }) => {
        config.cache = {
            type: 'memory',
        };
        if (dev) {
            config.cache = {
                type: 'memory',
            };
        }
        return config;
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**res.cloudinary.com**",
            }
        ],
    },
};

export default nextConfig;

