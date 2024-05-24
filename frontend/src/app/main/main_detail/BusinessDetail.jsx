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
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{businessDetail.name}</h1>

            <div className="flex flex-col md:flex-row md:space-x-4">

                <div className="md:w-3/4 relative mb-4 md:mb-0">
                    {businessDetail.photos.length > 0
                        ? <div className="relative">
                            <img
                                src={businessDetail.photos[currentImageIndex]}
                                alt={`${businessDetail.name} photo ${currentImageIndex + 1}`}
                                className="w-full overflow-hidden"
                            />

                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 mt-4">
                                <button
                                    onClick={prevImage}
                                    className="bg-gray-500 text-white px-2 py-1 rounded">
                                    Prev
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="bg-gray-500 text-white px-2 py-1 rounded">
                                    Next
                                </button>
                            </div>
                        </div>
                        : <p>No photos available</p>
                    }
                </div>

                <div className="md:w-1/4">
                    <h2 className="text-2xl font-semibold">Details</h2>
                    <p className='text-green-500'>{businessDetail.location.display_address.join(', ')}</p>
                    <p>Rating: {businessDetail.rating}</p>
                    <p>Review Count: {businessDetail.review_count}</p>
                    <p>Price: {businessDetail.price}</p>
                    <p>Phone: {businessDetail.display_phone}</p>
                    <a
                        href={googleMapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline mt-2 block"
                    >
                        See on Google Maps
                    </a>
                </div>
            </div>
        </div>
    );
};

export default BusinessDetail;
