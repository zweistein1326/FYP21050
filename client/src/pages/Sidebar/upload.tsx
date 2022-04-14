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
  Alert,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import Button from '@mui/material/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import { REGISTER } from '../../graphql';
import { ethers } from 'ethers';
import axios, { AxiosResponse } from 'axios';
import Layout from './Layout'
import { AppState } from '../../store/configureStore'
import { connect, useSelector } from 'react-redux';


declare var window: any;


const UploadPage = () => {
  const navigate = useNavigate();
  const state = useSelector((s: any)=> s.auth) 
  const [errorMessage, setErrorMessage] = useState<any>(null);
  const [defaultAccount, setDefaultAccount] = useState<any>(null);
  const [userBalance, setUserBalance] = useState<any>(null);
  const [file,setFile] = useState<File | null>(null);
  const [receiverAddress, setReceiverAddress] = useState<any>('')
  const [credentials, setCredentials] = useState<any[]>([])
  const [checkCredentials, setCheckCredentials] = useState<any[]>([])
  const [open, setOpen] = useState<any>('')
  const [openTransfer, setOpenTransfer] = useState<any>('')
  const [selectedDoc, setSelectedDoc] = useState<Boolean>(false)
  const [filePlaceholder, setFilePlaceholder] = useState<any>('Upload File')
  const baseUrl = 'http://127.0.0.1:8000/'

  const handleClickOpen =()=>{
    setOpen(true)
  }

  const handleClickOpenTransfer =()=>{
    setOpenTransfer(true)
  }

  const handleClickClose =()=>{
    setOpen(false)
  }
  const handleClickCloseTransfer =()=>{
    setOpenTransfer(false)
  }

  useEffect(()=>{
    connectWalletHandler();
    getCredentials()
  },[state])

  const getCredentials = async () =>{
    
    const retrievedString :any = localStorage.getItem('user') || '';
    const user = JSON.parse(retrievedString);
    const res : AxiosResponse<any> = await axios.get(baseUrl+'getFilesByUser?userId='+user.user.id)
    console.log(res.data,baseUrl+'getFilesByUser?userId'+user.user.id);
    res.data.credentials.forEach((i:any)=>{
      if(i.isValid === true){
        setCredentials(oldData=> [...oldData, i.data[0]] )
        setCheckCredentials(oldData=>[...oldData, i])
      }
      
    })
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

  const onFileUpload = (event:any) => {
    event.preventDefault();
    setFile(event.target.files[0]);
    setFilePlaceholder(event.target.files[0].name);
    console.log(event.target.files[0]);
  }

  const handleSubmitTransfer = async (event:any) =>{
    event.preventDefault();
        try{
            var credentialId = '';
            checkCredentials.map((i:any)=>{      
              if(i.data[0] === selectedDoc){
                credentialId = i.id
                console.log('check')
              }
            })
            const retrievedString :any = localStorage.getItem('user') || '';
            const user = JSON.parse(retrievedString);
    
            const payload = {
              from: user.user.id, 
              to:receiverAddress, 
              credentialId, 
              walletAddress: defaultAccount
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


  const handleSubmitFile = async (event:any) => {
    event.preventDefault();
    console.log('file',file);
    var bodyFormData = new FormData();
    if(file!==null){
        try{
            const retrievedString :any = localStorage.getItem('user') || '';
            const user = JSON.parse(retrievedString);
            const formData = new FormData()
            formData.append('inputFile',file) 
            formData.append('walletAddress', defaultAccount)
            formData.append('senderAddress',user.user.id)     
            const res : AxiosResponse<any> = await axios.post(baseUrl+'upload', formData)
            console.log('result of send',res.data)
            if(res.data.success === true){
              console.log("check")
              handleClickOpen()
              setFilePlaceholder('Upload File')
              setCheckCredentials([])
              setCredentials([])
              getCredentials()
            }
        
        } catch(err) {
          console.error(err)
        }
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
          {"Upload Completed"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Your file has been uploaded.
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
    
    <Container component="main"  >
      <Box
        sx={{
          marginTop: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
      <Typography variant='h5' display="block" gutterBottom>Upload and Transfer</Typography>
      <Grid container spacing={2}>
      <Grid item xs={12}>

        <Box component="form" noValidate sx={{ mt: 1, marginBottom:3 }}>
                    <Card sx={{width: '100%'}}>
                        <Typography variant='h6' display="block" gutterBottom>
                            Account Details
                        </Typography>
                        <CardContent>
                            Address: {defaultAccount}
                        </CardContent>
                    <Typography variant="button" display="block" gutterBottom>Balance: {userBalance}</Typography>
                    </Card>
                
          
        </Box>
        </Grid>    
                <Grid item xs = {6}>
                <Card sx={{width: '100%'}} >
                    <Box component="form" onSubmit={handleSubmitFile} noValidate sx={{ mt: 1, marginBottom:3  }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <br></br>
                        <Typography variant='h6' display="block" gutterBottom color="text.secondary" style={{ fontWeight: 600 }}>
                        File Upload
                        </Typography>
                        </Grid>
                        <Box sx={{ width: '100%', typography: 'body1' }}>
                        <Grid item xs={12}>
                        <br></br>
                            <input type="file" id="file" name="file" placeholder={filePlaceholder} onChange={onFileUpload}/>
                            </Grid>
                            <Grid item xs={12}>
                                <br></br>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Submit File
                            </Button>
                            </Grid>
                            <br></br>
                        </Box>                    
                    </Grid>
                    </Box>
                </Card>
                </Grid>
                <Grid item xs={6}>
                <Card sx={{width: '100%'}}>
                  <br></br>
                    <Typography variant='h6' display="block" gutterBottom color="text.secondary" style={{ fontWeight: 600 }}>
                        Transfer
                    </Typography>
                    <CardContent>
                    <Box component="form" onSubmit={handleSubmitTransfer} noValidate sx={{ mt: 1  }}>
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
                          options={credentials}
                          onChange={(event, value) => setSelectedDoc(value)}
                          // sx={{ width: }}
                          renderInput={(params) => <TextField {...params} label="Credential"  />}
                          size='small'
                          />
                          </Grid>
                        
                      </Grid>
                      <br></br>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography>Enter address of receiver</Typography>
                        </Grid>
                        <Grid item xs={6}>
                        <TextField size="small" id="outlined-basic" label="Address" variant="outlined" value={receiverAddress} onChange={(e)=>setReceiverAddress(e.target.value)} />      
                        </Grid>
                        <Grid item xs ={12}>
                        <Button type='submit' variant="contained">Transfer</Button>
                        </Grid>
                    </Grid>
                    </Box>
                    
                    </CardContent>
                    </Card>
                </Grid>                
        </Grid>
      </Box>
    </Container>
    </Layout>
  );
};

export default UploadPage;