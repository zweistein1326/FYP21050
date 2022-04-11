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
} from '@mui/material';
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

const RevokePage = () => {
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
  const [credentials, setCredentials] = useState<any[]>([])
  const [docRevoke, setDocRevoke] = useState<any>('')
  const baseUrl = 'https://fyp21050-server.herokuapp.com'



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

  const getCredentials = async () =>{
    const res : AxiosResponse<any> = await axios.get('http://127.0.0.1:8000/getAllCredentials?username='+name)
    console.log(res.data);
  }

//   const 

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

  const handleGetCredentials = async ()=>{
    
  }


  const handleSubmitFile = async (event:any) => {
    event.preventDefault();
    console.log('file',file);
    var bodyFormData = new FormData();
    if(file!==null){
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
    <Container component="main" maxWidth="sm" >
      <Box
        sx={{
          marginTop: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box component="form" onSubmit={connectWalletHandler} noValidate sx={{ mt: 1, marginBottom:3 }}>
          <Typography variant='h5' display="block" gutterBottom>Revocation</Typography>
          <Card sx={{width: '100%'}}>
              {/* <Typography variant='h6' display="block" gutterBottom>
                
              </Typography> */}
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
                    // sx={{ width: }}
                    renderInput={(params) => <TextField {...params} label="Credential" value={docRevoke} onChange={(e)=> setDocRevoke(e.target.value)} />}
                    size='small'
                />
                </Grid>
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

