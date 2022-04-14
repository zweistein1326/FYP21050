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
} from '@mui/material';
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
  const navigate = useNavigate();
  const state = useSelector((s: any)=> s.auth) 
  const [message, setMessage] = useState<string>('');
  const [submitRegister, { loading, error }] = useMutation(REGISTER);
  const [errorMessage, setErrorMessage] = useState<any>(null);
  const [defaultAccount, setDefaultAccount] = useState<any>(null);
  const [userBalance, setUserBalance] = useState<any>(null);
  const [connButtonText, setConnButtonText] = useState('Connect Wallet');
  const [file,setFile] = useState<File | null>(null);
  const [receiverAddress, setReceiverAddress] = useState<any>('')
  const [credentials, setCredentials] = useState<any[]>([])
  const [docRevoke, setDocRevoke] = useState<any>('')
  const [revokeReason, setRevokeReason] = useState<any>('')
  const [checkCredentials, setCheckCredentials] = useState<any>('')
  const [open, setOpen] = useState<any>('')
  const baseUrl = 'http://127.0.0.1:8000/'


  useEffect(()=>{ 
    connectWalletHandler();
    getCredentials();
  },[])

  const getCredentials = async () =>{
    const retrievedString :any = localStorage.getItem('user') || '';
    const user = JSON.parse(retrievedString);
    const res : AxiosResponse<any> = await axios.get(baseUrl+'getFilesByUser?userId='+user.user.id)
    console.log(res.data,baseUrl+'getFilesByUser?userId'+user.user.id);
    res.data.credentials.forEach((i:any)=>{
      if(i.isValid === true){
        setCredentials(oldData=>[...oldData, i.data[0]] )
      setCheckCredentials((oldData:any)=>[...oldData, i])
      }
    })
    
  }

  const handleClickOpen =()=>{
    setOpen(true)
  }

  const handleClickClose =()=>{
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

  
  const handleRevocation = async (event:any) =>{
    event.preventDefault();

    var credentialId = '' 
    const retrievedString :any = localStorage.getItem('user') || '';
    const user = JSON.parse(retrievedString);
    checkCredentials.map((i:any)=>{      
      if(i.data[0] === docRevoke){
        credentialId = i.id
      }
    })
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
      
    <Container component="main" maxWidth="sm" >
      <Box
        sx={{
          marginTop: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box component="form" onSubmit={handleRevocation} noValidate sx={{ mt: 1, marginBottom:3 }}>
          <Typography variant='h5' display="block" gutterBottom>Revocation</Typography>
          <Card sx={{width: '100%'}}>
            <Grid container spacing={2} sx={{width:600, margin:'15px'}}>
                <Grid item xs={6}>
                <Typography variant='subtitle1'>
                Choose the credential
                </Typography>
                </Grid>
                <Grid item xs={6}>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={credentials}
                    onChange={(event, value) => setDocRevoke(value)}
                    
                    renderInput={(params) => <TextField {...params} label="Credential"  />}
                    size='small'
                />
                </Grid>
                <Grid item xs={12}><TextField style={{width:'60%'}} label="Reason" value={revokeReason} onChange={(e)=> setRevokeReason(e.target.value)} /></Grid>
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
              </Card>
      </Box>
      </Box>
    </Container>
    </Layout>
  );
};

export default RevokePage;

