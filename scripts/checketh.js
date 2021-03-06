/*jshint esversion: 8 */

const fs = require('fs');
const moment = require('moment');
const mysql = require('mysql2/promise');

const Web3 = require('web3');
const opensea = require("opensea-js");
const OpenSeaPort = opensea.OpenSeaPort;
const Network = opensea.Network;
const OpenSeaAsset = opensea.OpenSeaAsset;

const fetch = require('node-fetch');

var axios = require('axios');

var superrare_axios = axios.create({
    baseURL: 'https://superrare.co',
    // timeout: 3000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
});

var ether_axios = axios.create({
    baseURL: 'https://api.etherscan.io',
    // timeout: 3000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
});

var ipfs_axios = axios.create({
    baseURL: 'https://ipfs.pixura.io',
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
});



const {
    Pool,
    Client
} = require('pg');
const format = require('pg-format');
const { assetContractFromJSON } = require('opensea-js/lib/utils/utils');

// This example provider won't let you make transactions, only read-only calls:
const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/df21ca59a8fe4160a07fdab98ad62471');

let web3 = new Web3(provider);
// console.log(web3);

const seaport = new OpenSeaPort(provider, {
    networkName: Network.Main
});

var pool = new Pool({
  user: 'cryptoart_admin',
  host: 'pgm-8vba9njj9d7940ux8o.pgsql.zhangbei.rds.aliyuncs.com',
  database: 'cryptoart',
  password: 'youshu123',
  port: '5432'
});

