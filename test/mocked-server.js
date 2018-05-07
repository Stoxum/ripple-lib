'use strict';


const port = 34371;

const createMockStoxumd = require('./mock-stoxumd');

function main() {
  if (global.describe) {
    // we are running inside mocha, exiting
    return;
  }
  console.log('starting server on port ' + port);
  createMockStoxumd(port);
  console.log('starting server on port ' + String(port + 1));
  createMockStoxumd(port + 1);
}

main();
