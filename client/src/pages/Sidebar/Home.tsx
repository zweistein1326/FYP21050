// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ethers } from 'ethers';
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
  Card,
} from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useNavigate, useLocation } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import Layout from './Layout'
import { login } from '../../actions/auth';
import { useCookies } from 'react-cookie';

import { connect, useDispatch, useSelector } from 'react-redux';



declare var window: any;


 interface TestResponseInterface {
   name: string,
   tokenId: number
 }

const Account = () => {
  const navigate = useNavigate();
//   const {state} = useLocation();
  const state = useSelector((s: any)=> s.auth) 
  const dispatch = useDispatch();
  console.log(state)
  const [tokens, setToken] = useState<TestResponseInterface[]>([]);
  const [name, setName] = useState<string>('');
  const [tableData, setTableData] = useState<any[]>([])
  const [cookies, setCookie] = useCookies(['user']);
  const [dataRows, setDataRows] = useState<any[]>([]);
  
  const baseUrl = "http://127.0.0.1:8000/"

  console.log("My token is", tokens)
  console.log(state,'state')

  useEffect(()=>{
    const retrievedObj :any = localStorage.getItem('user') || '';
    const user = JSON.parse(retrievedObj)
    console.log('check storage',user.user.privateKey)
    if(user){
        console.log(user.user.username, 'inside')
        setName(user.user.username)
    }
    getCredentials();
    // if(cookies.username!==null){
    //     dispatch(login(payloadStore))
    // }
  },[state])

  
  const getCredentials = async () =>{
    const retrievedString :any = localStorage.getItem('user') || '';
    const user = JSON.parse(retrievedString);
    const res : AxiosResponse<any> = await axios.get(baseUrl+'getFilesByUser?userId='+user.user.id)
    console.log(res.data,baseUrl+'getFilesByUser?userId'+user.user.id);
    var num = 1
    res.data.credentials.forEach((i:any)=>{
      setDataRows(oldData=>[...oldData, {id:num, doc:i.data[0], link:i.data[2], valid:i.isValid}] )
      num = num + 1
    })
    console.log('data rows',dataRows)
  }

  
  
  const rows = dataRows;
  const columns: GridColDef[] = [
      {field: "id",headerName:'No.', width:50}, 
      {field:"doc", headerName:'Document', minWidth:250, flex:2},
      {field: "link", headerName:'Link', minWidth: 250, flex:2
        // valueGetter: (params) => 
        //   return (<a href={params.getValue("id")}>{params.getValue("id")}</a>)
      },
      {field: "valid", headerName:'Valid', minWidth: 50, flex:2},
    ]

  return (
    <Layout>
    <Container component="main" sx={{width: '100%'}}>        
        <Box sx={{ width: '100%', maxWidth: 1500, marginTop: '10px' }} >
        <Typography variant="h4" component="div" gutterBottom>
            Welcome {name}
            {/* Welcome */}
        </Typography>
        <Grid>
        <Card sx={{width: '100%'}}>

            <Grid item>
                <br></br>
        <Typography variant="h5">Uploaded Files</Typography>    
        <br></br>
        </Grid>
        <Grid alignItems="center">
        <div style={{ height: 400, width: '100%', marginLeft:'0px', background:"white" }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={rows.length>5? [5]: [rows.length]}
            />
        </div>
        
        </Grid>
        </Card>
        </Grid>
        
        </Box>  

    </Container>
    </Layout>
  );
};

export default Account;
