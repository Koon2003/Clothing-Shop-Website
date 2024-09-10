import React, { useState, useEffect } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Typography from '@mui/material/Typography';
import "./css/CollectionSlide.css"; // CSS custom cho component này

const CollectionSlide = () => {
    const [selectedCollection, setSelectedCollection] = useState(null);

    // Hàm trộn mảng ngẫu nhiên
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    // Lấy dữ liệu bộ sưu tập từ API
    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/collections`);
                const data = await response.json();
                // Trộn mảng ngẫu nhiên
                if (data.length > 0) {
                    // Choose a random collection or default to the first if there's only one
                    const randomIndex = data.length > 1 ? Math.floor(Math.random() * data.length) : 0;
                    const randomCollection = data[randomIndex];
                    randomCollection.images = shuffleArray(randomCollection.images);
                    setSelectedCollection(randomCollection);
                }
            } catch (error) {
                console.error('Error fetching collections:', error);
            }
        };

        fetchCollections();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true, // Tự động chạy
        autoplaySpeed: 2000, // Thời gian chuyển slide (2000ms = 2s)
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <div className="collection-slide">
            {selectedCollection && (
                <>
                    
                    <Slider {...settings}>
                        {selectedCollection.images.map((image, index) => (
                            <div key={index} className="collection-slide__item">
                                <img src={image} alt={`Collection ${index}`} />
                                
                            </div>
                        ))}
                    </Slider>
                </>
            )}
        </div>
    );
};

export default CollectionSlide;