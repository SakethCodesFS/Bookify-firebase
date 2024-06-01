import { createContext, useContext, useEffect, useState } from "react";
import { loadFromLocalStorage, saveToLocalStorage } from "../utils/localStorageHelper";

const cartContext = createContext(null);

export const useCart = () => {
    return useContext(cartContext);
}

export const CartProvider = (props) => {
    const [cartItems, setCartItems] = useState(loadFromLocalStorage('cartItems') || []);

    useEffect(() => {
        saveToLocalStorage('cartItems', cartItems);    
    }, [cartItems]);

    const addItemToCart = (newItem) => {
        setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(
                item => item.bookId === newItem.bookId && item.customerName === newItem.customerName
            );
            
            if (existingItemIndex >= 0) {
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += newItem.quantity;
                return updatedItems;
            }
            
            return [...prevItems, newItem];
        });
    };

    const removeItemFromCart = (index) => {
        setCartItems(prevItems => {
            const updatedItems = prevItems.filter((_, i) => i !== index);
            console.log('Updated cart items after removal:', updatedItems); // Debug log
            return updatedItems;
        });
    };

    return (
        <cartContext.Provider value={{ cartItems, setCartItems, addItemToCart, removeItemFromCart }}>
            {props.children}
        </cartContext.Provider>
    );
}
