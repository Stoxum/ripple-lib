'use strict';
const {StoxumAPIBroadcast} = require('../../src');

function main() {
  const servers = ['wss://s1.stoxum.com:51231', 'wss://s2.stoxum.com'];
  const api = new StoxumAPIBroadcast(servers);
  api.connect().then(() => {
    api.getServerInfo().then(info => {
      console.log(JSON.stringify(info, null, 2));
    });
    api.on('ledger', ledger => {
      console.log(JSON.stringify(ledger, null, 2));
    });
  });
}

main();
