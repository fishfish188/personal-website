import React from 'react';
import { createRoot } from 'react-dom/client';
import LoadingScreen from './LoadingScreen';
import './styles.css';

const images = ['bg-home.webp', 'BG-rectangle.png', 'computer-screen.webp', 'keyboard.webp']
  .map((name) => `https://hardhardfish.dpdns.org/${name}`);

createRoot(document.getElementById('root')).render(<LoadingScreen images={images} preview />);
