import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import {useNodeAPI} from "../../hooks/useNodeAPI.jsx";

const BusinessDetail = () => {
    const {id} = useParams();
    const {businessDetail, loadBusinessDetail} = useNodeAPI();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        setCurrentImageIndex((currentImageIndex + 1) % businessDetail.photos.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((currentImageIndex - 1 + businessDetail.photos.length) % businessDetail.photos.length);
    };

    useEffect(() => {
        loadBusinessDetail(id);
    }, [id, loadBusinessDetail]);

    useEffect(() => {
        if (businessDetail?.photos?.length > 0) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % businessDetail.photos.length);
            }, 5000); // Auto slide every 5s
            return () => clearInterval(interval); // Clear interval on component unmount
        }
    }, [businessDetail]);

    if (!businessDetail) {
        return <div className="text-center">Loading...</div>;
    }

    const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${businessDetail.coordinates.latitude},${businessDetail.coordinates.longitude}`;

    return (
        <div
            className="w-full h-screen flex bg-black p-20 rounded-lg"
            style={{ background: 'linear-gradient(rgba(0,125,100,0.5), rgba(0,0,125,0.8))' }}
        >
            <div className="w-1/2 flex flex-col justify-center items-center"> {/* Section A */}
                {businessDetail.photos.length > 0 ? (
                    <div className="relative">
                        <img
                            src={businessDetail.photos[currentImageIndex]}
                            alt={`${businessDetail.name}`}
                            className="w-full h-full object-cover overflow-hidden rounded-lg"
                        />
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 mt-4">
                            <button
                                onClick={prevImage}
                                className="bg-blue-800 text-white px-2 py-1 rounded"
                            >
                                Prev
                            </button>
                            <button
                                onClick={nextImage}
                                className="bg-blue-800 text-white px-2 py-1 rounded"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                ) : (
                    <p>No photos available</p>
                )}
            </div>

            <div className="w-1/2 flex flex-col justify-center items-center p-4"> {/* Section B */}
                <div className="flex flex-col space-y-2 text-left w-full max-w-md">
                    <h1 className="font-bold mb-4">{businessDetail.name}</h1>

                    {businessDetail.categories.length > 0 ?
                        <div className="flex flex-wrap">
                            {businessDetail.categories.map((item, index) => (
                                <div
                                    className="bg-blue-800 text-amber-300 text-sm px-2 py-1 rounded-full mr-2 mb-2">
                                    {item.title}
                                </div>
                            ))
                            }
                        </div>
                        : null
                    }

                    {businessDetail.transactions.length > 0 ?
                        <div className="flex flex-wrap">
                            {businessDetail.transactions.map((item, index) => (
                                <div
                                    className="bg-blue-800 text-white text-sm px-2 py-1 rounded-full mr-2 mb-2">
                                    {item === 'restaurant_reservation' ? 'RESTAURANT RESERVATION' : item.toUpperCase()}
                                </div>
                            ))
                            }
                        </div>
                        : null
                    }

                    <p className="text-green-500">{businessDetail.location.display_address.join(', ')}</p>
                    <p>⭐ {businessDetail.rating}</p>
                    <p>Review Count: {businessDetail.review_count}</p>
                    <p>{businessDetail.price}</p>
                    <p>{businessDetail.display_phone}</p>
                    <p>{businessDetail.is_closed ? "OPEN NOW" : "Closed"}</p>
                    <a
                        href={businessDetail.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline mt-2"
                    >
                        Website
                    </a>
                    <a
                        href={googleMapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline mt-2"
                    >
                        See on Google Maps
                    </a>
                </div>
            </div>
        </div>
    );
};

export default BusinessDetail;
