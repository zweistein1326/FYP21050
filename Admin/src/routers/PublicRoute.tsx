import React from "react";
import { connect } from "react-redux";
import { Route, Navigate } from "react-router-dom";
import Header from "../components/Header";


export const PublicRoute =({
    isAuthenticated,
    component,
    ...rest }:any) => {
        const routeComponent = (props:any)=>(
            isAuthenticated ? React.createElement(component,props): <Navigate to={'/'}/>
        )
    return(
        <Route
        {...rest}
        element={routeComponent}
        />
    )
}



const mapStateToProps = (state:any)=> ({
    isAuthenticated: !!state.auth.user.id
})

export default connect(mapStateToProps)(PublicRoute);