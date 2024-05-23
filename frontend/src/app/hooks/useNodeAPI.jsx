import React, { createContext, useState, useContext } from 'react';

const YelpContext = createContext();

const backendUrl = 'http://localhost:3001/api/yelp'

export const YelpProvider = ({ children }) => {
    const [businesses, setBusinesses] = useState([]);
    const [offset, setOffset] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const limit = 5;

    const loadBusinesses = async (reset = false, term = '') => {
        try {
            const currentOffset = reset ? 0 : offset;
            const response = await fetch(`${backendUrl}?offset=${currentOffset}&limit=${limit}&term=${term}`);
            const data = await response.json();
            setBusinesses(reset ? data.businesses : [...businesses, ...data.businesses]);
            if (!reset) setOffset(offset + limit);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <YelpContext.Provider value={{ businesses, loadBusinesses, setSearchTerm, searchTerm }}>
            {children}
        </YelpContext.Provider>
    );
};

export const useNodeAPI = () => {
    const context = useContext(YelpContext);
    if (context === undefined) {
        throw new Error('useYelp must be used within a YelpProvider');
    }
    return context;
};
