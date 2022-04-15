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
import {create} from 'ipfs-http-client'



declare var window: any;
const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https"
});


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
  const [url, setUrlArr] = useState<any>('')
  const [dataUpload, setDataUpload] = useState<any>('')
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
        i.viewers.forEach((item:any)=>{
          setCredentials(oldData=> [...oldData, item.data.fileName] )
        })
        setCheckCredentials(oldData=>[...oldData, i])
        console.log(i)
        
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
            // var credentialId = '';
            // checkCredentials.map((i:any)=>{    
              
            //   i.viewers.forEach((item:any)=>{
            //     if(item.data.fileName === selectedDoc){
            //       credentialId = i.id
            //     console.log('check')
            //     }
            //   })              
            // })
            const retrievedString :any = localStorage.getItem('user') || '';
            const user = JSON.parse(retrievedString);
    
            const payload = {
              from: user.user.id, 
              to:receiverAddress, 
              credentialId: dataUpload, 
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
            const created = await ipfs.add(file);
            const url = `https://ipfs.infura.io/ipfs/${created.path}`;
            //const viewers = [{id:string, data:{fileName:string, assetHash:string, metadataUrl:string}, permissions:{revoke:boolean, share:boolean, transfer: boolean}}]
            setUrlArr(url);
            const viewers = [{
              id: user.user.id , 
              data:{
                  fileName:file.name, assetHash:created.cid.toString(), metadataUrl:url},
                  permissions:{revoke:true, share:true, transfer: true}
            }]
            const formData = new FormData()
            formData.append('inputFile',file) 
            formData.append('walletAddress', defaultAccount)
            formData.append('senderAddress',user.user.id)     
            formData.append('viewers', JSON.stringify(viewers))
            const res : AxiosResponse<any> = await axios.post(baseUrl+'upload', formData)
            console.log('result of send',res.data)
            if(res.data.success === true){
              setDataUpload(res.data.credential.id)
              console.log(res.data.credential.id)
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
    
    <Container component="main" sx={{width:'80%'}} >
      <Box
        sx={{
          marginTop: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
      <Typography variant='h5' display="block" gutterBottom>Upload and Transfer</Typography>
      <Grid container>
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
                <Grid container spacing={2}>
                {/* <Grid item xs={2}></Grid> */}
                <Grid item xs = {12}>
                <Card sx={{width: '100%'}} >
                    <Box component="form" onSubmit={handleSubmitFile} noValidate sx={{ mt: 1, marginBottom:3  }}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                          <br></br>
                        <Typography variant='h6' display="block" gutterBottom color="text.secondary" style={{ fontWeight: 600 }}>
                        File Upload
                        </Typography>
                        </Grid>
                        </Grid>
                        <Grid container spacing={3}>
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
                        </Box>                    
                    </Grid>
                    </Box>
                    <hr></hr>
                    <Typography variant='h6' display="block" gutterBottom color="text.secondary" style={{ fontWeight: 600 }}>
                        Transfer
                    </Typography>
                    
                    <Box component="form" onSubmit={handleSubmitTransfer} noValidate sx={{ mt: 1  }}>
                    <Grid container spacing={2} >
                      {/* <Grid item xs={6}>
                      <Typography variant='subtitle1'>
                      Choose the credential
                      </Typography>
                      </Grid> */}
                      <br></br>
                      {/* <Grid item xs={6}>
                      <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={credentials}
                          onChange={(event, value) => setSelectedDoc(value)}
                          // sx={{ width: }}
                          renderInput={(params) => <TextField {...params} label="Credential"  />}
                          size='small'
                          />
                          </Grid> */}
                        
                      </Grid>
                      <br></br>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography>Enter address of receiver</Typography>
                        </Grid>
                        <Grid item xs={6}>
                        <TextField size="small" id="outlined-basic" label="Address" variant="outlined" style={{width:'70%'}} value={receiverAddress} onChange={(e)=>setReceiverAddress(e.target.value)} />      
                        </Grid>
                        <Grid item xs ={12}>
                        <Button type='submit' variant="contained">Transfer</Button>
                        </Grid>
                        <br></br>
                    </Grid>
                    </Box>
                  <br></br>
                </Card>

                </Grid>
                {/* <Grid item xs={6}> */}
                {/* <Card sx={{width: '100%'}}>
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
                    </Card> */}
                {/* </Grid>   */}
                </Grid>
              
        </Grid>
      </Box>
    </Container>
    </Layout>
  );
};

export default UploadPage;