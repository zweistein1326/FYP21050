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
        const tx = await usersDeployedContract.methods.createNewUser(username, walletAddress, publicKey).send({from: walletAddress, gas:1000000});
        // web3.eth.accounts.signTransaction(tx);
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
    const {username, walletAddress} = req.body;
    try{
        const user = await usersDeployedContract.methods.getUserByUsername(username).call({from: web3.eth.defaultAccount, gas:100000});
        if(user.walletAddress == walletAddress){
            const returnUser = {id:user.id, username:user.username, walletAddress:user.walletAddress, credentialIds:user.credentialIds}
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
        const user = await usersDeployedContract.methods.getUserById(userId).call({from:web3.eth.defaultAccount, gas:100000});
        console.log(user)

        if(user.credentialIds.length>0){
            user.credentialIds.forEach(async(credentialId,index)=>{
                const credential = await usersDeployedContract.methods.getCredentialById(credentialId).call({from:web3.eth.defaultAccount, gas:100000});
                const newCredential = {id:credential.id, createdBy:credential.createdBy, currentOwner:credential.currentOwner, isValid:credential.isValid, revocationReason:credential.revocationReason, createdAt:credential.createdAt, viewers:credential.viewers.map((viewer)=>({id:viewer.id, data:{fileName:viewer.data.fileName, assetHash:viewer.data.assetHash, metadataUrl: viewer.data.metadataUrl}, permissions:{transfer: viewer.permissions.transfer, share:viewer.permissions.share, revoke: viewer.permissions.revoke}}))}
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
    const { senderAddress, walletAddress, viewers } = req.body;
    // viewers = [{id:string, data:{fileName:string, assetHash:string, metadataUrl:string}, permissions:{revoke:boolean, share:boolean, transfer: boolean}}]

    try{
        const tx = await usersDeployedContract.methods.addCredential(senderAddress, Date.now().toString(), JSON.parse(viewers)).send({from: walletAddress, gas:1000000}); // Add credential to list of all credentials
        const credentialId = await usersDeployedContract.methods.addCredential(senderAddress, Date.now().toString(), JSON.parse(viewers)).call({from: web3.eth.defaultAccount, gas:1000000}) - 1 ; // Add credential to list of all credentials
        const credential =  await usersDeployedContract.methods.getCredentialById(credentialId).call({from: web3.eth.defaultAccount, gas:'1000000'}); // Add credential to list of all credentials
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
        const credential = await usersDeployedContract.methods.getCredentialById(credentialId).call({from: web3.eth.defaultAccount, gas:100000});
        const newCredential = {id:credential.id, createdBy:credential.createdBy, currentOwner:credential.currentOwner, isValid:credential.isValid, revocationReason:credential.revocationReason, createdAt:credential.createdAt, viewers:credential.viewers.map((viewer)=>({id:viewer.id, data:{fileName:viewer.data.fileName, assetHash:viewer.data.assetHash, metadataUrl: viewer.data.metadataUrl}, permissions:{transfer: viewer.permissions.transfer, share:viewer.permissions.share, revoke: viewer.permissions.revoke}}))}
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
        const originalCredential = await usersDeployedContract.methods.getCredentialById(credentialId).call({from: web3.eth.defaultAccount, gas:100000});
        const fromUser = await usersDeployedContract.methods.getUserById(fromAddress).call({from: web3.eth.defaultAccount, gas:100000});
        const toUser = await usersDeployedContract.methods.getUserById(toAddress).call({from: web3.eth.defaultAccount, gas:100000});
        
        if(toUser.id!==""){
            await usersDeployedContract.methods.transferCredential(originalCredential.id, fromAddress, toAddress,{fileName:'',assetHash:'', metadataUrl:''},{revoke:false, share:true, transfer:true}).send({from: walletAddress, gas:2000000});
            const credential = await usersDeployedContract.methods.getCredentialById(originalCredential.id).call({from: web3.eth.defaultAccount, gas:100000});
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
        await usersDeployedContract.methods.revokeCredential(credentialId, senderAddress, reason).send({from: walletAddress, gas:100000});
        const credential = await usersDeployedContract.methods.getCredentialById(credentialId).call({from:web3.eth.defaultAccount, gas:100000});
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
        await usersDeployedContract.methods.addViewerToCredential(credentialId, senderId, viewers).send({from: walletAddress, gas:900000});
        const credential = await usersDeployedContract.methods.getCredentialById(credentialId).call({from:web3.eth.defaultAccount, gas:00000});
        const newCredential = {id:credential.id, createdBy:credential.createdBy, currentOwner:credential.currentOwner, isValid:credential.isValid, revocationReason:credential.revocationReason, createdAt:credential.createdAt, viewers:credential.viewers.map((viewer)=>({id:viewer.id, data:{fileName:viewer.data.fileName, assetHash:viewer.data.assetHash, metadataUrl: viewer.data.metadataUrl}, permissions:{transfer: viewer.permissions.transfer, share:viewer.permissions.share, revoke: viewer.permissions.revoke}}))}
        return res.json({credential: newCredential, success:true});
    }
    catch(e){
        return res.status(200).json({message:e.message, success:false})
    }
})

module.exports = router;