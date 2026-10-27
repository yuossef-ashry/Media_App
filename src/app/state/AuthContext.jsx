import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { userApi } from '../../services/api';
const AuthContext = createContext(null);
function savedUser() {
    try {
        const value = localStorage.getItem('user');
        return value ? JSON.parse(value) : null;
    }
    catch {
        return null;
    }
}
export function AuthProvider({ children }) {
    const [user, setUser] = useState(savedUser);
    const refreshUser = useCallback(async () => {
        if (!localStorage.getItem('token'))
            return;
        try {
            const response = await userApi.profile();
            const nextUser = response.data.user;
            setUser(nextUser);
            localStorage.setItem('user', JSON.stringify(nextUser));
        }
        catch {
            // Keep the cached profile available if the profile endpoint is temporarily unavailable.
        }
    }, []);
    const setSession = useCallback((token, nextUser) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(nextUser));
        setUser(nextUser);
    }, []);
    const signOut = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    }, []);
    useEffect(() => {
        if (localStorage.getItem('token'))
            void refreshUser();
    }, [refreshUser]);
    const value = useMemo(() => ({ user, setSession, signOut, refreshUser }), [user, setSession, signOut, refreshUser]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
    const value = useContext(AuthContext);
    if (!value)
        throw new Error('useAuth must be used inside AuthProvider');
    return value;
}
