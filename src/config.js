import * as url from 'url';
import dotenv from 'dotenv';
import { Command } from 'commander';

const commandLineOptions = new Command();
commandLineOptions
    .option('--mode <mode>')
    .option('--port <port>')
commandLineOptions.parse();

switch (commandLineOptions.opts().mode) {
    case 'prod':
        dotenv.config({ path: './.env.prod'});
        break;
    
    case 'devel':
    default:
        dotenv.config({ path: './.env.devel'});
}

const config = {
    __FILENAME: url.fileURLToPath(import.meta.url),
    __DIRNAME: url.fileURLToPath(new URL('.', import.meta.url)),
    PORT: commandLineOptions.opts().port || process.env.PORT || 3000,
    MONGOOSE_URL: process.env.MONGOOSE_URL,
    SECRET_KEY: process.env.SECRET_KEY,
    GITHUB_AUTH: {
        clientId: process.env.GITHUB_AUTH_CLIENT_ID,
        clientSecret: process.env.GITHUB_AUTH_CLIENT_SECRET,
        callbackUrl: `http://localhost:${commandLineOptions.opts().port || 3000}/api/auth/githubcallback`
    },
    GOOGLE_AUTH: {
        clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
        callbackUrl: `http://localhost:${commandLineOptions.opts().port || 3000}/api/auth/googlecallback`
    },
    PERSISTENCE: process.env.PERSISTENCE,
    MODE: commandLineOptions.opts().mode || 'devel',
    GOOGLE_APP_EMAIL: process.env.GOOGLE_APP_EMAIL,
    GOOGLE_APP_PASS: process.env.GOOGLE_APP_PASS,
    RESEND_API_EMAIL: process.env.RESEND_API_EMAIL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,

};

export default config;