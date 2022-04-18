import { useMutation } from "@apollo/client";
import { Box, Button, FormControl, FormHelperText, Input, InputLabel, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ADDCREDENTIAL } from "../graphql";

var CryptoJS = require('crypto-js');
var SHA256 = require('crypto-js/sha256');

const privateKey = 'MIICXAIBAAKBgQDLyT/Ah5gtJu74KRpNatZgFzdePXdRYLvknjBCqanlhzkfE4NwUIVGK1/lumyZVuA1zBXvDrXXRm4tuDod8ROQYEPOw25A+9Eq6UGBRUOO1/zWkpumPiJtIgLFDbto98VfD0ooISc0GLHm5dBidxri5IHUT8Wl+gTeIqRJDYI9nwIDAQABAoGAQshH6StGdn2M0Kx/nyFE8aaKEYspH/UIfipM/HunXr3KvWFisJriohUyzxEh57ptrZOdGIOEmfDNyJPYD9niI9d8ETiC0qHfMUblxNG5McC8ATLARp0bKXJ7XT4dJJQ15/yltrH+KxIVZ7fEoMHXHxXYp3AYVrjaaupZzXK1WBkCQQDpLGSK+624L0DPhyuTNLfWMHCaOGEaVDGGese+fhZ3KKNk3HhaWyqX2t3EALFqp3R2pCnyjT8I7sNYiAct/XZbAkEA37xgJDUUZO0mZr2dtWtOtK5BDsqM2Cpp1iSL5kggDcuuuepvNfxh/goEyo4FAXBC+GBQcdgXx9GOmrV/7tyhDQJBAMspoNjv/Sb0FRY9Ahya3GrFffcBlKmqHhS8OfmiRtTAFc21wy+HK49wZbV3nR3+lZ0h4GKz6u5PiulCbG8H3u0CQGDMHURM+q/Xsl+M9eiBrqGZKmh91YXIg9W0JhrRZZzSXJvvA4J12OeR6hTAcQX4TeErumImvdMjpPDmSZ1MMxkCQGMB7L+HemusnZP6JvBYyUwlkvSDoqkRUABW74cCu5dsHDBOVnAtBbyXGH1JgCSkqLtk+1ZKgH7I8M9VL7zs66s='
// import private key from local storage

const AddCredential = (props:any) => {

    const navigate = useNavigate();
    const [addCredential,{loading,error}] = useMutation(ADDCREDENTIAL);


    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        let tempPayload = {
            title: data.get('credential_title'),
            value: data.get('credential_value'),
            issuerId: props.auth.user.id,
            receiverId: data.get('receiver_id')
        }

        // generate hash

        const hash = SHA256(tempPayload).toString();
        
        // sign hash

        var signature = CryptoJS.AES.encrypt(hash,privateKey).toString();

        console.log(signature);

        let payload = {...tempPayload, hash, signature}

        addCredential({
            variables:{
                input:payload
            }
        }).then((res)=>{
            const {status, credential, message} = res.data.addCredential;
            if(status==="success"){
                console.log(credential);
            }
        })
    }
    return (
        <Box>
            <Typography>Create new credential</Typography>
            <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
                <TextField
                margin ="normal"
                required
                fullWidth
                id="title"
                label="Credential title"
                name="credential_title"
                autoComplete="text"
                autoFocus/>
                Select credential type: Text, Image, JSON, Video, Smart Contract, 
                <TextField
                margin ="normal"
                required
                fullWidth
                id="value"
                label="Credential value"
                name="credential_value"
                autoComplete="text"
                autoFocus/>
                <TextField
                margin ="normal"
                required
                fullWidth
                id="receiver_id"
                label="Receiver Id"
                name="receiver_id"
                autoComplete="text"
                autoFocus/>
                <Button 
                type="submit" 
                variant="contained" 
                sx = {{ mt:3, mb:2 }}
                disabled={loading}
                >
                    Submit
                </Button>
            </Box>
        </Box>
    )
}

const mapStateToProps = (state:any)=>({
    auth:state.auth
})

export default connect(mapStateToProps)(AddCredential);