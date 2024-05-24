import React, {useEffect, useState} from 'react';
import {useNodeAPI} from "../hooks/useNodeAPI.jsx";
import {Link} from 'react-router-dom'

const BusinessList = () => {
    const { businesses, loadBusinesses, loadBusinessDetail, setSearchTerm, searchTerm, setCategories, categories, setPrice, price } = useNodeAPI();
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

    // Debouncing for search function so if search button is not pressed after querying, after 3s it will automatically apply the params search. Debounce only if there is/are query/queries
    useEffect(() => {
        if (term || category || priceFilter) {
            const handler = setTimeout(() => {
                setSearchTerm(term);
                setCategories(category);
                setPrice(priceFilter);
                loadBusinesses(true, term, category, priceFilter);
            }, 3_000);
            // Cleanup function to clear the timeout if the user types again
            return () => clearTimeout(handler);
        }
    }, [term, category, priceFilter]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchTerm(term);
        setCategories(category);
        setPrice(priceFilter);
        loadBusinesses(true, term, category, priceFilter);
    };

    const handleClick = (id) => {
        // history.push(`/business/${id}`);
    };
    const handleBusinessClick = async (id) => {
        await loadBusinessDetail(id);
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
                            <li key={`${business.id}-${indeks}`} className="hover:bg-gray-500 p-2">
                                <h2>{business.name}</h2>
                                <p>{business.location.display_address.join(', ')}</p>
                                <p>Rating: {business.rating}</p>
                                <p>Price: {business.price}</p>
                                <img src={business.image_url} alt={business.name} width="100"/>
                                <Link
                                    to={`/business/${business.id}`}
                                    onClick={() => handleBusinessClick(business.id)}
                                    className="cursor-pointer">
                                    <button>Detail</button>
                                </Link>
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
