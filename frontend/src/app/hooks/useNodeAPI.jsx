import React, { createContext, useState, useContext } from 'react';

const YelpContext = createContext();

const backendUrl = 'http://localhost:3001/api/yelp'
// const url = `${backendUrl}?offset=${currentOffset}&limit=${limit}&term=${term}&categories=${categories}&price=${price}`

export const YelpProvider = ({ children }) => {
    const [businesses, setBusinesses] = useState([]);
    const [offset, setOffset] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState('');
    const [price, setPrice] = useState('');
    const limit = 5;

    const loadBusinesses = async (
        reset = false,
        term = '',
        categories = '',
        price = ''
    ) => {
        try {
            const currentOffset = reset ? 0 : offset;
            const url = new URL(backendUrl);
            url.searchParams.append('offset', currentOffset);
            url.searchParams.append('limit', limit);
            if (term) url.searchParams.append('term', term);
            if (categories) url.searchParams.append('categories', categories);
            if (price) url.searchParams.append('price', price);

            const response = await fetch(url);
            const data = await response.json();
            setBusinesses(reset ? data.businesses : [...businesses, ...data.businesses]);
            if (!reset) setOffset(offset + limit);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <YelpContext.Provider value={{
            businesses,
            loadBusinesses,
            setSearchTerm,
            searchTerm,
            setCategories,
            categories,
            setPrice,
            price
        }}>
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
