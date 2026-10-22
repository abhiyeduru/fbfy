"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Product, ColorVariant, StoreSettings, Order } from "@/types";
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

export interface AppliedCoupon {
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  minSpend?: number;
}

export const VALID_COUPONS: Record<string, AppliedCoupon> = {
  WELCOME10: { code: "WELCOME10", type: "PERCENT", value: 10 },
  FBFY500: { code: "FBFY500", type: "FIXED", value: 500, minSpend: 3000 },
  STREET20: { code: "STREET20", type: "PERCENT", value: 20, minSpend: 4000 },
  FIRSTDROP: { code: "FIRSTDROP", type: "PERCENT", value: 15 },
};

const DEFAULT_STORE_SETTINGS: StoreSettings = {
  announcementText: "FREE EXPRESS SHIPPING ON ALL ORDERS OVER ₹1,999 • USE CODE: WELCOME10 FOR 10% OFF • DROP 04 ARCHIVE LIVE",
  announcementActive: true,
  announcementLinkText: "SHOP THE DROP",
  announcementLinkUrl: "#collection",
  heroHeadline: "BUILT TO DEFY THE ORDINARY",
  heroSubtitle: "Heavyweight 280-400 GSM Architectural Silhouettes with Bespoke Laser-Engraved Personalization",
  heroCtaText: "EXPLORE DROP 04",
  heroCtaLink: "#collection",
  heroBadgeText: "STREETWEAR ARCHIVE // 2026",
  freeShippingThreshold: 1999,
  codFee: 99,
  maintenanceMode: false,
};

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
  cartSubtotal: number;
  cartDiscount: number;
  cartShippingFee: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  isTrackOrderOpen: boolean;
  setIsTrackOrderOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  customName: string;
  setCustomName: (name: string) => void;

  // Coupon
  appliedCoupon: AppliedCoupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Navigation & Category Filter
  activeCategoryFilter: string;
  setActiveCategoryFilter: (category: string) => void;

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

  // Store Settings (CMS)
  storeSettings: StoreSettings;
  updateStoreSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;
}

const CartAuthContext = createContext<CartAuthContextType | undefined>(undefined);

export function CartAuthProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [customName, setCustomName] = useState("YOU");
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Coupon
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  // Active Category Filter (driven by Mega-Menu)
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("ALL");

  // Products state
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  // Store CMS Settings
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);

  // Load products & settings from Firestore
  useEffect(() => {
    try {
      const unsubscribeProducts = onSnapshot(
        collection(db, "products"),
        (snapshot) => {
          if (!snapshot.empty) {
            const list: Product[] = [];
            snapshot.forEach((d) => {
              list.push({ id: d.id, ...d.data() } as Product);
            });
            setProducts(list);
          }
        },
        (error) => {
          console.error("Firestore products sync error:", error);
        }
      );

      const unsubscribeSettings = onSnapshot(
        doc(db, "settings", "global"),
        (snap) => {
          if (snap.exists()) {
            setStoreSettings((prev) => ({ ...prev, ...(snap.data() as StoreSettings) }));
          }
        },
        (error) => {
          console.error("Firestore settings sync error:", error);
        }
      );

      return () => {
        unsubscribeProducts();
        unsubscribeSettings();
      };
    } catch (err) {
      console.error("Firestore init error:", err);
    }
  }, []);

  const updateStoreSettings = async (newSettings: Partial<StoreSettings>) => {
    try {
      const merged = { ...storeSettings, ...newSettings };
      setStoreSettings(merged);
      await setDoc(doc(db, "settings", "global"), merged, { merge: true });
    } catch (err) {
      console.error("Update settings error:", err);
    }
  };

  // Add Product to Firestore
  const addProduct = async (productData: Product) => {
    try {
      const id = productData.id || "fbf-" + Date.now();
      const productWithId = { ...productData, id };
      await setDoc(doc(db, "products", id), productWithId);
      setProducts((prev) => [productWithId, ...prev.filter((p) => p.id !== id)]);
    } catch (err) {
      console.error("Add product error:", err);
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

  // Load cart and wishlist from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("fbfy_cart");
      if (savedCart) setCartItems(JSON.parse(savedCart));

      const savedName = localStorage.getItem("fbfy_name");
      if (savedName) setCustomName(savedName);

      const savedWishlist = localStorage.getItem("fbfy_wishlist");
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
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

  // Save wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("fbfy_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

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
    setAppliedCoupon(null);
  };

  // Wishlist toggle
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Coupon handlers
  const applyCoupon = (rawCode: string) => {
    const code = rawCode.trim().toUpperCase();
    const coupon = VALID_COUPONS[code];
    if (!coupon) {
      return { success: false, message: `Invalid promo code "${code}". Try WELCOME10 or FBFY500.` };
    }
    if (coupon.minSpend && cartSubtotal < coupon.minSpend) {
      return {
        success: false,
        message: `Code "${code}" requires minimum order value of ₹${coupon.minSpend}.`,
      };
    }
    setAppliedCoupon(coupon);
    return { success: true, message: `Promo code "${code}" applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Calculations
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  let cartDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "PERCENT") {
      cartDiscount = Math.round((cartSubtotal * appliedCoupon.value) / 100);
    } else if (appliedCoupon.type === "FIXED") {
      cartDiscount = Math.min(appliedCoupon.value, cartSubtotal);
    }
  }

  // Free shipping logic
  const cartShippingFee =
    cartSubtotal > 0 && cartSubtotal < storeSettings.freeShippingThreshold ? 149 : 0;

  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShippingFee);

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
        cartSubtotal,
        cartDiscount,
        cartShippingFee,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAuthOpen,
        setIsAuthOpen,
        isTrackOrderOpen,
        setIsTrackOrderOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        customName,
        setCustomName,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isWishlisted,
        activeCategoryFilter,
        setActiveCategoryFilter,
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
        storeSettings,
        updateStoreSettings,
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
