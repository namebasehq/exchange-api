const fetch = require('node-fetch');
const { encode } = require('querystring');
const enums = require('./enums');

// flatten the enums for convenience
const flattenedEnums = {};
Object.keys(enums).forEach(key => {
  flattenedEnums = { ...flattenedEnums, ...enums[key] };
});

// main export
class Exchange {
  constructor(accessKey, secretKey, apiRoot = enums.Misc.DEFAULT_API_ROOT) {
    this.accessKey = accessKey;
    this.secretKey = secretKey;
    this.apiRoot = apiRoot;
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
      enums.OrderSides.LMT,
      quantity,
      price,
      receiveWindow
    );
  }

  limitBuy(symbol, quantity, price, receiveWindow) {
    return this._createOrder(
      symbol,
      enums.OrderSides.BUY,
      enums.OrderSides.LMT,
      quantity,
      price,
      receiveWindow
    );
  }

  marketSell(symbol, quantity, price, receiveWindow) {
    return this._createOrder(
      symbol,
      enums.OrderSides.SELL,
      enums.OrderSides.MKT,
      quantity,
      receiveWindow
    );
  }

  marketBuy(symbol, quantity, price, receiveWindow) {
    return this._createOrder(
      symbol,
      enums.OrderSides.BUY,
      enums.OrderSides.MKT,
      quantity,
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
    return this._request('GET', endpoint, { receiveWindow });
  }

  userTrades(symbol, orderId, limit, receiveWindow) {
    const endpoint = '/trade/account';
    return this._timedRequest('GET', endpoint, { symbol, orderId, limit, receiveWindow });
  }

  depositAddress(asset, receiveWindow) {
    const endpoint = '/deposit/address';
    return this._request('GET', endpoint, { asset, receiveWindow });
  }

  withdraw(asset, address, amount, receiveWindow) {
    const endpoint = '/withdraw';
    return this._timedRequest('POST', endpoint, { asset, address, amount, receiveWindow });
  }

  depositHistory(asset, startTime, endTime, receiveWindow) {
    const endpoint = '/deposit/history';
    return this._request('GET', endpoint, { asset, startTime, endTime, receiveWindow });
  }

  withdrawalHistory(asset, startTime, endTime, receiveWindow) {
    const endpoint = '/withdraw/history';
    return this._request('GET', endpoint, { asset, startTime, endTime, receiveWindow });
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
    const queryString = encode(payload);
    const url = `${this.apiRoot}${endpoint}${queryString}`;
    return fetch(url, { method }).then(res => res.json());
  }
}

module.exports = {
  Exchange,
  ...flattenedEnums,
};
