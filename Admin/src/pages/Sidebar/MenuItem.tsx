import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {
  createStyles,
  darken,
  makeStyles,
  Theme,
} from "@material-ui/core/styles";
import { Link } from "react-router-dom";

import { DrawerItem } from "./Drawer";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      "&:hover": {
        backgroundColor: "#778899",
        color: theme.palette.common.white,
      },
      "&$selected": {
        backgroundColor: "#C0C0C0",
        color: theme.palette.common.white,
      },
    },
    selected: {},
    listIcon: {
      minWidth: "auto",
      paddingRight: theme.spacing(2),
      textDecoration: "none",
    },
    icon: {
      color: theme.palette.secondary.main,
    },
    linkDecoration: {
        textDecoration: 'none',
    }
    
  })
);

type Props = DrawerItem & {
  selected?: boolean;
  onClick?: () => void;
};

const MenuItem: React.FC<Props> = ({
  route,
  literal,
  Icon,
  selected,
  onClick,
}) => {
  const classes = useStyles();

  const link = (
    <ListItem
      button
      selected={selected}
      classes={{
        selected: classes.selected,
        button: classes.button,
      }}
      onClick={onClick}
    >
      <ListItemIcon className={classes.listIcon}>
        <Icon className={classes.icon} />
      </ListItemIcon>
      <ListItemText primary={literal} />
      
    </ListItem>
  );
  return route ? <Link to={route}>{link}</Link> : link;
};

export default MenuItem;