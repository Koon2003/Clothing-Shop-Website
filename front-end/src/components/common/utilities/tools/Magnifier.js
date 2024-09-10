import React, { useState, useRef } from 'react';

const Magnifier = ({ src, width, height, magnifierHeight = 100, magnifierWidth = 100, zoomLevel = 2 }) => {
    const [showMagnifier, setShowMagnifier] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const imgRef = useRef();

    const handleMouseMove = e => {
        const { top, left } = imgRef.current.getBoundingClientRect();
        const x = e.pageX - left - window.pageXOffset - magnifierWidth / 2;
        const y = e.pageY - top - window.pageYOffset - magnifierHeight / 2;

        setPosition({ x, y });
    };

    return (
        <div
            style={{
                position: 'relative',
                height: height,
                width: width
            }}
            onMouseEnter={() => setShowMagnifier(true)}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setShowMagnifier(false)}
        >
            <img
                ref={imgRef}
                src={src}
                style={{ height: height, width: width }}
                alt=""
            />
            {showMagnifier && (
                <div
                    style={{
                        position: 'absolute',
                        pointerEvents: 'none',
                        height: `${magnifierHeight}px`,
                        width: `${magnifierWidth}px`,
                        top: `${position.y}px`,
                        left: `${position.x}px`,
                        opacity: '1',
                        border: '1px solid lightgray',
                        backgroundColor: 'white',
                        backgroundImage: `url(${src})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: `-${position.x * zoomLevel}px -${position.y * zoomLevel}px`,
                        backgroundSize: `${width * zoomLevel}px ${height * zoomLevel}px`
                    }}
                />
            )}
        </div>
    );
};

export default Magnifier;
