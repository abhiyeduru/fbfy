"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Product, ColorVariant } from "@/types";
import { auth, db } from "@/lib/firebase";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { PRODUCTS } from "@/data/products";

interface CartAuthContextType {
  // Cart
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

  // Auth
  user: User | null;
  authLoading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string) => Promise<void>;
  signOutUser: () => Promise<void>;

  // Products Management
  products: Product[];
  addProduct: (product: Product) => Promise<void>;
  editProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  seedProductsToFirestore: () => Promise<void>;
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

  // Products state - initialized with static PRODUCTS and synced live with Firestore
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  // Load products from Firestore
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(
        collection(db, "products"),
        (snapshot) => {
          if (!snapshot.empty) {
            const list: Product[] = [];
            snapshot.forEach((d) => {
              list.push({ id: d.id, ...d.data() } as Product);
            });
            // Keep deterministic order
            setProducts(list);
          }
        },
        (error) => {
          console.error("Firestore products sync error:", error);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.error("Firestore products init error:", err);
    }
  }, []);

  // Add Product to Firestore
  const addProduct = async (productData: Product) => {
    try {
      const id = productData.id || "fbf-" + Date.now();
      const productWithId = { ...productData, id };
      await setDoc(doc(db, "products", id), productWithId);
      setProducts((prev) => [productWithId, ...prev.filter((p) => p.id !== id)]);
    } catch (err) {
      console.error("Add product error:", err);
      // Fallback local update
      setProducts((prev) => [productData, ...prev]);
    }
  };

  // Edit Product in Firestore
  const editProduct = async (productData: Product) => {
    try {
      await setDoc(doc(db, "products", productData.id), productData, { merge: true });
      setProducts((prev) =>
        prev.map((p) => (p.id === productData.id ? { ...p, ...productData } : p))
      );
    } catch (err) {
      console.error("Edit product error:", err);
      // Fallback local update
      setProducts((prev) =>
        prev.map((p) => (p.id === productData.id ? productData : p))
      );
    }
  };

  // Delete Product from Firestore
  const deleteProduct = async (productId: string) => {
    try {
      await deleteDoc(doc(db, "products", productId));
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error("Delete product error:", err);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    }
  };

  // Seed default archive into Firestore if empty
  const seedProductsToFirestore = async () => {
    try {
      const batch = writeBatch(db);
      PRODUCTS.forEach((prod) => {
        const ref = doc(db, "products", prod.id);
        batch.set(ref, prod);
      });
      await batch.commit();
    } catch (err) {
      console.error("Seed products error:", err);
    }
  };

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
      const newItem: CartItem = {
        id: itemId,
        productId: product.id,
        name: product.name,
        code: product.code,
        color,
        size,
        customName: finalName,
        price: product.price,
        quantity,
        image: product.imageFront,
      };
      return [...prev, newItem];
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
        products,
        addProduct,
        editProduct,
        deleteProduct,
        seedProductsToFirestore,
      }}
    >
      {children}
    </CartAuthContext.Provider>
  );
}

export function useCartAuth() {
  const context = useContext(CartAuthContext);
  if (!context) {
    throw new Error("useCartAuth must be used within a CartAuthProvider");
  }
  return context;
}
