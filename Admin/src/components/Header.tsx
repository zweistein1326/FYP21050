import {Button} from '@mui/material'
import { useNavigate } from 'react-router-dom';

const Header = (props:any) => {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
        props.setLoggedIn(!props.loggedIn);
    };

    const handleLogin = ()=>{

    }

    return(
        props.loggedIn? <Button onClick={handleLogout}>Logout</Button>: <Button href="/login">Login</Button>
        )
}

export default Header;


