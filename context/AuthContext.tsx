/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { createContext, useCallback, useContext, useEffect, useState } from "react";

/**
 * Authentication context props.
 *
 * @property {boolean} isAuthenticated - Indicates if the user is authenticated.
 * @property {Function} login - Function to set authentication state to logged in.
 * @property {Function} logout - Function to clear authentication state and log out.
 */
interface AuthContextProps {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
}

/**
 * Props for the `AuthProvider` component.
 *
 * @property {React.ReactNode} children - The child components that will be wrapped by the provider.
 */
interface AuthProviderProps {
    children: React.ReactNode;
}

/**
 * **Authentication Context**
 *
 * This context provides authentication state management, including login and logout functions.
 */
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

/**
 * **Authentication Provider**
 *
 * Manages the authentication state and provides authentication-related functions.
 *
 * @param AuthProviderProps - Component props.
 * @returns The AuthContext provider.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    /**
     * Effect to check authentication status on component mount.
     * Retrieves authentication token from localStorage and sets the authentication state.
     */
    useEffect((): void => {
        const token = localStorage?.getItem("authToken");
        setIsAuthenticated(!!token);
    }, []);

    /**
     * Function to handle user login.
     * Updates the authentication state to true.
     */
    const login = useCallback((): void => {
        setIsAuthenticated(true);
    }, []);

    /**
     * Function to handle user logout.
     * Removes the authentication token from localStorage and updates the state.
     */
    const logout = useCallback((): void => {
        localStorage?.removeItem("authToken");
        setIsAuthenticated(false);
    }, []);

    return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to access the authentication context.
 *
 * @throws {Error} If used outside of an AuthProvider.
 * @returns {AuthContextProps} The authentication context.
 */
export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error();
    }
    return context;
};
