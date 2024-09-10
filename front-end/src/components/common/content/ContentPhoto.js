import React, { useState, useEffect } from 'react';
import "./css/ContentPhoto.css";

const ContentPhoto = () => {
    const images = [
        'https://github.com/goldenpig17/TAN_Images/blob/main/ContentPhotos/z4971826337241_0b9e90cd6e4dd69b60bbf49dc2d0f0a3.jpg?raw=true',
        'https://github.com/goldenpig17/TAN_Images/blob/main/ContentPhotos/z4995708306465_9910b6f3e8da4a363852017cf9ea94a5.jpg?raw=true',
        'https://github.com/goldenpig17/TAN_Images/blob/main/ContentPhotos/z4995711859624_bb590addd151e85e058f6cd453c8df3f.jpg?raw=true',
        
    ];

    // State để lưu ảnh được chọn ngẫu nhiên
    const [selectedImage, setSelectedImage] = useState('');

    useEffect(() => {
        // Chọn ngẫu nhiên một ảnh từ mảng khi component được mount
        const randomIndex = Math.floor(Math.random() * images.length);
        setSelectedImage(images[randomIndex]);
    }, []); // Mảng phụ thuộc rỗng để effect chỉ chạy một lần khi mount

    return (
        <div className="random-image-container" style={{ backgroundImage: `url(${selectedImage})` }}>
            <div className="text-box">
                <h1>TAN BOUTIQUE</h1>
                <p>Hokuro is the premium clothing brand that fuses the captivating world of anime with stylish apparel. ...</p>
                {/* Thêm nội dung của bạn ở đây */}
            </div>
        </div>
    );
};

export default ContentPhoto;
