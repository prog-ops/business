import React, {useEffect, useState} from 'react';
import {useNodeAPI} from "../hooks/useNodeAPI.jsx";

const BusinessList = () => {
    const { businesses, loadBusinesses, setSearchTerm, searchTerm, setCategories, categories, setPrice, price } = useNodeAPI();
    const [term, setTerm] = useState('');
    const [category, setCategory] = useState('');
    const [priceFilter, setPriceFilter] = useState('');

    useEffect(() => {
        loadBusinesses(true, searchTerm, categories, price);// Load initial set of businesses on mount

        // This will show duplication if using only business.id for key, add the index to prevent it
        // console.log('Business IDs:', businesses.map(business => business.id));
    }, [
        searchTerm,
        categories,
        price
        // without custom params, set no deps as load is called by user interaction
    ]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchTerm(term);
        setCategories(category);
        setPrice(priceFilter);
        loadBusinesses(true, term, category, priceFilter);
    };

    return (
        <div>
            <h1>Businesses</h1>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="Search e.g. beef, eat, etc...."
                />
                <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Category"
                />
                <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
                    <option value="">Select Price</option>
                    <option value="1">$</option>
                    <option value="2">$$</option>
                    <option value="3">$$$</option>
                    <option value="4">$$$$</option>
                </select>
                <button type="submit">Search</button>
            </form>
            {businesses.length > 0 ? (
                <div>
                    <ul>
                        {businesses.map((business, indeks) => (
                            <li key={`${business.id}-${indeks}`}>
                                <h2>{business.name}</h2>
                                <p>{business.location.display_address.join(', ')}</p>
                                <p>Rating: {business.rating}</p>
                                <p>Price: {business.price}</p>
                                <img src={business.image_url} alt={business.name} width="100"/>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => loadBusinesses(false, searchTerm, categories, price)}>Load More</button>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default BusinessList;
