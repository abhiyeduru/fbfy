"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Product, ColorVariant } from "@/types";
import { auth } from "@/lib/firebase";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

interface CartAuthContextType {
  cartItems: CartItem[];
  addToCart: (
    product: Product,
    color: ColorVariant,
    size: string,
    customName: string,
    quantity?: number
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  customName: string;
  setCustomName: (name: string) => void;
  user: User | null;
  authLoading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

const CartAuthContext = createContext<CartAuthContextType | undefined>(undefined);

export function CartAuthProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [customName, setCustomName] = useState("YOU");
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("fbfy_cart");
      if (saved) {
        setCartItems(JSON.parse(saved));
      }
      const savedName = localStorage.getItem("fbfy_name");
      if (savedName) {
        setCustomName(savedName);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("fbfy_cart", JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem("fbfy_name", customName);
    } catch (e) {
      console.error(e);
    }
  }, [customName]);

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const addToCart = (
    product: Product,
    color: ColorVariant,
    size: string,
    engravedName: string,
    quantity = 1
  ) => {
    const finalName = engravedName.trim() || customName.trim() || "YOU";
    const itemId = `${product.id}-${color.id}-${size}-${finalName}`;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          productId: product.id,
          name: product.name,
          code: product.code,
          color: color,
          size: size,
          customName: finalName.toUpperCase(),
          price: product.price,
          quantity: quantity,
          image: product.imageFront,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const signIn = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
    setIsAuthOpen(false);
  };

  const signUp = async (email: string, pass: string) => {
    await createUserWithEmailAndPassword(auth, email, pass);
    setIsAuthOpen(false);
  };

  const signOutUser = async () => {
    await signOut(auth);
  };

  return (
    <CartAuthContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAuthOpen,
        setIsAuthOpen,
        customName,
        setCustomName,
        user,
        authLoading,
        signIn,
        signUp,
        signOutUser,
      }}
    >
      {children}
    </CartAuthContext.Provider>
  );
}

export function useCartAuth() {
  const context = useContext(CartAuthContext);
  if (!context) {
    throw new Error("useCartAuth must be used within CartAuthProvider");
  }
  return context;
}
