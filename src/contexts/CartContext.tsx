import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';

export type CartItem = {
  id: string;
  product_id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  rental: boolean;
  rental_days?: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (productId: string, isRental: boolean) => void;
  updateQuantity: (productId: string, quantity: number, isRental: boolean) => void;
  updateRentalDays: (productId: string, days: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Load cart from localStorage or database when component mounts or user changes
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        // If user is logged in, try to load cart from database
        const { data, error } = await supabase
          .from('carts')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error || !data) {
          // If no cart in database, use localStorage
          const storedCart = localStorage.getItem('cart');
          if (storedCart) {
            setCart(JSON.parse(storedCart));
          }
        } else if (data.cart_items) {
          setCart(data.cart_items as CartItem[]);
        }
      } else {
        // If not logged in, use localStorage
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
      }
    };
    
    loadCart();
  }, [user]);

  // Save cart to localStorage and database when it changes
  useEffect(() => {
    const saveCart = async () => {
      // Always save to localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // If user is logged in, also save to database
      if (user) {
        const { error } = await supabase
          .from('carts')
          .upsert(
            { 
              user_id: user.id, 
              cart_items: cart,
              updated_at: new Date().toISOString()
            },
            { onConflict: 'user_id' }
          );
        
        if (error) {
          console.error('Error saving cart to database:', error);
        }
      }
    };
    
    if (cart.length > 0) {
      saveCart();
    }
  }, [cart, user]);

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    setCart(prevCart => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.findIndex(i => 
        i.product_id === item.product_id && i.rental === item.rental
      );
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const newCart = [...prevCart];
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity: newCart[existingItemIndex].quantity + item.quantity,
          rental_days: item.rental ? item.rental_days : undefined
        };
        
        toast({
          title: "Cart updated",
          description: `${item.name} quantity increased to ${newCart[existingItemIndex].quantity}`,
        });
        
        return newCart;
      } else {
        // Add new item with unique ID
        const newItem = { 
          ...item, 
          id: crypto.randomUUID() 
        };
        
        toast({
          title: "Added to cart",
          description: `${item.name} added to your cart`,
        });
        
        return [...prevCart, newItem];
      }
    });
  };

  const removeFromCart = (productId: string, isRental: boolean) => {
    setCart(prevCart => {
      const itemToRemove = prevCart.find(item => item.product_id === productId && item.rental === isRental);
      if (itemToRemove) {
        toast({
          title: "Item removed",
          description: `${itemToRemove.name} removed from your cart`,
        });
      }
      return prevCart.filter(item => !(item.product_id === productId && item.rental === isRental));
    });
  };

  const updateQuantity = (productId: string, quantity: number, isRental: boolean) => {
    if (quantity <= 0) {
      removeFromCart(productId, isRental);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.product_id === productId && item.rental === isRental
          ? { ...item, quantity }
          : item
      )
    );
  };

  const updateRentalDays = (productId: string, days: number) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.product_id === productId && item.rental
          ? { ...item, rental_days: days }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalPrice = cart.reduce((sum, item) => {
    if (item.rental && item.rental_days) {
      return sum + (item.price * item.quantity * item.rental_days);
    }
    return sum + (item.price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateRentalDays,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
