import { useMutation } from "@apollo/client";
import { Box, Button, TextField, Typography } from "@mui/material"
import { REQUESTCREDENTIAL } from "../graphql";

const RequestCredential = (props:any) => {

    const [requestCredential,{loading,error}] = useMutation(REQUESTCREDENTIAL);

    const handleSubmit = async(event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const payload = {
            id: data.get('user_id'),
            message: data.get('message')
        }

        requestCredential({
            variables:{
                input: payload
            }
        }).then((res)=>{
            const {status,message} = res.data.requestCredential;
            console.log(status, message);
        });
    }

    return (
        <Box>
            <Typography variant="h4">Request credential from user</Typography>
            <Box component="form" sx={{ mt:1 }} onSubmit={handleSubmit}>
                <TextField
                margin="normal"
                required
                fullWidth
                id = "user_id"
                label = "User Id"
                name = "userId"
                autoComplete="text"
                autoFocus
                />
                <TextField
                margin="normal"
                fullWidth
                id = "message"
                label = "Message"
                name = "message"
                autoComplete="text"
                />
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

export default RequestCredential;