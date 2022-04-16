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
import { LOGIN } from '../graphql';
import {connect, useSelector, useDispatch} from 'react-redux';
import { login } from '../actions/auth';
import { User } from '../models/User';
import axios, { AxiosResponse } from 'axios';
import { privateEncrypt } from 'crypto';
import { useCookies } from 'react-cookie';
import {encrypt, decrypt} from '../components/rsa/utils';
import rsa from 'js-crypto-rsa';
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:3000"));



declare var window: any;
const {ethereum} = window;

const Login = (props:any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [message, setMessage] = useState<string>('');
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
    }
  }


  useEffect(()=>{
    connectWalletHandler();
    tempAccount();
  },[])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const baseUrl = 'http://127.0.0.1:8000/'
    

    rsa.generateKey(2048).then( async (key:any)=>{
      const publicKey = key.publicKey;
      const privateKey = key.privateKey;

      console.log('publicKey', publicKey);
      console.log('privateKey', privateKey);

      const payload = {
          username: username,
          walletAddress: address,
          publicKey: JSON.stringify(publicKey),
      }

      const payloadStore = {
        username: username,
        publicKey: address
      }
      // Register
      const res : AxiosResponse<any> = await axios.post(baseUrl+'register', payload)
      console.log('result', res.data);

      if (res.data.success === true){
        dispatch(login(payloadStore))
        localStorage.setItem('user', JSON.stringify(res.data));
        localStorage.setItem('publicKey'+username, JSON.stringify(publicKey));
        localStorage.setItem('privateKey'+username, JSON.stringify(privateKey));
        navigate('/home', {state: payload}) 
      }
    });    
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
            name="address"
            label="Wallet Address"
            type="address"
            id="address"
            autoComplete="address"
            value={address}
            onChange={(e:any)=> setAddress(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
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