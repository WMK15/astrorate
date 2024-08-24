"use client"
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Snackbar, Alert, Button } from '@mui/material';

// Define types for Snackbar context state and actions
interface SnackbarState {
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
}

interface SnackbarContextProps {
    showSnackbar: (message: string, severity?: 'success' | 'info' | 'warning' | 'error') => void;
}

// Create a Snackbar context
const SnackbarContext = createContext<SnackbarContextProps | undefined>(undefined);

// Snackbar provider component
export const SnackbarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: '',
        severity: 'success',
    });

    const showSnackbar = (message: string, severity: 'success' | 'info' | 'warning' | 'error' = 'success') => {
        setSnackbar({
            open: true,
            message,
            severity,
        });
    };

    const handleClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleClose}
                action={
                    <Button color="inherit" onClick={handleClose}>
                        Close
                    </Button>
                }
            >
                <Alert onClose={handleClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};

// Custom hook to use Snackbar context
export const useSnackbar = (): SnackbarContextProps => {
    const context = useContext(SnackbarContext);
    if (context === undefined) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
};
