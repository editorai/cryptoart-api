const fs = require('fs');
const moment = require('moment');
const mysql = require('mysql2/promise');
const {
  ethers
} = require("pandachainjs");
const Web3 = require('pandaweb3');

const config = require('../src/config/config.js');

const erc20_abi = [
  "function totalSupply() public view returns (uint256)",
  "function balanceOf(address _who) public view returns (uint256)",
  "function transfer(address _to, uint256 _value) public returns (bool)",
  "event Transfer(address indexed from, address indexed to,uint256 value)"
];

var web3 = web3Connect();
var provider = ethConnect();
var tokenprovider = ethTokenConnect();

test();
async function test() {

  var mySQLConfig = config.mySQLConfig;
  const connection = await mysql.createPool({
    database: mySQLConfig.database,
    host: mySQLConfig.host,
    port: mySQLConfig.port,
    user: mySQLConfig.user,
    password: mySQLConfig.password,
    // connectionLimit: 10,
  });

  // var currentBlockNumber = await provider.getBlockNumber();
  // console.log("Current Block: " + currentBlockNumber);

  // var lastblocknumber = 0;
  // const [last_block_rows] = await connection.query(`select max(block_number) as last_block_number from block_tbl limit 1;`);
  // if (last_block_rows.length > 0 && last_block_rows[0].last_block_number)
  //   lastblocknumber = last_block_rows[0].last_block_number;
  // console.log("Last blocknumber: " + lastblocknumber);



  // var fromto_sqlstring = "(select distinct transaction_from as fromto_hash from transaction_tbl where block_number > 200000)";
  // fromto_sqlstring += " union "
  // fromto_sqlstring += "(select distinct transaction_to as fromto_hash from transaction_tbl where block_number > 200000)";
  // const [fromto_rows] = await connection.query(fromto_sqlstring);//'select * from fromto_tbl;'

  // for (var i = 0; i < fromto_rows.length; i++) {
  //   var fromtoHash = fromto_rows[i].fromto_hash;
  //   try {
  //     var thebalance = await web3.eth.getBalance(fromtoHash);
  //     const [update_rows] = await connection.query("update fromto_tbl set fromto_balance = " + thebalance + " where fromto_hash = '" + fromtoHash + "';");
  //     console.log("Update balance of " + fromtoHash);
  //   } catch (e) {
  //     console.log("e: " + e);
  //   }
  // }


  //-------4-------
  // const [block_miners_rows] = await connection.query('select fromto_hash from fromto_tbl where fromto_balance is null;');
  // for (var i = 0; i < block_miners_rows.length; i++) {
  //   var fromtoHash = block_miners_rows[i].fromto_hash;
  //   var thebalance = await web3.eth.getBalance(fromtoHash);
  //   const [update_rows] = await connection.query("update fromto_tbl set fromto_balance = " + thebalance + " where fromto_hash = '" + fromtoHash + "';");
  //   console.log("Update balance of " + fromtoHash);
  // }

  // var supply1 = web3.toDecimal("0x00000000000000000000000000000000000000000023919aabbc6bea0b000000");
  // var supply2 = web3.toDecimal("0x00000000000000000000000000000000000000000000152d02c7e14af6800000");
  
  // var sqlstring = "Update token_contract_tbl set token_contract_totalsupply = " + supply1 + " where token_contract_name = 'GDSO';";
  // const [insert_transaction_result] = await connection.query(sqlstring);
  // sqlstring = "Update token_contract_tbl set token_contract_totalsupply = " + supply2 + " where token_contract_name = 'GPDC';";
  // const [insert_transaction_result2] = await connection.query(sqlstring);

  // console.log("ss");

  // 0x1615a112e5434d01ae00
  // 0x0000002aa1efb94e0000
  // var vv = web3.isChecksumAddress("0x0000000000000000000000005c2b75e6ca0d48d3b2b29c8c9bffa97c8b05dc89");
  // var bb = web3.toHex("0x000000000000000000000000000000000000000000000000004e28e2290f0000");
  // var zz = web3.toWei("0x000000000000000000000000000000000000000000000000004e28e2290f0000");
  // var gg = web3.toBigNumber("0x000000000000000000000000000000000000000000000000002aa1efb94e0000");
  // var ss = web3.toDecimal("0x000000000000000000000000000000000000000000000000004e28e2290f0000");

  // var ss = web3.toChecksumAddress("0x0000000000000000000000005c2b75e6ca0d48d3b2b29c8c9bffa97c8b05dc89");
  // var dd = web3.toChecksumAddress("0x5c2b75e6ca0d48d3b2b29c8c9bffa97c8b05dc89");
  //0x5c2b75e6ca0d48d3b2b29c8c9bffa97c8b05dc89
  //0x0000000000000000000000005c2b75e6ca0d48d3b2b29c8c9bffa97c8b05dc89
  //0x0c6ea72b7653185ce75543ae484f4ceb3804c68f
  // var vv = web3.toChecksumAddress("0x0000000000000000000000000c6ea72b7653185ce75543ae484f4ceb3804c68f");

  // var fromtohash = "0x0000000000000000000000005c2b75e6ca0d48d3b2b29c8c9bffa97c8b05dc89";
  // fromtohash = "0x" + fromtohash.substring(fromtohash.indexOf('000000000000000000000000') + 24, fromtohash.length);
  // var ss = 0;

  // var contractHash = "0xeb7dbde8aebcd14625444012529efdbc9fedba1a";
  // var contract = new ethers.Contract(contractHash, erc20_abi, provider);
  // var thebalance1 = await contract.balanceOf("0x0000000000000000000000000000000000000000");
  // var tt = web3.toDecimal(thebalance1);


  //------------------------------Update Token Contract ------------------------------
  // const [token_contract_result] = await connection.query('select token_contract_hash from token_contract_tbl;');
  // var token_contract = token_contract_result.map(hash => {
  //   return hash.token_contract_hash;
  // });
  // var sqlstring = "select *, date_format(block_timestamp, '%Y-%m-%d %H:%I:%S') as timestring from transaction_tbl where block_number <= 258129;";
  // const [transaction_rows] = await connection.query(sqlstring);
  // for (var i = 0; i < transaction_rows.length; i++) {

  //   var transaction_receipt = transaction_rows[i].transaction_receipt_content;
  //   transaction_receipt = JSON.parse(transaction_receipt);
  //   if (transaction_receipt.logs && transaction_receipt.logs.length > 0) {

  //     // console.log("find logs at: " + transaction_receipt.transactionHash);
  //     for (var j = 0; j < transaction_receipt.logs.length; j++) {
  //       var thelog = transaction_receipt.logs[j];

  //       var theaddress = thelog.address;
  //       var thedata = web3.toDecimal(thelog.data);
  //       var thetopics = thelog.topics;
  //       var thetopics_0 = "";
  //       var thetopics_1 = "";
  //       var thetopics_2 = 0;
  //       if (thetopics.length >= 3) {
  //         thetopics_0 = thetopics[0];
  //         thetopics_1 = thetopics[1];
  //         thetopics_2 = thetopics[2];
  //       }

  //       //------------------------------Update Token Contract------------------------------
  //       if (token_contract.indexOf(theaddress) < 0 && theaddress.length >= 4) {
  //         var thesqlstring1 = "INSERT INTO token_contract_tbl ( token_contract_name, token_contract_hash ) VALUES('" + theaddress.substr(0, 4) + "', '" + theaddress + "');";
  //         const [insert_token_result] = await connection.execute(thesqlstring1);
  //         console.log("Insert fromto, affectedRows:" + insert_token_result.affectedRows + ", insertId:" + insert_token_result.insertId);
  //         token_contract.push(theaddress);
  //       }

  //       //------------------------------Update Token Contract Transaction------------------------------
  //       var sqlstring2 = "INSERT INTO token_contract_transaction_tbl ( block_number, block_timestamp, transaction_hash, token_contract_hash, token_contract_transaction_value, token_contract_transaction_topics0, token_contract_transaction_topics1, token_contract_transaction_topics2)";
  //       sqlstring2 += " VALUES(";
  //       sqlstring2 += transaction_receipt.blockNumber + ", '" + transaction_rows[i].timestring + "', '" + transaction_receipt.transactionHash + "', '" + theaddress + "', " + thedata + ", '" + thetopics_0 + "', '" + thetopics_1 + "', '" + thetopics_2 + "');";

  //       const [insert_transaction_result] = await connection.query(sqlstring2);
  //       console.log("Insert token_contract Transaction, affectedRows:" + insert_transaction_result.affectedRows + ", insertId:" + insert_transaction_result.insertId);
  //     }
  //   }
  // }


  //------------------------------Update token_contract fromto------------------------------
  // const [token_contracttransaction_fromto_rows] = await connection.query('select token_contract_transaction_topics1, token_contract_transaction_topics2 from token_contract_transaction_tbl');// where block_number > ' + lastblocknumber + ';');

  // var token_fromtos = [];
  // token_contracttransaction_fromto_rows.forEach(transactions => {
  //   var tran_from = transactions.token_contract_transaction_topics1;
  //   if (token_fromtos.indexOf(tran_from) < 0)
  //     token_fromtos.push(tran_from);

  //   var tran_to = transactions.token_contract_transaction_topics2;
  //   if (token_fromtos.indexOf(tran_to) < 0)
  //     token_fromtos.push(tran_to);
  // });

  // for (var i = 0; i < token_fromtos.length; i++) {
  //   var fromtohash = token_fromtos[i];
  //   //0x5c2b75e6ca0d48d3b2b29c8c9bffa97c8b05dc89
  //   //0x0000000000000000000000005c2b75e6ca0d48d3b2b29c8c9bffa97c8b05dc89
  //   if(fromtohash.indexOf('000000000000000000000000') > 0) {
  //     fromtohash = "0x" + fromtohash.substring(fromtohash.indexOf('000000000000000000000000') + 24, fromtohash.length);
  //   }
  //   else {
  //     console.log("Nochange for: " + fromtohash);
  //   }

  //   const [fromto_result] = await connection.query('select count(*) as count from fromto_tbl where fromto_hash ="' + fromtohash + '";');
  //   if (fromto_result[0].count == 0) {
  //     var thesqlstring11 = "INSERT INTO fromto_tbl ( fromto_hash, is_jointoken ) VALUES('" + fromtohash + "', true);";
  //     const [insert_fromto_result] = await connection.execute(thesqlstring11);
  //     console.log("Insert token fromto, affectedRows:" + insert_fromto_result.affectedRows + ", insertId:" + insert_fromto_result.insertId);
  //   }
  //   else {
  //     var thesqlstring12 = "UPDATE fromto_tbl set is_jointoken = true where fromto_hash ='" + fromtohash + "';";
  //     const [insert_fromto_result] = await connection.execute(thesqlstring12);
  //     console.log("Update token fromto, affectedRows:" + insert_fromto_result.affectedRows + ", insertId:" + insert_fromto_result.insertId);
  //   }
  // }

  // //------------------------------Update token_contract fromto balance------------------------------
  // var fromto_sqlstring1 = "(select *, date_format(block_timestamp, '%Y-%m-%d %H:%I:%S') as timestring from token_contract_transaction_tbl)"; // where block_number > " + lastblocknumber + ")";
  // const [token_contract_transactions] = await connection.query(fromto_sqlstring1);
  // for (var i = 0; i < token_contract_transactions.length; i++) {

  //   var transaction_from = token_contract_transactions[i].token_contract_transaction_topics1;
  //   if (transaction_from.indexOf('000000000000000000000000') > 0) {
  //     transaction_from = "0x" + transaction_from.substring(transaction_from.indexOf('000000000000000000000000') + 24, transaction_from.length);
  //   }
  //   var transaction_to = token_contract_transactions[i].token_contract_transaction_topics2;
  //   if (transaction_to.indexOf('000000000000000000000000') > 0) {
  //     transaction_to = "0x" + transaction_to.substring(transaction_to.indexOf('000000000000000000000000') + 24, transaction_to.length);
  //   }

  //   var contractHash = token_contract_transactions[i].token_contract_hash;
  //   var block_number = token_contract_transactions[i].block_number;
  //   var block_timestamp = token_contract_transactions[i].timestring;
  //   var transaction_hash = token_contract_transactions[i].transaction_hash;

  //   try {
  //     var contract = new ethers.Contract(contractHash, erc20_abi, tokenprovider);

  //     var thebalance_from = await contract.balanceOf(transaction_from);
  //     thebalance_from = ethers.utils.formatEther(thebalance_from, {
  //       commify: true
  //     });
  //     const [from_result] = await connection.query("select count(*) as count from token_contract_balance_tbl where fromto_hash = '" + transaction_from + "' and token_contract_hash = '" + contractHash + "';");
  //     if (from_result[0].count == 0) {
  //       var thesqlstring11 = "INSERT INTO token_contract_balance_tbl ( token_contract_hash, fromto_hash, fromto_balance, latest_block_number, latest_block_timestamp, latest_transaction_hash ) VALUES('" + contractHash + "', '" + transaction_from + "', " + thebalance_from + ", " + block_number + ", '" + block_timestamp + "', '" + transaction_hash + "');";
  //       const [insert_fromto_result] = await connection.execute(thesqlstring11);
  //       console.log("Insert token fromto, affectedRows:" + insert_fromto_result.affectedRows + ", insertId:" + insert_fromto_result.insertId);
  //     } else {
  //       const [update_rows1] = await connection.query("update token_contract_balance_tbl set fromto_balance = " + thebalance_from + ", latest_block_number=" + block_number + ", latest_block_timestamp = '" + block_timestamp + "', latest_transaction_hash = '" + transaction_hash + "' where fromto_hash = '" + transaction_from + "' and token_contract_hash = '" + contractHash + "';");
  //       console.log("Update token balance of " + transaction_from);
  //     }

  //     var thebalance_to = await contract.balanceOf(transaction_to);
  //     thebalance_to = ethers.utils.formatEther(thebalance_to, {
  //       commify: true
  //     });
  //     const [to_result] = await connection.query("select count(*) as count from token_contract_balance_tbl where fromto_hash = '" + transaction_to + "' and token_contract_hash = '" + contractHash + "';");
  //     if (to_result[0].count == 0) {
  //       var thesqlstring22 = "INSERT INTO token_contract_balance_tbl ( token_contract_hash, fromto_hash, fromto_balance, latest_block_number, latest_block_timestamp, latest_transaction_hash ) VALUES('" + contractHash + "', '" + transaction_to + "', " + thebalance_to + ", " + block_number + ", '" + block_timestamp + "', '" + transaction_hash + "');";
  //       const [insert_fromto_result] = await connection.execute(thesqlstring22);
  //       console.log("Insert token fromto, affectedRows:" + insert_fromto_result.affectedRows + ", insertId:" + insert_fromto_result.insertId);
  //     } else {
  //       const [update_rows1] = await connection.query("update token_contract_balance_tbl set fromto_balance = " + thebalance_to + ", latest_block_number=" + block_number + ", latest_block_timestamp = '" + block_timestamp + "', latest_transaction_hash = '" + transaction_hash + "' where fromto_hash = '" + transaction_to + "' and token_contract_hash = '" + contractHash + "';");
  //       console.log("Update token balance of " + transaction_to);
  //     }

  //   } catch (e) {
  //     console.log("e: " + e);
  //   }
  // }


  var sqlstring3 = "select transaction_receipt_content, transaction_hash from transaction_tbl where block_number > 261304"; // where block_number > " + lastblocknumber + ";";
  const [transaction_rows] = await connection.query(sqlstring3);
  for (var i = 0; i < transaction_rows.length; i++) {

    var transaction_hash = transaction_rows[i].transaction_hash;
    var transaction_receipt = transaction_rows[i].transaction_receipt_content;
    transaction_receipt = JSON.parse(transaction_receipt);
    if (transaction_receipt && transaction_receipt.logs && transaction_receipt.logs.length > 0) {

      var thelog = transaction_receipt.logs[0];
      var thetopics = thelog.topics;
      var thetopics_2 = 0;
      if (thetopics.length >= 3) {
        thetopics_2 = thetopics[2];

        if (thetopics_2.indexOf('000000000000000000000000') > 0) {
          thetopics_2 = "0x" + thetopics_2.substring(thetopics_2.indexOf('000000000000000000000000') + 24, thetopics_2.length);
        }

        var sqlstring = "Update transaction_tbl set token_contract_transaction_topics2 = '" + thetopics_2 + "' where transaction_hash = '" + transaction_hash + "';";
        const [insert_transaction_result] = await connection.query(sqlstring);
        console.log("Update Transaction, affectedRows:" + insert_transaction_result.affectedRows + ", insertId:" + insert_transaction_result.insertId);

      }
    }
  }

  connection.end(function (err) {
    // The connection is terminated now
    console.log("Finished update block from: ");
    return;
  });
}

