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

var opensea_axios = axios.create({
    baseURL: 'https://api.opensea.io',
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

    const pgresult = await pool.query('select * from public.artwork_tbl where fid >= 6180 order by fid;');
    const artworks = pgresult.rows;
    for(let i = 0;i < artworks.length;i ++) {
        console.log('fid: ' + artworks[i].fid + ', token_id: ' + artworks[i].token_id);

        const options = {
            method: 'GET',
            qs: {
                asset_contract_address: contract_address,
                token_id: artworks[i].token_id,
                only_opensea: 'false',
                offset: '0',
                limit: '300'
            }
        };
        let events = await seaport.api.get('/api/v1/events', options.qs);
        events = events.asset_events;
        const trueevents = events.filter(event => {
            return event.total_price !== null;
        });
        console.log('Found events: ' + events.length + ', true events: ' + trueevents.length);

        let newevents = trueevents.map(event => {
            return [
                artworks[i].token_id,
                contract_address,
                event.transaction.timestamp,
                Number(event.total_price) / 1000000000000000000 + '',
                event.event_type,
                event.transaction.transaction_hash,
                event.asset.owner.address,
                event.asset.owner.user?event.asset.owner.user.username:'',
                event.transaction.from_account.address,
                event.transaction.from_account.user?event.transaction.from_account.user.username:'',
                event.transaction.to_account.address,
                event.transaction.to_account.user?event.transaction.to_account.user.username:'',
                event.payment_token.eth_price,
                event.payment_token.usd_price,
            ];
        });

        if(newevents.length > 0) {
            let query = format('INSERT INTO artwork_history_tbl (token_id, contract_hash, transfer_date, total_price, event_type, transfer_hash, owner_address_hash, owner_user_name, from_address_hash, from_user_name, to_address_hash, to_user_name, eth_price, usd_price) VALUES %L returning fid', newevents);
            let { rows } = await pool.query(query);
            // console.log(rows);
        }

    }





    // const url = 'https://api.opensea.io/api/v1/events';
    // const payload = {
    //     asset_contract_address: contract_address,
    //     token_id: '20684',
    //     only_opensea: 'false',
    //     offset: '0',
    //     limit: '300'
    // };

    // let pp = '';
    // for(let prop in payload) {
    //     pp += prop + '=' + payload[prop] + '&';
    // }
    // const json_tx = await opensea_axios.post('/api/v1/events?' + pp);
    // if(json_tx.status === 200 && json_tx.data){
    //     resultData = json_tx.data;
    // }

    // const results = await fetch(url, options);
    // const rr = results.json();
    // console.log(results);

    // const pgresult = await pool.query('select * from public.artwork_tbl where fid >= 306 order by fid;');
    // const artworks = pgresult.rows;
    
    // const tokenId = '20684';
    // const asset = await seaport.api.getAsset({
    //     tokenAddress: '0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0', // string
    //     tokenId, // string | number | null
    // });

    console.log('OK');

}
