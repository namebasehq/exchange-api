require('dotenv').config();
const Exchange = require('./exchange');

const namebase = new Exchange(process.env.API_ROOT, process.env.ACCESS_KEY, process.env.SECRET_KEY);

const result = namebase.request('GET', '/info', {});
result.then(a => {
  console.log(a);
});
