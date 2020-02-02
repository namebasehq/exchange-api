Namebase Exchange Api
==

An easy-to-use Node.js package that lets you programmatically interact with the Namebase exchange.

## Usage

Here is some sample code demonstrating how to use this package. First, go to https://www.namebase.io/pro and generate an API key.

Note: this is not a comprehensive enumeration of the supported features. Read the source code for a full list. The raw API documentation can be found here: https://github.com/namebasehq/exchange-api-documentation/

```javascript
const namebase = require('namebase-exchange-api');
const exchange = new namebase.Exchange(
  /* ACCESS KEY */,
  /* SECRET KEY */
);

// get the last trade price
const result1 = await exchange.priceTicker(namebase.HNSBTC);

// place a limit sell order
const quantity = '112.010000'; // units are HNS for the HNSBTC market
const orderPrice = '0.00004321'; // units are BTC for the HNSBTC market
const result2 = await exchange.limitSell(
  namebase.HNSBTC,
  quantity,
  orderPrice
);

// find all open orders
const result3 = await exchange.openOrders(namebase.HNSBTC);

if (result3.length > 0) {
  // pick a random order
  const orderIds = result3.map(order => order.orderId);
  const orderIndex = Math.floor(Math.random() * orderIds.length);

  // cancel the order
  const result4 = await exchange.cancelOrder(
    namebase.HNSBTC,
    orderIds[orderIndex]
  );
}
```
