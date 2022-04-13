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
import { User } from '../models/User';
import { privateEncrypt } from 'crypto';
import axios, { AxiosResponse } from 'axios';

declare var window: any;
const {ethereum} = window;


const Login = (props:any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [message, setMessage] = useState<string>('');
  const [submitLogin, { loading, error }] = useMutation(LOGIN);
  const [username, setUsername] = useState<any>('');
  // const [privateKey, setPrivateKey] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  
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
    const key = JSON.parse(retrievedString);
    // const privateKeyTemp = key.publicKey+''
    console.log('check storage',key.privateKey, typeof(key.privateKey), typeof(username))
  }

  useEffect(()=>{
  //   const data = {
  //     "user": {
  //         "id": 1,
  //         "username": "User6",
  //         "publicKey": {
  //             "kty": "RSA",
  //             "n": "x1YebA-iHsw-BdhVbDZgmY4HL1MRNFfF2DUa6trlpRH3EgzlatDd_2i7G8_oYq9NUor2NPF3bwsfEJ9J3kaCWjkWmET_LlEuidjJThFNtiXtiTASqg_xmWB-NgwuNnfpviU6FkaY7ZcqROiMEU_MiL_Y9QUhbhqTHM2JT_Gau92-afLJzrj4bmiC8FcYTnJJCjWo8wXo_TaOSLLMfoXkK1eoIMZMMxitG4WLPYc5QxCHu8wgcZEiKXSrH2Rnps1oo5H67BJv5E-E3kxtcduM2fBZsQeadS-onGadoZA_plJ7BrgD48idtouWc0EhbCcuPr9DTB4s0ToKZprA73j9Vw",
  //             "e": "AQAB"
  //         },
  //         "credentials": [],
  //         "walletAddress": "0x0304842812a48720b2d6a474d66ff6b04c10fe0a",
  //         "privateKey": {
  //             "kty": "RSA",
  //             "n": "x1YebA-iHsw-BdhVbDZgmY4HL1MRNFfF2DUa6trlpRH3EgzlatDd_2i7G8_oYq9NUor2NPF3bwsfEJ9J3kaCWjkWmET_LlEuidjJThFNtiXtiTASqg_xmWB-NgwuNnfpviU6FkaY7ZcqROiMEU_MiL_Y9QUhbhqTHM2JT_Gau92-afLJzrj4bmiC8FcYTnJJCjWo8wXo_TaOSLLMfoXkK1eoIMZMMxitG4WLPYc5QxCHu8wgcZEiKXSrH2Rnps1oo5H67BJv5E-E3kxtcduM2fBZsQeadS-onGadoZA_plJ7BrgD48idtouWc0EhbCcuPr9DTB4s0ToKZprA73j9Vw",
  //             "e": "AQAB",
  //             "d": "TEepVqLY4D46UdRKRCG-76QJHdQE1mnsPON9jHf9vyBT0uV6eVi6Sz3RtD_oZrM8vKSOuQ3aLXUtCxhZlSSYR1xnSBfHKvtH-toplqVKfrSe5Iuv6MI3KwFg6t_YY2GZ4fiu9M1JQkpBk6MFzq4h0AbSSFkRROgIedIxhJUpKFBy2aFFIuZXk4vOURKVg3QcK4oooNFiTVe77iUBKzb3tzYQOS3BVjCIxy42eKB6sZMLeT81B-3Ry3S1pg27D8J5WtQfEUbWC1zpPOwQ6mGXn-VeBaDb-kkoyEq2dH2nqvtQ06KmwdnRkEKFcHjKMSnRzc9bqMoFrjyZXQDo19myyQ",
  //             "p": "5uOvZyvq1JWbPpVF4kzpYwXZDU28PjIvv794xszYK63tDx0HJs5Ev_wC8p2TjHJUckI58sFwIEVM5VkD_4sjH9xRPmArswAOpf4ap0t4dymq-NYwTbrHr-kgCu1SrMWvky6QZ4sIZ7-X4d_2VSv_4rGt3K7OV07v7JkUNspFzX0",
  //             "q": "3QPzL3kXbUB8-WwDWmLRgpEKoL1TrgLkqLpQ_IkUvOh1AVM5cJWsV0laDfmD3cqksox1ZmadQkTG1rjgyc0m5jWSxFnyE0xSYYbARpmBOmacrQExVgai2_iaA4SZkHZC-ahJJjzrK8Qtg9AjYQTLnAhdm2hOaQyM8L1dKLRjfmM",
  //             "dp": "yGlduRofzcLGbD452MKV2oQa8TdGbF43oCLc_QKVqORhXrr9mCt29YYUMO-iQUiEEGF310UcxIYixvjLRadKJ7-fLZtgkxE7pc246PnTaOvcIf4ZE39LEWAzlgiFuL4nNoQ2iAngk910QnWaZje49tbvaRy6soIsM5x0NVLB4Ck",
  //             "dq": "DLUFbl1P84AZr11-c9vqn88nBUbdYMvZybmsnlhjUNksoP7f9pEkb4BQJS2LX10fSwS4W0LbF8xMglvu0Kty6Rl7br6dJG7m7aSJuYVp4Km1qFzBMWkARBVvBXTCP4QNJb1_NyuZedK1qzZ0UkesTTRN7Xl5yKBoGg9JI-X7MnE",
  //             "qi": "WssJEVQaBx-u_YtDw-kjtZlhay1L1XvsVhvbaWP9PBKECBFjweB62feqWhvd8zsgjiFE0RM-IYozxCFMzEPjr2L0HT2NUIwo_yCHQOR2lby361726yn_4Y2Z5-m3JbKS960jIj4zzjDxh2hyYOU7LPHICg14m3gQ-1UkcKvkTWk"
  //         }
  //     },
  //     "success": true
  // }
  
    // localStorage.setItem('user', JSON.stringify(data));

    // const user:any = localStorage.getItem('user') || '';
    // console.log('private key', user['privateKey'])
    connectWalletHandler();
    checkKey();
  },[])



  const HandleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // const data = new FormData(event.currentTarget);
    // const password:string = data.get('password')?.toString() || '';
    // console.log(password);

    const userTemp = 'user4'
    const walletTemp= '0x0AC9Be48d8b52F707161c6001b3fb3d13d4B3214'
    
    // const onLogin =  (name: string) =>{
    //   useCallback(()=>{
    //     dispatch(login(name))
    //   },[dispatch])
    // }

    // const onLogin = React.useCallback(
    //   function(name:any) {
    //     dispatch(login(name));
    //   },
    //   [dispatch]
    // );


    // const privateKey:any = localStorage.getItem('privateKey') || '';
    // console.log('private key', privateKey)
    // const payload = {
    //   username: username,
    //   walletAddress: address,
    //   privateKey: privateKey
    // };

    const payload = {
      username: username,
      walletAddress: address,
    };

    const payloadStore = {
      username: username,
      publicKey: address,
    }

    const baseUrl = 'http://127.0.0.1:8000/'
    // login
    try{
      console.log(payload)
      const res : AxiosResponse<any> = await axios.post(baseUrl+'login', payload)
      console.log('result',res.data)
      var successTemp = true 
      if(res.data.success === true){
      // if(successTemp === true){
        // onLogin(username)
        console.log(username,'username')
        localStorage.setItem('user', JSON.stringify(res.data));
        dispatch(login(payloadStore))
        console.log('checker')
        navigate('/home',{state: {username, address}})
      }else{
        <Alert severity="error">Invalid Login.</Alert>
      }

    }
    catch(e){
      console.log(e)
    }
    
  //   submitLogin({
  //     variables: {
  //       input: payload,
  //     },
  //   })
  //     .then((res) => {
  //       const { status, token, message, user } = res.data.login;
  //       if (status === 'success') {
  //         props.login(user)
  //         localStorage.setItem('token', token);
  //         navigate(`/user/${user.id}`);
  //       } else {
  //         setMessage(message);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       if (error) setMessage(error.message);
  //     });
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
          {/* <TextField
            margin="normal"
            required
            fullWidth
            name="privateKey"
            label="Private Key"
            type="privateKey"
            id="privateKey"
            autoComplete="privateKey"
          /> */}
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
            Sign In
          </Button>
          <Typography >The address for the connected Metamask Wallet is <i>{address}</i></Typography>
          <br></br>
          <Grid container>
            {/* <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid> */}
            <Grid item>
              <Grid item>
                <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

const mapDispatchToProps = (dispatch:any)=> ({
  login: (userData:any) => dispatch(login(userData)),
  // logout: () => dispatch(logout())
});

export default connect(null, mapDispatchToProps)(Login);
// export default Login;
