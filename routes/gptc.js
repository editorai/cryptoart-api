const express = require('express');
const router = express.Router();
const fs = require('fs');
const mysql = require('mysql2');
const config = require('../config/config');

var mySQLConfig = config.mySQLConfig;
const pool = mysql.createPool({
  database: mySQLConfig.database,
  host: mySQLConfig.host,
  port: mySQLConfig.port,
  user: mySQLConfig.user,
  password: mySQLConfig.password,
  connectionLimit: 100,
});
const promisePool = pool.promise();

router.get('/search/:searchtype/:keyword', function (req, res) {

  var searchtype = req.params.searchtype;
  var keyword = req.params.keyword;
  var limitcount = 4;

  var sqlstring = "select * from ";

  if (searchtype == "all") {
    sqlstring += "((select 'Block' as type, block_hash as hashaddress from block_tbl where cast(block_number as char) like '%" + keyword + "%' or block_hash like '%" + keyword + "%' ORDER BY block_number DESC limit " + limitcount + ")";
    sqlstring += " UNION ALL ";
    sqlstring += " (select 'Trans' as type, transaction_hash as hashaddress from transaction_tbl where transaction_hash like '%" + keyword + "%' ORDER BY block_number DESC limit " + limitcount + ")";
    sqlstring += " UNION ALL ";
    sqlstring += " (select 'Wallet' as type, fromto_hash as hashaddress from fromto_tbl where fromto_hash like '%" + keyword + "%' limit " + limitcount + ")";
    sqlstring += " UNION ALL ";
    sqlstring += " (select 'Contract' as type, token_contract_hash as hashaddress from token_contract_tbl where token_contract_name like '%" + keyword + "%' or token_contract_hash like '%" + keyword + "%' limit " + limitcount + ")) a;";
  }
  else if(searchtype == "block") {
    sqlstring += "((select 'Block' as type, block_hash as hashaddress from block_tbl where cast(block_number as char) like '%" + keyword + "%' or block_hash like '%" + keyword + "%' ORDER BY block_number DESC limit " + limitcount + ")) a;";
  }
  else if(searchtype == "transaction") {
    sqlstring += " (select 'Trans' as type, transaction_hash as hashaddress from transaction_tbl where transaction_hash like '%" + keyword + "%' ORDER BY block_number DESC limit " + limitcount + ")) a;";
  }
  else if(searchtype == "wallet") {
    sqlstring += " (select 'Wallet' as type, fromto_hash as hashaddress from fromto_tbl where fromto_hash like '%" + keyword + "%' limit " + limitcount + ")) a;";
  }
  else if(searchtype == "contract") {
    sqlstring += " (select 'Contract' as type, token_contract_hash as hashaddress from token_contract_tbl where token_contract_name like '%" + keyword + "%' or token_contract_hash like '%" + keyword + "%' limit " + limitcount + ")) a;";
  }

  pool.query(sqlstring, async function (err, rows, fields) {

    console.log('search');
    if (rows && rows.length > 0) {
      res.send({
        "result": {
          "searchtype": searchtype,
          "keyword": keyword,
          "searchresult": rows
        }
      });
    } else {
      res.send({
        "result": {
          "searchtype": searchtype,
          "keyword": keyword,
          "searchresult": []
        }
      });
    }
  });
});

router.get('/contracttransactions/:contracthash/:pagesize/:currentpage', function (req, res) {

  var contracthash = req.params.contracthash;
  var pagesize = req.params.pagesize;
  var currentpage = req.params.currentpage;
  var currentIdx = (currentpage - 1) * pagesize;

  var sqlstring = "select t1.*, t2.token_contract_transaction_value, t2.token_contract_transaction_topics2 from transaction_tbl t1, token_contract_transaction_tbl t2 where t2.token_contract_hash='" + contracthash + "' and t2.transaction_hash = t1.transaction_hash ORDER BY t2.block_number DESC limit " + currentIdx + "," + pagesize + ";";

  pool.query(sqlstring, async function (err, rows, fields) {

    const [trans_rows] = await promisePool.query("select count(*) as count from token_contract_transaction_tbl where token_contract_hash='" + contracthash + "';");
    var amount = trans_rows[0].count;

    console.log('contracttransactions');
    if (rows && rows.length > 0) {
      var transactions = rows;
      res.send({
        "result": {
          "pagesize": pagesize,
          "currentpage": currentpage,
          "transactions": transactions,
          "total": amount
        }
      });
    } else {
      res.send({
        "result": {
          "pagesize": pagesize,
          "currentpage": currentpage,
          "transactions": [],
          "total": amount
        }
      });
    }
  });
});

