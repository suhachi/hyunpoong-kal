import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  ReactNode,
} from "react";
import type { CartContextType, CartItem, DeliveryType, DeliveryAddress } from "@/types/cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "hyunpung_cart";
const MIN_ORDER_DELIVERY = 15000;
const BASE_DELIVERY_FEE = 3000;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliveryType, setDeliveryTypeState] = useState<DeliveryType>("delivery");
  const [deliveryAddress, setDeliveryAddressState] = useState<DeliveryAddress | undefined>();
  const [requests, setRequestsState] = useState<string>("");
  const [couponId, setCouponId] = useState<string | undefined>();
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  const loadFromStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      const data = JSON.parse(stored);
      setItems(data.items || []);
      setDeliveryTypeState(data.deliveryType || "delivery");
      setDeliveryAddressState(data.deliveryAddress);
      setRequestsState(data.requests || "");
      setCouponId(data.couponId);
      setCouponDiscount(data.couponDiscount || 0);
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    loadFromStorage();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) loadFromStorage();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") loadFromStorage();
    };
    const handleFocus = () => {
      loadFromStorage();
    };

    window.addEventListener("storage", handleStorageChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [loadFromStorage]);

  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          items,
          deliveryType,
          deliveryAddress,
          requests,
          couponId,
          couponDiscount,
        }),
      );
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [items, deliveryType, deliveryAddress, requests, couponId, couponDiscount]);

  const addItem = useCallback((item: CartItem) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        i =>
          i.menuId === item.menuId &&
          i.options.noodle === item.options.noodle &&
          i.options.spicy === item.options.spicy &&
          JSON.stringify(i.options.toppings?.sort()) ===
          JSON.stringify(item.options.toppings?.sort()) &&
          JSON.stringify(i.customOptions?.sort((a, b) => a.id.localeCompare(b.id))) ===
          JSON.stringify(item.customOptions?.sort((a, b) => a.id.localeCompare(b.id))),
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += item.quantity;
        updated[existingIndex].subtotal =
          (item.menuPrice +
            item.optionPrices.noodle +
            item.optionPrices.toppings +
            (item.optionPrices.custom || 0)) *
          updated[existingIndex].quantity;
        return updated;
      }

      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((menuId: string) => {
    setItems(prev => prev.filter(item => item.menuId !== menuId));
  }, []);

  const updateQuantity = useCallback((menuId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(menuId);
      return;
    }

    setItems(prev =>
      prev.map(item => {
        if (item.menuId === menuId) {
          const unitPrice =
            item.menuPrice +
            item.optionPrices.noodle +
            item.optionPrices.toppings +
            (item.optionPrices.custom || 0);
          return {
            ...item,
            quantity,
            subtotal: unitPrice * quantity,
          };
        }
        return item;
      }),
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    setCouponId(undefined);
    setCouponDiscount(0);
    setRequestsState("");
  }, []);

  const setDeliveryType = useCallback((type: DeliveryType) => {
    setDeliveryTypeState(type);
  }, []);

  const setDeliveryAddress = useCallback((address: DeliveryAddress) => {
    setDeliveryAddressState(address);
  }, []);

  const setRequests = useCallback((req: string) => {
    setRequestsState(req);
  }, []);

  const applyCoupon = useCallback((id: string, discount: number) => {
    setCouponId(id);
    setCouponDiscount(discount);
  }, []);

  const removeCoupon = useCallback(() => {
    setCouponId(undefined);
    setCouponDiscount(0);
  }, []);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const getSubtotal = useCallback(() => {
    return items.reduce((total, item) => total + item.subtotal, 0);
  }, [items]);

  const getDeliveryFee = useCallback(() => {
    if (deliveryType === "pickup") return 0;

    const subtotal = items.reduce((total, item) => total + item.subtotal, 0);

    if (subtotal < MIN_ORDER_DELIVERY) return 0;

    return BASE_DELIVERY_FEE;
  }, [deliveryType, items]);

  const getTotalAmount = useCallback(() => {
    const subtotal = items.reduce((total, item) => total + item.subtotal, 0);
    let deliveryFee = 0;

    if (deliveryType === "delivery" && subtotal >= MIN_ORDER_DELIVERY) {
      deliveryFee = BASE_DELIVERY_FEE;
    }

    return subtotal + deliveryFee - couponDiscount;
  }, [items, deliveryType, couponDiscount]);

  const forceReload = useCallback(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const value = useMemo<CartContextType>(() => ({
    state: {
      items,
      deliveryType,
      deliveryAddress,
      requests,
      couponId,
      couponDiscount,
    },
    actions: {
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      setDeliveryType,
      setDeliveryAddress,
      setRequests,
      applyCoupon,
      removeCoupon,
      getTotalItems,
      getSubtotal,
      getDeliveryFee,
      getTotalAmount,
      forceReload,
    }
  }), [
    items,
    deliveryType,
    deliveryAddress,
    requests,
    couponId,
    couponDiscount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setDeliveryType,
    setDeliveryAddress,
    setRequests,
    applyCoupon,
    removeCoupon,
    getTotalItems,
    getSubtotal,
    getDeliveryFee,
    getTotalAmount,
    forceReload,
  ]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
