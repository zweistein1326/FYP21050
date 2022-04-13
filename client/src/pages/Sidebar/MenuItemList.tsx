import {Grid, List} from "@mui/material";
import { useLocation } from "react-router-dom";
// import {makeStyles} from '@mui/styles'
import { makeStyles, Theme } from "@material-ui/core/styles";

import { DRAWER_LIST } from "./menu";
import MenuItem from "./MenuItem";

const useStyles = makeStyles(() => ({
  padding: {
    padding: 0,
    textDecoration: 'none',
    color: "white",
  },
  textDecoration : {
      textDecoration: "none"
  }
}));

const MenuItemsList = () => {
  const classes = useStyles();

  const { pathname } = useLocation();

  return (
    <Grid>
      <List className={classes.padding}>
        {DRAWER_LIST.map(({ literal, route, Icon }) => (
          <MenuItem
            Icon={Icon}
            literal={literal}
            route={route}
            key={route}
            selected={pathname === route} 
          >
              {literal}
          </MenuItem>
        ))}
        {/* <Link to="first" style={{ textDecoration: 'none' }}>
            <MenuItem style={{ paddingLeft: 13 }}>Team 1</MenuItem>
        </Link> */}
      </List>
    </Grid>
  );
};

export default MenuItemsList;