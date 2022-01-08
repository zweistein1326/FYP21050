import { AnyARecord } from "dns";
import { User } from "../models/User";

export const login = (user:User) => ({
    type: 'LOGIN',
    user:user
})

export const credentials = ({ username }:any) => ({
    type: 'CREDENTIALS',
    username
})

export const startLogin = () => {
    return (dispatch:any) => {
        // return firebase.auth().signInWithPopup(googleAuthProvider);
    }
}

export const logout = () => ({
    type: 'LOGOUT',
})

// export const startLogout = () => {
//     return (dispatch) => {
//         //if auth provider == firebase
//         // return firebase.auth().signOut()
//         // startLogoutSSOB();
//     }
// }