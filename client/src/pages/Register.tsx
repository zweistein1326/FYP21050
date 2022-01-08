import { useState } from 'react';
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
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { REGISTER } from '../graphql';
import { ethers } from 'ethers';
import fs from 'fs';

declare var window: any;

const Register = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>('');
  const [submitRegister, { loading, error }] = useMutation(REGISTER);
  const [errorMessage, setErrorMessage] = useState<any>(null);
  const [defaultAccount, setDefaultAccount] = useState<any>(null);
  const [userBalance, setUserBalance] = useState<any>(null);
  const [connButtonText, setConnButtonText] = useState('Connect Wallet');
  const [file,setFile] = useState<File | null>(null);

  const connectWalletHandler = (event:any) => {
    event.preventDefault()
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
    setConnButtonText('Disconnect Wallet');
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

  const handleSubmitFile = (event:any) => {
    event.preventDefault();
    console.log(file);
    var bodyFormData = new FormData();
    if(file!==null){
        console.log('updating data');
        bodyFormData.append('abs', file, file.name);
      }
      console.log(bodyFormData)
  } 

  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const data = new FormData(event.currentTarget);

  //   if (data.get('password') !== data.get('confirm-password')) {
  //     setMessage('Password does not match');
  //     return;
  //   }

  //   const payload = {
  //     password: data.get('password'),
  //   };

  //   submitRegister({
  //     variables: {
  //       input: payload,
  //     },
  //   })
  //     .then((res) => {
  //       const { status, privateKey, message } = res.data.register;
  //       if (status === 'success') {
  //         localStorage.setItem('privateKey', privateKey);
  //         navigate('/');
  //       } else {
  //         setMessage(message);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       if (error) setMessage(error.message);
  //     });
  // };

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
        {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        {message && (
          <Typography variant="body1" color="red" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )} */}
        <Box component="form" onSubmit={connectWalletHandler} noValidate sx={{ mt: 1 }}>
          {/* <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <TextField
            margin="normal"
            required
            fullWidth
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
            disabled={loading}
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            Submit File
          </Button>

          <Typography>Your uploaded files</Typography>
          <Typography>1</Typography>
          <Typography>2</Typography>
          <Typography>3</Typography>
          <Typography>4</Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
