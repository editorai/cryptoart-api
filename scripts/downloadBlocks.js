const fs = require('fs');
const moment = require('moment');
const {
  ethers
} = require("pandachainjs");
const Web3 = require('pandaweb3');
const {
  isArray
} = require('pandaweb3/lib/utils/utils');

const config = require('../src/config/config.js');

var provider = ethConnect();
var web3 = web3Connect();

var currentBlock = {};
var blockswithtransactions = [];
var pagesize = 20;

var record = {
  "block": {
    "latest": {
      "blocknumber": 0
    }
  },
  "miner": [
    "0xB50970d977fe010DFB6f6759Bb5C832A8eF0017B",
    "0xFFa4658ff14E486a3a57CC7163c153724C9d1904"
  ],
  "transaction": {
    "amount": 0,
    "fromto": []
  }
};
if (fs.existsSync('scripts/record.json')) {
  record = JSON.parse(fs.readFileSync('scripts/record.json'));
} else {
  //transaction amount 0
  //delete transactions.json
  //delete fromtos
  //delete miners
}

var transactionslist = [];
if (fs.existsSync('scripts/transactions.json')) {
  transactionslist = JSON.parse(fs.readFileSync('scripts/transactions.json'));
}


var latestblocknumber = 1;
if (record.block.latest.blocknumber) {
  latestblocknumber = record.block.latest.blocknumber;
}

var updatetransaction = true;
var newtransaction = {
  "amount": 0,
  "fromtolength": 0,
  "fromto": []
};
if (record.transaction) {
  newtransaction = record.transaction;
}

var newminer = [];
if (record.miner) {
  newminer = record.miner;
}

// var miners = [];
// var fromtos = [];
// for (var i = 1; i <= record.block.latest.blocknumber; i++) {
//   var block = fs.readFileSync('scripts/blocks/' + i + '.json');
//   block = JSON.parse(block);

//   // if (block.miner && block.miner == '0xA33281e32Fcf19Ff284E0381Bcfb426F5E7c0F58') {
//   //   block.timestamp = moment(new Date(1e3 * block.timestamp)).format('YYYY-MM-DD HH:mm:ss');
//   //   console.log(JSON.stringify(block));
//   //   var bb = 1;
//   // }
//   if(block.miner && miners.indexOf(block.miner) < 0) {
//     miners.push(block.miner);
//     console.log("miners: " + JSON.stringify(miners));
//   }
// }
// for (var i = 1; i <= record.block.latest.blocknumber; i++) {
//   if (fs.existsSync('scripts/transactions/' + i + '.json')) {
//     var transactionsblock = fs.readFileSync('scripts/transactions/' + i + '.json');
//     transactionsblock = JSON.parse(transactionsblock);

//     transactionsblock.forEach(transaction => {
//       if (transaction.from && fromtos.indexOf(transaction.from) < 0) {
//         fromtos.push(transaction.from);
//         console.log("fromtos: " + JSON.stringify(fromtos));
//       }
//       if (transaction.to && fromtos.indexOf(transaction.to) < 0) {
//         fromtos.push(transaction.to);
//         console.log("fromtos: " + JSON.stringify(fromtos));
//       }
//     })
//   }
// }
// calcuTransactions(176665, 0);
// return;


getBlock(null, (result) => {
  currentBlock = Object.assign({}, result);
  // currentBlock.number = 10620;
  console.log("Start download blocks from " + currentBlock.number + " ~ " + latestblocknumber);
  updatelatestBlocks(1);
});

