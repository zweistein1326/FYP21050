const fs = require('fs');
const router = require('express').Router();
const {addFile, encrypt, decrypt} = require('./helperFunctions')
const oneID = require('../../blockchain/build/contracts/OneID.json');
const Web3 = require('web3');

var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545/'));
var oneIdDeployedContract = new web3.eth.Contract(oneID.abi, oneID.networks[5777].address);

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
    
    const {username, walletAddress, publicKey, isAdmin} = req.body;
    try{
        const tx = await oneIdDeployedContract.methods.createNewUser(username, walletAddress, publicKey, isAdmin).send({from: walletAddress, gas:4000000});
        console.log('GAS REGISTER', tx.gasUsed)
        const user = await oneIdDeployedContract.methods.getUserByUsername(username).call({from: web3.eth.defaultAccount, gas:4000000});
        const returnUser = {id:user.id, username:user.username, publicKey:user.publicKey, credentialIds:user.credentialIds, publicKey: user.publicKey, isAdmin: user.isAdmin}
        return res.status(200).json({user: returnUser, success: true})
    }
    catch(e){
        return res.status(200).json({message:e.message, success:false})
    }
})

// * Login
router.post('/login', async (req, res, next) => {
    const {username, walletAddress} = req.body;
    try{
        const user = await oneIdDeployedContract.methods.getUserByUsername(username).call({from: web3.eth.defaultAccount, gas:400000});
        if(user.walletAddress.toLowerCase() == walletAddress.toLowerCase()){
            const returnUser = {id:user.id, username:user.username, publicKey:user.publicKey, credentialIds:user.credentialIds, publicKey: user.publicKey, isAdmin: user.isAdmin}
            return res.status(200).json({user: returnUser, success:true});
        }
        return res.status(200).json({message:'Login Failed',success:false});
    }
    catch(e){
        return res.status(200).json({message:e.message, success:false})
    }
})

router.get('/getUserById', async (req, res, next)=>{
    const userId = req.query.userId;
    try{
        const user = await oneIdDeployedContract.methods.getUserById(userId).call({from:web3.eth.defaultAccount, gas:400000});
        const returnUser = {id:user.id, username:user.username, publicKey:user.publicKey, credentialIds:user.credentialIds, publicKey: user.publicKey, isAdmin: user.isAdmin}
        return res.status(200).json({user: returnUser, success:true})
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
        const user = await oneIdDeployedContract.methods.getUserById(userId).call({from:web3.eth.defaultAccount, gas:400000});

        if(user.credentialIds.length>0){
            user.credentialIds.forEach(async(credentialId,index)=>{
                const credential = await oneIdDeployedContract.methods.getCredentialById(credentialId).call({from:web3.eth.defaultAccount, gas:400000});
                const newCredential = {id:credential.id, createdBy:credential.createdBy, currentOwner:credential.currentOwner, isValid:credential.isValid, revocationReason:credential.revocationReason, createdAt:credential.createdAt, viewers:credential.viewers.map((viewer)=>({id:viewer.id, data:{fileName:viewer.data.fileName, assetHash:viewer.data.assetHash, metadataUrl: viewer.data.metadataUrl}, permissions:{transfer: viewer.permissions.transfer, share:viewer.permissions.share, revoke: viewer.permissions.revoke}}))}
                userCredentials.push(newCredential);
                if(index == user.credentialIds.length-1)
                {
                    // console.log(userCredentials);
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
    const { senderAddress, walletAddress, viewers } = req.body;
    // viewers = [{id:string, data:{fileName:string, assetHash:string, metadataUrl:string}, permissions:{revoke:boolean, share:boolean, transfer: boolean}}]
    // console.log(req.body);
    try{
        const tx = await oneIdDeployedContract.methods.addCredential(senderAddress, Date.now().toString(), viewers).send({from: walletAddress, gas:5000000}); // Add credential to list of all credentials
        console.log('GAS CREATE NEW CREDENTIAL', tx.gasUsed)
        const credentialId = await oneIdDeployedContract.methods.addCredential(senderAddress, Date.now().toString(), viewers).call({from: web3.eth.defaultAccount, gas:5000000}) - 1 ; // Add credential to list of all credentials
        const credential =  await oneIdDeployedContract.methods.getCredentialById(credentialId).call({from: web3.eth.defaultAccount, gas:4000000}); // Add credential to list of all credentials
        const newCredential = {id:credential.id, createdBy:credential.createdBy, currentOwner:credential.currentOwner, isValid:credential.isValid, revocationReason:credential.revocationReason, createdAt:credential.createdAt, viewers:credential.viewers.map((viewer)=>({id:viewer.id, data:{fileName:viewer.data.fileName, assetHash:viewer.data.assetHash, metadataUrl: viewer.data.metadataUrl}, permissions:{transfer: viewer.permissions.transfer, share:viewer.permissions.share, revoke: viewer.permissions.revoke}}))}
        return res.json({credential:newCredential, success:true});
    }
    catch(e){
        return res.json({message:e.message, success: false});
    }
    
})

// * Fetch Credential By Id
router.get('/getCredential', async(req, res, next)=> {
    const {credentialId} = req.query;
    try{
        const credential = await oneIdDeployedContract.methods.getCredentialById(credentialId).call({from: web3.eth.defaultAccount, gas:400000});
        const newCredential = {id:credential.id, createdBy:credential.createdBy, currentOwner:credential.currentOwner, isValid:credential.isValid, revocationReason:credential.revocationReason, createdAt:credential.createdAt, viewers:credential.viewers.map((viewer)=>(
            {id:viewer.id, data:{fileName:viewer.data.fileName, assetHash:viewer.data.assetHash, metadataUrl: viewer.data.metadataUrl}, permissions:{transfer: viewer.permissions.transfer, share:viewer.permissions.share, revoke: viewer.permissions.revoke}}))}
        return res.status(200).json({credential: newCredential, success:true})
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