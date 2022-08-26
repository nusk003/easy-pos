require('dotenv').config();

const ip = require('ip');
const spawnChild = require('cross-spawn');

process.env.REACT_APP_LOCAL_IP = `https://${ip.address()}`;

if (process.env.REACT_APP_HTTPS === 'true') {
  spawnChild('yarn', ['start:https'], { stdio: 'inherit' });
} else {
  spawnChild('yarn', ['start'], { stdio: 'inherit' });
}
