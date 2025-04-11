module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    }
  },
  compilers: {
    solc: {
      version: "0.8.0",  // This should match your contract pragma
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
          details: {
            yul: false
          }
        },
      },
    }
  }
};