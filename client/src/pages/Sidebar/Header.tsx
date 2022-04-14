import { makeStyles, Theme } from "@material-ui/core/styles";
import {useDrawerContext} from "../../context/Sidebar"
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import  MenuIcon  from "@material-ui/icons/Menu";
import {AppBar, Toolbar, IconButton, Typography} from "@material-ui/core";

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