import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CustomRoute = ({ component: Component, protect, ...rest }) => {
    const { user } = useSelector(state => state.user);

    // Conditionally render based on authentication or other logic
    const RenderComponent = protect && !user ? (
        <Navigate to="/login" />
    ) : (
        <Component />
    );

    return <Route {...rest} element={RenderComponent} />;
};

export default CustomRoute;