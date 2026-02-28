import React, { useMemo } from 'react';
import './PollenParticles.css';

const PollenParticles = () => {
    // Generate an array of random particles for a natural, dusty feel
    const particleCount = 40;

    const particles = useMemo(() => {
        return Array.from({ length: particleCount }).map((_, i) => ({
            id: i,
            size: 1 + Math.random() * 3, // Random size between 1px and 4px
            left: `${Math.random() * 100}%`, // Random horizontal start
            top: `${Math.random() * 100}%`, // Random vertical start
            animationDuration: `${15 + Math.random() * 25}s`, // Float speed
            animationDelay: `${Math.random() * -20}s`, // Stagger start times so it's instantly populated
            opacity: 0.2 + Math.random() * 0.4, // Subtle variance in brightness
        }));
    }, []);

    return (
        <div className="pollenContainer" aria-hidden="true">
            {particles.map(p => (
                <div
                    key={p.id}
                    className="pollenParticle"
                    style={{
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        left: p.left,
                        top: p.top,
                        opacity: p.opacity,
                        animationDuration: p.animationDuration,
                        animationDelay: p.animationDelay,
                    }}
                />
            ))}
        </div>
    );
};

export default PollenParticles;
