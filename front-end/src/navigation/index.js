import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "../pages";

const MainNavigator = () => {

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={<Home />}
                />
            </Routes>
        </Router>
    );
};

export default MainNavigator;