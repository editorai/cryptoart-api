const env = process.env.NODE_ENV || 'development';

const config = {
  customAPIURL: {
    production_https: 'https://47.74.241.234:8082',
    production: 'http://47.74.241.234:8082',
    dev: 'http://localhost:8082',
  },
  mySQLConfig: {
    database: 'explorerpanda',
    user: 'explorerpanda',
    host: process.env.ENV == 'production'?'rm-t4n5h49t19k85g8uy.mysql.singapore.rds.aliyuncs.com':'rm-t4n5h49t19k85g8uy3o.mysql.singapore.rds.aliyuncs.com',
    port: 3306,
    // host_internal: 'rm-t4n5h49t19k85g8uy.mysql.singapore.rds.aliyuncs.com',
    password: 'Lipenghui199908'
  },
  gptc: {
    providerURL: 'http://explorerapi.pandachain.io',
    tokenproviderURL: 'http://61.160.223.235:8545',
    poolList: [{
        name: '钱包',
        ipAddress: '47.74.225.249',
        id: 'Xhh2020jiayou'
      },
      {
        name: '浏览器',
        ipAddress: '47.74.248.179',
        id: 'Xhh2020jiayou'
      },
      {
        name: '节点',
        ipAddress: '47.74.241.234',
        id: 'Xhh2020jiayou'
      }
    ]
  }
};

module.exports = config;
