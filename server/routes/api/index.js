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
const pinataAPIKey = process.env.PINATA_API_KEY;
const pinataSecretKey = process.env.PINATA_SECRET_KEY
const pinata_secret_token = process.env.PINATA_SECRET_TOKEN;
const axios = require('axios');
const FormData = require('form-data');
const { platform } = require('os');

const setDefaultAccount = async () => {
    var account = await web3.eth.getAccounts();
    web3.eth.defaultAccount = account[0];
}

var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545/'));
setDefaultAccount();
var credentialHashDeployedContract = new web3.eth.Contract(credentialHashContract.abi, credentialHashContract.networks[5777].address);
var uniqueAssetDeployedContract = new web3.eth.Contract(uniqueAssetContract.abi, uniqueAssetContract.networks[5777].address);




router.get('/', async (req, res, next) => {
    return res.json("Hello World");
})

/* 
    Upload File to IPFS 
*/
router.post('/upload', async (req, res, next) => {
    // upload any kind of files
    // add file hash to ethereum
    console.log('filesss --------- ', req.files)
    let fileObj = {};
    let fileSend = {}
    if (req.files.inputFile) {
        console.log(req.file)
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
                hash: fileHash,
            }


            // const data = web3.eth.accounts.sign(fileHash.toString(), '0f529545995df0da31150eeadb0036083d18698362c42e186cbdb785b984f0c9');
            const data = web3.eth.accounts.sign(fileHash.toString(), '63b87947cc2fb9661ac095c901243d15f4329ebd4f9d9dad3bc4b41f3c0bff69');

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
                console.log({ recepientAddress, assetHash, metadataUrl });
                // console.log(web3.eth.defaultAccount, 'check default account');
                const tokenId = await uniqueAssetDeployedContract.methods.awardItem(recepientAddress, assetHash, metadataUrl).call({ from: recepientAddress, gas: '1000000' })
                await uniqueAssetDeployedContract.methods.awardItem(recepientAddress, assetHash, metadataUrl).send({ from: recepientAddress, gas: '1000000' });
                // console.log(tokenId.toNumber())
                // const tokenId = await uniqueAssetDeployedContract.methods.awardItem(recepientAddress, assetHash, metadataUrl).call({ from: recepientAddress, gas: '1000000' })

                // const owner = await uniqueAssetDeployedContract.methods.ownerOf(tokenId).call({ from: recepientAddress, gas: '1000000' });

                console.log(tokenId)
                // console.log(token);

                if (process.platform === "darwin") {
                    fileSend = {
                        name: fileName,
                        tokenId: tokenId
                    }
                }
                else {
                    fileSend = {
                        name: fileName,
                        tokenId: tokenId.toNumber()
                    }
                }
                // Transfer of ownership using transferFrom in Remix



                // const resData2 = await uniqueAssetDeployedContract.methods.tokenURIs(2).call({ from: recepientAddress });
                // console.log('resData2', resData2);
                // tokenId = resData.toNumber();
                // console.log(tokenId);
            }
            catch (e) {
                console.log(e);
            }



            // addFileToUser('10', fileObj);
            // Send TokenID
            console.log('file sent',fileSend)
            return res.json(fileSend);

        })
    }
    
    // return res.json('Uploaded');
})

/**
 * Transfer of Ownership
 * Input: tokenId
 */
router.post('/transfer', async (req, res, next) => {
    // To get tokenid of asset requirements: recepientAddress, assetHash?, metadataUrl
    console.log('checker')
    const fromAddress = req.body.from
    const toAddress = req.body.to
    const tokenId = req.body.tokenId
    // console.log(tokenId,toAddress)

    const recepientAddress = web3.eth.defaultAccount;
    try {

        const owner = await uniqueAssetDeployedContract.methods.ownerOf(tokenId).call({ from: recepientAddress, gas: '1000000' });
        if (owner === fromAddress) {
            console.log(owner, recepientAddress)
            uniqueAssetDeployedContract.methods.transferFrom(owner, toAddress, tokenId).send({ from: owner, gas: '1000000' });
            const ret = {
                message: 'Successful',
                newOwner: req.body.to
            }
            res.json(ret)
        }

        res.status(400).json("Unsuccesful")
    }
    catch (e) {
        console.log(e.message)
    }


    // try {

    // }
    // catch (error) {
    //     console.log(error.message);
    // }
})

router.get('/owner', async (req, res, next) => {
    // To get tokenid of asset requirements: recepientAddress, assetHash?, metadataUrl
    console.log('checker')
    // const fromAddress = req.body.from
    // const toAddress = req.body.to
    const tokenId = req.query.tokenId
    console.log(tokenId)

    const recepientAddress = web3.eth.defaultAccount;
    try {
        // const tokenId = await uniqueAssetDeployedContract.methods.awardItem(recepientAddress, assetHash, metadataUrl).call({ from: recepientAddress, gas: '1000000' })
        // console.log(tokenId.toNumber())
        // const tokens = await uniqueAssetDeployedContract.methods.name().call({ from: recepientAddress, gas: '1000000' });;
        const owner = await uniqueAssetDeployedContract.methods.ownerOf(tokenId).call({ from: recepientAddress, gas: '1000000' });;
        console.log(owner)
        // uniqueAssetDeployedContract.methods.transferFrom(owner,toAddress, tokenId).send({ from: owner, gas: '1000000' });
        // console.log(tokenTransfer)
        res.json({ owner })
    }
    catch (e) {
        console.log(e.message)
    }


    // try {

    // }
    // catch (error) {
    //     console.log(error.message);
    // }
})


router.get('/getByTokenId/:tokenId', async (req, res, next) => {
    const { tokenId } = req.params;
    console.log('check id', tokenId)
    const recepientAddress = web3.eth.defaultAccount;

    try {
        const tokenUri = await uniqueAssetDeployedContract.methods.tokenURIs(tokenId).call({ from: recepientAddress, gas: '1000000' });
        return res.status(200).json({ tokenUri });
    }
    catch (error) {
        console.log(error.message);
        return res.status(400).json({ tokenUri: null });
    }
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