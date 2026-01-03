import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  gadget_id: string;
  quantity: number;
  gadget: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
    swap_available: boolean;
  };
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (gadgetId: string) => Promise<void>;
  removeFromCart: (gadgetId: string) => Promise<void>;
  updateQuantity: (gadgetId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setItems([]);
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("cart_items")
      .select(`
        id,
        gadget_id,
        quantity,
        gadget:gadgets(id, name, price, image_url, swap_available)
      `)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching cart:", error);
    } else {
      setItems(data as unknown as CartItem[]);
    }
    setLoading(false);
  };

  const addToCart = async (gadgetId: string) => {
    if (!user) return;

    const existingItem = items.find((item) => item.gadget_id === gadgetId);

    if (existingItem) {
      await updateQuantity(gadgetId, existingItem.quantity + 1);
      return;
    }

    const { error } = await supabase.from("cart_items").insert({
      user_id: user.id,
      gadget_id: gadgetId,
      quantity: 1,
    });

    if (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    } else {
      await fetchCart();
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      });
    }
  };

  const removeFromCart = async (gadgetId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id)
      .eq("gadget_id", gadgetId);

    if (error) {
      console.error("Error removing from cart:", error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    } else {
      setItems((prev) => prev.filter((item) => item.gadget_id !== gadgetId));
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart",
      });
    }
  };

  const updateQuantity = async (gadgetId: string, quantity: number) => {
    if (!user || quantity < 1) return;

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("user_id", user.id)
      .eq("gadget_id", gadgetId);

    if (error) {
      console.error("Error updating quantity:", error);
    } else {
      setItems((prev) =>
        prev.map((item) =>
          item.gadget_id === gadgetId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      console.error("Error clearing cart:", error);
    } else {
      setItems([]);
    }
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.gadget.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
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
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
