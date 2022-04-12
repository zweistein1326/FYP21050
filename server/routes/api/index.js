const fs = require('fs');
const router = require('express').Router();
const {addFile, encrypt, decrypt} = require('./helperFunctions')
const usersContract = require('../../blockchain/build/contracts/Users.json');
const Web3 = require('web3');

var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545/'));
var usersDeployedContract = new web3.eth.Contract(usersContract.abi, usersContract.networks[5777].address);

const setDefaultAccount = async () => {
    var account = await web3.eth.getAccounts();
    web3.eth.defaultAccount = account[0];
    const balance = await web3.eth.getBalance(web3.eth.defaultAccount)
    console.log(balance)
}

setDefaultAccount()

/* --------------------------API Endpoints-------------------------- */

router.get('/', async(req,res,next)=>{
    return res.send('Server running')
})

// * Register
router.post('/register', async (req, res, next) => {
    
    const {username, walletAddress, publicKey} = req.body;
    
    try{
        const tx = await usersDeployedContract.methods.createNewUser(username, publicKey).send({from: web3.eth.defaultAccount, gas:1000000});
        web3.eth.accounts.signTransaction(tx);
        const user = await usersDeployedContract.methods.getUserByUsername(username).call({from: web3.eth.defaultAccount, gas:1000000});
        const returnUser = {id:user.id, username:user.username, publicKey:user.publicKey, credentialIds:user.credentialIds}
        return res.status(200).json({user: returnUser, success: true})
    }
    catch(e){
        return res.status(200).json({message:e.message, success:false})
    }
})

// * Login
router.post('/login', async (req, res, next) => {
    const {username, walletAddress, messageHash} = req.body;
    try{
        const user = await usersDeployedContract.methods.getUserByUsername(username).call({from: web3.eth.defaultAccount, gas:'100000'});
        if(web3.eth.accounts.recover(messageHash)===user.walletAddress){
            const returnUser = {id:user.id, username:user.username, publicKey:user.publicKey, credentialIds:user.credentialIds}
            return res.status(200).json({user: returnUser, success:true});
        }
        return res.status(200).json({message:'Login Failed',success:false});
    }
    catch(e){
        return res.status(200).json({message:e.message, success:false})
    }
})

// * Get credentials by User
router.get('/getFilesByUser',async(req,res,next)=>{
    let userCredentials = [];
    const userId = req.query.userId;
    try{
        const user = await usersDeployedContract.methods.getUserById(userId).call({from:web3.eth.defaultAccount, gas:'100000'});
        console.log(user)

        if(user.credentialIds.length>0){
            user.credentialIds.forEach(async(credentialId,index)=>{
                const credential = await usersDeployedContract.methods.getCredentialById(credentialId).call({from:web3.eth.defaultAccount, gas:'100000'});
                const newCredential = {id:credential.id, createdBy:credential.createdBy, data:credential.data, currentOwner:credential.currentOwner, isValid:credential.isValid, revocationReason:credential.revocationReason, createdAt:credential.createdAt, viewers:credential.viewers}
                userCredentials.push(newCredential);
                if(index == user.credentialIds.length-1)
                {
                    return res.status(200).json({credentials:userCredentials,success:true})
                }
            })
        }
        else{
            return res.status(200).json({credentials:userCredentials, success:true})
        }
    }
    catch(e){
        return res.json({message:e.message, success:false})
    }
})

// * Upload Document
router.post('/upload', async (req, res, next) => {
    const { senderAddress, walletAddress } = req.body;
    let fileSend = {};

    try{
        if (req.files) {
            const file = req.files.inputFile;
            const fileName = file.name;
            const filePath = __dirname + fileName;
            file.mv(filePath, async (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                
                const fileHash = await addFile(fileName, filePath);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.log("Error: Unable to delete file", err);
                    }
                });
                const assetHash = fileHash.toString();
                const metadataUrl = `https://ipfs.io/ipfs/${assetHash}`
                try {
                    // const user = await usersDeployedContract.methods.getUserById(senderAddress).call({from: web3.eth.defaultAccount, gas:'100000'});
        
                    // const encryptedAssetHash = await encrypt(assetHash, user.publicKey)
                    // const encryptedMetadataUrl = await encrypt(metadataUrl, user.publicKey)

                    // fileSend = { name: fileName, encryptedMetadataUrl, encryptedAssetHash }

                    const tx = await usersDeployedContract.methods.addCredential(senderAddress, {fileName, assetHash,metadataUrl}, Date.now().toString(), []).send({from: web3.eth.defaultAccount, gas:1000000}); // Add credential to list of all credentials
                    const credentialId = await usersDeployedContract.methods.addCredential(senderAddress, {fileName, assetHash, metadataUrl}, Date.now().toString(), []).call({from: web3.eth.defaultAccount, gas:1000000}) - 1 ; // Add credential to list of all credentials
                    const credential =  await usersDeployedContract.methods.getCredentialById(credentialId).call({from: web3.eth.defaultAccount, gas:'1000000'}); // Add credential to list of all credentials
                    const newCredential = {id:credential.id, createdBy:credential.createdBy, data:credential.data, currentOwner:credential.currentOwner, isValid:credential.isValid, revocationReason:credential.revocationReason, createdAt:credential.createdAt, viewers:credential.viewers}
                    return res.json({credential:newCredential, success:true});
                }
                catch (e) {
                    return res.json({message:e.message, success: false});
                }
            })
        }
        else{
            return res.status(200).json({message: 'Please upload a file', success: false});
        }
    }
    catch(e){
        return res.json({message:e.message, success: false});
    }
    
})

