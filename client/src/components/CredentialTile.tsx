import { useState } from "react";
import { connect } from "react-redux"
import { Alert, Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { CHANGEPENDINGSTATUS, CHANGESTATUS } from "../graphql";

const CredentialTile = (props:any) => {
    const {credential,title} = props;
    const [changeCredentialPendingStatus,{loading,error}] = useMutation(CHANGEPENDINGSTATUS);
    const [changeCredentialStatus,{loading:loading2,error:error2}] = useMutation(CHANGESTATUS);

    const getCredentialInfo = ()=>{
        // find info for credentialx
    }

     const acceptCredential=()=>{
        changeCredentialPendingStatus({
            variables:{
                input: {
                    id:title,
                    ownerId: props.auth.user.id
                }
            }
        }).then((res)=>{
            const {status} = res.data.changeCredentialPendingStatus;
            console.log(status);
        })
    }

    const revokeCredential = ()=>{
        alert('Are you sure you want to revoke this credential?');
        // delink credential from user's account
        changeCredentialStatus({
            variables:{
                input: {
                    id:title,
                    ownerId: props.auth.user.id
                }
            }
        }).then((res)=>{
            const {status} = res.data.changeCredentialStatus;
            console.log(status);
        })
    }

    return(
        <Box sx={{ mt:3, mb:2, border:'1px solid grey', p:2 }}>
            <Link to={`${title}`}><Typography variant="h6">{credential.title}</Typography></Link>
            {credential.pending ?
            <Box>
            <Button 
            onClick={acceptCredential} 
            color="success" 
            variant="contained" 
            sx={{ mt:3, mb:2 }}>
                Accept
            </Button>
            <Button onClick={revokeCredential}
            color="error"
            variant="contained"
            sx={{ mt:3, mb:2 }}>
                Reject
            </Button>
            </Box> 
            :
            <Button onClick={revokeCredential}
            color="warning"
            variant="contained"
            sx={{ mt:3, mb:2 }}>
                Revoke
            </Button>}
        </Box>
    )
}

const mapStateToProps = (state:any) => ({
    auth:state.auth
})
export default connect(mapStateToProps)(CredentialTile);