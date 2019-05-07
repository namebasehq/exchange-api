const fetch = require('node-fetch');
const { encode } = require('querystring');

class Exchange {
  constructor(apiRoot, accessKey, secretKey) {
    this.apiRoot = apiRoot;
    this.accessKey = accessKey;
    this.secretKey = secretKey;
  }

  request(method, endpoint, payload) {
    const queryString = encode(payload);
    const url = `${this.apiRoot}${endpoint}${queryString}`;
    return fetch(url, { method }).then(res => res.json());
  }
}

module.exports = Exchange;
