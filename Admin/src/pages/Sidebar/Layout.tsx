import { ReactNode } from "react";
import Header from "./Header";
import CustomDrawer from "./Sidebar";
import {Toolbar} from '@mui/material';
import { makeStyles } from "@material-ui/core/styles";
import { DrawerContextProvider } from "../../context/Sidebar";

const useStyles = makeStyles(() => ({
  root: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    background: "#2a2a2a",
    padding: 'none',
    width: '100%',
  },
  container: {
    display: "flex",
    flex: 1,
  },
  main: {
    flex: 1,
  },
}));

type Props = {
  children: NonNullable<ReactNode>;
};

const Layout: React.FC<Props> = ({ children }) => {
  const classes = useStyles();
  return (
    <DrawerContextProvider>
      <div className={classes.root}>
        <Header />
        <Toolbar />
        <div className={classes.container}>
          <CustomDrawer />
          <main className={classes.main}>{children}</main>
        </div>
      </div>
    </DrawerContextProvider>
  );
};

export default Layout;