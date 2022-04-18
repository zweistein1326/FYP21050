import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import {encrypt, decrypt} from './rsa/utils';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';



function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const ManageForm = ({rowInfo}) => {
  console.log("INSIDE MANAGEFORM");
  console.log(rowInfo);
  const baseUrl = "http://127.0.0.1:8000/"
  
  let publicKey;
  let privateKey;
  let retrievedString = localStorage.getItem('user')
  let user = retrievedString ? JSON.parse(retrievedString) : null;
  if(user){
    let publicks = localStorage.getItem('publicKey' + user.username) ? localStorage.getItem('publicKey' + user.username) : "";
    publicKey = (publicks === "") ? {} : JSON.parse(publicks);
    let pks = localStorage.getItem('privateKey' + user.username) ? localStorage.getItem('privateKey' + user.username) : "";
    privateKey = (pks === "") ? {} : JSON.parse(pks);
  }

  const [value, setValue] = React.useState(0);
  const [revokeCredentials, setRevokeCredentials] = useState([])
  const [shareCredentials, setShareCredentials] = useState([])
  const [transferCredentials, setTransferCredentials] = useState([])
  const [checkCredentials, setCheckCredentials] = useState([])
  const [credential, setCredentials] = useState([])
  const [docRevoke, setDocRevoke] = useState('')
  const [revokeReason, setRevokeReason] = useState('')
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(false);
  const [receiverAddress, setReceiverAddress] = useState('');
  const [dataTransfer, setDataTransfer] = useState('1');
  const [dataShare, setDataShare] = useState('1');
  const [dataRevoke, setDataRevoke] = useState('1');
  const [selectedDocShare, setSelectedDocShare] = useState(false);
  


  const accountChangeHandler = async(newAccount) => {
    setDefaultAccount(newAccount);
  }

  const handleChangeRevokeData = (event) => {
    setDataRevoke(event.target.value);
    console.log(event.target.value)
  };

  const handleChangeShareData = (event) => {
    setDataShare(event.target.value);
  };

  const handleChangeTransferData = (event) => {
    setDataTransfer(event.target.value);
  };

  const connectWalletHandler = () => {
    if(window.ethereum){
      window.ethereum.request({method:'eth_requestAccounts'}).then(async (result) => {
        await accountChangeHandler(result[0]);
      }).then(()=>{
      });
    }
    else{
      setErrorMessage('Install Metamask');
    }
  }
  

  console.log("KEYPAIR")
  console.log(publicKey)
  console.log(privateKey)
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleRevocation = async (event) =>{
    event.preventDefault();
    var credentialId = '' 
    const retrievedString = localStorage.getItem('user') || '';
    const user = JSON.parse(retrievedString);
    credentialId = docRevoke

    const payload = {
      credentialId, 
      senderAddress: user.id, 
      reason: revokeReason, 
      walletAddress: defaultAccount,
    }

    console.log(payload)
    const res = await axios.post(baseUrl+'revoke', payload)
    console.log('result of send',res.data)
    if(res.data.success){
      // handleClickOpen()
      setCheckCredentials([])
      setCredentials([])
      setShareCredentials([])
      setTransferCredentials([])
      setRevokeCredentials([])
      getCredentials()
    }
  }

  useEffect(()=>{ 
    connectWalletHandler();
    getCredentials();
  },[])

  const getCredentials = async () =>{
    const retrievedString = localStorage.getItem('user') || '';
    const user = JSON.parse(retrievedString);
    const res = await axios.get(baseUrl+'getFilesByUser?userId='+user.id)
    console.log(baseUrl+'getFilesByUser?userId='+user.id);
    console.log(res.data)
    res.data.credentials.forEach((i)=>{
      console.log(i)
      if(i.isValid === true){
        console.log('itemaas',i)
        setCredentials(oldData=> [...oldData, i.viewers[0].data.fileName])
        i.viewers.forEach((item)=>{                
          if(item.id === user.id){
            // console.log('checker',i)
            if(item.permissions.revoke){
              console.log('check checker')
              setRevokeCredentials(oldData=>[...oldData, i])              
            }
            if(item.permissions.share){
              setShareCredentials(oldData=>[...oldData, i])
            }
            if(item.permissions.transfer){
              setTransferCredentials(oldData=>[...oldData, i])
            }
          }
        })
        setCheckCredentials((oldData)=>[...oldData, i])
        console.log(i)
      }      
    })
  }

  const handleSelectiveDisclosure = async (event) =>{
    event.preventDefault();
    try {
      const credential = await axios.get(baseUrl+'getCredential?credentialId='+selectedDocShare) ;
      const receiver = await axios.get(baseUrl+'getUserById?userId='+receiverAddress);           
      let fileName = "";
      let assetHash = "";
      let metadataUrl = "";
      let decryptAssetHash = "";
      let decryptMetadataUrl ;

      credential.data.credential.viewers.forEach(async (item, index) => {
      console.log(item);
      if (item.id == user.id) {
        fileName = item.data.fileName;
        const receiverPublicKey = JSON.parse(receiver.data.user.publicKey)
        try {
          decryptAssetHash = await decrypt(item.data.assetHash, privateKey);
        } catch (e) {
          console.log(e)
        }
        try {
          decryptMetadataUrl = await decrypt(item.data.metadataUrl, privateKey);
        } catch (e) {
          console.log(e)
        }
        console.log(decryptAssetHash, decryptMetadataUrl)
        try {
          assetHash = await encrypt(decryptAssetHash, receiverPublicKey)
        } catch (e) {
          console.log(e)
        }
        try {
          metadataUrl = await encrypt(decryptMetadataUrl, receiverPublicKey)
        } catch (e) {
          console.log(e)
        }
        console.log(assetHash, metadataUrl)

        var dR = dataRevoke === '1'?true:false
        var dS = dataShare === '1'?true:false
        var dT = dataTransfer === '1'? true: false 
        const viewers = [{
          id: receiverAddress , 
          data:{
              fileName:fileName, 
              assetHash:assetHash, 
              metadataUrl:metadataUrl},
              permissions: {
                revoke:dR,
                share:dS,
                transfer: dT
              }
        }]

        const payload = {
          credentialId: selectedDocShare, 
          senderId: user.id, 
          viewers: viewers, 
          walletAddress: defaultAccount,
        }

        console.log('payload',payload)
        const res  = await axios.post(baseUrl+'addViewer', payload)
        console.log('result of send',res.data)
        if(res.data.success){
          // handleClickOpenSelectiveDisclosure()
          setCheckCredentials([])
          setCredentials([])
          getCredentials()
        }
      }
      })
    } catch(err) {
      console.log(err)
    }
  }

  const handleSubmitTransfer = async (event) =>{
    event.preventDefault();
      try{
          var credentialId = selectedDoc;
          event.preventDefault();
              const credential = await axios.get(baseUrl+'getCredential?credentialId='+credentialId) 
              const receiver = await axios.get(baseUrl+'getUserById?userId='+receiverAddress);           
              let fileName = "";
              let assetHash = "";
              let metadataUrl = "";
              let decryptAssetHash = "";
              let decryptMetadataUrl;
  
              console.log(credential, receiver)
             credential.data.credential.viewers.forEach(async(item, index)=>{
              console.log(item);
              if (item.id == user.id){
                  fileName = item.data.fileName;
                  const receiverPublicKey = JSON.parse(receiver.data.user.publicKey)
                  try{
                    decryptAssetHash = await decrypt(item.data.assetHash, privateKey);
                  }catch(e){
                    console.log(e)
                  }
                  try{
                    decryptMetadataUrl = await decrypt(item.data.metadataUrl, privateKey);
                  }catch(e){
                    console.log(e)
                  }
                  console.log(decryptAssetHash, decryptMetadataUrl)
                  try{
                    assetHash =  await encrypt(decryptAssetHash, receiverPublicKey)
                  }
                  catch(e){
                    console.log(e)
                  }
                  try{
                    metadataUrl = await encrypt(decryptMetadataUrl, receiverPublicKey)
                  }
                  catch(e){
                    console.log(e)
                  }
                  
                  console.log(assetHash, metadataUrl)
                  const viewer = {
                    id: receiverAddress, 
                    data:{
                        fileName: fileName,
                        assetHash,
                        metadataUrl
                      },
                    permissions: {
                      transfer: true,
                      share: true,
                      revoke: true
                    }
                  }
                  const payload = {
                    from: user.id, 
                    to:receiverAddress, 
                    credentialId:credentialId, 
                    walletAddress: defaultAccount,
                    viewer: viewer
                  }
                  console.log(payload)
                  const res = await axios.post(baseUrl+'transfer', payload)
                  console.log('result of send',res.data.success)
                  if(res.data.success){
                    console.log('checker')
                  }
                  return;
                }
                })
          } 
          catch(err) {
            console.error(err)
          } 
}
  
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Transfer" {...a11yProps(0)} />
          <Tab label="Revoke" {...a11yProps(1)} />
          <Tab label="Selective Disclosure" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
      <Typography variant='h5' display="block" gutterBottom>Transfer</Typography>
        <Box component="form" onSubmit={handleSubmitTransfer} noValidate sx={{ mt: 1  }}>
          <Grid container spacing={2} >
            <Grid item xs={4}>
              <Typography variant='subtitle1'>
                Choose the credential
              </Typography>
            </Grid>
            <br></br>
            <Grid item xs={8}>
              <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={transferCredentials}
                  // onChange={(event, value) => setSelectedDoc(value)}
                  onChange={(event, value) => {setSelectedDoc(value.id);console.log('vv',value.id)}}                        
                  renderInput={(params) => <TextField {...params} label="Credential"  />}
                  size='small'
                  getOptionLabel={option => option.viewers[0].data.fileName}
                  renderOption={(props, option) => {
                  return (
                  <li {...props} key={option.id}>
                    {option.viewers[0].data.fileName}
                    {/* {console.log(option)} */}
                  </li>
                  );
                }}
              />
            </Grid>        
            </Grid>
            <br></br>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography>Enter address of receiver</Typography>
              </Grid>
              <Grid item xs={8}>
                <TextField size="small" id="outlined-basic" label="Address" variant="outlined" style={{width:'100%'}} value={receiverAddress} onChange={(e)=>setReceiverAddress(e.target. value)} />      
              </Grid>
              <Grid item xs ={12}>
                <Button type='submit' variant="contained">Transfer</Button>
              </Grid>
              <br></br>
            </Grid>
        </Box>
      </TabPanel>
      <TabPanel value={value} index={1}>
      <Box component="form" onSubmit={handleRevocation} noValidate sx={{ mt: 1  }}>
        <Grid container spacing={2} >
            <Grid item xs={4}>
            <Typography variant='subtitle1'>
            Credential to Revoke
            </Typography>
            </Grid>
            <br></br>
            <Grid item xs={8} >
            <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={revokeCredentials}
                // options={credentials}
                onChange={(event, value) => {setDocRevoke(value.id);console.log('vv',value.id)}}                        
                renderInput={(params) => <TextField {...params} label="Credential"  />}
                size='small'
                getOptionLabel={option => option.viewers[0].data.fileName}
                renderOption={(props, option) => {
                  return (
                    <li {...props} key={option.id}>
                      {option.viewers[0].data.fileName}
                      {/* {console.log(option)} */}
                    </li>
                  );
                }}
            />
            </Grid>
            <Grid item xs={4}>
            <Typography variant='subtitle1'>
            Reason for revocation 
            </Typography>
            </Grid>
            <Grid item xs={8}><TextField size='small' style={{width:'100%'}} label="Reason" value={revokeReason} onChange={(e)=> setRevokeReason(e.target.value)} /></Grid>
            <Grid item xs={12}>

            <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Revoke
            </Button>
            </Grid>
        </Grid>
        </Box>
      </TabPanel>
      <TabPanel value={value} index={2}>
      <Typography variant='h5' display="block" gutterBottom>Selective Disclosure</Typography>
        <Box component="form" onSubmit={handleSelectiveDisclosure} noValidate sx={{ mt: 1  }}>
          <Grid container spacing={2} >
            <Grid item xs={6}>
              <Typography variant='subtitle1'>
                Choose the credential
              </Typography>
            </Grid>
            <br></br>
            <Grid item xs={6}>
              <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={shareCredentials}
                  onChange={(event, value) => {setSelectedDocShare(value.id);console.log('vv',value.id)}}                        
                  renderInput={(params) => <TextField {...params} label="Credential"  />}
                  size='small'
                  getOptionLabel={option => option.viewers[0].data.fileName}
                  renderOption={(props, option) => {
                  return (
                    <li {...props} key={option.id}>
                      {option.viewers[0].data.fileName}
                    </li>
                  );
                }}
              />
            </Grid>                        
          </Grid>
          <br></br>
          <Grid container spacing={2}>
          <br></br>
          <Grid item xs={6}>
            <Typography>Enter address of receiver</Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField size="small" id="outlined-basic" label="Address" variant="outlined" style={{width:'100%'}} value={receiverAddress} onChange={(e)=>setReceiverAddress(e.target.value)} />      
          </Grid>
          <Grid item xs={6}>
          <Typography>Choose Revocation Permission Status</Typography>
          </Grid>
          <Grid item xs={6}>
          <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={dataRevoke}
              label="Status"
              onChange={(e)=>handleChangeRevokeData(e)}
              size="small"

            >
              <MenuItem value={'1'}>True</MenuItem>
              <MenuItem value={'0'}>False</MenuItem>
            </Select>
          </Grid>
          {/* </Grid> */}
          <Grid item xs={6}>
          <Typography>Choose Share Permission Status</Typography>
          </Grid>
          <Grid item xs={6}>
          <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={dataShare}
              label="Status"
              onChange={(e)=>handleChangeShareData(e)}
              size="small"

            >
              <MenuItem value={'1'}>True</MenuItem>
              <MenuItem value={'0'}>False</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={6}>
          <Typography>Choose Transfer Permission Status</Typography>
          </Grid>
          <Grid item xs={6}>
          <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={dataTransfer}
              label="Status"
              onChange={(e)=>handleChangeTransferData(e)}
              size="small"

            >
              <MenuItem value={'1'}>True</MenuItem>
              <MenuItem value={'0'}>False</MenuItem>
            </Select>
          </Grid>
          <Grid item xs ={12}>
          <Button type='submit' variant="contained">Submit</Button>
          </Grid>
          <br></br>
      </Grid>
      </Box>
      </TabPanel>
    </Box>
  )
}

export default ManageForm;