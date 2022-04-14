export default (state = {}, action:any) => {
    switch (action.type) {
<<<<<<< .merge_file_g6A2s8
        case 'LOGIN':{
            const {username, publicKey} = action.payload
            console.log(action.payload)
            const newUser = [
                {username, publicKey, signedIn : true}
            ]
            return {
                newUser
            }
        }
            
        case 'CREDENTIALS':
            return { username: action.username }
=======
        case 'SET_ACCOUNT':
            return {account:action.account}
        // case 'CREDENTIALS':
        //     return { username: action.username }
>>>>>>> .merge_file_zyCOwo
        case 'LOGOUT':
            return {}
        default: return state;
    }
}