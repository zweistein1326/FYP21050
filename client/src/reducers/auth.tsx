export default (state = {}, action:any) => {
    switch (action.type) {
        case 'SET_ACCOUNT':
            return {account:action.account}
        // case 'CREDENTIALS':
        //     return { username: action.username }
        case 'LOGOUT':
            return {}
        default: return state;
    }
}