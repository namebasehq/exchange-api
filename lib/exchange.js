const fetch = require('node-fetch');
const { encode } = require('querystring');
const enums = require('./enums');

// flatten the enums for convenience
const flattenedEnums = {};
Object.keys(enums).forEach(key => {
  Object.keys(enums[key]).forEach(keyKey => {
    flattenedEnums[keyKey] = enums[key][keyKey];
  });
});

// main export
class Exchange {
  constructor(accessKey, secretKey, apiRoot = enums.Misc.DEFAULT_API_ROOT) {
    this.accessKey = accessKey;
    this.secretKey = secretKey;
    this.apiRoot = apiRoot;

    if (this.accessKey && this.secretKey) {
      const credentials = Buffer.from(this.accessKey + ':' + this.secretKey);
      this.authorization = 'Basic ' + credentials.toString('base64');
    } else {
      this.authorization = null;
    }
  }

  info() {
    const endpoint = '/info';
    return this._request('GET', endpoint, {});
  }

  depth(symbol, limit) {
    const endpoint = '/depth';
    return this._request('GET', endpoint, { symbol, limit });
  }

  priceTicker(symbol) {
    const endpoint = '/ticker/price';
    return this._request('GET', endpoint, { symbol });
  }

  bookTicker(symbol) {
    const endpoint = '/ticker/book';
    return this._request('GET', endpoint, { symbol });
  }

  klinesTicker(symbol, interval, startTime, endTime, limit) {
    const endpoint = '/ticker/klines';
    return this._request('GET', endpoint, {
      symbol,
      interval,
      startTime,
      endTime,
      limit,
    });
  }

  dayTicker(symbol) {
    const endpoint = '/ticker/day';
    return this._request('GET', endpoint, { symbol });
  }

  trades(symbol, tradeId, limit, receiveWindow) {
    const endpoint = '/trade';
    return this._timedRequest('GET', endpoint, {
      symbol,
      tradeId,
      limit,
      receiveWindow,
    });
  }

  limitSell(symbol, quantity, price, receiveWindow) {
    return this._createOrder(
      symbol,
      enums.OrderSides.SELL,
      enums.OrderTypes.LMT,
      quantity,
      price,
      receiveWindow
    );
  }

  limitBuy(symbol, quantity, price, receiveWindow) {
    return this._createOrder(
      symbol,
      enums.OrderSides.BUY,
      enums.OrderTypes.LMT,
      quantity,
      price,
      receiveWindow
    );
  }

  marketSell(symbol, quantity, price, receiveWindow) {
    return this._createOrder(
      symbol,
      enums.OrderSides.SELL,
      enums.OrderTypes.MKT,
      quantity,
      null,
      receiveWindow
    );
  }

  marketBuy(symbol, quantity, price, receiveWindow) {
    return this._createOrder(
      symbol,
      enums.OrderSides.BUY,
      enums.OrderTypes.MKT,
      quantity,
      null,
      receiveWindow
    );
  }

  cancelOrder(symbol, orderId, receiveWindow) {
    const endpoint = '/order';
    return this._timedRequest('DELETE', endpoint, { symbol, orderId, receiveWindow });
  }

  order(symbol, orderId, receiveWindow) {
    const endpoint = '/order';
    return this._timedRequest('GET', endpoint, { symbol, orderId, receiveWindow });
  }

  openOrders(symbol, receiveWindow) {
    const endpoint = '/order/open';
    return this._timedRequest('GET', endpoint, { symbol, receiveWindow });
  }

  allOrders(symbol, orderId, limit, receiveWindow) {
    const endpoint = '/order/all';
    return this._timedRequest('GET', endpoint, { symbol, orderId, limit, receiveWindow });
  }

  accountInfo(receiveWindow) {
    const endpoint = '/account';
    return this._timedRequest('GET', endpoint, { receiveWindow });
  }

  userTrades(symbol, orderId, limit, receiveWindow) {
    const endpoint = '/trade/account';
    return this._timedRequest('GET', endpoint, { symbol, orderId, limit, receiveWindow });
  }

  depositAddress(asset, receiveWindow) {
    const endpoint = '/deposit/address';
    return this._timedRequest('POST', endpoint, { asset, receiveWindow });
  }

  withdraw(asset, address, amount, receiveWindow) {
    const endpoint = '/withdraw';
    return this._timedRequest('POST', endpoint, { asset, address, amount, receiveWindow });
  }

  depositHistory(asset, startTime, endTime, receiveWindow) {
    const endpoint = '/deposit/history';
    return this._timedRequest('GET', endpoint, { asset, startTime, endTime, receiveWindow });
  }

  withdrawalHistory(asset, startTime, endTime, receiveWindow) {
    const endpoint = '/withdraw/history';
    return this._timedRequest('GET', endpoint, { asset, startTime, endTime, receiveWindow });
  }

  _createOrder(symbol, side, type, quantity, price, receiveWindow) {
    const endpoint = '/order';
    return this._timedRequest('POST', endpoint, {
      symbol,
      side,
      type,
      quantity,
      price,
      receiveWindow,
    });
  }

  _timedRequest(method, endpoint, payload) {
    return this._request(method, endpoint, {
      ...payload,
      timestamp: Date.now(),
    });
  }

  _request(method, endpoint, payload) {
    // clear out null keys
    const keys = Object.keys(payload);
    keys.forEach(key => {
      if (!payload[key] && key !== false && key !== 0) {
        delete payload[key];
      }
    });

    // put the payload in the right spot
    let url = `${this.apiRoot}${endpoint}`;
    let options = {};
    if (method === 'GET') {
      url += `?${encode(payload)}`;
    } else {
      options.body = JSON.stringify(payload);
    }

    // actually make the request
    return fetch(url, {
      method,
      headers: {
        Authorization: this.authorization,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      ...options,
    }).then(res => res.json());
  }
}

module.exports = {
  Exchange,
  ...flattenedEnums,
};