test();
async function test() {

    const contract_address = '0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0';

    const pgresult = await pool.query('select * from public.artwork_tbl where fid >= 3645 and fid < 9000 order by fid;');
    const artworks = pgresult.rows;
    for(let i = 0;i < artworks.length;i ++) {
        console.log('fid: ' + artworks[i].fid);

        const payload = {
            module: 'account',
            action: 'tokennfttx',
            contractaddress: contract_address,
            startblock: artworks[i].blocknumber,
            endblock: artworks[i].blocknumber,
            page: 1,
            offset: 100,
            sort: 'asc',
            apikey: '9UMZZGUSIJHRS1BET72J5S743K1DJY7VTK'
        };

        let pp = '';
        for(let prop in payload) {
            pp += prop + '=' + payload[prop] + '&';
        }
        const ether_tx = await ether_axios.get('/api?' + pp);
        console.log('count: ' + ether_tx.data.result.length);
        if(ether_tx.data.result.length > 0) {
            const tx_hash = ether_tx.data.result[0].hash;

            const theTX = await web3.eth.getTransaction(tx_hash);
            let inputStr = web3.utils.toAscii(theTX.input);//Ùl! Jhttps://ipfs.pixura.io/ipfs/QmZzQhdb6Qa44iyc26Lpk8JFmaSt3ART8vTV6V1mofLvQ7
            console.log('Found input: ' + inputStr);
            if(inputStr.indexOf('http') >= 0) {
                inputStr = web3.utils.toUtf8(theTX.input);
                inputStr = decodeURI(inputStr);
            
                let wholeurl = String(inputStr).substring(String(inputStr).indexOf('http'));
                // wholeurl = encodeURI(wholeurl);
                console.log('Found input: ' + wholeurl);

                // const decodURIsss = decodeURI(wholeurl);
                // const fetch_result = await fetch(wholeurl, {method: 'GET'});
                let resultData = {};
                let theurl = wholeurl.substring(wholeurl.indexOf('https://ipfs.pixura.io') + 22);  //'/ipfs/QmZzQhdb6Qa44iyc26Lpk8JFmaSt3ART8vTV6V1mofLvQ7'
                const json_tx = await ipfs_axios.get(theurl);
                if(json_tx.status === 200 && json_tx.data){
                    resultData = json_tx.data;
                }
                // resultData = JSON.stringify(resultData);
                const name = resultData.name.replace(/'/g, "").replace(/"/g, "");
                const createdBy = resultData.createdBy.replace(/'/g, "").replace(/"/g, "");
                const yearCreated = resultData.yearCreated.replace(/'/g, "").replace(/"/g, "");
                const description = resultData.description.replace(/'/g, "").replace(/"/g, "");
                const image = resultData.image.replace(/'/g, "").replace(/"/g, "");
                const tags = JSON.stringify(resultData.tags).replace(/'/g, "");
                // const ipfs = JSON.stringify(resultData).replace(/'/g, "").replace(/"/g, "");

                let updatequery = "update public.artwork_tbl set name = '" + name + "', createdBy = '" + createdBy + "',  yearCreated = '" + yearCreated + "',  description = '" + description + "', image = '" + image + "', input = '" + wholeurl + "' where fid = " + artworks[i].fid + ";";
                let { rows } = await pool.query(updatequery);
                console.log('Update artwork_tbl rows: ' + rows.length);
            }

        }
    }


    // var abi = require("./SuperRare.json");
    // var address = "0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0";
    // var contract = new web3.eth.Contract(abi, address);
    // contract.methods.name().call().then(
    //     function (result) {
    //         console.log(result);
    //     }
    // );




    // const asset = await seaport.api.getAsset({
    //     tokenAddress, // string
    //     tokenId, // string | number | null
    // });

    const asset = await seaport.api.getAsset({
        tokenAddress, // string
        tokenId, // string | number | null
    });

    console.log('OK');

}

async function updateTransfers() {

    const latestBlock = 11982000;//await web3.eth.getBlockNumber(); 836000   from: 8488750 - 11978559
    const step = 1000;
    const startBlock = 11979000;

    const pgresult = await pool.query('select * from public.contract_tbl;');
    const contracts = pgresult.rows;

    for(let i = 0;i < contracts.length;i ++) {

        cc = contracts[i];
        if(cc.name === 'SuperRareV2') {
        
            const contract_abi = cc.contract_abi;
            const contract_address = cc.contract_hash;
            const contract = new web3.eth.Contract(contract_abi, contract_address); //合约实例

            // const contract_name = await contract.methods.name().call();
            // const contract_block = contract.defaultBlock;

            //https://api.etherscan.io/api?module=account&action=tokennfttx&contractaddress=0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0&page=1&offset=%2010000&sort=asc&apikey=9UMZZGUSIJHRS1BET72J5S743K1DJY7VTK

            let j = startBlock;
            while(j + 1000 <= latestBlock) {

                const payload = {
                    module: 'account',
                    action: 'tokennfttx',
                    contractaddress: contract_address,
                    startblock: j,
                    endblock: j + 999,
                    page: 1,
                    offset: 1000,
                    sort: 'asc',
                    apikey: '9UMZZGUSIJHRS1BET72J5S743K1DJY7VTK'
                };
    
                let pp = '';
                for(let prop in payload) {
                    pp += prop + '=' + payload[prop] + '&';
                }
                const ether_tx = await ether_axios.get('/api?' + pp);
                const ether_tx_count = ether_tx.data.result.length;
                console.log('Found block from ' + j + ' - ' + (j +999) + ': ' + ether_tx_count + '.');
                if(ether_tx_count > 0) {
                    //transfer_tbl
                    let transfers = ether_tx.data.result.map(tx => {
                        return [
                            tx.blockHash,
                            tx.blockNumber,
                            tx.confirmations,
                            tx.contractAddress,
                            tx.cumulativeGasUsed,
                            tx.from,
                            tx.gas,
                            tx.gasPrice,
                            tx.gasUsed,
                            tx.hash,
                            tx.input,
                            tx.nonce,
                            tx.timeStamp,
                            tx.to,
                            tx.tokenDecimal,
                            tx.tokenID,
                            tx.tokenName,
                            tx.tokenSymbol,
                        ];
                    });
                    if(transfers.length > 0) {

                        // ether_tx.data.result.forEach(tx => {
                        //     console.log(tx.hash + ', ' + tx.tokenID);//0x7722394bf16cc8392fa03830b72ecb523f78c130de2d4d4360bc9e5a63b60060
                        // });

                        let query = format('INSERT INTO transfer_tbl (blockHash, blockNumber, confirmations, contractAddress, cumulativeGasUsed, "from", gas, gasPrice, gasUsed, "hash", input, nonce, "timeStamp", "to", tokenDecimal, tokenID, tokenName, tokenSymbol) VALUES %L returning fid', transfers);
                        let { rows } = await pool.query(query);
                        console.log('Update transfers rows: ' + rows.length);
                    }

                    //artwork_tbl
                    let artwork_transfers = ether_tx.data.result.filter(tx => {
                        return tx.from === '0x0000000000000000000000000000000000000000';
                    }).map(tx => {
                        return [
                            cc.name,
                            tx.tokenID,
                            tx.blockNumber,
                            tx.contractAddress,
                            tx.to,
                            tx.timeStamp,
                            tx.input,
                        ];
                    });
                    if(artwork_transfers.length > 0) {
                        let query = format('INSERT INTO artwork_tbl (contract_name, token_id, blockNumber, contractAddress, artistAddress, "timeStamp", input) VALUES %L returning fid', artwork_transfers);
                        let { rows } = await pool.query(query);
                        console.log('Update artwork_transfers rows: ' + rows.length);
                    }

                    //investors_tbl
                    let investors_transfers = ether_tx.data.result.filter(tx => {
                        return tx.from !== '0x0000000000000000000000000000000000000000';
                    }).forEach(async (tx) => {
                        
                        const pgresult = await pool.query("select count(*) from public.investors_tbl where address_hash = '" + tx.to + "'");
                        const pg_count = pgresult.rows[0].count;
                        if(pg_count === '0') {
                            let query = "INSERT INTO investors_tbl (address_hash) VALUES ('" + tx.to + "')";
                            let { rows } = await pool.query(query);
                            console.log('Update investors_transfers rows: ' + rows.length);
                        }
                    });

                }

                j = j + 1000;
            }
        }

        // const events = await contract.getPastEvents('Transfer', {//allEvents, Transfer, ApprovalForAll
        //     filter: {
        //         _from: '0x0000000000000000000000000000000000000000'
        //     },
        //     fromBlock: 11960000,
        //     toBlock: 11962000, //'latest',
        // });
        // console.log(JSON.stringify(events));
    }
}

async function updateArtists() {

    const payload = {
        contractAddresses: ["0x41a322b28d0ff354040e2cbc676f0320d8c8850d", "0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0"],
        endDate: null,
        orderBy: "TOTAL_SALES_USD_DESC",
        startDate: null,
    };
    const superrare = await superrare_axios.post('/api/v2/stats/creators', payload);
    const statsWithUsers = superrare.data.result.statsWithUsers;
    
    try {

        const pgresult = await pool.query('select * from public.artists_tbl;');
        const pg_artists = pgresult.rows;

        let artists = statsWithUsers.map(user => {
            return [
                user.ethAddress,
                user.ethAddress + '_' + user.userProfile.username,
                user.userProfile.username,
                user.userProfile.avatar,
                user.averageResalePrice,
                user.averageResalePriceUsd,
                user.averageSalePrice,
                user.averageSalePriceUsd,
                user.highestResale,
                user.highestResaleUsd,
                user.highestSale,
                user.highestSaleUsd,
                Number(user.numberOfBids),
                Number(user.numberOfCreations),
                Number(user.numberOfResales),
                Number(user.numberOfSales),
                user.totalResales,
                user.totalResalesUsd,
                user.totalSales,
            ];
        });

        if(artists.length > 0) {
            let query = format('INSERT INTO artists_tbl (address_hash, artist_id, name, avatar_url, average_resale_price, average_resale_priceUsd, average_sale_price, average_sale_priceUsd, highest_resale, highest_resaleUsd, highest_sale, highest_saleUsd, number_bids, number_creations, number_resales, numbe_sales, total_resales, total_resalesUsd, total_sales) VALUES %L returning fid', artists);
            let { rows } = await pool.query(query);
            console.log(rows);
        }
    }
    catch(e) {
        console.log(e);
    }
}