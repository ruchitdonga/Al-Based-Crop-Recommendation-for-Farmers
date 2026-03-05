import React from 'react';
import './AudioVisualizer.css';

const AudioVisualizer = ({ isListening }) => {
    // We'll create 5 bars for a simple, recognizable audio wave look
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
