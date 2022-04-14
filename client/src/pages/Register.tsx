import { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Box,
  Checkbox,
  Container,
  TextField,
  FormControlLabel,
  Link,
  Grid,
  Typography,
  Alert,
  AlertTitle
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
<<<<<<< .merge_file_rjCfjc
import { LOGIN } from '../graphql';
import {connect, useSelector, useDispatch} from 'react-redux';
import { login } from '../actions/auth';
import { User } from '../models/User';
import axios, { AxiosResponse } from 'axios';
import { privateEncrypt } from 'crypto';
import { useCookies } from 'react-cookie';
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:3000"))
=======
import { ethers } from 'ethers';
import axios, { AxiosResponse } from 'axios';
import fs from 'fs';
import { id } from 'ethers/lib/utils';
import CredentialTile from '../components/CredentialTile';
import { useDispatch } from 'react-redux';
import { setAccount } from '../actions/auth';

declare var window: any;
>>>>>>> .merge_file_N4dCoY


declare var window: any;
const {ethereum} = window;

const Login = (props:any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [message, setMessage] = useState<string>('');
<<<<<<< .merge_file_rjCfjc
  const [submitLogin, { loading, error }] = useMutation(LOGIN);
  const [username, setUsername] = useState<string>('');
  const [address, setAddress] = useState<string>('')
  const [cookies, setCookies] = useCookies<any>(['user'])
  const [connectedAddress, setConnectedAddress] = useState<any>('')
  
  const tempAccount = async () =>{
    console.log('check')
    const tempAccount = await web3.eth.accounts.create([])
    console.log('check account',tempAccount.address)
  }

  
  const connectWalletHandler = async () => {
    try{
      const accounts = await ethereum.request({method: 'eth_requestAccounts'});
      console.log('account', accounts[0]);
      setConnectedAddress(accounts[0])
    } catch(err){
      console.log(err);
=======
  const [errorMessage, setErrorMessage] = useState<any>(null);
  const [defaultAccount, setDefaultAccount] = useState<any>(null);
  const [userBalance, setUserBalance] = useState<any>(null);
  const [connButtonText, setConnButtonText] = useState('Connect Wallet');
  const [file,setFile] = useState<File | null>(null);
  const [tokens, setToken] = useState<TestResponseInterface[]>([]);
  const [showToken, setShowToken] = useState<any[]>([])
  const [tokenUrl, setTokenUrl] = useState <any[]>([]);
  const [tokenCount, setTokenCount]= useState<number>(1);
  const dispatch = useDispatch();

  console.log("My token is", tokens)

  // const []
  const connectWalletHandler = (event:any) => {
    event.preventDefault()
    if(window.ethereum){
      window.ethereum.request({method:'eth_requestAccounts'}).then(async (result:any[]) => {
        await accountChangeHandler(result[0]);
        dispatch(setAccount(result[0]));
        return result[0];
      }).then(async(account:any)=>{
          console.log(account);
          // const res : AxiosResponse<any> = await axios.get('http://127.0.0.1:8000/getFilesByUser?userId='+ account);
          const res : AxiosResponse<any> = await axios.get('http://127.0.0.1:8000/getFilesByUser?userId='+ account)
          console.log("res",res);
      });
    }
    else{
      setErrorMessage('Install Metamask');
>>>>>>> .merge_file_N4dCoY
    }
  }


  useEffect(()=>{
    connectWalletHandler();
    tempAccount();
  },[])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

<<<<<<< .merge_file_rjCfjc
    const baseUrl = 'http://127.0.0.1:8000/'
    const keyAccount = await web3.eth.accounts.create([])
    console.log('key account',keyAccount)

    const payload = {
        username: username,
        walletAddress: address,
=======
  const handleSubmitFile = async (event:any) => {
    event.preventDefault();
    console.log('file',file);
    var bodyFormData = new FormData();
    if(file!==null){
        console.log('updating data');
        bodyFormData.append('inputFile', file); 
        bodyFormData.append('sender', defaultAccount);       
        try {
          const res : AxiosResponse<any> = await axios.post('http://127.0.0.1:8000/upload', bodyFormData)
          console.log(res);
          const tokenData : AxiosResponse<any> = await axios.get('http://127.0.0.1:8000/getByTokenId/'+ res.data.tokenId)
          const owner : AxiosResponse<any> = await axios.get('http://127.0.0.1:8000/owner?tokenId='+ res.data.tokenId)
          setFile(null);
          console.log(owner.data);
          const newTokenData = tokenData.data
          let x = <CredentialTile newTokenData = {newTokenData} tokenData={res.data} owner={owner.data.owner} tokenCount={tokenCount}/>
          setShowToken([...showToken,x])
          setTokenCount(tokenCount+1)
          setToken([...tokens, newTokenData])
        } catch(err) {
          console.error(err)
        }
>>>>>>> .merge_file_N4dCoY
    }

    const payloadStore = {
      username: username,
      publicKey: address
    }
    // Register
    const res : AxiosResponse<any> = await axios.post(baseUrl+'register', payload)
    console.log('result', res.data)

    if (res.data.success === true){
      dispatch(login(payloadStore))
      localStorage.setItem('user', JSON.stringify(res.data));
      localStorage.setItem('keyAccount',JSON.stringify(keyAccount))
      setCookies('username', username, {path:'/'})
      navigate('/home', {state: payload}) 
    }else{
      <Alert severity="error">Invalid Registeration.</Alert>
    }    
  };

  return (
    <Container component="main" maxWidth="xs" >
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Create your Algol Account
        </Typography>
        {message && (
          <Typography variant="body1" color="red" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e:any)=> setUsername(e.target.value)}
          />
          <TextField            
            margin="normal"
            required
            fullWidth
<<<<<<< .merge_file_rjCfjc
            name="address"
            label="Wallet Address"
            type="address"
            id="address"
            autoComplete="address"
            value={address}
            onChange={(e:any)=> setAddress(e.target.value)}
          />
=======
            name="confirm-password"
            label="Confirm Password"
            type="password"
            id="confirm-password"
            autoComplete="current-password"
          /> */}
          <Typography>Address: {defaultAccount}</Typography>
          <Typography>Balance: {userBalance}</Typography>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            // onSubmit={}
          >
            {connButtonText}
          </Button>
          {/* <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/login" variant="body2">
                {'Already have an account? Login'}
              </Link>
            </Grid>
          </Grid> */}
        </Box>
        <Box component="form" onSubmit={handleSubmitFile} noValidate sx={{ mt: 1 }}>
          <Typography>Upload New File</Typography>
          <input type="file" name="file" placeholder='upload file' onChange={onFileUpload}/>
>>>>>>> .merge_file_N4dCoY
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Create
          </Button>
          <Typography >The address for the connected Metamask Wallet is <i>{connectedAddress}</i></Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;