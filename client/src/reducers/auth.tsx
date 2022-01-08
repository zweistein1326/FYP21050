export default (state = {}, action:any) => {
    switch (action.type) {
        case 'LOGIN':
            return {user:action.user}
        // case 'CREDENTIALS':
        //     return { username: action.username }
        case 'LOGOUT':
            return {}
        default: return state;
    }
}