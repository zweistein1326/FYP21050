import { useMutation } from '@apollo/client';
import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link, useParams } from 'react-router-dom';
import CredentialTile from '../components/CredentialTile';
import Header from '../components/Header';
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
    {/* Account: {props.location.state.account} */}
      {/* <Header setLoggedIn={setLoggedIn} loggedIn={loggedIn}/> */}
    </Box>
    {/* <Box sx={{display:'flex'}}>
    <Box sx={{width:'20vw', height:'100vh', mt:2, backgroundColor:'beige', p:3}}>
      <Typography>
          My photo (optional)
        </Typography>
        <Typography sx={{display:'inline'}}>
          DID: <span style={{fontWeight:'bold'}}>{activeUser.id} (@{activeUser.username})</span>
        </Typography>
        <Typography>
          Name: {activeUser.firstname} {activeUser.lastname}
        </Typography>
        <Typography>
          Email: {activeUser.email}
        </Typography>
        <Button sx={{ mt:3, mb:2 }} variant="contained"><Link to={`/addCredential`}><Typography sx={{color:'white'}}>Add new Credential</Typography></Link></Button>
        <Button sx={{ mt:3, mb:2 }} variant="contained"><Link to={`/requestCredential`}><Typography sx={{color:'white'}}>Request Credential</Typography></Link></Button>
    </Box>
      <Box sx={{width:'60vw', height:'100vh', m:3}}>
      {loggedIn ?
      <>
        {activeUser.id == props.auth.user.id?
        <Box display='flex'>
          <Box sx={{width:'30%'}}>
          <Typography variant="h4" >
            Issued Credentials
          </Typography>
          <Typography >
            Show credential issued by this user -&gt; View all
          </Typography>
          {activeUser.credentials ?
          activeCredentials.map((credential:any,index:number)=>credential.pending?<CredentialTile key={credential.id} credential={credential} title={activeCredentials[index].id} />:null)
          :''}
          </Box>
          <Box sx={{width:'30%'}}>
          <Typography variant="h4" >
            Pending Requests
          </Typography>
          {activeUser.credentials ?
          activeCredentials.map((credential:any,index:number)=>credential.pending?<CredentialTile key={credential.id} credential={credential} title={activeCredentials[index].id} />:null)
          :''}
          </Box>
          <Box sx={{width:'30%'}}>
          <Typography variant="h4">
            Accepted credentials
          </Typography>
          {activeUser.credentials ?
          activeCredentials.map((credential:any,index:number)=>!credential.pending?<CredentialTile key={credential.id} credential={credential} title={activeCredentials[index].id} />:null)
          :''}
          </Box>
        </Box>:
        null}
      </>: null}
      </Box>
      </Box> */}
    </Box>
  );
};

const mapStateToProps = (state:any) => ({
  auth:state.auth
})

export default connect(mapStateToProps)(Home);
