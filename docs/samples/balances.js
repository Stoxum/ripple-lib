'use strict';
const StoxumAPI = require('../../src').StoxumAPI; // require('stoxum-lib')

const api = new StoxumAPI({server: 'wss://s1.stoxum.com:51231'});
const address = 'r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV';

api.connect().then(() => {
  api.getBalances(address).then(balances => {
    console.log(JSON.stringify(balances, null, 2));
    process.exit();
  });
});
