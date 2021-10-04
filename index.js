// import Blockchain from "./models/Blockchain"

uuid4 = require('uuid');
moment = require('moment');
sha256 = require('sha256');

class Blockchain {
    constructor() {
        this.chain = [];
        this.current_transactions = [];
        this.nodes = [];
        this.current_block = null;
        this.addNewBlock(1, null);
        this.createNewNode();
    }

    addNewBlock(index, previous_hash) {
        this.current_block = new Block(index, previous_hash);
    }

    createNewNode() {
        var node = new Node();
        this.nodes = this.nodes.concat([node]);
        this.current_block.addTransaction({
            'message': 'New Node added',
            'node_id': node.id,

        })
    }

    mineCurrentBlock() {
        this.current_block.timestamp = moment.now();
        this.chain = this.chain.concat([this.current_block]);
    }
}

// class Transaction {
//     constructor(sender, asset, receiver) {
//         this.sender = sender;
//         this.asset = asset;
//         this.receiver = receiver
//     }
// }

class Block {
    constructor(index, previous_hash) {
        this.index = index;
        this.previous_hash = previous_hash;
        this.transactions = [];
        this.timestamp = ''
    }

    addTransaction(transaction) {
        this.transactions = this.transactions.concat([transaction]);
    }
}

// class Nodes {
//     constructor() {
//         this.nodes = [];
//         this.createNewNode();
//     }

//     createNewNode() {
//         this.nodes.concat([new Entity()])
//         console.log(this.nodes);
//     }
// }

class Node {
    constructor() {
        this.id = uuid4.v4();
        this.attributes = [new Attribute(this.id, 'admin_id', 'IP')]
    }
}

class Attribute {
    constructor(parent_id, generator_id, title) {
        this.parent_id = parent_id;
        this.generator_id = generator_id;
        this.title = title
    }
}

function hash(message) {
    return sha256(JSON.stringify(message));
}

var blockchain = new Blockchain();
blockchain.createNewNode();
blockchain.mineCurrentBlock();
blockchain.addNewBlock(2, hash(blockchain.chain[blockchain.chain.length - 1]))
blockchain.createNewNode();
blockchain.mineCurrentBlock();
console.log(blockchain.chain);

for (i = 0; i < blockchain.chain.length; i++) {
    console.log(blockchain.chain[i].transactions)
}

console.log(blockchain.nodes);

for (i = 0; i < blockchain.nodes.length; i++) {
    console.log(blockchain.nodes[i].attributes)
}