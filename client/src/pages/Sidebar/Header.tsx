// import AppBar from "@material-ui/core/AppBar";
// import Toolbar from "@material-ui/core/Toolbar";
// import IconButton from "@material-ui/core/IconButton";
// import MenuIcon from "@material-ui/icons/Menu";
// import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
// import Typography from "@material-ui/core/Typography";
import { makeStyles, Theme } from "@material-ui/core/styles";
// import { useDrawerContext } from "../contexts/drawer-context";
import {useDrawerContext} from "../../context/Sidebar"
// import {AppBar, Toolbar,  Typography} from '@mui/material';
// import {makeStyles} from '@mui/styles'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import  MenuIcon  from "@material-ui/icons/Menu";
import {AppBar, Toolbar, IconButton, Typography} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    // background: theme.palette.primary.dark,
    // color: theme.palette.secondary.light,
    color: "#C41E3A",
    background: "#16161d"
  },
  icon: {
    padding: theme.spacing(1),
  },
  title: {
    margin: "auto",
    align: "center",
    // color: "#ce2029",
    color: "#e34234",
    fontFamily: "Consolas",
    fontSize: "200%"
  },
}));

const Header = () => {
  const classes = useStyles();
  const { isOpened, toggleIsOpened } = useDrawerContext();
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
      </Toolbar>
    </AppBar>
  );
};

export default Header;