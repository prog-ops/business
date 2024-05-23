import React from 'react';
import BusinessList from './BusinessList';
import {YelpProvider} from "../hooks/useNodeAPI.jsx";

const BusinessApp = () => {
    return (
        <YelpProvider>
            <BusinessList />
        </YelpProvider>
    );
};

export default BusinessApp;
