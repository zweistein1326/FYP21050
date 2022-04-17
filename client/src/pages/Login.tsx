import React from 'react';
import { useEffect, useState, useCallback } from 'react';
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
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { LOGIN } from '../graphql';
import {connect, useDispatch, useSelector} from 'react-redux';
import { login } from '../actions/auth';
import {DialogBox} from '../components/DialogBox'

import axios, { AxiosResponse } from 'axios';

declare var window: any;
const {ethereum} = window;


const Login = (props:any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [message, setMessage] = useState<string>('');
  const [submitLogin, { loading, error }] = useMutation(LOGIN);
  const [username, setUsername] = useState<any>('');
  const [address, setAddress] = useState<string>('');
  const [err, setErr] = useState<Boolean>(false)

  const handleErrorClose=(f:boolean):void=>{
    setErr(f)
  }
  
  const connectWalletHandler = async () => {
    try{
      const accounts = await ethereum.request({method: 'eth_requestAccounts'});
      setAddress(accounts[0])      
    } catch(err){
      console.log(err);
    }
  }

  const checkKey=async()=>{
    const retrievedString :any = localStorage.getItem('keyAccount') || '';
    const key = retrievedString ? JSON.parse(retrievedString) : {} ;
    console.log('check storage',key.privateKey, typeof(key.privateKey), typeof(username))
  }

  useEffect(()=>{
    connectWalletHandler();
    checkKey();
  },[])



  const HandleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
        
    const payload = {
      username: username,
      walletAddress: address,
    };

    const payloadStore = {
      username: username,
      publicKey: address,
    }

    const baseUrl = 'http://127.0.0.1:8000/'
    try{
      console.log(payload)
      const res : AxiosResponse<any> = await axios.post(baseUrl+'login', payload)
      console.log('result',res.data)
      if(res.data.success && res.data.user.isAdmin){
        console.log(username,'username')
        localStorage.setItem('user', JSON.stringify(res.data));
        dispatch(login(payloadStore))
        console.log('checker')
        navigate('/home',{state: {username, address}})
      }else{
        setErr(true)
      }

    }
    catch(e){
      console.log(e)
    }
    
  };

  return (
    <Container component="main" maxWidth="xs">
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
          Sign in
        </Typography>
        {message && (
          <Typography variant="body1" color="red" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
        <Box component="form" onSubmit={HandleSubmit} noValidate sx={{ mt: 1 }}>
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
          />          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            Sign In
          </Button>
          <Typography >The address for the connected Metamask Wallet is <i>{address}</i></Typography>
          <br></br>
          <Grid container>            
            <Grid item>
              <Grid item>
                <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        {err && <DialogBox title='Login Failed' data='Please re-enter your credentials.' error={handleErrorClose} />}
      </Box>
    </Container>
  );
};

const mapDispatchToProps = (dispatch:any)=> ({
  login: (userData:any) => dispatch(login(userData)),
});

export default connect(null, mapDispatchToProps)(Login);