router.get('/gettokencontractlist/:contracthash', function (req, res) {

  var contracthash = req.params.contracthash;

  var sqlstring = "select * from token_contract_tbl;";
  if (contracthash != "all") {
    sqlstring = "select * from token_contract_tbl where token_contract_hash = '" + contracthash + "';";
  }

  pool.query(sqlstring, function (err, rows, fields) {

    if (rows && rows.length > 0) {

      console.log("tokencontract");
      res.send({
        "result": {
          "tokencontract": rows
        }
      });
    } else {
      console.log({
        "error": "NaN"
      });
      res.send({
        "error": "NaN"
      });
    }
  });
});

router.get('/tokendetail/:pagesize/:currentpage', function (req, res) {

  var pagesize = req.params.pagesize;
  var currentpage = req.params.currentpage;
  var currentIdx = (currentpage - 1) * pagesize;
  var sqlstring = "select * from token_contract_tbl ORDER BY token_contract_totalsupply DESC limit " + currentIdx + "," + pagesize + ";";

  pool.query(sqlstring, async function (err, rows, fields) {

    const [token_contract_rows] = await promisePool.query("select count(*) as count from token_contract_tbl;");
    var token_contract_amount = token_contract_rows[0].count;

    const [fromto_rows] = await promisePool.query("select count(*) as count from fromto_tbl where is_jointoken = true and fromto_hash != '0x0000000000000000000000000000000000000000';");
    var fromto_amount = fromto_rows[0].count;

    if (rows && rows.length > 0) {

      var tokens = rows;

      console.log('tokendetail');
      res.send({
        "result": {
          "pagesize": pagesize,
          "currentpage": currentpage,
          "tokencontract_amount": token_contract_amount,
          "tokencontract_fromto_amount": fromto_amount,
          "tokencontract": tokens
        }
      });
    } else {
      console.log({
        "error": "NaN"
      });
      res.send({
        "error": "NaN"
      });
    }

  });

});

router.get('/balancelist/:pagesize/:currentpage', function (req, res) {

  var pagesize = req.params.pagesize;
  var currentpage = req.params.currentpage;
  var currentIdx = (currentpage - 1) * pagesize;
  var sqlstring = "select * from fromto_tbl where is_contract = false ORDER BY fromto_balance DESC limit " + currentIdx + "," + pagesize + ";";
  pool.query(sqlstring, async function (err, rows, fields) {

    if (rows && rows.length > 0) {

      const [trans_rows] = await promisePool.query("select count(*) as count from fromto_tbl;");
      var amount = trans_rows[0].count;

      var fromtos = rows;

      console.log('balancelist');
      res.send({
        "result": {
          "pagesize": pagesize,
          "currentpage": currentpage,
          "total": amount,
          "fromtos": fromtos
        }
      });
    } else {
      console.log({
        "error": "NaN"
      });
      res.send({
        "error": "NaN"
      });
    }

  });

});

router.get('/getgptcamount', function (req, res) {

  var sqlstring = "select sum(fromto_balance) as count from fromto_tbl where is_contract = false;";
  pool.query(sqlstring, function (err, rows, fields) {

    if (rows && rows.length > 0 && rows[0].count) {

      var amount = rows[0].count;
      console.log("blocklength: " + amount);
      res.send({
        "result": {
          "amount": amount
        }
      });
    } else {
      console.log({
        "error": "NaN"
      });
      res.send({
        "error": "NaN"
      });
    }
  });
});

router.get('/getblocknumber', function (req, res) {

  var sqlstring = "select max(block_number) as count from block_tbl limit 1;";
  pool.query(sqlstring, function (err, rows, fields) {

    if (rows && rows.length > 0 && rows[0].count) {

      var amount = rows[0].count;
      console.log("blocklength: " + amount);
      res.send({
        "result": {
          "amount": amount
        }
      });
    } else {
      console.log({
        "error": "NaN"
      });
      res.send({
        "error": "NaN"
      });
    }
  });
});

router.get('/transactionamount2', function (req, res) {

  var sqlstring = "select count(*) as count from transaction_tbl";
  pool.query(sqlstring, function (err, rows, fields) {

    if (rows && rows.length > 0 && rows[0].count) {

      var amount = rows[0].count;
      console.log("transactionamount: " + amount);
      res.send({
        "result": {
          "amount": amount
        }
      });
    } else {
      console.log({
        "error": "NaN"
      });
      res.send({
        "error": "NaN"
      });
    }

  });

});

