import React from 'react';

const AudioVisualizer = ({ isListening }) => {
    const bars = Array.from({ length: 5 });

    return (
        <div className={`audioVisualizer ${isListening ? 'is-active' : ''}`} aria-hidden="true">
            {bars.map((_, i) => (
                <div
                    key={i}
                    className="waveBar"
                    style={{
                        animationDelay: `${i * -0.2}s`,
                    }}
                />
            ))}
        </div>
    );
};

export default AudioVisualizer;
