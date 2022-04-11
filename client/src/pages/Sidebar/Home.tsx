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
} from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useNavigate, useLocation } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import Layout from './Layout'

import { connect, useSelector } from 'react-redux';



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
  const [tokens, setToken] = useState<TestResponseInterface[]>([]);
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

  
  
  const rows =  [{id:1,doc:'abc', ownerAddress:'abcs'},{id:2,doc: 'abcd',ownerAddress:'abcdss'}]
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
