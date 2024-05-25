import React, {useEffect, useState} from 'react';
import {useNodeAPI} from "../hooks/useNodeAPI.jsx";
import {Link} from 'react-router-dom'

const inputs = 'rounded-md p-2 me-4'

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
            <h1 className='mb-8'>Businesses List</h1>
            <form
                className='mb-8 p-2'
                onSubmit={handleSearch}>
                <input
                    className={inputs}
                    type="text"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="Search e.g. beef, eat, etc...."
                />
                <input
                    className={inputs}
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Category"
                />
                <select
                    className={inputs}
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}>
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
                            <li
                                key={`${business.id}-${indeks}`}
                                className="overflow-hidden flex relative bg-blue-950 rounded-3xl shadow-lg shadow-blue-950 hover:bg-blue-900 mb-8"
                                style={{height: '300px'}} // Set a fixed height for the list item
                            >
                                <img
                                    className="w-1/5 object-cover rounded-lg"
                                    src={business.image_url}
                                    alt={business.name}
                                    style={{height: '100%'}} // Ensure the image takes the full height of its container
                                />
                                <div
                                    className="flex-grow px-4 py-4 flex flex-col justify-between relative ml-2"> {/* Adjusted container to grow and added margin-left */}
                                    <div
                                        className="flex justify-between items-start"> {/* Added flexbox to position chips */}
                                        <h1>{business.name} ⭐ {business.rating}</h1>
                                    </div>
                                    <div className="flex flex-col space-y-4 mb-2"> {/* Added space between the elements */}
                                        <p className="flex text-gray-300">{business.location.display_address.join(', ')}</p>
                                        <p className="flex">{business.price}</p>
                                    </div>
                                    {business.categories.length > 0 ?
                                        <div className="flex flex-wrap">
                                            {business.categories.map((item, index) => (
                                                    <div
                                                        className="bg-blue-800 text-amber-300 text-sm px-2 py-1 rounded-full mr-2 mb-2">
                                                        {item.title}
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        : null
                                    }
                                    {business.transactions.length > 0 ?
                                        <div className="flex flex-wrap">
                                            {business.transactions.map((item, index) => (
                                                    <div
                                                        className="bg-blue-800 text-white text-sm px-2 py-1 rounded-full mr-2 mb-2">
                                                        {item === 'restaurant_reservation' ? 'RESTAURANT RESERVATION' : item.toUpperCase()}
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        : null
                                    }
                                    <Link
                                        to={`/business/${business.id}`}
                                        onClick={() => handleBusinessClick(business.id)}
                                        className="bottom-4 right-4 cursor-pointer flex items-center" // Positioned the button at the bottom right
                                    >
                                        <button
                                            className="absolute bottom-4 right-4 w-12 h-8 flex items-center justify-center bg-green-700 rounded-full text-white">
                                            {'>'}
                                        </button>
                                    </Link>
                                </div>
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
