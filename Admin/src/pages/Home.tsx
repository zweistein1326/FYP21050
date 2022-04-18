import { useMutation } from '@apollo/client';
import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link, useParams } from 'react-router-dom';
import CredentialTile from '../components/CredentialTile';
import Header from '../components/Header';
import { GETUSERBYID } from '../graphql';
import { User } from '../models/User';
import { AppState } from '../store/configureStore'

declare var window:any;

const Home = (props:any) => {

  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(
    props.auth.user !==null ,
  );
  const [activeUser,setActiveUser] = useState<any>({});
  const [activeCredentials,setActiveCredentials] = useState<any>([]);
  const [fetchInfo,{loading,error}] = useMutation(GETUSERBYID);
  const [account, setAccount] = useState<any>(null);
  
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };
  
  const {ethereum} = window;

  const connectWalletHandler = async () => {
    try{
      const accounts = await ethereum.request({method: 'eth_requestAccounts'});
      setAccount(accounts[0]);
    } catch(err){
      console.log(err);
    }
  }

  // const getUserInfo = async () =>{
  //   console.log(id);
  //   await connectWalletHandler();
  //   fetchInfo({
  //     variables: {
  //       id
  //   },
  // })
  //   .then((res)=>{
  //     let user:User = res.data.getUserById.user;
  //     setActiveUser(user);
  //     const credArray:any = [];
  //     if(user.credentials){
  //       Object.values(user.credentials).forEach((credential, index) => credential.status? credArray.push(credential):null)
  //     }
  //     console.log(credArray);
  //     setActiveCredentials(credArray);
  //   })
  // }

  // useEffect(()=>{ 
  //   getUserInfo()
  // },activeUser);


  return (
    <Box>
      <Box >
        User information
      </Box>
    </Box>
  );
};

const mapStateToProps = (state:any) => ({
  auth:state.auth
})

export default connect(mapStateToProps)(Home);
