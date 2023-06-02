const fs = require('fs');
const router = require('express').Router();
const {addFile, encrypt, decrypt, sha256hash} = require('./helperFunctions')
const oneID = require('../../blockchain/build/contracts/OneID.json');
const credVerify = require('../../blockchain/build/contracts/CredVerify.json');
const Web3 = require('web3');

var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545/'));
// var oneIdDeployedContract = new web3.eth.Contract(oneID.abi, oneID.networks[5777].address);
var credVerifyDeployedContract = new web3.eth.Contract(credVerify.abi, credVerify.networks[5777].address);

const setDefaultAccount = async () => {
    var account = await web3.eth.getAccounts();
    web3.eth.defaultAccount = account[0];
}

setDefaultAccount()

/* --------------------------API Endpoints-------------------------- */

router.get('/', async(req,res,next)=>{
    return res.send('Server running')
})

// * Register
router.post('/register', async (req, res, next) => {
    
    const { address, email }   = req.body;
    try{
        const user = await credVerifyDeployedContract.methods.getUserByAddress(address, email).call({from: web3.eth.defaultAccount, gas:4000000});
        if(user){
            const returnUser = {address: address, credentialIds:user.credentialIds}
            return res.status(200).json({user: returnUser, success: true})
        } else { 
            const tx = await credVerifyDeployedContract.methods.createNewUser(address).send({from: address, gas:4000000});
            const returnUser = {address: address, credentialIds: []}
            return res.status(200).json({user: returnUser, success: true})
        }
    }
    catch(e){
        return res.status(200).json({message:e.message, success:false})
    }
})

// * Login
router.post('/login', async (req, res, next) => {
    const { address } = req.body;
    // check if the user has correct credentials to login
    // if yes, return user details else retrn error
    try{
        const user = await credVerifyDeployedContract.methods.getUserByAddress(address).call({from: web3.eth.defaultAccount, gas:400000});
        if(user){
            const returnUser = {address: address, credentialIds:user.credentialIds};
            return res.status(200).json({user: returnUser, success:true});
        }
        return res.status(200).json({message:'Login Failed',success:false});
    }
    catch(e){
        return res.status(200).json({message:e.message, success:false})
    }
})

router.get('/user', async (req, res, next)=>{
    const { address } = req.query;
    try{
        const user = await credVerifyDeployedContract.methods.getUserByAddress(address).call({from:web3.eth.defaultAccount, gas:400000});
        const returnUser = { address: address, credentialIds:user.credentialIds }
        return res.status(200).json({user: returnUser, success:true})
    }
    catch(e){
        return res.status(200).json({message:e.message, success:false})
    }
})

router.post('/credential', async (req, res, next)=>{
    const { address, data } = req.body;
    try {
        let credential_hash = sha256hash(data + Date.now().toString());
        const tx = await credVerifyDeployedContract.methods.addCredential(credential_hash, address, Date.now().toString(), data, []).send({from: web3.eth.defaultAccount, gas:4000000});
        const [owners, viewers, created_at, _data, issuedBy] = await credVerifyDeployedContract.methods.addCredential(credential_hash, address, Date.now().toString(), data, []).call({from: web3.eth.defaultAccount, gas:4000000});
        return res.status(200).json({credential: {id: credential_hash, owners, data: _data, created_at, viewers, issuedBy} ,success:true})
    } catch (e) {
        console.log(e);
    }
})

// * Get credentials by User
router.get('/credentials',async(req,res,next)=>{
    const { address } = req.query; 
    try{
        const user = await credVerifyDeployedContract.methods.getUserByAddress(address).call({from:web3.eth.defaultAccount, gas:400000});
        let credentials = [];
        if(user) {
            let credential_headers = user.credentialIds.map( async (cred_id) => {
                // GET CREDENTIAL HEADERS BY CREDENTIAL ID
                const [owners, viewers, created_at, data, issuedBy] = await credVerifyDeployedContract.methods.getCredentialById(cred_id).call({from: web3.eth.defaultAccount, gas:400000});
                return {id: cred_id, owners, data, created_at, viewers, issuedBy};
            })
            credentials = await Promise.all(credential_headers);
        }
        // GET CREDENTIAL HEADERS 
        return res.status(200).json({address: address, credentials: credentials ?? [], success:true})
    }
    catch(e){
        return res.json({message:e.message, success:false})
    }
})

