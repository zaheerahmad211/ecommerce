import { createContext, useState, useContext, useEffect } from 'react';
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState([]);
    // Check localStorage on load
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedCart = localStorage.getItem('cart');
        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedCart) setCart(JSON.parse(storedCart));
    }, []);
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };
    const logout = () => {
        setUser(null);
        setCart([]);
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
    };
    const addToCart = (product) => {
        const updatedCart = [...cart, product];
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };
    return (
        <AuthContext.Provider value={{ user, cart, login, logout, addToCart }}>
            {children}
        </AuthContext.Provider>
    );
};