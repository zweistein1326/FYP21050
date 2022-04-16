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
import { DataGrid, GridColDef, GridValueGetterParams, gridVisibleSortedRowEntriesSelector } from '@mui/x-data-grid';
import { useNavigate, useLocation } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import Layout from './Layout'
import { login } from '../../actions/auth';
import { useCookies } from 'react-cookie';
import { connect, useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import {encrypt, decrypt} from '../../components/rsa/utils';


declare var window: any;

const Account = () => {
  const navigate = useNavigate();
  const state = useSelector((s: any)=> s.auth) 
  const dispatch = useDispatch();
  console.log(state)
  const [name, setName] = useState<string>('');
  const [tableData, setTableData] = useState<any[]>([])
  const [cookies, setCookie] = useCookies(['user']);
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
  },[state])

  
  const getCredentials = async () =>{
    const retrievedString :any = localStorage.getItem('user') || '';
    const user = JSON.parse(retrievedString);
    const res : AxiosResponse<any> = await axios.get(baseUrl+'getFilesByUser?userId='+user.user.id)
    console.log(res.data,baseUrl+'getFilesByUser?userId'+user.user.id);
    var num = 1
    res.data.credentials.forEach( async (i:any)=>{
      var doc = ''
      var link = ''
      var assetHash = ''
      var t = ''
      var s = ''
      var r = ''
      i.viewers.forEach((item:any)=>{
        if(item.id === user.user.id){
          if(item.permissions.transfer){
            t = 'Allowed'
          }else{
            t = 'Disallowed'
          }
          if(item.permissions.share){
            s = 'Allowed'
          }else{
            s = 'Disallowed'
          }
          if(item.permissions.revoke){
            r = 'Allowed'
          }else{
            r = 'Disallowed'
          }
    
        }
        console.log('item',item)
        doc = item.data.fileName
        link = item.data.metadataUrl
        assetHash = item.data.assetHash
      });

      const resp : AxiosResponse<any> = await axios.get(baseUrl+'getUserById?userId='+i.currentOwner);

      const pks :any = localStorage.getItem('privateKey' + user.user.username) ? localStorage.getItem('privateKey' + user.user.username) : "";
      const privateKey = (pks === "") ? {} : JSON.parse(pks);
      
      i.viewers.forEach(async (it: any) => {
        if (it.id === user.user.id) {
          const ah = await decrypt(it.data.assetHash, privateKey);
          const dmrl = await decrypt(it.data.metadataUrl, privateKey);
          setDataRows((oldData)=>[...oldData, {
            id:num, 
            owner: resp.data.user.username,
            doc:it.data.fileName, 
            date: i.createdAt,
            link: dmrl,
            assetHash: ah, 
            valid:i.isValid,
            transfer: t,
            revoke: r,
            share: s, 
          }] )
        }
      })
      num = num + 1
    })
  }
  
  const rows = dataRows;
  const columns: GridColDef[] = [
      {field: "id",headerName:'No.', width:50}, 
      {field: "owner",headerName:'Owner', width:100}, 
      {field: "date", headerName:'UNIX Timestamp', width:150},
      {field:"doc", headerName:'Document', minWidth:200, flex:2},
      {field: "link", headerName:'Link', minWidth: 200, flex:2},
      {field: "assetHash", headerName:'Asset Hash', minWidth: 200, flex:2},
      {field: "valid", headerName:'Valid', minWidth: 100, flex:2},
      {field: "transfer",headerName:'Transfer', width:100}, 
      {field: "revoke",headerName:'Revoke', width:100}, 
      {field: "share",headerName:'Share', width:100}, 

    ]

  return (
    <Layout>
    <Container component="main" sx={{width: '100%'}}>        
        <Box sx={{ width: '100%', maxWidth: 1500, marginTop: '10px' }} >
        <Typography variant="h4" component="div" gutterBottom>
            Welcome {name}
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
