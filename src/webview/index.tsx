import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Declare the acquireVsCodeApi function
declare global {
    function acquireVsCodeApi(): any;
}

console.log('Webview script loaded!');

const container = document.getElementById('root');
console.log('Container:', container);

if (container) {
    const root = createRoot(container);
    root.render(<App />);
    console.log('React rendered');
} else {
    console.error('Root element not found');
}