// * Fetch Credential By Id
router.get('/credential', async(req, res, next)=> {
    const {id} = req.query;
    try{
        const [owners, viewers, created_at, data, issuedBy] = await credVerifyDeployedContract.methods.getCredentialById(id).call({from: web3.eth.defaultAccount, gas:400000});
        return res.status(200).json({credential: {id: id, owners, data, created_at, viewers, issuedBy} ,success:true})
    }
    catch(e){
        return res.status(200).json({message:e.message, success:false})
    }
})

// * Transfer credential
router.post('/transfer', async (req, res, next) => {
    const {from:fromAddress, to:toAddress, credentialId, walletAddress, viewer} = req.body;
    
    try {
        const originalCredential = await oneIdDeployedContract.methods.getCredentialById(credentialId).call({from: web3.eth.defaultAccount, gas:400000});
        const fromUser = await oneIdDeployedContract.methods.getUserById(fromAddress).call({from: web3.eth.defaultAccount, gas:400000});
        const toUser = await oneIdDeployedContract.methods.getUserById(toAddress).call({from: web3.eth.defaultAccount, gas:400000});
        
        if(toUser.id!==""){
            const tx = await oneIdDeployedContract.methods.transferCredential(originalCredential.id, fromAddress, toAddress,viewer.data,viewer.permissions).send({from: walletAddress, gas:4000000});
            console.log('GAS TRANSFER CREDENTIAL', tx.gasUsed)
            const credential = await oneIdDeployedContract.methods.getCredentialById(originalCredential.id).call({from: web3.eth.defaultAccount, gas:400000});
            const newCredential = {id:credential.id, createdBy:credential.createdBy, currentOwner:credential.currentOwner, isValid:credential.isValid, revocationReason:credential.revocationReason, createdAt:credential.createdAt, viewers:credential.viewers.map((viewer)=>({id:viewer.id, data:{fileName:viewer.data.fileName, assetHash:viewer.data.assetHash, metadataUrl: viewer.data.metadataUrl}, permissions:{transfer: viewer.permissions.transfer, share:viewer.permissions.share, revoke: viewer.permissions.revoke}}))}
            return res.status(200).json({credential: newCredential, success:'true'})
        }
        else{
            return res.status(200).json({message:`User does not exist`, success:false})
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
        const tx = await oneIdDeployedContract.methods.revokeCredential(credentialId, senderAddress, reason).send({from: walletAddress, gas:900000});
        console.log('GAS REVOKE CREDENTIAL', tx.gasUsed)
        const credential = await oneIdDeployedContract.methods.getCredentialById(credentialId).call({from:web3.eth.defaultAccount, gas:900000});
        const newCredential = {id:credential.id, createdBy:credential.createdBy, currentOwner:credential.currentOwner, isValid:credential.isValid, revocationReason:credential.revocationReason, createdAt:credential.createdAt, viewers:credential.viewers.map((viewer)=>({id:viewer.id, data:{fileName:viewer.data.fileName, assetHash:viewer.data.assetHash, metadataUrl: viewer.data.metadataUrl}, permissions:{transfer: viewer.permissions.transfer, share:viewer.permissions.share, revoke: viewer.permissions.revoke}}))}
        return res.status(200).json({credential: newCredential, success:true})
    }
    catch(e){
        return res.status(200).json({message:e.message, success:false})
    }
})

// * Selective Disclosure
router.post('/addViewer', async(req,res,next)=>{
    const {credentialId, viewers, senderId, walletAddress} = req.body;
    try{
        const tx = await oneIdDeployedContract.methods.addViewerToCredential(credentialId, senderId, viewers).send({from: walletAddress, gas:900000});
        console.log('GAS SHARE CREDENTIAL', tx.gasUsed)
        const credential = await oneIdDeployedContract.methods.getCredentialById(credentialId).call({from:web3.eth.defaultAccount, gas:900000});
        const newCredential = {id:credential.id, createdBy:credential.createdBy, currentOwner:credential.currentOwner, isValid:credential.isValid, revocationReason:credential.revocationReason, createdAt:credential.createdAt, viewers:credential.viewers.map((viewer)=>({id:viewer.id, data:{fileName:viewer.data.fileName, assetHash:viewer.data.assetHash, metadataUrl: viewer.data.metadataUrl}, permissions:{transfer: viewer.permissions.transfer, share:viewer.permissions.share, revoke: viewer.permissions.revoke}}))}
        return res.json({credential: newCredential, success:true});
    }
    catch(e){
        return res.status(200).json({message:e.message, success:false})
    }
})

module.exports = router;