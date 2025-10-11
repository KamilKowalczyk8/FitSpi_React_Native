const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const APP_ROOT = path.resolve(__dirname, 'app');
process.env.EXPO_ROUTER_APP_ROOT = APP_ROOT;

module.exports = {};
