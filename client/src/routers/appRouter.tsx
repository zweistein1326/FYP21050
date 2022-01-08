import { BrowserRouter, Router, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import {createBrowserHistory} from 'history';
import Login from "../pages/Login";
import Home from "../pages/Home";
import Register from "../pages/Register";
import CredentialPage from "../pages/CredentialPage";
import AddCredential from "../pages/AddCredential";

export const history = createBrowserHistory();

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <PublicRoute path="/" component={AddCredential} />
                <PublicRoute path="/register" component={Register} />
                <PrivateRoute path="/user/:id" component={Home} />
                <PrivateRoute path="/user/:id/:credentialId" component={CredentialPage} />
                <PrivateRoute path="/addCredential" component={AddCredential} />
                {/* <PublicRoute component={NotFoundPage} /> */}
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;