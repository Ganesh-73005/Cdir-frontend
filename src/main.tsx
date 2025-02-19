import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot
import App from './App';
import { StateProvider } from './context/StateContext';
import { ThemeProvider } from './components/theme-provider'

// Get the root element
const container = document.getElementById('root');

// Create a root
const root = createRoot(container!); // Use non-null assertion (!) to ensure container is not null

// Render your app
root.render(
    <ThemeProvider>
    <StateProvider>
        <App />
        </StateProvider>
    </ThemeProvider>
);