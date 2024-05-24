import React from 'react';
import {YelpProvider} from "../hooks/useNodeAPI.jsx";
import BusinessList from "./BusinessList.jsx";

const BusinessApp = () => {
    return (
        <BusinessList/>
    );
};

export default BusinessApp;
