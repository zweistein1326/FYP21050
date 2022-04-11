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
  CardContent
} from '@mui/material';
import Tab from '@mui/material/Tab';
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
// import SideBarLayout from './SidebarLayout'
import fs from 'fs';
import { id } from 'ethers/lib/utils';
import Layout from './Layout'
import { AppState } from '../../store/configureStore'
import { connect, useSelector } from 'react-redux';
import { assertName } from 'graphql';


declare var window: any;


 interface TestResponseInterface {
   name: string,
   tokenId: number
 }

const UploadPage = () => {
  const navigate = useNavigate();
//   const {state} = useLocation();
  const state = useSelector((s: any)=> s.auth) 
  console.log(state)
  const [message, setMessage] = useState<string>('');
  const [submitRegister, { loading, error }] = useMutation(REGISTER);
  const [errorMessage, setErrorMessage] = useState<any>(null);
  const [defaultAccount, setDefaultAccount] = useState<any>(null);
  const [userBalance, setUserBalance] = useState<any>(null);
  const [connButtonText, setConnButtonText] = useState('Connect Wallet');
  const [file,setFile] = useState<File | null>(null);
  const [tokens, setToken] = useState<TestResponseInterface[]>([]);
  const [showToken, setShowToken] = useState<any[]>([])
  const [tokenUrl, setTokenUrl] = useState <any[]>([]);
  const [tokenCount, setTokenCount]= useState<number>(1);
  const [name, setName] = useState<string>('');
  const [receiverAddress, setReceiverAddress] = useState<any>('')
  const baseUrl = 'https://fyp21050-server.herokuapp.com'

  const [value, setValue] = useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  console.log("My token is", tokens)
  console.log(state,'state')

  useEffect(()=>{
    if(state){
        console.log(state['newUser'][0].username, 'inside')
        setName(state['newUser'][0].username)
    }
    connectWalletHandler();
  },[state])

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
    // setConnButtonText('Disconnect Wallet');
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
    console.log(event.target.files[0]);
  }

  const handleSubmitTransfer = async (event:any) =>{
    event.preventDefault();
    if(file!== null){
        try{
            const payload = {
                // Add credential part
                // credentialId: credentialId, 
                requestSenderAddress: defaultAccount, 
                receiverAddress: receiverAddress,
            }
            const res : AxiosResponse<any> = await axios.post(baseUrl+'/transfer', payload)
            console.log('result of send',res.data.credentialId)
        
        } catch(err) {
          console.error(err)
        } 
    }
  }


  const handleSubmitFile = async (event:any) => {
    event.preventDefault();
    console.log('file',file);
    var bodyFormData = new FormData();
    if(file!==null){
        // console.log('updating data');
        // bodyFormData.append('inputFile', file);        
        // try {
        //   const res : AxiosResponse<any> = await axios.post('http://127.0.0.1:8000/upload', bodyFormData)
        //   console.log(res.data);
        //   const tokenData : AxiosResponse<any> = await axios.get('http://127.0.0.1:8000/getByTokenId/'+ res.data.tokenId,{
        //   // params:{
        //   //   tokenId : t.tokenId
        //   // }
        //   })
        //   const newTokenData = tokenData.data
        //   console.log('newTokenData', tokenData);
        //   let x = <Link  color='black' underline='hover' variant='button' href={newTokenData.tokenUri} key={res.data.tokenId} display='block' >{tokenCount}.  {res.data.name}</Link>
        //   setShowToken([...showToken,x])
        //   setTokenCount(tokenCount+1)
        //   console.log('tokens',[...tokens, newTokenData])
        //   setToken([...tokens, newTokenData])
        try{
            const current = new Date();
            const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;

            const payload = {
                inputFile: file, 
                ownerAddress: defaultAccount, 
                iat: date
            }
            const res : AxiosResponse<any> = await axios.post(baseUrl+'/uploadCredential', payload)
            console.log('result of send',res.data.credentialId)

        
        } catch(err) {
          console.error(err)
        }
    }
  } 

  
  return (
    <Layout>
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
                {/* <Grid item xs={12}> */}
                <Grid item xs = {6}>
                <Card sx={{width: '100%'}}>
                    <Box component="form" onSubmit={handleSubmitFile} noValidate sx={{ mt: 1, marginBottom:3  }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                        <Typography variant='h6' display="block" gutterBottom color="text.secondary" style={{ fontWeight: 600 }}>
                        File Upload
                        </Typography>
                        </Grid>
                        <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', marginLeft:'40px' }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                <Tab label="Upload" value="1" sx={{marginRight: '20px'}} />  
                                <Tab label="Choose" value="2" />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                        <Grid item xs={12}>
                            <input type="file" name="file" placeholder='upload file' onChange={onFileUpload}/>
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
                            <Typography>Your uploaded files</Typography>
                            <Typography>{showToken}</Typography>
                            </TabPanel>
                            <TabPanel value="2">
                                
                            </TabPanel>
                        </TabContext>
                        </Box>
                    
                    </Grid>

                    
                    </Box>
                </Card>
                </Grid>
                <Grid item xs={6}>
                <Card sx={{width: '100%'}}>
                    <Typography variant='h6' display="block" gutterBottom color="text.secondary" style={{ fontWeight: 600 }}>
                        Transfer
                    </Typography>
                    <CardContent>
                    <Box component="form" onSubmit={handleSubmitTransfer} noValidate sx={{ mt: 1  }}>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography>Enter address of receiver</Typography>
                        </Grid>
                        <Grid item xs={6}>
                        <TextField size="small" id="outlined-basic" label="Address" variant="outlined" value={receiverAddress} onChange={(e)=>setReceiverAddress(e.target.value)} />      
                        </Grid>
                        <Grid item xs ={12}>
                        <Button variant="contained">Transfer</Button>
                        </Grid>
                    </Grid>
                    </Box>
                    
                    </CardContent>
                    </Card>
                </Grid>
                {/* </Grid> */}
                          
          {/* </Grid> */}
        </Grid>
      </Box>
    </Container>
    </Layout>
  );
};

export default UploadPage;