async function calcuTransactions(currentblocknumber, latestblocknumber) {

  console.log("Start download transactions from " + currentblocknumber + " ~ " + latestblocknumber);
  for (var i = latestblocknumber + 1; i <= currentblocknumber; i++) {
    if (fs.existsSync('scripts/blocks/' + i + '.json')) {
      var block = fs.readFileSync('scripts/blocks/' + i + '.json');
      block = JSON.parse(block);
      if (block.transactions && block.transactions.length > 0) {

        newtransaction.amount += block.transactions.length;
        const result = await Promise.all(block.transactions.map(transaction => {
          return provider.getTransaction(transaction);
        }));
        result.forEach(trans => {

          transactionslist.push({
            "blockNumber": trans.blockNumber,
            "transactionHash": trans.hash,
            "timestamp": moment(new Date(1e3 * block.timestamp)).format('YYYY-MM-DD HH:mm:ss')
          });

          if (trans.from) {
            if (newtransaction.fromto.indexOf(trans.from) < 0)
              newtransaction.fromto.push(trans.from);
            //updtate fromto
            updatefromto(trans, 'from');
          }
          if (trans.to) {
            if (newtransaction.fromto.indexOf(trans.to) < 0)
              newtransaction.fromto.push(trans.to);
            //updtate fromto
            updatefromto(trans, 'to');
          }
        });

        //update miner
        if (newminer.indexOf(block.miner) < 0) {
          newminer.push(block.miner);
        }
        updateminer(block, result);

        fs.writeFileSync('scripts/transactions/' + block.number + '.json', JSON.stringify(result, null, 2));
        console.log("Get transactions for block: " + block.number + ', ll:' + result.length);
      }
    } else {
      console.log("Not found block: " + i);
    }
  }

  console.log("newtransaction.amount: " + newtransaction.amount);
  newtransaction.fromtolength = newtransaction.fromto.length;
  console.log("newtransaction.amount of fromto: " + newtransaction.fromto.length);
  saveRecord(null, newtransaction, newminer);
  saveTransactionslist();

  function updatefromto(trans, fromorto) {
    var filedir = 'scripts/fromtos/' + trans[fromorto] + '.json';
    var fromto = {
      "from": [],
      "to": []
    };
    if (fs.existsSync(filedir)) {
      fromto = JSON.parse(fs.readFileSync(filedir));
    }
    fromto[fromorto].push({
      "blockNumber": trans.blockNumber,
      "transactionHash": trans.hash,
      "transactionValue": trans.value
    });
    fs.writeFileSync(filedir, JSON.stringify(fromto, null, 2));
  }

  function updateminer(block, transactions) {
    var filedir = 'scripts/miners/' + block.miner + '.json';
    var miner = {
      transactions: []
    };

    if (fs.existsSync(filedir)) {
      miner = JSON.parse(fs.readFileSync(filedir));
    }

    var newts = transactions.map(trans => {
      return {
        "blockNumber": trans.blockNumber,
        "transactionHash": trans.hash,
        "value": trans.value,
        "gasPrice": trans.gasPrice,
        "gasUsed": block.gasUsed,
        "timestamp": moment(new Date(1e3 * block.timestamp)).format('YYYY-MM-DD HH:mm:ss')
      }
    });
    miner.transactions = miner.transactions.concat(newts);
    fs.writeFileSync(filedir, JSON.stringify(miner, null, 2));
  }
}


//获取一定范围的区块列表
function updatelatestBlocks(currentPage) {
  if (currentBlock.number != 'NaN') {
    getLatestBlocks(currentBlock.number, latestblocknumber, pagesize, currentPage, (result) => {
      if (result.length > 0 && isArray(result)) {

        result.forEach(block => {
          fs.writeFileSync('scripts/blocks/' + block.number + '.json', JSON.stringify(block, null, 2));
          // console.log("Save Block: " + block.number);
        });
      }

      currentPage++;
      if (currentPage * pagesize <= currentBlock.number) {
        updatelatestBlocks(currentPage)
      } else {
        saveRecord(currentBlock.number);

        if (updatetransaction)
          calcuTransactions(currentBlock.number, latestblocknumber);
      }

    });
  }
}

function saveRecord(currentblocknumber, newtransaction, newminer) {

  if (currentblocknumber) {
    record.block.latest = {
      "blocknumber": currentblocknumber,
      "updatetime": moment().format('YYYY-MM-DD HH:mm:ss')
    };
  }
  if (newtransaction) {
    record.transaction = newtransaction;
  }

  if (newminer) {
    record.miner = newminer;
  }

  fs.writeFileSync('scripts/record.json', JSON.stringify(record, null, 2));
  console.log("Save record.json");
}

function saveTransactionslist() {
  fs.writeFileSync('scripts/transactions.json', JSON.stringify(transactionslist, null, 2));
  console.log("Save transactionslist.json");
}

function ethConnect() {
  let provider = new ethers.providers.JsonRpcProvider(config.gptc.providerURL, {
    name: 'pandachain',
    chainId: 10
  });
  return provider;
}

function web3Connect() {
  let web3 = new Web3(new Web3.providers.HttpProvider(config.gptc.providerURL));
  return web3;
}


function getBlock(blocknumber, callback) {
  if (blocknumber == null) {
    provider.getBlock().then(function (result) {
      callback(result);
    });
  } else {
    provider.getBlock(blocknumber).then(function (result) {
      callback(result);
    });
  }
}

function getLatestBlocks(currentblocknumber, latestblocknumber, pageSize, currentPage, callback) {

  var blockarr = [];
  var pageIdx = pageSize;
  while (--pageIdx >= 0) {
    var bb = currentblocknumber - pageSize * (currentPage - 1) - pageIdx;
    if (bb >= latestblocknumber)
      blockarr.push(bb);
  }

  Promise.all(blockarr.map(block => {
    return provider.getBlock(block);
  }).reverse()).then((result) => {

    result.forEach(block => {
      if (block.transactions.length > 0) {
        console.log('block.transactions for ' + block.number);
        blockswithtransactions.push(block.number);
      }
    })
    callback(result);
  }).catch(err => {
    console.log('Error loading or parsing data.');
    callback('Error loading or parsing data.');
  });
}
