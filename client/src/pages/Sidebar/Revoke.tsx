import { useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  Checkbox,
  Container,
  TextField,
  FormControlLabel,
  Link,
  Grid,
  Typography,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tabs, 
  Tab,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Button from '@mui/material/Button';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useMutation } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { REGISTER } from '../../graphql';
import { ethers } from 'ethers';
import axios, { AxiosResponse } from 'axios';
import Layout from './Layout'
import { AppState } from '../../store/configureStore'
import { connect, useSelector } from 'react-redux';


declare var window: any;


const RevokePage = () => {
  const state = useSelector((s: any)=> s.auth) 
  const [submitRegister, { loading, error }] = useMutation(REGISTER);
  const [errorMessage, setErrorMessage] = useState<any>(null);
  const [defaultAccount, setDefaultAccount] = useState<any>(null);
  const [userBalance, setUserBalance] = useState<any>(null);
  const [connButtonText, setConnButtonText] = useState('Connect Wallet');
  const [receiverAddress, setReceiverAddress] = useState<any>('')
  const [credentials, setCredentials] = useState<any[]>([])
  const [docRevoke, setDocRevoke] = useState<any>('')
  const [revokeReason, setRevokeReason] = useState<any>('')
  const [checkCredentials, setCheckCredentials] = useState<any>('')
  const [open, setOpen] = useState<any>(Boolean)
  const [openTransfer, setOpenTransfer] = useState<any>('')
  const [selectedDoc, setSelectedDoc] = useState<Boolean>(false)
  const [selectedDocShare, setSelectedDocShare] = useState<Boolean>(false)
  const [value, setValue] = useState<any>("1");
  const [fileId, setFileId] = useState<any>('')
  const [dataRevoke, setDataRevoke] = useState<any>('1')
  const [dataTransfer, setDataTransfer] = useState<any>('1')
  const [dataShare, setDataShare] = useState<any>('1')
  const [revokeCredentials, setRevokeCredentials] = useState<any[]>([])
  const [shareCredentials, setShareCredentials] = useState<any[]>([])
  const [transferCredentials, setTransferCredentials] = useState<any[]>([])


  const baseUrl = 'http://127.0.0.1:8000/'


  useEffect(()=>{ 
    connectWalletHandler();
    getCredentials();
    console.log(value,'value')
  },[])

  const handleChange = (event: any, newValue: number) => {
    setValue(newValue);
  };

  const getCredentials = async () =>{
    
    const retrievedString :any = localStorage.getItem('user') || '';
    const user = JSON.parse(retrievedString);
    const res : AxiosResponse<any> = await axios.get(baseUrl+'getFilesByUser?userId='+user.user.id)
    console.log(res.data,baseUrl+'getFilesByUser?userId'+user.user.id);
    res.data.credentials.forEach((i:any)=>{
      if(i.isValid === true){
        setCredentials(oldData=> [...oldData, i.viewers[0].data.fileName])
        i.viewers.forEach((item:any)=>{                
          if(item.id===user.user.id){
            console.log('checker',i)
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
        setCheckCredentials((oldData:any)=>[...oldData, i])
        console.log(i)
      }      
    })
  }

  const handleClickOpenTransfer =()=>{
    setOpenTransfer(true)
  }

  const handleClickCloseTransfer =()=>{
    setOpenTransfer(false)
  }

  
  const handleClickOpen =()=>{
    setOpen(true)
  }

  const handleClickClose =()=>{
    setOpen(false)
  }


  const handleClickOpenSelectiveDisclosure =()=>{
    setOpen(true)
  }

  const handleClickCloseSelectiveDisclosure =()=>{
    setOpen(false)
  }

  const connectWalletHandler = () => {
    if(window.ethereum){
      window.ethereum.request({method:'eth_requestAccounts'}).then(async (result:any[]) => {
        await accountChangeHandler(result[0]);
      }).then(()=>{
      });
    }
    else{
      setErrorMessage('Install Metamask');
    }
  }

  const accountChangeHandler = async(newAccount:any) => {
    setDefaultAccount(newAccount);
    getUserBalance(newAccount);
  }

  const getUserBalance = (address:any) =>{
    window.ethereum.request({method:'eth_getBalance', params:[address,'latest']}).then((balance:any)=>{
      console.log(balance);
      setUserBalance(ethers.utils.formatEther(balance));
    })
  }

  const handleSubmitTransfer = async (event:any) =>{
    event.preventDefault();
        try{
            var credentialId = selectedDoc;
            const retrievedString :any = localStorage.getItem('user') || '';
            const user = JSON.parse(retrievedString);
    
            const r : AxiosResponse<any> = await axios.get(baseUrl+'getCredential?credentialId='+credentialId)
            let fileName = "";
            let assetHash = "";
            let metadataUrl = "";

            r.data.credential.viewers.forEach((item:any)=>{
              if (item.id == user.user.id){
                fileName = item.data.fileName;
                assetHash = item.data.assetHash;
                metadataUrl = item.data.metadataUrl;
              }
            })
            const viewer = {
              id: receiverAddress, 
              data:{
                  fileName:fileName,
                  assetHash:assetHash,
                  metadataUrl:metadataUrl
                },
              permissions: {
                transfer: true,
                share: true,
                revoke: true
              }
            }
            const payload = {
              from: user.user.id, 
              to:receiverAddress, 
              credentialId:credentialId, 
              walletAddress: defaultAccount,
              viewer: viewer
            }
            console.log(payload)
            const res : AxiosResponse<any> = await axios.post(baseUrl+'transfer', payload)
            console.log('result of send',res.data.success)
            if(res.data.success){
              console.log('checker')
              handleClickOpenTransfer()
            }
        } catch(err) {
          console.error(err)
        } 
  }


  
  const handleRevocation = async (event:any) =>{
    event.preventDefault();

    var credentialId = '' 
    const retrievedString :any = localStorage.getItem('user') || '';
    const user = JSON.parse(retrievedString);
    credentialId = docRevoke

    const payload = {
      credentialId, 
      senderAddress: user.user.id, 
      reason: revokeReason, 
      walletAddress: defaultAccount,
    }
    console.log(payload)
    const res : AxiosResponse<any> = await axios.post(baseUrl+'revoke', payload)
    console.log('result of send',res.data)
    if(res.data.success){
      handleClickOpen()
      setCheckCredentials([])
      setCredentials([])
      setShareCredentials([])
      setTransferCredentials([])
      setRevokeCredentials([])
      getCredentials()

    }
  }

  const handleChangeRevokeData = (event: SelectChangeEvent) => {
    setDataRevoke(event.target.value);
    console.log(event.target.value)
  };
  const handleChangeTransferData = (event: SelectChangeEvent) => {
    setDataTransfer(event.target.value);
  };

  const handleChangeShareData = (event: SelectChangeEvent) => {
    setDataShare(event.target.value);
  };

  const handleSelectiveDisclosure = async (event:any) =>{
    event.preventDefault();
    var credentialId = selectedDocShare
    var fileName = ''
    var assetHash = ''
    var metadataUrl = ''
    const retrievedString :any = localStorage.getItem('user') || '';
    const user = JSON.parse(retrievedString);

    checkCredentials.forEach((i:any)=>{    
        console.log('item',i)
        fileName = i.viewers[0].data.fileName
        assetHash = i.viewers[0].data.assetHash
        metadataUrl = i.viewers[0].data.metadataUrl
        console.log('check',i, )
    })
    
    var dR = dataRevoke === '1'?true:false
    var dS = dataShare === '1'?true:false
    var dT = dataTransfer === '1'? true: false 


    const viewers = [{
      id: receiverAddress , 
      data:{
          fileName:fileName, assetHash:assetHash, metadataUrl:metadataUrl},
          permissions:{revoke:dR, share:dS, transfer: dT}
    }]


    const payload = {
      credentialId, 
      senderId: user.user.id, 
      viewers: viewers, 
      walletAddress: defaultAccount,
    }

    console.log('payload',payload)
    const res : AxiosResponse<any> = await axios.post(baseUrl+'addViewer', payload)
    console.log('result of send',res.data)
    if(res.data.success){
      handleClickOpenSelectiveDisclosure()
      setCheckCredentials([])
      setCredentials([])
      getCredentials()
    }
  }

  
  return (
    <Layout>
      <Dialog
        open={open}
        onClose={handleClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Revocation Completed"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Your file has been revoked.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickClose}>Okay</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={open}
        onClose={handleClickCloseSelectiveDisclosure}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Revocation Completed"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            The credentials have been updated.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickClose}>Okay</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openTransfer}
        onClose={handleClickCloseTransfer}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Credential Transferred"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Your credential has been transferred.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickCloseTransfer}>Okay</Button>
        </DialogActions>
      </Dialog>
      <br></br>
      <Typography variant='h5' display="block" gutterBottom>Manage</Typography>
      
      
    <Container component="main" >
      <Box
        sx={{
          marginTop: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Card sx={{width:'70%'}}>
        <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Revoke" value="1" />
            <Tab label="Transfer" value="2" />
            <Tab label="Selective Disclosure" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
        <Typography variant='h5' display="block" gutterBottom>Revocation</Typography>
<Box component="form" onSubmit={handleRevocation} noValidate sx={{ mt: 1  }}>
<Grid container spacing={2} >
    <Grid item xs={4}>
    <Typography variant='subtitle1'>
    Choose the credential
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
        <TabPanel value="2">
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

                          // sx={{ width: }}
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
                        <TextField size="small" id="outlined-basic" label="Address" variant="outlined" style={{width:'100%'}} value={receiverAddress} onChange={(e)=>setReceiverAddress(e.target.value)} />      
                        </Grid>
                        <Grid item xs ={12}>
                        <Button type='submit' variant="contained">Transfer</Button>
                        </Grid>
                        <br></br>
                    </Grid>
                    </Box>
        </TabPanel>
        <TabPanel value="3">
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
                          // onChange={(event, value) => setSelectedDocShare(value.id)}
                          onChange={(event, value) => {setSelectedDocShare(value.id);console.log('vv',value.id)}}                        

                          // sx={{ width: }}
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
                      <br></br>
                        <Grid item xs={6}>
                            <Typography>Enter address of receiver</Typography>
                        </Grid>
                        <Grid item xs={6}>
                        <TextField size="small" id="outlined-basic" label="Address" variant="outlined" style={{width:'100%'}} value={receiverAddress} onChange={(e)=>setReceiverAddress(e.target.value)} />      

                        </Grid>
                        {/* <Grid container spacing={2}> */}
                        

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
                            onChange={(e:any)=>handleChangeRevokeData(e)}
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
                            onChange={(e:any)=>handleChangeShareData(e)}
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
                            onChange={(e:any)=>handleChangeTransferData(e)}
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
      </TabContext>
      </Card>
     </Box>
    </Container>
    </Layout>
  );
};

export default RevokePage;

