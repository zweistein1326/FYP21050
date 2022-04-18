import {Box, Button, Typography} from '@mui/material';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Credential } from '../models/Credential';

const CredentialPage = (props:any) => {
    const { credentialId }:any = useParams();
    const [credential,setCredential] = useState<Credential|null>(null);
    const [isAuth,setAuth] = useState(
        props.auth.user !== null //set inital to public
    );    

    const acceptCredential=()=>{
        // change pending status to false
    }

    const rejectCredential = ()=>{
        // delink credential from user's account
    }
    
    const fetchCredentialInfo = () => {
        var cred  = props.auth.user.credentials[credentialId];
        setCredential(cred);
    }

    useEffect(fetchCredentialInfo,[]);
    
    return(
        <>
        <Typography>
            Hi this is credential no. {`${credentialId}`}
        </Typography>
        {credential?
        <>
            <Typography>Issuer:<Link to={`/user/${credential.issuer}`}>{credential.issuer}</Link></Typography>
            <Typography>Credential: {credential.title}</Typography>
            <Typography>Value: {credential.value}</Typography>
            <Typography>Verified: True</Typography>
            <Typography>Url:<a href={credential.url}> {credential.url}</a></Typography>
            <Typography>View History</Typography>
            <Typography>Shared with: </Typography>
            {credential.pending ?
            <Box>
            <Button 
            onClick={()=>{}} 
            color="success" 
            variant="contained" 
            sx={{ mt:3, mb:2 }}>
                Accept
            </Button>
            <Button onClick={()=>{}}
            color="error"
            variant="contained"
            sx={{ mt:3, mb:2 }}>
                Reject
            </Button>
            </Box> 
            :
            <Button onClick={()=>{}}
            color="error"
            variant="contained"
            sx={{ mt:3, mb:2 }}>
                Delete
            </Button>}
        </>:
           null}
        
        </>
    )
}

const mapStateToProps =(state:any)=>({
    auth:state.auth
})

export default connect(mapStateToProps)(CredentialPage);