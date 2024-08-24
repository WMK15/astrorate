"use client"

import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Head from 'next/head';

// Function to generate a random number within a given range
const randomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate the box-shadow CSS for the stars
const generateBoxShadow = (): string => {
    const STAR_COUNT = 600; // Increased star count for more density
    let result = '';
    for (let i = 0; i < STAR_COUNT; i++) {
        const x = randomNumber(-50, 50);
        const y = randomNumber(-50, 50);
        const blur = randomNumber(0, 2); // Increased blur range for varying star sizes
        const spread = randomNumber(0, 1);
        const opacity = randomNumber(5, 20) / 100; // Varying opacity for star brightness
        result += `${x}vw ${y}vh ${blur}px ${spread}px rgba(255, 255, 255, ${opacity}),`;
    }
    return result.slice(0, -1);
};

// Keyframes for zoom and twinkle animations
const zoomKeyframes = `
  @keyframes zoom {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.5);
    }
  }
`;

const twinkleKeyframes = `
  @keyframes twinkle {
    0% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.5;
    }
  }
`;

const StarryBackground: React.FC = () => {
    const [styleInjected, setStyleInjected] = useState(false);

    useEffect(() => {
        if (!styleInjected) {
            const styleTag = document.createElement('style');
            styleTag.type = 'text/css';
            styleTag.appendChild(document.createTextNode(zoomKeyframes));
            styleTag.appendChild(document.createTextNode(twinkleKeyframes));
            styleTag.id = 'animation-keyframes';
            document.head.appendChild(styleTag);
            setStyleInjected(true);
        }
    }, [styleInjected]);

    const backgroundStyle = {
        background: 'linear-gradient(180deg, #000000 0%, #1b1b2f 50%, #232946 100%)',
        height: '100vh',
        width: '100vw',
        position: 'fixed' as 'fixed',
        top: 0,
        left: 0,
        zIndex: -1, // Ensure background is behind other content
        overflow: 'hidden',
        animation: 'zoom 30s alternate infinite',
    } as React.CSSProperties;

    const starStyle = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        height: '1px',
        width: '1px',
        backgroundColor: '#fff',
        borderRadius: '50%',
        boxShadow: generateBoxShadow(),
        animation: 'twinkle 3s infinite',
    } as React.CSSProperties;

    return (
        <>
            <Head>
                <style>
                    {zoomKeyframes}
                    {twinkleKeyframes}
                </style>
            </Head>
            <Box sx={backgroundStyle}>
                <Box sx={starStyle} />
            </Box>
        </>
    );
};

export default StarryBackground;
