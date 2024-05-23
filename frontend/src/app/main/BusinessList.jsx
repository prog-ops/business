import React, {useEffect, useState} from 'react';
import {useNodeAPI} from "../hooks/useNodeAPI.jsx";

const BusinessList = () => {
    const { businesses, loadBusinesses, setSearchTerm, searchTerm } = useNodeAPI();
    const [term, setTerm] = useState('');

    useEffect(() => {
        loadBusinesses(true, searchTerm);
        // This will show duplication if using only business.id for key, add the index to prevent it
        // console.log('Business IDs:', businesses.map(business => business.id));

    }, [
        searchTerm
        // without term, set no deps as load called by user interaction
    ]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchTerm(term);
        loadBusinesses(true, term);
    };

    return (
        <div>
            {businesses.length > 0 ? (
                <div>
                    <h1>Businesses</h1>
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                            placeholder="Search e.g. beef, eat, etc...."
                        />
                        <button type="submit">Search</button>
                    </form>
                    <ul>
                        {businesses.map((business, indeks) => (
                            <li key={`${business.id}-${indeks}`}>
                                <h2>{business.name}</h2>
                                <p>{business.location.display_address.join(', ')}</p>
                                <p>Rating: {business.rating}</p>
                                <p>Price: {business.price}</p>
                                <img key={business.id} src={business.image_url} alt={business.name} width="100"/>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => loadBusinesses(false, searchTerm)}>Load More</button>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default BusinessList;
