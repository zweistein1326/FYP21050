import { gql } from "@apollo/client";

export const ADDCREDENTIAL = gql`
    fragment Payload on REST{
        title: String,
        value: String,
        issuerId: String,
        receiverId: String
    }
    mutation AddCredential($input:Payload!){
        addCredential(input:$input) @rest(type:"Post",method:"POST",path:"/addCredential"){
            status
            credential
            message
        }
    }
`;

export const REQUESTCREDENTIAL = gql`
    fragment Payload on REST{
       id:String,
       message:String
    }
    mutation RequestCredential($input:Payload!){
        requestCredential(input:$input) @rest(type:"Post",method:"POST",path:"/requestCredential"){
            status
            message
        }
    }
`;


export const CHANGEPENDINGSTATUS = gql`
    fragment Payload on REST {
        id: String
    }
    mutation ChangeCredentialPendingStatus($input: Payload!){
        changeCredentialPendingStatus(input: $input)
            @rest(type: "Post", method: "POST", path: "/updateCredentialPendingStatus") {
                status
            }
    }
`;

export const CHANGESTATUS = gql`
    fragment Payload on REST {
        id: String
    }
    mutation ChangeCredentialStatus($input: Payload!){
        changeCredentialStatus(input: $input)
            @rest(type: "Post", method: "POST", path: "/updateCredentialStatus") {
                status
            }
    }
`;