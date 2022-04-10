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
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { LOGIN } from '../graphql';
import {connect} from 'react-redux';
import { login } from '../actions/auth';
import { User } from '../models/User';
import { privateEncrypt } from 'crypto';
import axios, { AxiosResponse } from 'axios';


const Login = (props:any) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>('');
  const [submitLogin, { loading, error }] = useMutation(LOGIN);
  const [username, setUsername] = useState<string>('');
  // const [privateKey, setPrivateKey] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // const data = new FormData(event.currentTarget);
    // const password:string = data.get('password')?.toString() || '';
    // console.log(password);

    const privateKey:string = localStorage.getItem('privateKey') || '';
    console.log('private key', privateKey)
    const payload = {
      username: username,
      walletAddress: address,
      privateKey: privateKey
    };

    const baseUrl = 'https://fyp21050-server.herokuapp.com'
    // login
    const res : AxiosResponse<any> = await axios.post(baseUrl+'/login', payload)
    console.log('result',res)

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
            onChange={(e)=> setUsername(e.target.value)}
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
  login: (userData:User) => dispatch(login(userData)),
  // logout: () => dispatch(logout())
});

export default connect(null, mapDispatchToProps)(Login);
