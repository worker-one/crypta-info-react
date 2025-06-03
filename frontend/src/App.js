import React from 'react';
import { Routes, Route, Link } from 'react-router';
import { Typography, Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import exchangeRoutes from './routes/exchanges.js'; // Import the exchange routes
import bookRoutes from './routes/books.js';
import authRoutes from './routes/auth.js'; // Import the auth routes
import adminRoutes from './routes/admin.js'; // Import the admin routes
import IndexPage from './pages/index.js';

// Basic theme for Material UI
const theme = createTheme({
    palette: {
        primary: {
            main: '#272727', // Example primary color
        },
        secondary: {
            main: '#295e7c', // Example secondary color
        },
        background: {
            default: '#f5f5f5', // Light background color
            paper: '#ffffff', // Paper background color
        },
        text: {
            primary: '#242424', // Primary text color
            secondary: '#a0a0a0', // Secondary text color
        },
        mode: 'light', // Light mode by default
        sucess: {
            main: '#4caf50', // Success color
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline /> {/* Normalize CSS and apply background color from theme */}
            <main>
                <Routes>
                    <Route path="/" element={<IndexPage />} />
                    {exchangeRoutes} {/* Use the imported exchange routes */}
                    {bookRoutes} {/* Use the imported book routes */}
                    {authRoutes} {/* Use the imported auth routes */}
                    {adminRoutes} {/* Add admin routes if any */}
                    {/* Add other routes here */}
                </Routes>
            </main>
        </ThemeProvider>
    );
}

export default App;