// updateDB();
async function updateDB() {

  var mySQLConfig = config.mySQLConfig;
  const connection = await mysql.createPool({
    database: mySQLConfig.database,
    host: mySQLConfig.host,
    port: mySQLConfig.port,
    user: mySQLConfig.user,
    password: mySQLConfig.password,
    connectionLimit: 10,
  });

  //------------------------------Update Blocks------------------------------
  var currentBlock = {};
  var currentBlockNumber = await provider.getBlockNumber();
  // console.log("Current Block: " + currentBlockNumber);

  // currentBlockNumber = 219863;

  var lastblocknumber = 0;
  const [last_block_rows] = await connection.query(`select max(block_number) as last_block_number from block_tbl limit 1;`);
  if (last_block_rows.length > 0 && last_block_rows[0].last_block_number)
    lastblocknumber = last_block_rows[0].last_block_number;

  //------------------------------Update Blocks------------------------------
  console.log("Update Blocks from " + lastblocknumber + " to " + currentBlockNumber);
  for (var i = lastblocknumber + 1; i <= currentBlockNumber; i++) {
    currentBlock = await web3.eth.getBlock(i);
    // console.log("currentBlock: " + JSON.stringify(currentBlock));
    var sqlstring = "INSERT INTO block_tbl ( block_number, block_hash, block_gasUsed, block_miner, block_timestamp, block_transaction_count, block_content)";
    sqlstring += " VALUES(";
    sqlstring += currentBlock.number + ", '" + currentBlock.hash + "', " + currentBlock.gasUsed + ", '" + currentBlock.miner + "', '" + moment(new Date(1e3 * currentBlock.timestamp)).format('YYYY-MM-DD HH:mm:ss') + "', " + currentBlock.transactions.length + ",'" + JSON.stringify(currentBlock) + "');";
    // console.log("sqlstring: " + sqlstring);

    const [insert_result] = await connection.query(sqlstring);
    console.log("Insert BlockNumber: " + currentBlock.number + ", affectedRows:" + insert_result.affectedRows + ", insertId:" + insert_result.insertId);
  }

  //------------------------------Update Transactions And Miner-Transactions------------------------------
  console.log("Update Transactions And Miner-Transactions... ");
  const [block_transactions_rows] = await connection.query('select block_number, block_miner, block_timestamp, block_content from block_tbl where block_transaction_count > 0 and block_number > ' + lastblocknumber + ';');

  var transactionhashes = [];
  block_transactions_rows.forEach(block => {
    var theblock = JSON.parse(block.block_content);
    theblock.transactions.forEach(transactionHash => {
      transactionhashes.push({
        "hash": transactionHash,
        "timestamp": moment(new Date(1e3 * theblock.timestamp)).format('YYYY-MM-DD HH:mm:ss'),
        "miner": block.block_miner,
        "blocknumber": block.block_number
      });
    });
  });
  console.log("Found new transaction count: " + transactionhashes.length);
  for (var i = 0; i < transactionhashes.length; i++) {

    var transactionHash = transactionhashes[i];
    var transaction = await web3.eth.getTransaction(transactionHash.hash);
    var transactionReceipt = await web3.eth.getTransactionReceipt(transactionHash.hash);

    if (transaction && transactionReceipt) {
      transaction.v = web3.toDecimal(transaction.v);
      transaction.gasPrice = web3.toDecimal(transaction.gasPrice);

      thetopics_2 = "null";
      if (transactionReceipt.logs && transactionReceipt.logs.length > 0) {
        var thetopics = transactionReceipt.logs[0].topics;
        if (thetopics.length >= 3) {
          thetopics_2 = thetopics[2];
          if (thetopics_2.indexOf('000000000000000000000000') > 0) {
            thetopics_2 = "0x" + thetopics_2.substring(thetopics_2.indexOf('000000000000000000000000') + 24, thetopics_2.length);
          }
        }
      }

      var sqlstring = "";
      if (thetopics_2 == "null") {
        sqlstring = "INSERT INTO transaction_tbl ( block_number, block_hash, block_timestamp, block_miner, transaction_hash, transaction_from, transaction_to, transaction_gas, transaction_gasPrice, transaction_gasUsed, transaction_v, transaction_content, transaction_receipt_content)";
        sqlstring += " VALUES(";
        sqlstring += transaction.blockNumber + ", '" + transaction.blockHash + "', '" + transactionHash.timestamp + "', '" + transactionHash.miner + "', '" + transaction.hash + "', '" + transaction.from + "', '" + transaction.to + "', " + transaction.gas + ", " + transaction.gasPrice + ", " + transactionReceipt.gasUsed + ", " + transaction.v + ", '" + JSON.stringify(transaction) + "','" + JSON.stringify(transactionReceipt) + "');";
      } else {
        sqlstring = "INSERT INTO transaction_tbl ( block_number, block_hash, block_timestamp, block_miner, transaction_hash, transaction_from, transaction_to, transaction_gas, transaction_gasPrice, transaction_gasUsed, transaction_v, transaction_content, transaction_receipt_content, token_contract_transaction_topics2)";
        sqlstring += " VALUES(";
        sqlstring += transaction.blockNumber + ", '" + transaction.blockHash + "', '" + transactionHash.timestamp + "', '" + transactionHash.miner + "', '" + transaction.hash + "', '" + transaction.from + "', '" + transaction.to + "', " + transaction.gas + ", " + transaction.gasPrice + ", " + transactionReceipt.gasUsed + ", " + transaction.v + ", '" + JSON.stringify(transaction) + "','" + JSON.stringify(transactionReceipt) + "','" + thetopics_2 + "');";
      }

      const [insert_transaction_result] = await connection.query(sqlstring);
      console.log("Insert Transaction, affectedRows:" + insert_transaction_result.affectedRows + ", insertId:" + insert_transaction_result.insertId);
    } else {
      console.log("Not found Transaction:" + transactionHash.hash + " at Block: " + transactionHash.blocknumber);
    }
  }

  //------------------------------Update Miners into fromto table------------------------------
  console.log("Update Miners into fromto table... ");
  const [block_miners_rows] = await connection.query('select distinct block_miner from block_tbl where block_number > ' + lastblocknumber + ';');

  for (var i = 0; i < block_miners_rows.length; i++) {
    var minerhash = block_miners_rows[i].block_miner;
    const [miners_result] = await connection.query('select fromto_hash, is_miner from fromto_tbl where fromto_hash ="' + minerhash + '";');
    if (miners_result.length == 0) {
      var thesqlstring = "INSERT INTO fromto_tbl ( fromto_hash, is_miner ) VALUES('" + minerhash + "', true);";
      const [insert_miner_result] = await connection.execute(thesqlstring);
      console.log("Insert Miner, affectedRows:" + insert_miner_result.affectedRows + ", insertId:" + insert_miner_result.insertId);
    } else {
      if (miners_result[0].is_miner != 1) {
        var thesqlstring12 = "UPDATE fromto_tbl set is_miner = true where fromto_hash ='" + minerhash + "';";
        const [insert_fromto_result] = await connection.execute(thesqlstring12);
        console.log("UPDATE token fromto, affectedRows:" + insert_fromto_result.affectedRows + ", insertId:" + insert_fromto_result.insertId);
      }
    }
  }

  //------------------------------Update fromto------------------------------
  console.log("Update fromto... ");
  const [transaction_fromto_rows] = await connection.query('select transaction_from, transaction_to from transaction_tbl where block_number > ' + lastblocknumber + ';');

  var fromtos = [];
  transaction_fromto_rows.forEach(transactions => {
    var tran_from = transactions.transaction_from;
    if (fromtos.indexOf(tran_from) < 0)
      fromtos.push(tran_from);

    var tran_to = transactions.transaction_to;
    if (fromtos.indexOf(tran_to) < 0)
      fromtos.push(tran_to);
  });

  for (var i = 0; i < fromtos.length; i++) {
    var fromtohash = fromtos[i];
    const [fromto_result] = await connection.query('select count(*) as count from fromto_tbl where fromto_hash ="' + fromtohash + '";');
    if (fromto_result[0].count == 0) {
      var thesqlstring1 = "INSERT INTO fromto_tbl ( fromto_hash ) VALUES('" + fromtohash + "');";
      const [insert_fromto_result] = await connection.execute(thesqlstring1);
      console.log("Insert fromto, affectedRows:" + insert_fromto_result.affectedRows + ", insertId:" + insert_fromto_result.insertId);
    }
  }

  //------------------------------Update fromto balance------------------------------
  console.log("Update fromto balance... ");
  var fromto_sqlstring = "(select distinct transaction_from as fromto_hash from transaction_tbl where block_number > " + lastblocknumber + ")";
  fromto_sqlstring += " union "
  fromto_sqlstring += "(select distinct transaction_to as fromto_hash from transaction_tbl where block_number > " + lastblocknumber + ")";
  fromto_sqlstring += " union "
  fromto_sqlstring += "(select distinct block_miner as fromto_hash from block_tbl where block_number > " + lastblocknumber + ")";
  const [fromto_rows] = await connection.query(fromto_sqlstring); //'select * from fromto_tbl;'
  for (var i = 0; i < fromto_rows.length; i++) {
    var fromtoHash = fromto_rows[i].fromto_hash;
    try {
      var thebalance = await web3.eth.getBalance(fromtoHash);
      const [update_rows] = await connection.query("update fromto_tbl set fromto_balance = " + thebalance + " where fromto_hash = '" + fromtoHash + "';");
      console.log("Update balance of " + fromtoHash);
    } catch (e) {
      console.log("e: " + e);
    }
  }






  //------------------------------Update Token Contract ------------------------------
  console.log("Update Token Contract... ");
  const [token_contract_result] = await connection.query('select token_contract_hash from token_contract_tbl;');
  var token_contract = token_contract_result.map(hash => {
    return hash.token_contract_hash;
  });
  var sqlstring3 = "select transaction_receipt_content, date_format(block_timestamp, '%Y-%m-%d %H:%I:%S') as timestring from transaction_tbl where block_number > " + lastblocknumber + ";";
  const [transaction_rows] = await connection.query(sqlstring3);
  for (var i = 0; i < transaction_rows.length; i++) {

    var transaction_receipt = transaction_rows[i].transaction_receipt_content;
    transaction_receipt = JSON.parse(transaction_receipt);
    if (transaction_receipt && transaction_receipt.logs && transaction_receipt.logs.length > 0) {
      // console.log("find logs at: " + transaction_receipt.transactionHash);
      for (var j = 0; j < transaction_receipt.logs.length; j++) {
        var thelog = transaction_receipt.logs[j];

        var theaddress = thelog.address;
        var thedata = web3.toDecimal(thelog.data);
        var thetopics = thelog.topics;
        var thetopics_0 = "";
        var thetopics_1 = "";
        var thetopics_2 = 0;
        if (thetopics.length >= 3) {
          thetopics_0 = thetopics[0];
          thetopics_1 = thetopics[1];
          thetopics_2 = thetopics[2];
        }

        //------------------------------Update Token Contract------------------------------
        if (token_contract.indexOf(theaddress) < 0 && theaddress.length >= 4) {
          var thesqlstring01 = "INSERT INTO token_contract_tbl ( token_contract_name, token_contract_hash, token_contract_desc ) VALUES('" + theaddress.substr(0, 4) + "', '" + theaddress + "', '" + theaddress.substr(0, 4) + " Token');";
          const [insert_token_result] = await connection.execute(thesqlstring01);
          console.log("Insert fromto, affectedRows:" + insert_token_result.affectedRows + ", insertId:" + insert_token_result.insertId);
          token_contract.push(theaddress);
        }

        //------------------------------Update Token Contract Transaction------------------------------
        var sqlstring2 = "INSERT INTO token_contract_transaction_tbl ( block_number, block_timestamp, transaction_hash, token_contract_hash, token_contract_transaction_value, token_contract_transaction_topics0, token_contract_transaction_topics1, token_contract_transaction_topics2)";
        sqlstring2 += " VALUES(";
        sqlstring2 += transaction_receipt.blockNumber + ", '" + transaction_rows[i].timestring + "', '" + transaction_receipt.transactionHash + "', '" + theaddress + "', " + thedata + ", '" + thetopics_0 + "', '" + thetopics_1 + "', '" + thetopics_2 + "');";
        const [insert_transaction_result] = await connection.query(sqlstring2);
        console.log("Insert token_contract Transaction, affectedRows:" + insert_transaction_result.affectedRows + ", insertId:" + insert_transaction_result.insertId);
      }
    }
  }



  //------------------------------Update token_contract fromto------------------------------
  console.log("Update token_contract fromto... ");
  var fromto_sqlstring1 = "select *, date_format(block_timestamp, '%Y-%m-%d %H:%I:%S') as timestring from token_contract_transaction_tbl where block_number > " + lastblocknumber + ";";
  const [token_contract_transactions] = await connection.query(fromto_sqlstring1);

  var token_fromtos = [];
  token_contract_transactions.forEach(transactions => {
    var tran_from = transactions.token_contract_transaction_topics1;
    if (token_fromtos.indexOf(tran_from) < 0)
      token_fromtos.push(tran_from);

    var tran_to = transactions.token_contract_transaction_topics2;
    if (token_fromtos.indexOf(tran_to) < 0)
      token_fromtos.push(tran_to);
  });

  for (var i = 0; i < token_fromtos.length; i++) {
    var fromtohash = token_fromtos[i];
    //0x5c2b75e6ca0d48d3b2b29c8c9bffa97c8b05dc89
    //0x0000000000000000000000005c2b75e6ca0d48d3b2b29c8c9bffa97c8b05dc89
    if (fromtohash.indexOf('000000000000000000000000') > 0) {
      fromtohash = "0x" + fromtohash.substring(fromtohash.indexOf('000000000000000000000000') + 24, fromtohash.length);
    } else {
      console.log("Nochange for: " + fromtohash);
    }

    const [fromto_result] = await connection.query('select fromto_hash, is_jointoken from fromto_tbl where fromto_hash ="' + fromtohash + '";');
    if (fromto_result.length == 0) {
      var thesqlstring11 = "INSERT INTO fromto_tbl ( fromto_hash, is_jointoken ) VALUES('" + fromtohash + "', true);";
      const [insert_fromto_result] = await connection.execute(thesqlstring11);
      console.log("Insert token fromto, affectedRows:" + insert_fromto_result.affectedRows + ", insertId:" + insert_fromto_result.insertId);
    } else {
      if (fromto_result[0].is_jointoken != 1) {
        var thesqlstring22 = "UPDATE fromto_tbl set is_jointoken = true where fromto_hash ='" + fromtohash + "';";
        const [insert_fromto_result] = await connection.execute(thesqlstring22);
        console.log("UPDATE token fromto, affectedRows:" + insert_fromto_result.affectedRows + ", insertId:" + insert_fromto_result.insertId);
      }
    }
  }

  //------------------------------Update token_contract fromto balance------------------------------
  console.log("Update Token Contract fromto balance... ");
  for (var i = 0; i < token_contract_transactions.length; i++) {

    var transaction_from = token_contract_transactions[i].token_contract_transaction_topics1;
    if (transaction_from.indexOf('000000000000000000000000') > 0) {
      transaction_from = "0x" + transaction_from.substring(transaction_from.indexOf('000000000000000000000000') + 24, transaction_from.length);
    }

    var transaction_to = token_contract_transactions[i].token_contract_transaction_topics2;
    if (transaction_to.indexOf('000000000000000000000000') > 0) {
      transaction_to = "0x" + transaction_to.substring(transaction_to.indexOf('000000000000000000000000') + 24, transaction_to.length);
    }

    var contractHash = token_contract_transactions[i].token_contract_hash;
    var block_number = token_contract_transactions[i].block_number;
    var block_timestamp = token_contract_transactions[i].timestring;
    var transaction_hash = token_contract_transactions[i].transaction_hash;

    try {
      var contract = new ethers.Contract(contractHash, erc20_abi, tokenprovider);

      var thebalance_from = await contract.balanceOf(transaction_from);
      thebalance_from = ethers.utils.formatEther(thebalance_from, {
        commify: true
      });
      const [from_result] = await connection.query("select count(*) as count from token_contract_balance_tbl where fromto_hash = '" + transaction_from + "' and token_contract_hash = '" + contractHash + "';");
      if (from_result[0].count == 0) {
        var thesqlstring111 = "INSERT INTO token_contract_balance_tbl ( token_contract_hash, fromto_hash, fromto_balance, latest_block_number, latest_block_timestamp, latest_transaction_hash ) VALUES('" + contractHash + "', '" + transaction_from + "', " + thebalance_from + ", " + block_number + ", '" + block_timestamp + "', '" + transaction_hash + "');";
        const [insert_fromto_result] = await connection.execute(thesqlstring111);
        console.log("Insert token fromto, affectedRows:" + insert_fromto_result.affectedRows + ", insertId:" + insert_fromto_result.insertId);
      } else {
        const [update_rows1] = await connection.query("update token_contract_balance_tbl set fromto_balance = " + thebalance_from + ", latest_block_number=" + block_number + ", latest_block_timestamp = '" + block_timestamp + "', latest_transaction_hash = '" + transaction_hash + "' where fromto_hash = '" + transaction_from + "' and token_contract_hash = '" + contractHash + "';");
        console.log("Update token balance of " + transaction_from);
      }

      var thebalance_to = await contract.balanceOf(transaction_to);
      thebalance_to = ethers.utils.formatEther(thebalance_to, {
        commify: true
      });
      const [to_result] = await connection.query("select count(*) as count from token_contract_balance_tbl where fromto_hash = '" + transaction_to + "' and token_contract_hash = '" + contractHash + "';");
      if (to_result[0].count == 0) {
        var thesqlstring222 = "INSERT INTO token_contract_balance_tbl ( token_contract_hash, fromto_hash, fromto_balance, latest_block_number, latest_block_timestamp, latest_transaction_hash ) VALUES('" + contractHash + "', '" + transaction_to + "', " + thebalance_to + ", " + block_number + ", '" + block_timestamp + "', '" + transaction_hash + "');";
        const [insert_fromto_result] = await connection.execute(thesqlstring222);
        console.log("Insert token fromto, affectedRows:" + insert_fromto_result.affectedRows + ", insertId:" + insert_fromto_result.insertId);
      } else {
        const [update_rows1] = await connection.query("update token_contract_balance_tbl set fromto_balance = " + thebalance_to + ", latest_block_number=" + block_number + ", latest_block_timestamp = '" + block_timestamp + "', latest_transaction_hash = '" + transaction_hash + "' where fromto_hash = '" + transaction_to + "' and token_contract_hash = '" + contractHash + "';");
        console.log("Update token balance of " + transaction_to);
      }

    } catch (e) {
      console.log("e: " + e);
    }
  }

  // connection.destroy();
  connection.end(err => {
    // The connection is terminated now
    console.log("Finished update block from: " + lastblocknumber + " to " + currentBlockNumber);
    return;
  });
}


function web3Connect() {
  let web3 = new Web3(new Web3.providers.HttpProvider(config.gptc.providerURL));
  return web3;
}

function ethConnect() {
  let provider = new ethers.providers.JsonRpcProvider(config.gptc.providerURL, {
    name: 'pandachain',
    chainId: 10
  });
  return provider;
}

function ethTokenConnect() {
  let provider = new ethers.providers.JsonRpcProvider(config.gptc.tokenproviderURL);
  return provider;
}

function getBlock(blocknumber, callback) {
  if (blocknumber == null) {
    provider.getBlock().then(function (result) {
      callback(result);
    });
  } else {
    web3.eth.getBlock(blocknumber, function (err, result) {
      callback(result);
    });
  }
}