router.get('/transactionamount', function (req, res) {

  if (fs.existsSync('scripts/record.json')) {
    var record = JSON.parse(fs.readFileSync('scripts/record.json'));

    var amount = record.transaction.amount;
    console.log(amount);
    res.send({
      "result": {
        "amount": amount
      }
    });
  } else {
    console.log({
      "error": "NaN"
    });
    res.send({
      "error": "NaN"
    });
  }

});

router.get('/fromtolength2', function (req, res) {

  var sqlstring = "select count(*) as count from fromto_tbl where is_contract = false;";
  pool.query(sqlstring, function (err, rows, fields) {

    if (rows && rows.length > 0 && rows[0].count) {

      var amount = rows[0].count;
      console.log("fromtolength: " + amount);
      res.send({
        "result": {
          "amount": amount
        }
      });
    } else {
      console.log({
        "error": "NaN"
      });
      res.send({
        "error": "NaN"
      });
    }

  });

});

router.get('/fromtolength', function (req, res) {

  if (fs.existsSync('scripts/record.json')) {
    var record = JSON.parse(fs.readFileSync('scripts/record.json'));

    var amount = record.transaction.fromtolength;
    console.log(amount);
    res.send({
      "result": {
        "amount": amount
      }
    });
  } else {
    console.log({
      "error": "NaN"
    });
    res.send({
      "error": "NaN"
    });
  }

});

router.get('/latesttransactions2/:pagesize/:currentpage', function (req, res) {

  var pagesize = req.params.pagesize;
  var currentpage = req.params.currentpage;
  var currentIdx = (currentpage - 1) * pagesize;
  var sqlstring = "select * from transaction_tbl ORDER BY block_number DESC limit " + currentIdx + "," + pagesize + ";";
  pool.query(sqlstring, async function (err, rows, fields) {

    if (rows && rows.length > 0) {

      const [trans_rows] = await promisePool.query("select count(*) as count from transaction_tbl;");
      var amount = trans_rows[0].count;

      var transactions = rows;

      console.log('latesttransactions');
      res.send({
        "result": {
          "pagesize": pagesize,
          "currentpage": currentpage,
          "total": amount,
          "transactions": transactions
        }
      });
    } else {
      console.log({
        "error": "NaN"
      });
      res.send({
        "error": "NaN"
      });
    }

  });
});

router.get('/latesttransactions/:pagesize/:currentpage', function (req, res) {

  if (fs.existsSync('scripts/transactions.json')) {

    var pagesize = req.params.pagesize;
    var currentpage = req.params.currentpage;

    var alltransactions = JSON.parse(fs.readFileSync('scripts/transactions.json'));

    var currentIdx = alltransactions.length - (currentpage - 1) * pagesize;
    var backIdx = currentIdx - pagesize;
    if (backIdx < 0)
      backIdx = 0;
    var transactions = alltransactions.slice(backIdx, currentIdx).reverse();

    console.log('latesttransactions');
    res.send({
      "result": {
        "pagesize": pagesize,
        "currentpage": currentpage,
        "total": alltransactions.length,
        "transactions": transactions
      }
    });
  } else {
    console.log({
      "error": "NaN"
    });
    res.send({
      "error": "NaN"
    });
  }

});

router.get('/minerdetails2/:minerhash/:pagesize/:currentpage', function (req, res) {

  var minerhash = req.params.minerhash;
  var pagesize = req.params.pagesize;
  var currentpage = req.params.currentpage;
  var currentIdx = (currentpage - 1) * pagesize;

  var sqlstring = "select * from transaction_tbl where block_miner='" + minerhash + "' ORDER BY block_number DESC limit " + currentIdx + "," + pagesize + ";";

  pool.query(sqlstring, async function (err, rows, fields) {

    if (rows && rows.length > 0) {

      const [trans_rows] = await promisePool.query("select count(*) as count from transaction_tbl where block_miner='" + minerhash + "';");
      var amount = trans_rows[0].count;

      const [blocks_rows] = await promisePool.query("select count(*) as count from (select distinct block_number from transaction_tbl where block_miner='" + minerhash + "') a;");
      var blockamount = blocks_rows[0].count;

      var transactions = rows;

      console.log('minertransactions');
      res.send({
        "result": {
          "pagesize": pagesize,
          "currentpage": currentpage,
          "total": amount,
          "blocktotal": blockamount,
          "transactions": transactions
        }
      });
    } else {
      console.log({
        "error": "NaN"
      });
      res.send({
        "error": "NaN"
      });
    }

  });
});
router.get('/minerdetails/:minerhash/:pagesize/:currentpage', function (req, res) {

  var minerhash = req.params.minerhash;
  if (fs.existsSync('scripts/miners/' + minerhash + '.json')) {

    var pagesize = req.params.pagesize;
    var currentpage = req.params.currentpage;

    var minertransactions = JSON.parse(fs.readFileSync('scripts/miners/' + minerhash + '.json')).transactions;

    var currentIdx = minertransactions.length - (currentpage - 1) * pagesize;
    var backIdx = currentIdx - pagesize;
    if (backIdx < 0)
      backIdx = 0;
    var transactions = minertransactions.slice(backIdx, currentIdx).reverse();

    console.log('minertransactions');
    res.send({
      "result": {
        "pagesize": pagesize,
        "currentpage": currentpage,
        "total": minertransactions.length,
        "transactions": transactions
      }
    });
  } else {
    console.log({
      "error": "NaN"
    });
    res.send({
      "error": "NaN"
    });
  }

});

