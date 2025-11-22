const url = require('url/');

url.fileURLToPath = function (url) {
    if (typeof url === 'string') {
        url = new URL(url);
    }
    if (url.protocol !== 'file:') {
        throw new TypeError('The URL must be of scheme file');
    }
    return url.pathname;
};

module.exports = url;
