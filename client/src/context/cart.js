import { useState,useEffect, useContext, createContext } from 'react';
import axios from 'axios';
const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart,setCart] = useState([]);

  useEffect(() =>{
    let existingCartItem = localStorage.getItem('cart')
    if(existingCartItem) setCart(JSON.parse(existingCartItem));
  },[])

  return (
    <CartContext.Provider value={[cart, setCart]}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => useContext(CartContext);

export { useCart, CartProvider }; // Make sure to export AuthProvider properly