router.get('/walletdetails2/:wallethash/:fromorto/:pagesize/:currentpage', function (req, res) {

  var wallethash = req.params.wallethash;
  var fromorto = req.params.fromorto;
  var pagesize = req.params.pagesize;
  var currentpage = req.params.currentpage;
  var currentIdx = (currentpage - 1) * pagesize;

  var fromortostring = "transaction_from='" + wallethash + "' or transaction_to='" + wallethash + "' or token_contract_transaction_topics2='" + wallethash + "'";
  if (fromorto == "to") {
    fromortostring = "transaction_to='" + wallethash + "' or token_contract_transaction_topics2='" + wallethash + "'";
  } else if (fromorto == "from") {
    fromortostring = "transaction_from='" + wallethash + "'";
  }

  var sqlstring = "select * from transaction_tbl where " + fromortostring + " ORDER BY block_number DESC limit " + currentIdx + "," + pagesize + ";";

  pool.query(sqlstring, async function (err, rows, fields) {

    const [trans_rows] = await promisePool.query("select count(*) as count from transaction_tbl where transaction_from='" + wallethash + "' or transaction_to='" + wallethash + "' or token_contract_transaction_topics2='" + wallethash + "';");
    var amount = trans_rows[0].count;

    const [blocks_rows] = await promisePool.query("select count(*) as count from (select distinct block_number from transaction_tbl where transaction_from='" + wallethash + "' or transaction_to='" + wallethash + "' or token_contract_transaction_topics2='" + wallethash + "') a;");
    var blockamount = blocks_rows[0].count;

    const [tokens_rows] = await promisePool.query("SELECT count(distinct token_contract_hash) as count from token_contract_balance_tbl where fromto_hash = '" + wallethash + "';");
    var tokenamount = tokens_rows[0].count;

    console.log('minertransactions');
    if (rows && rows.length > 0) {
      var transactions = rows;
      res.send({
        "result": {
          "pagesize": pagesize,
          "currentpage": currentpage,
          "total": amount,
          "blocktotal": blockamount,
          "tokentotal": tokenamount,
          "transactions": transactions
        }
      });
    } else {
      res.send({
        "result": {
          "pagesize": pagesize,
          "currentpage": currentpage,
          "total": amount,
          "blocktotal": blockamount,
          "tokentotal": tokenamount,
          "transactions": []
        }
      });
    }
  });
});
router.get('/walletdetails/:wallethash/:pagesize/:currentpage', function (req, res) {

  var wallethash = req.params.wallethash;
  if (fs.existsSync('scripts/fromtos/' + wallethash + '.json')) {

    var pagesize = req.params.pagesize;
    var currentpage = req.params.currentpage;

    var minertransactions = JSON.parse(fs.readFileSync('scripts/miners/' + wallethash + '.json')).transactions;

    var currentIdx = minertransactions.length - (currentpage - 1) * pagesize;
    var backIdx = currentIdx - pagesize;
    if (backIdx < 0)
      backIdx = 0;
    var transactions = minertransactions.slice(backIdx, currentIdx).reverse();

    console.log('minertransactions');
    res.send({
      "result": {
        "pagesize": pagesize,
        "currentpage": currentpage,
        "total": minertransactions.length,
        "transactions": transactions
      }
    });
  } else {
    console.log({
      "error": "NaN"
    });
    res.send({
      "error": "NaN"
    });
  }

});

module.exports = router;
