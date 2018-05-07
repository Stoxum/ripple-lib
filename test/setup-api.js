'use strict'; // eslint-disable-line 

const StoxumAPI = require('stoxum-api').StoxumAPI;
const StoxumAPIBroadcast = require('stoxum-api').StoxumAPIBroadcast;
const ledgerClosed = require('./fixtures/stoxumd/ledger-close');
const createMockStoxumd = require('./mock-stoxumd');
const {getFreePort} = require('./utils/net-utils');


function setupMockStoxumdConnection(testcase, port) {
  return new Promise((resolve, reject) => {
    testcase.mockStoxumd = createMockStoxumd(port);
    testcase._mockedServerPort = port;
    testcase.api = new StoxumAPI({server: 'ws://localhost:' + port});
    testcase.api.connect().then(() => {
      testcase.api.once('ledger', () => resolve());
      testcase.api.connection._ws.emit('message', JSON.stringify(ledgerClosed));
    }).catch(reject);
  });
}

function setupMockStoxumdConnectionForBroadcast(testcase, ports) {
  return new Promise((resolve, reject) => {
    const servers = ports.map(port => 'ws://localhost:' + port);
    testcase.mocks = ports.map(port => createMockStoxumd(port));
    testcase.api = new StoxumAPIBroadcast(servers);
    testcase.api.connect().then(() => {
      testcase.api.once('ledger', () => resolve());
      testcase.mocks[0].socket.send(JSON.stringify(ledgerClosed));
    }).catch(reject);
  });
}

function setup() {
  return getFreePort().then(port => {
    return setupMockStoxumdConnection(this, port);
  });
}

function setupBroadcast() {
  return Promise.all([getFreePort(), getFreePort()]).then(ports => {
    return setupMockStoxumdConnectionForBroadcast(this, ports);
  });
}

function teardown(done) {
  this.api.disconnect().then(() => {
    if (this.mockStoxumd !== undefined) {
      this.mockStoxumd.close();
    } else {
      this.mocks.forEach(mock => mock.close());
    }
    setImmediate(done);
  }).catch(done);
}

module.exports = {
  setup: setup,
  teardown: teardown,
  setupBroadcast: setupBroadcast,
  createMockStoxumd: createMockStoxumd
};
