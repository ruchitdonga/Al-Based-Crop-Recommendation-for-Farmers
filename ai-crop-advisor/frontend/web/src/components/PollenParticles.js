import React, { useMemo } from 'react';

const PollenParticles = () => {
    const particleCount = 40;

    const particles = useMemo(() => {
        return Array.from({ length: particleCount }).map((_, i) => ({
            id: i,
            size: 1 + Math.random() * 3,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${15 + Math.random() * 25}s`,
            animationDelay: `${Math.random() * -20}s`,
            opacity: 0.2 + Math.random() * 0.4,
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
