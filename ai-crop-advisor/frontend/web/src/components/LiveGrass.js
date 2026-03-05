import React from 'react';
import './LiveGrass.css';

const LiveGrass = () => {
    // Generate a field of grass blades.
    // Increase blade count significantly to make the grass thicker and more realistic.
    const bladesCount = 150;

    // An array to map over
    const blades = Array.from({ length: bladesCount });

    return (
        <div className="liveGrassContainer" aria-hidden="true">
            <div className="grassLayer grassLayer--back">
                {blades.map((_, i) => (
                    <div
                        key={`back-${i}`}
                        className="grassBlade grassBlade--back"
                        style={{
                            left: `${(i * 100) / bladesCount}%`,
                            bottom: `${-5 + Math.random() * 4}px`,
                            animationDelay: `${Math.random() * -3}s`,
                            animationDuration: `${2.5 + Math.random() * 2}s`,
                            height: `${12 + Math.random() * 10}px`
                        }}
                    ></div>
                ))}
            </div>

            <div className="grassLayer grassLayer--front">
                {blades.map((_, i) => (
                    <div
                        key={`front-${i}`}
                        className="grassBlade grassBlade--front"
                        style={{
                            left: `${(i * 100) / bladesCount}%`,
                            bottom: `${-8 + Math.random() * 6}px`,
                            animationDelay: `${Math.random() * -3}s`,
                            animationDuration: `${2 + Math.random() * 1.5}s`,
                            height: `${18 + Math.random() * 12}px`,
                            transform: `translateX(${Math.random() * 8 - 4}px)`
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default LiveGrass;
