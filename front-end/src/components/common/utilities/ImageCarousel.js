import React, { useState } from "react";
import "./css/ImageCarousel.css";

const ImageCarousel = ({ images }) => {
    // State quản lý index của ảnh hiện tại
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageError, setImageError] = useState(false);

    // Hàm xử lý khi ảnh bị lỗi
    const handleImageError = (e) => {
        console.error('Image failed to load:', e.target.src);
        setImageError(true); // Set the error state to true
    };

    // Hàm xử lý khi click vào nút Previous
    const goToPrevious = () => {
        const isFirstImage = currentIndex === 0;
        const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    // Hàm xử lý khi click vào nút Next
    const goToNext = () => {
        const isLastImage = currentIndex === images.length - 1;
        const newIndex = isLastImage ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    return (
        <div className="carousel">
            {imageError ? (
                <div className="image-error">Unable to load image</div>
            ) : (
                <div className="carousel-images">
                    {images.map((image, index) => (
                        <div key={index} className={`image ${index === currentIndex ? 'active' : ''}`}>
                            <img src={image} alt={`Slide ${index}`} onError={handleImageError} />
                        </div>
                    ))}
                </div>
            )}
            <button className="carousel-button prev" onClick={goToPrevious}>&lt;</button>
            <button className="carousel-button next" onClick={goToNext}>&gt;</button>
        </div>
    );
};

export default ImageCarousel;