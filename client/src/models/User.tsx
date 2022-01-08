import { Credential } from "./Credential";

export interface User{
    id: String,
    email: String,
    username: String,
    publicKey: String,
    credentials: Credential[]
}
