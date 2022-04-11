// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ethers } from 'ethers';
// import axios, { AxiosResponse } from 'axios';

// import Layout from './Layout'


// const DashboardPage = () => {


//     useEffect(()=>{
        
//     },[])
    
//     return(
//         <Layout>
//         <div>Dashboard</div>
//         </Layout>    
//     )
// }

// export default DashboardPage;

import { useState, useEffect } from 'react';
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
  ListItem,
  ListItemText,
} from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useMutation } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { REGISTER } from '../../graphql';
import { ethers } from 'ethers';
import axios, { AxiosResponse } from 'axios';
// import SideBarLayout from './SidebarLayout'
import fs from 'fs';
import { id } from 'ethers/lib/utils';
import Layout from './Layout'
import { AppState } from '../../store/configureStore'
import { connect, useSelector } from 'react-redux';
import { assertName } from 'graphql';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';



declare var window: any;


 interface TestResponseInterface {
   name: string,
   tokenId: number
 }

const Account = () => {
  const navigate = useNavigate();
//   const {state} = useLocation();
  const state = useSelector((s: any)=> s.auth) 
  console.log(state)
  const [message, setMessage] = useState<string>('');
  const [submitRegister, { loading, error }] = useMutation(REGISTER);
  const [errorMessage, setErrorMessage] = useState<any>(null);
  const [defaultAccount, setDefaultAccount] = useState<any>(null);
  const [userBalance, setUserBalance] = useState<any>(null);
  const [connButtonText, setConnButtonText] = useState('Connect Wallet');
  const [file,setFile] = useState<File | null>(null);
  const [tokens, setToken] = useState<TestResponseInterface[]>([]);
  const [showToken, setShowToken] = useState<any[]>([])
  const [tokenUrl, setTokenUrl] = useState <any[]>([]);
  const [tokenCount, setTokenCount]= useState<number>(1);
  const [name, setName] = useState<string>('');
  const [tableData, setTableData] = useState<any[]>([])

  console.log("My token is", tokens)
  console.log(state,'state')

  useEffect(()=>{
    if(state){
        console.log(state['newUser'][0].username, 'inside')
        setName(state['newUser'][0].username)
    }
    getCredentials();
  },[state])

  const getCredentials = async () =>{
    const res : AxiosResponse<any> = await axios.get('http://127.0.0.1:8000/getAllCredentials?username='+name)
    console.log(res.data);

  }

  // const []
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

  


  const handleSubmitFile = async (event:any) => {
    event.preventDefault();
    console.log('file',file);
    var bodyFormData = new FormData();
    if(file!==null){
        console.log('updating data');
        bodyFormData.append('inputFile', file);        
        try {
          const res : AxiosResponse<any> = await axios.post('http://127.0.0.1:8000/upload', bodyFormData)
          console.log(res.data);
          const tokenData : AxiosResponse<any> = await axios.get('http://127.0.0.1:8000/getByTokenId/'+ res.data.tokenId,{
          // params:{
          //   tokenId : t.tokenId
          // }
          })
          const newTokenData = tokenData.data
          console.log('newTokenData', tokenData);
          let x = <Link  color='black' underline='hover' variant='button' href={newTokenData.tokenUri} key={res.data.tokenId} display='block' >{tokenCount}.  {res.data.name}</Link>
          setShowToken([...showToken,x])
          setTokenCount(tokenCount+1)
          console.log('tokens',[...tokens, newTokenData])
          setToken([...tokens, newTokenData])
        } catch(err) {
          console.error(err)
        }
    }
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

  
  const rows =  [{id:1,doc:'abc', ownerAddress:'abcs'},{id:2,doc: 'abcd',ownerAddress:'abcdss'}]
//   const rows = []
  const columns: GridColDef[] = [
      {field: "id",headerName:'No.', width:70}, 
      {field:"doc", headerName:'Document', width:130},
      {field: "ownerAddress", headerName:'Owner Address', width:160},
    ]

  return (
    <Layout>
    <Container component="main" maxWidth='sm'>        
        <Box sx={{ width: '100%', maxWidth: 1000, marginTop: '10px' }} >
        <Typography variant="h4" component="div" gutterBottom>
            Welcome {name}
            {/* Welcome */}
        </Typography>
        <Grid>
            <Grid item>
        <Typography variant="h5">Uploaded Files</Typography>    
        </Grid>
        <Grid alignItems="center">
        <div style={{ height: 400, width: '100%', marginLeft:'0px' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={rows.length>5? [5]: [rows.length]}
            />
        </div>
        
        </Grid>
        </Grid>
        
        </Box>  

    </Container>
    </Layout>
  );
};

export default Account;
