const router = require('express').Router();
const ipfsClient = require('ipfs-http-client');
const fs = require('fs');
const ipfs = ipfsClient.create({
    host: "localhost",
    port: 5001,
    protocol: "http"
});
const formidable = require('formidable');
const auth = require('../components/auth');
const { addFileToUser, getUserFiles } = require('../../database');
const Web3 = require('web3');
const credentialHashContract = require('../../blockchain/build/contracts/CredentialHash.json');
const uniqueAssetContract = require('../../blockchain/build/contracts/UniqueAsset.json');
const chainAPI = 'https://mainnet.infura.io/v3/5d0233c446ba4d538c2082aefc9bd130' // https://<network>.infura.io/v3/<PROJECT_ID>
const pinataAPIKey = process.env.PINATA_API_KEY;
const pinataSecretKey = process.env.PINATA_SECRET_KEY
const pinata_secret_token = process.env.PINATA_SECRET_TOKEN;
const axios = require('axios');
const FormData = require('form-data');

const setDefaultAccount = async () => {
    var account = await web3.eth.getAccounts();
    web3.eth.defaultAccount = account[2];
}

var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545/'));
setDefaultAccount();
var credentialHashDeployedContract = new web3.eth.Contract(credentialHashContract.abi, credentialHashContract.networks[5777].address);
var uniqueAssetDeployedContract = new web3.eth.Contract(uniqueAssetContract.abi, '0x213fE4e5B00baD84F20C9e03713d9eB48fA44CaB');



router.get('/', async (req, res, next) => {
    return res.json("Hello World");
})

/* 
    Upload File to IPFS 
*/
router.post('/upload', async (req, res, next) => {
    // upload any kind of files
    // add file hash to ethereum

    let fileObj = {};
    if (req.files.inputFile) {
        const file = req.files.inputFile;
        const fileName = file.name;
        const filePath = __dirname + "/img/" + fileName;

        file.mv(filePath, async (err) => {
            if (err) {
                console.log("Error: failed to download file.");
                return res.status(500).send(err);
            }
            const fileHash = await addFile(fileName, filePath);
            console.log("File Hash received -->", fileHash);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log("Error: Unable to delete file", err);
                }
            });
            fileObj = {
                file: file,
                name: fileName,
                path: filePath,
                hash: fileHash
            }

            const data = web3.eth.accounts.sign(fileHash.toString(), '6f49451d42e90662ee96cd7848f775203ad8358f0453dcc91451a5f7f9ccedd3');

            // save signature with user

            const recoveredData = web3.eth.accounts.recover(data.message, data.signature); // recover data

            // credentialHashDeployedContract.methods.saveHash(fileHash.toString()).send({ from: web3.eth.defaultAccount }).on('receipt', async (result) => {
            //     saveHash = result
            //     resultCid = await credentialHashDeployedContract.methods.getHash().call({ to: saveHash.to })
            // });
            // console.log(resultCid);
            const assetHash = fileHash.toString();
            const metadataUrl = `ipfs://${assetHash}`
            const recepientAddress = web3.eth.defaultAccount;
            // credentialHashDeployedContract.methods.saveHash(fileHash.toString()).send({ from: web3.eth.defaultAccount }).on('receipt', async (result) => {
            //     saveHash = result
            //     resultCid = await credentialHashDeployedContract.methods.getHash().call({ to: saveHash.to })
            // });
            try {
                const resData = await uniqueAssetDeployedContract.methods.awardItem(recepientAddress, assetHash, metadataUrl).call();
                tokenId = resData.toNumber();
            }
            catch (e) {
                console.log(e.message);
            }

            console.log(tokenId);

            // addFileToUser('10', fileObj);
            return res.json(fileObj);
        })
    }
    // return res.json('Uploaded');
})

/* 
    Add file to IPFS 
*/

const addFile = async (fileName, filePath) => {
    const file = fs.readFileSync(filePath);
    const filesAdded = await ipfs.add({ path: fileName, content: file }, {
        progress: (len) => console.log("Uploading file...", len)
    });
    const fileHash = filesAdded.cid;
    return fileHash;
}

/* 
    Get File by CID -> Fetch directly from IPFS 
*/

router.get('/file/:cid', async (req, res, next) => {
    const { cid } = req.params;
    const result = await getData(cid);
    // console.log(result);
    return res.json({ file: result });
})

const getData = async (hash) => {
    const asyncitr = ipfs.cat(hash);
    let data = [];
    let count = 0;
    const file = writeDataToFile(asyncitr);
    // console.log(data);
    return file;
}

const writeDataToFile = async (asyncitr) => {
    getFilePath();
    const file = fs.createWriteStream(__dirname + '/img/' + 'me.doc'); // __dirname + '/img' + filename
    for await (const itr of asyncitr) {
        file.write(Buffer.from(itr));
    }
    file.end();
    return file;
}

/*  
    Login existing user
*/
router.post('/login', async (req, res, next) => {
    console.log('login');
    auth.login(req.body)
        .then(user => {
            console.log(user);
            if (user) {
                return res.json(user)
            }
            return res.status(400).json({ message: 'Username or password incorrect' });
        })
        .catch(e => {
            return next(e)
        })
})

/*
    Register new user
*/

router.post('/register', async (req, res, next) => {
    const account = web3.eth.accounts.create();
})

router.post('/getAllFiles', async (req, res, next) => {
    const { userId } = req.params;
    const userFiles = getUserFiles(userId);
    if (userFiles !== null) {
        return res.status(200).json({ files: userFiles });
    }
    else {
        return res.status(200).json({ files: null, message: 'User does not have any existing files' });
    }
});


const pinFileToIPFS = async () => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    var data = new FormData();
    var tokenId = null;

    data.append('file', fs.createReadStream(__dirname + '/img/me.png'));

    const res = await axios.post(url, data, {
        maxContentLength: "Infinity",
        headers: {
            "Content-Type": `multipart/form-data;boundary = ${data._boundary}`,
            pinata_api_key: pinataAPIKey,
            pinata_secret_api_key: pinataSecretKey
        }
    });
}

module.exports = router;