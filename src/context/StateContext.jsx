// StateContext.tsx
import React, { createContext, useState } from 'react';

export const StateContext = createContext();

export const StateProvider = ({ children }) => {
    const [isLogin, setIsLogin] = useState(false);
    const [loading, setLoading] = useState(false);

    return (
        <StateContext.Provider value={{ isLogin, setIsLogin, loading, setLoading }}>
            {children}
        </StateContext.Provider>
    );
};