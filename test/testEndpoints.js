const namebase = require('../lib/exchange');
const credentials = require('../credentials.json');

const x = new namebase.Exchange(
  credentials.ACCESS_KEY,
  credentials.SECRET_KEY,
  credentials.API_ROOT
);

async function log(name, ...parameters) {
  const result = await x[name].apply(x, parameters);
  console.log(`--- Executing ${name}() ---\n`);
  console.log(result);
  console.log('\n\n');
  return result;
}

(async () => {
  await log('info');
  await log('depth', namebase.HNSBTC);
  await log('priceTicker', namebase.HNSBTC);
  await log('bookTicker', namebase.HNSBTC);
  await log('supplyTicker', namebase.HNSBTC);
  await log('klinesTicker', namebase.HNSBTC, namebase.ONE_HOUR, null, null, 2);
  await log('dayTicker', namebase.HNSBTC);
  await log('trades', namebase.HNSBTC, null, 2);
  await log('openOrders', namebase.HNSBTC);
  await log('allOrders', namebase.HNSBTC, null, 2);
  await log('accountInfo');
  await log('userTrades', namebase.HNSBTC, null, 2);
  await log('depositAddress', namebase.HNS);
  await log('depositHistory', namebase.HNS);
  await log('withdrawalHistory', namebase.BTC);
 )();
