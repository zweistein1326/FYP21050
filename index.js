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
        this.createNewNode(0, 'IP', 'abcdgede');
    }

    addNewBlock(index, previous_hash) {
        this.current_block = new Block(index, previous_hash);
    }

    createNewNode(generator_id, title, value) {
        var node = new Node(generator_id, title, value);
        this.nodes = this.nodes.concat([node]);
        this.current_block.addTransaction({
            'message': 'New Node added',
            'node_id': node.id,
        })
    }

    getNodeById(id) {
        return this.nodes.filter((node) => node.id === id)
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
    constructor(generator_id, title, value) {
        this.generator_id = generator_id;
        this.id = uuid4.v4();
        this.attributes = [new Attribute(this.id, generator_id, title, value)]
    }

    addAtribute(generator_id, title, value) {
        this.attributes = this.attributes.concat([new Attribute(this.id, generator_id, title, value)])
    }

    deleteAttribute(attribute_id, modifier_id) {
        var attribute = this.attributes.filter((attribute) => attribute.attribute_id == attribute_id);
        var attribute_index = this.attributes.findIndex((attribute) => attribute.attribute_id == attribute_id);
        if (attribute && modifier_id === attribute[0].generator_id) {
            this.attributes.slice(attribute_index)
            console.log('deleted attribute');
        }
        else {
            console.log('no such attribute found');
        }
    }

    finAttribute() { }
}

class Attribute {
    constructor(parent_id, generator_id, title, value) {
        this.parent_id = parent_id;
        this.generator_id = generator_id;
        this.title = title
        this.value = value;
        this.attribute_id = hash([this.parent_id, this.generator_id, this.title, this.value])
    }
}

function hash(message) {
    return sha256(JSON.stringify(message));
}

var blockchain = new Blockchain();
// blockchain.createNewNode(0, 'IP', 'ffffff');
blockchain.mineCurrentBlock();
blockchain.addNewBlock(2, hash(blockchain.chain[blockchain.chain.length - 1]))
// blockchain.createNewNode(0, 'IP', 'aaaaaaa');

var admin = blockchain.nodes[0]
blockchain.createNewNode(admin.id, 'IP', 'dfffffff')
blockchain.mineCurrentBlock();

// console.log(blockchain.chain)

for (i = 0; i < blockchain.chain.length; i++) {
    console.log(blockchain.chain[i].transactions)
}

// console.log(blockchain.nodes);

for (i = 0; i < blockchain.nodes.length; i++) {
    var node = blockchain.nodes[i]
    console.log(blockchain.nodes[i].attributes)
}