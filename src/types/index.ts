export type ColorVariant = {
  id: string;
  name: string;
  hex: string;
  textColor: string;
};

export type ProductCategory =
  | "Oversized Tees"
  | "Hoodies"
  | "Graphic Editions"
  | "Bottomwear"
  | "Acid Washed";

export type ProductBadge = "NEW DROP" | "BESTSELLER" | "LIMITED EDITION" | "ARCHIVE SALE";

export type Product = {
  id: string;
  name: string;
  code: string;
  category: ProductCategory;
  collection: "SIGNATURE" | "GRAPHIC" | "WASHED" | "LIMITED";
  badge?: ProductBadge;
  fit: string;
  fabric: string;
  gsm: number;
  price: number;
  originalPrice?: number;
  stock: number;
  rating: number;
  reviewCount: number;
  defaultColor: string;
  availableColors: ColorVariant[];
  imageFront: string;
  imageBack?: string;
  editorialImage?: string;
  images: { id: string; label: string; url: string }[];
  features: string[];
  description?: string;
  isPublished?: boolean;
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

export type OrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PROCESSING"
  | "PACKED"
  | "SHIPPED"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state?: string;
  postalCode: string;
  items: CartItem[];
  subtotal?: number;
  discount?: number;
  couponCode?: string;
  shippingFee?: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: "PENDING" | "PAID" | "COD_PENDING" | "FAILED";
  razorpayPaymentId?: string | null;
  status: OrderStatus;
  courierPartner?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  adminNotes?: string;
  createdAt: number;
  userUid?: string;
};

export type StoreSettings = {
  announcementText: string;
  announcementActive: boolean;
  announcementLinkText?: string;
  announcementLinkUrl?: string;
  heroHeadline: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroCtaLink: string;
  heroBadgeText: string;
  freeShippingThreshold: number;
  codFee: number;
  maintenanceMode: boolean;
};
