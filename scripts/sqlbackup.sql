
--DROP TABLE block_tbl
CREATE TABLE IF NOT EXISTS `block_tbl`(
   `block_number` BIGINT UNSIGNED,
   `block_hash` VARCHAR(255) NOT NULL,
   `block_gasUsed` INT UNSIGNED,
   `block_miner` VARCHAR(255) NOT NULL,
   `block_timestamp` TIMESTAMP,
   `block_transaction_count` INT UNSIGNED,
   `block_content` TEXT NOT NULL,
   PRIMARY KEY ( `block_number` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE INDEX idx_block_tbl ON block_tbl (block_number);

select * from `transaction_tbl` where transaction_hash = '0xc3e97b5c7ed7b7548c1b015cb137c4a4fef2e95ae7d9dc9c4ef221e7bcc70eaa'
select * from `transaction_tbl` where transaction_receipt_content like '%c39%'
select * from `transaction_tbl` where transaction_to = '0x579D0c7dd5A0dd430660EB3Ab823981304961c39'
select * from `transaction_tbl` where block_miner = '0x579D0c7dd5A0dd430660EB3Ab823981304961c39'


--delete from block_tbl;
select * from block_tbl;

select * from block_tbl ORDER BY block_number DESC limit 0,10;

INSERT INTO block_tbl ( block_number, block_hash, block_gasUsed, block_miner, block_timestamp, block_transaction_count, block_content) 
VALUES(217900, '0x8342ff5e1bebbde4766c7169f31220c8fb2a990ad6b5ce0c3b14f47fa833314f', 0, '0xcbe58263d2be66da99c9c04a57ee13e7436e8fbc', '2020-09-26 11:19:44', 1, '{"difficulty":"6987289","extraData":"0xd98301090f85676770746388676f312e31342e34856c696e7578","gasLimit":8000000,"gasUsed":0,"hash":"0x8342ff5e1bebbde4766c7169f31220c8fb2a990ad6b5ce0c3b14f47fa833314f","logsBloom":"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","miner":"0xcbe58263d2be66da99c9c04a57ee13e7436e8fbc","mixHash":"0x2e4d15b4377400765baf06f6dff3926d6e22da07bcd2a5ca6a1c01b34d0d48b6","nonce":"0x373ed3b6c1200c28","number":217900,"parentHash":"0xe17c91087e552fe39ecc8433c9dcfc91507eb92d265866af6f6e7424376a2874","receiptsRoot":"0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421","sha3Uncles":"0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347","size":540,"stateRoot":"0x4ea4ce430e5009818d2c05c4b5e4d2be5193fe3818579897d267f5efa45f998a","timestamp":1601090384,"totalDifficulty":"507519987541","transactions":[],"transactionsRoot":"0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421","uncles":[]}');


select max(block_number) as last_block_number from block_tbl limit 1;
select count(*) from block_tbl;

select count(*) from block_tbl where block_transaction_count > 0 

---------------


--DROP TABLE transaction_tbl
CREATE TABLE IF NOT EXISTS `transaction_tbl`(
   `transaction_id` INT UNSIGNED AUTO_INCREMENT,
   `block_number` BIGINT UNSIGNED,
   `block_hash` VARCHAR(255) NOT NULL,
   `block_timestamp` TIMESTAMP,
   `block_miner` VARCHAR(255) NOT NULL,
   `transaction_hash` VARCHAR(255) NOT NULL,
   `transaction_from` VARCHAR(255) NOT NULL,
   `transaction_to` VARCHAR(255) NOT NULL,
   `transaction_gas` INT UNSIGNED,
   `transaction_gasPrice` DOUBLE,
   `transaction_gasUsed` INT UNSIGNED,
   `transaction_v` DOUBLE,
   `transaction_content` TEXT NOT NULL,
   `transaction_receipt_content` TEXT NOT NULL,
   PRIMARY KEY ( `transaction_id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE INDEX transaction_tbl_block_timestamp ON transaction_tbl (block_timestamp);
CREATE INDEX transaction_tbl_block_miner ON transaction_tbl (block_miner);
CREATE INDEX transaction_tbl_transaction_from ON transaction_tbl (transaction_from);
CREATE INDEX transaction_tbl_transaction_to ON transaction_tbl (transaction_to);



--delete from transaction_tbl;
select * from transaction_tbl;

select count(*) from transaction_tbl;

----------------


DROP TABLE miner_tbl
CREATE TABLE IF NOT EXISTS `miner_tbl`(
   `miner_id` INT UNSIGNED AUTO_INCREMENT,
   `miner_hash` VARCHAR(255) NOT NULL,
   PRIMARY KEY ( `miner_id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `miner_tbl` ADD unique(`miner_hash`);


delete from miner_tbl;
select * from miner_tbl;

select distinct block_miner from block_tbl where block_number > 6495


select count(*) from miner_tbl;


INSERT INTO miner_tbl ( miner_hash ) VALUES('0xb50970d977fe010dfb6f6759bb5c832a8ef0017b');INSERT INTO miner_tbl ( miner_hash ) VALUES('0x5c2b75e6ca0d48d3b2b29c8c9bffa97c8b05dc89');INSERT INTO miner_tbl ( miner_hash ) VALUES('0xcbe58263d2be66da99c9c04a57ee13e7436e8fbc');



----------------


--DROP TABLE fromto_tbl
CREATE TABLE IF NOT EXISTS `fromto_tbl`(
   `fromto_id` INT UNSIGNED AUTO_INCREMENT,
   `fromto_hash` VARCHAR(255) NOT NULL,
   PRIMARY KEY ( `fromto_id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `fromto_tbl` ADD unique(`fromto_hash`);

ALTER TABLE fromto_tbl ADD fromto_balance DOUBLE UNSIGNED DEFAULT 0;
ALTER TABLE fromto_tbl ADD is_miner BOOLEAN DEFAULT false;
ALTER TABLE fromto_tbl ADD is_contract BOOLEAN DEFAULT false;
UPDATE fromto_tbl set fromto_balance = 0;

delete from fromto_tbl where fromto_hash =  'null';

--delete from fromto_tbl;
select * from fromto_tbl where is_contract = true;
select * from fromto_tbl where `fromto_hash`  like '%c68f%'

select count(*) from fromto_tbl;


select *, fromto_hash from fromto_tbl where fromto_balance is null;

update fromto_tbl t2, miner_tbl t1 set t2.is_miner = true where ( t1.miner_hash = t2.fromto_hash)
update fromto_tbl t2, token_contract_tbl t1 set t2.is_contract = true where ( t1.token_contract_hash = t2.fromto_hash)

select t2.* from fromto_tbl t2, token_contract_tbl t1 where  t1.token_contract_hash = t2.fromto_hash


INSERT INTO fromto_tbl ( fromto_hash, is_miner) VALUES(
select t1.miner_hash, true from miner_tbl t1, fromto_tbl t2 where t1.miner_hash != t2.fromto_hash)
)

select sum(fromto_balance) as count from fromto_tbl where is_contract = false;
----------------




(select distinct transaction_from as fromto_hash from transaction_tbl)
union
(select distinct transaction_to as fromto_hash from transaction_tbl)
union 
(select distinct block_miner as fromto_hash from block_tbl)


----------------


select * from transaction_tbl;
select max(block_number) as last_block_number from transaction_tbl limit 1;


DROP TABLE token_contract_tbl
CREATE TABLE IF NOT EXISTS `token_contract_tbl`(
   `token_contract_id` INT UNSIGNED AUTO_INCREMENT,
   `token_contract_name` VARCHAR(255) NOT NULL,
   `token_contract_hash` VARCHAR(255) NOT NULL,
   `token_contract_deploytransaction` VARCHAR(255) NOT NULL,
   PRIMARY KEY ( `token_contract_id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `token_contract_tbl` ADD unique(`token_contract_hash`);

ALTER TABLE token_contract_tbl ADD token_contract_price DOUBLE UNSIGNED DEFAULT 0;
ALTER TABLE token_contract_tbl ADD token_contract_totalsupply DOUBLE UNSIGNED DEFAULT 0;
ALTER TABLE token_contract_tbl ADD token_contract_desc VARCHAR(255);

update token_contract_tbl set token_contract_name = 'GDSO', token_contract_deploytransaction = '0xf55732dcddc0ae22de9b55aa7245ea0274f72af625d5b62abe24d6744f4cb377' WHERE token_contract_hash = '0xeb7dbde8aebcd14625444012529efdbc9fedba1a';
update token_contract_tbl set token_contract_name = 'GPDC', token_contract_deploytransaction = '0x604d0547aa4a35889435b3e661a4133e0e319c03ee41d99fa62affb254c57eaf' WHERE token_contract_hash = '0x3bfa6399e07685bd32108a3be36be22ad1f509fe';
update token_contract_tbl set token_contract_desc = concat(token_contract_name,' Token');
select * from token_contract_tbl;



DROP TABLE token_contract_transaction_tbl
CREATE TABLE IF NOT EXISTS `token_contract_transaction_tbl`(
   `token_contract_transaction_id` INT UNSIGNED AUTO_INCREMENT,
   `block_number` BIGINT UNSIGNED,
   `block_timestamp` TIMESTAMP,
   `transaction_hash` VARCHAR(255) NOT NULL,
   `token_contract_hash` VARCHAR(255) NOT NULL,
   `token_contract_transaction_value` DOUBLE DEFAULT 0,
   `token_contract_transaction_topics0` VARCHAR(255) NOT NULL,
   `token_contract_transaction_topics1` VARCHAR(255) NOT NULL,
   `token_contract_transaction_topics2` VARCHAR(255) NOT NULL,
   PRIMARY KEY ( `token_contract_transaction_id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE INDEX token_contract_transaction_tbl_block_number ON token_contract_transaction_tbl (block_number);
CREATE INDEX token_contract_transaction_tbl_block_timestamp ON token_contract_transaction_tbl (block_timestamp);
CREATE INDEX token_contract_transaction_tbl_transaction_hash ON token_contract_transaction_tbl (transaction_hash);
CREATE INDEX token_contract_transaction_tbl_token_contract_hash ON token_contract_transaction_tbl (token_contract_hash);
CREATE INDEX token_contract_transaction_tbl_transaction_topics1 ON token_contract_transaction_tbl (token_contract_transaction_topics1);
CREATE INDEX token_contract_transaction_tbl_transaction_topics2 ON token_contract_transaction_tbl (token_contract_transaction_topics2);

delete from token_contract_transaction_tbl;
select * from token_contract_transaction_tbl;

select DISTINCT token_contract_transaction_from from token_contract_transaction_tbl


CREATE TABLE IF NOT EXISTS `token_contract_fromto_tbl`(
   `token_contract_fromto_id` INT UNSIGNED AUTO_INCREMENT,
   `token_contract_fromto_hash` VARCHAR(255) NOT NULL,
   `token_contract_fromto_balance` DOUBLE UNSIGNED DEFAULT 0,
   PRIMARY KEY ( `token_contract_fromto_id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `token_contract_fromto_tbl` ADD unique(`token_contract_fromto_hash`);


--delete from token_contract_fromto_tbl;
select * from token_contract_fromto_tbl;
select * from token_contract_fromto_tbl ORDER BY fromto_balance DESC limit 0,10
select count(*) from token_contract_fromto_tbl;


select * from (
(select distinct token_contract_transaction_topics1 as fromto_hash from token_contract_transaction_tbl)
union
(select distinct token_contract_transaction_topics2 as fromto_hash from token_contract_transaction_tbl)
) a








