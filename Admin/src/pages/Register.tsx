import { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Box,
  Container,
  TextField,
  Link,
  Grid,
  Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { LOGIN } from '../graphql';
import {useDispatch} from 'react-redux';
import { login } from '../actions/auth';
import axios, { AxiosResponse } from 'axios';
import { useCookies } from 'react-cookie';
import {DialogBox} from '../components/DialogBox'
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
  const [connectedAddress, setConnectedAddress] = useState<any>('')
  const [err, setErr] = useState<Boolean>(false)
  
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

  // handleClickOpen=()=>{
  //   setOpen(true)
  // }

  const handleErrorClose=(f:boolean):void=>{
    console.log('check close')
    setErr(f)
  }


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const baseUrl = 'http://127.0.0.1:8000/'
    

    rsa.generateKey(2048).then( async (key:any)=>{
      const publicKey = key.publicKey;
      const privateKey = key.privateKey;

      const payload = {
          username: username,
          walletAddress: address,
          publicKey: JSON.stringify(publicKey),
          isAdmin: true
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
      }else{
        console.log('err',err)
        setErr(true)
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
        <Grid container>            
            <Grid item>
              <Grid item>
                <Link href="/login" variant="body2">
                {"Have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </Grid>
        {/* {err && <DialogBox title='Registration Failed' data='Please re-enter your credentials.' error={handleErrorClose} />} */}
        {err === true? <DialogBox title='Registration Failed' data='Please re-enter your credentials.' error={handleErrorClose} />: <>{console.log('check err',err)}</>}
      </Box>
    </Container>
  );
};

export default Login;