// * Fetch Credential By Id
router.get('/getCredential', async(req, res, next)=> {
    const {credentialId} = req.query;
    try{
        const credential = await usersDeployedContract.methods.getCredentialById(credentialId).call({from: web3.eth.defaultAccount, gas:'100000'});
        const newCredential = {id:credential.id, createdBy:credential.createdBy, data:credential.data, currentOwner:credential.currentOwner, isValid:credential.isValid, revocationReason:credential.revocationReason, createdAt:credential.createdAt, viewers:credential.viewers}
        return res.status(200).json({credential: newCredential, success:true})
    }
    catch(e){
        return res.status(200).json({message:e.message, success:false})
    }
})

// * Transfer credential
router.post('/transfer', async (req, res, next) => {
    const {from:fromAddress, to:toAddress, credentialId, walletAddress} = req.body;
    
    try {
        const originalCredential = await usersDeployedContract.methods.getCredentialById(credentialId).call({from: web3.eth.defaultAccount, gas:'100000'});
        const fromUser = await usersDeployedContract.methods.getUserById(fromAddress);
        const toUser = await usersDeployedContract.methods.getUserById(toAddress);
        
        if(credential){
            if(toUser.id!==""){
                await usersDeployedContract.methods.transferCredential(originalCredential.id, fromAddress, toAddress).send({from: web3.eth.defaultAccount, gas:'100000'});
                const credential = await usersDeployedContract.methods.getCredentialById(originalCredential.id).call({from: web3.eth.defaultAccount, gas:'100000'});
                const newCredential = {id:credential.id, createdBy:credential.createdBy, data:credential.data, currentOwner:credential.currentOwner, isValid:credential.isValid, revocationReason:credential.revocationReason, createdAt:credential.createdAt, viewers:credential.viewers}
                return res.status(200).json({credential: newCredential, success:'true'})
            }
            else{
                return res.status(200).json({message:`User does not exist`, success:false})
            }
        }
        else{
            return res.status(200).json({message:`credential does not exist`, success:false})
        }
    }
    catch (e) {
        return res.status(200).json({message: e.message, success:false})
    }
})

// * Revoke Credential
router.post('/revoke', async(req,res,next)=>{
    const {credentialId, senderAddress, reason, walletAddress} = req.body;

    try{
        await usersDeployedContract.methods.revokeCredential(credentialId, senderAddress, reason).send({from: web3.eth.defaultAccount, gas:'100000'});
        const credential = await usersDeployedContract.methods.getCredentialById(credentialId).call({from:web3.eth.defaultAccount, gas:'100000'});
        const newCredential = {id:credential.id, createdBy:credential.createdBy, data:credential.data, currentOwner:credential.currentOwner, isValid:credential.isValid, revocationReason:credential.revocationReason, createdAt:credential.createdAt, viewers:credential.viewers}
        return res.status(200).json({credential: newCredential, success:true})
    }
    catch(e){
        return res.status(200).json({message:e.message, success:false})
    }
})

// * Selective Disclosure
router.post('/addViewer', async(req,res,next)=>{
    const {credentialId, viewerId, senderId, walletAddress} = req.body;
    try{
        await usersDeployedContract.methods.addViewerToCredential(credentialId, senderId, viewerId).send({from: web3.eth.defaultAccount, gas:'100000'});
        const credential = await usersDeployedContract.methods.getCredentialById(credentialId).call({from:web3.eth.defaultAccount, gas:'100000'});
        const newCredential = {id:credential.id, createdBy:credential.createdBy, data:credential.data, currentOwner:credential.currentOwner, isValid:credential.isValid, revocationReason:credential.revocationReason, createdAt:credential.createdAt, viewers:credential.viewers}
        return res.json({credential: newCredential, success:true});
    }
    catch(e){
        return res.status(200).json({message:e.message, success:false})
    }
})

module.exports = router;