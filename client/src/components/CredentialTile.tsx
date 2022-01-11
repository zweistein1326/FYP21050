import { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux"
import { Alert, Box, Button, Typography, Link, TextField } from "@mui/material";
import { useMutation } from "@apollo/client";
import { CHANGEPENDINGSTATUS, CHANGESTATUS } from "../graphql";
import axios, { AxiosResponse } from "axios";

const CredentialTile = (props:any) => {
    const account = useSelector((state:any)=> state.auth.account);
    console.log(account);
    const {credential,title} = props;
    const [changeCredentialPendingStatus,{loading,error}] = useMutation(CHANGEPENDINGSTATUS);
    const [changeCredentialStatus,{loading:loading2,error:error2}] = useMutation(CHANGESTATUS);
    const [receiver, setReceiver] = useState<string>('');
    const [owner, setOwner] = useState<string>('');

    const transfer = async() => {
        try{
            const newOwner : AxiosResponse<any> = await axios.post('http://127.0.0.1:8000/transfer',{
            from:account,
            to: receiver,
            tokenId: props.tokenData.tokenId
        });
        alert(`Transferred to ${newOwner.data.newOwner}`)
        setOwner(newOwner.data.newOwner);
        setReceiver('');
        console.log(newOwner);
        }catch(e){
            alert('Could not complete transfer');
        }
        
        // update token owner
    }

    useEffect(()=>{
        setOwner(props.owner);
    },[]);

    return(
        <Box>
            <Link color='black' underline='hover' variant='button' href={props.newTokenData.tokenUri} key={props.tokenData.tokenId} display='block' >{props.tokenCount}.  {props.tokenData.name}</Link>
            <Typography>Owner: {owner}</Typography>
            <TextField name="receiver_address" placeholder="Transfer to" value={receiver} onChange={(receiver)=>{setReceiver(receiver.target.value)}}/>
            <Button onClick = {transfer}>Transfer</Button>
        </Box>
    )
}


export default CredentialTile;