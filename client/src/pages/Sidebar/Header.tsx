import { makeStyles, Theme } from "@material-ui/core/styles";
import {useDrawerContext} from "../../context/Sidebar"
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import  MenuIcon  from "@material-ui/icons/Menu";
import {AppBar, Toolbar, IconButton, Typography, Button} from "@material-ui/core";
import { useNavigate } from "react-router-dom";


const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    color: "#C41E3A",
    background: "#16161d"
  },
  icon: {
    padding: theme.spacing(1),
  },
  title: {
    margin: "auto",
    align: "center",
    color: "#e34234",
    fontFamily: "Consolas",
    fontSize: "200%"
  },
}));

const Header = () => {
  const classes = useStyles();
  const { isOpened, toggleIsOpened } = useDrawerContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (localStorage.getItem("user")) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  }
  return (
    <AppBar className={classes.appBar}>
      <Toolbar>
        <IconButton
          color="inherit"
          onClick={() => toggleIsOpened(!isOpened)}
          className={classes.icon}
        >
          {isOpened ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
        <Typography variant="h6" className={classes.title} align="center" >
          <b>ALGOL.</b> 
        </Typography>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;