export type ColorVariant = {
  id: string;
  name: string;
  hex: string;
  textColor: string;
};

export type Product = {
  id: string;
  name: string;
  code: string;
  collection: "SIGNATURE" | "GRAPHIC" | "WASHED" | "LIMITED";
  fit: string;
  fabric: string;
  gsm: number;
  price: number;
  defaultColor: string;
  availableColors: ColorVariant[];
  imageFront: string;
  imageBack?: string;
  editorialImage?: string;
  images: { id: string; label: string; url: string }[];
  features: string[];
};

export type CameraPreset = "hero" | "neck" | "signature" | "inspect";

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  code: string;
  color: ColorVariant;
  size: string;
  customName: string; // e.g. "fbfy by {customName}"
  price: number;
  quantity: number;
  image: string;
};

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  postalCode: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED";
  createdAt: number;
  userUid?: string;
};
