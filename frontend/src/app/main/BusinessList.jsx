import React, { useEffect } from 'react';
import {useNodeAPI} from "../hooks/useNodeAPI.jsx";

const BusinessList = () => {
    const { businesses, loadBusinesses } = useNodeAPI();

    useEffect(() => {
        loadBusinesses(true);
        // This will show duplication if using only business.id for key, add the index to prevent it
        // console.log('Business IDs:', businesses.map(business => business.id));

    }, [
        // no deps because load called by user interaction
    ]);

    return (
        <div>
            {businesses.length > 0 ? (
                <div>
                    <h1>Businesses</h1>
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
                    <button onClick={() => loadBusinesses()}>Load More</button>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default BusinessList;
