export default (state = {}, action:any) => {
    switch (action.type) {
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
        case 'LOGOUT':
            return {}
        default: return state;
    }
}