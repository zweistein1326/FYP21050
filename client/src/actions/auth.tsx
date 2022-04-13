import { AnyARecord } from "dns";
import { User } from "../models/User";

export const login = ({username, publicKey}:User) => ({
    type: 'LOGIN',
    payload: {
        username,
        publicKey,
        signedIn: true
    }
})

export const credentials = ({ username }:any) => ({
    type: 'CREDENTIALS',
    payload:{username}
})

export const startLogin = () => {
    return (dispatch:any) => {
        // return firebase.auth().signInWithPopup(googleAuthProvider);
    }
}

// export const address = ({ username }:any) => ({
//     type: 'CREDENTIALS',
//     payload:{username}
// })
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