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

declare var window: any;
const {ethereum} = window;

const Login = (props:any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [message, setMessage] = useState<string>('');
  const [submitLogin, { loading, error }] = useMutation(LOGIN);
  const [username, setUsername] = useState<string>('');
  const [address, setAddress] = useState<string>('')
  // const [privateKey, setPrivateKey] = useState<string>('');
  // const []

  // const accounts = await ethereum.request({method: 'eth_requestAccounts'});
  // console.log('account', accounts[0]);
  const connectWalletHandler = async () => {
    try{
      const accounts = await ethereum.request({method: 'eth_requestAccounts'});
      console.log('account', accounts[0]);
      
      // console.log("Wallet exists! We're ready to go!");
    } catch(err){
      console.log(err);
    }
  }

  useEffect(()=>{
    connectWalletHandler();
  },[])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const baseUrl = 'https://fyp21050-server.herokuapp.com'

    const payload = {
        username: username,
        walletAddress: address
    }

    const payloadStore = {
      username: username,
      publicKey: address
    }
    // Register
    const res : AxiosResponse<any> = await axios.post(baseUrl+'/register', payload)
    console.log('result',res.data.user.privateKey)

    if (res.data.success === true){
      dispatch(login(payloadStore))
      localStorage.setItem('privateKey', res.data.user.privateKey);
      console.log(localStorage.getItem('privateKey'))
      navigate('/home', {state: payload}) 
    }else{
      <Alert severity="error">Invalid Registeration.</Alert>
    }

    // submitLogin({
    //   variables: {
    //     input: payload,
    //   },
    // })
    //   .then((res) => {
    //     const { status, token, message, user } = res.data.login;
    //     if (status === 'success') {
    //       props.login(user)
    //       localStorage.setItem('token', token);
    //       navigate(`/user/${user.id}`);
    //     } else {
    //       setMessage(message);
    //     }
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     if (error) setMessage(error.message);
    //   });
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
          Create your Algol Account
        </Typography>
        {message && (
          <Typography variant="body1" color="red" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        {/* <Box component="form"  noValidate sx={{ mt: 1 }}> */}
          <TextField
            // error={username===''}
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
            // error={address === ''}
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
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            Create
          </Button>
          
        </Box>
      </Box>
    </Container>
  );
};

// const mapDispatchToProps = (dispatch:any)=> ({
//   login: (userData:User) => dispatch(login(userData)),
//   // logout: () => dispatch(logout())
// });

// export default connect(null, mapDispatchToProps)(Login);
export default Login;