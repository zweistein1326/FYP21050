import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout'
import { useDispatch, useSelector } from 'react-redux';


declare var window: any;

const Account = () => {
  const [name, setName] = useState<string>('');
  const [dataRows, setDataRows] = useState<any[]>([]);
  
  const baseUrl = "http://127.0.0.1:8000/"

  useEffect(()=>{
    const retrievedObj :any = localStorage.getItem('user') || '';
    const user = JSON.parse(retrievedObj)
    console.log('check storage',user.user.privateKey)
    if(user){
        console.log(user.user.username, 'inside')
        setName(user.user.username)
    }
    getCredentials();
  },[])

  let privateKey: any;
  const retrievedString :any = localStorage.getItem('user');
  const user = retrievedString ? JSON.parse(retrievedString) : null;
  if(user){
    let pks :any = localStorage.getItem('privateKey' + user.user.username) ? localStorage.getItem('privateKey' + user.user.username) : "";
    privateKey = (pks === "") ? {} : JSON.parse(pks);  
  }
  
  
  const getCredentials = async () =>{
    const res = await fetch(baseUrl+'credentials?address=0xF03aDB7B25fd5593b304042A6AEB421fA37B3D17').then(res => res.json());
    console.log(res);
    let credentials = res.credentials.map((cred: any) => { 
      return {
        ...cred,
        issuedBy: `HKU: ${cred.issuedBy}`,
        owners: cred.owners.join(','),
        viewers: cred.viewers.join(',')
      }
    })
    setDataRows(credentials);
  }
  
  const rows = dataRows;
  const columns: GridColDef[] = [
      {field: "id", headerName:'Credential Hash', width:250}, 
      {field: "data", headerName:'Data', width:250},
      {field: "issuedBy", headerName:'Issuer', width:250},
      {field: "viewers", headerName:'Viewers', width:250},
      {field: "created_at", headerName:'Created At', minWidth:200, flex:2},
  ]

  return (
    <Layout>
    <Container component="main" sx={{width: '100%'}}>        
        <Box sx={{ width: '100%', maxWidth: 1500, marginTop: '10px' }} >
        <Typography style={{color:'#fff'}} variant="h4" component="div" gutterBottom>
            Welcome {name}
        </Typography>
        <Grid>
        <Card sx={{width: '100%'}}>

            <Grid item xs={2}>
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
