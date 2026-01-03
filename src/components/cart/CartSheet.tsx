import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Plus, Minus, Trash2, MessageCircle, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const WHATSAPP_NUMBER = "2348107941349";

export const CartSheet = () => {
  const { items, itemCount, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleRequestOnWhatsApp = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to complete your request",
      });
      navigate("/auth");
      return;
    }

    if (items.length === 0) return;

    setIsSubmitting(true);

    try {
      // Create order record
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          gadget_id: items[0].gadget_id, // Primary gadget for legacy support
          customer_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Customer",
          customer_email: user.email || "",
          customer_phone: "",
          delivery_address: "Via WhatsApp",
          total_price: totalPrice,
          status: "requested_whatsapp",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        gadget_id: item.gadget_id,
        gadget_name: item.gadget.name,
        gadget_price: item.gadget.price,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Generate WhatsApp message
      let message = "Hello JE Tech Hub 👋\n\nI would like to request the following gadgets:\n\n";
      
      items.forEach((item, index) => {
        message += `${index + 1}. ${item.gadget.name}\n`;
        message += `   Price: ${formatPrice(item.gadget.price)}\n`;
        message += `   Quantity: ${item.quantity}\n`;
        if (item.gadget.swap_available) {
          message += `   (Swap Available)\n`;
        }
        message += "\n";
      });

      message += `Total: ${formatPrice(totalPrice)}\n\n`;
      message += "Please let me know how to proceed with the order.";

      // URL encode the message
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

      // Clear cart
      await clearCart();

      toast({
        title: "Order created!",
        description: "Redirecting you to WhatsApp...",
      });

      setIsOpen(false);

      // Open WhatsApp
      window.open(whatsappUrl, "_blank");
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-accent text-accent-foreground text-xs">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="font-heading">Shopping Cart</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <ShoppingCart className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="font-heading font-semibold text-lg mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-4">
              Add gadgets to your cart to request them on WhatsApp
            </p>
            <Button
              onClick={() => {
                setIsOpen(false);
                navigate("/gadgets");
              }}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Browse Gadgets
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.gadget.image_url || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200"}
                        alt={item.gadget.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">
                        {item.gadget.name}
                      </h4>
                      <p className="text-accent font-semibold">
                        {formatPrice(item.gadget.price)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.gadget_id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.gadget_id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => removeFromCart(item.gadget_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-4">
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total ({itemCount} items)</span>
                <span className="text-xl font-heading font-bold text-foreground">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <SheetFooter className="flex-col gap-2 sm:flex-col">
                <Button
                  onClick={handleRequestOnWhatsApp}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <MessageCircle className="h-4 w-4 mr-2" />
                  )}
                  Request on WhatsApp
                </Button>
                <Button
                  variant="outline"
                  onClick={() => clearCart()}
                  className="w-full"
                  disabled={isSubmitting}
                >
                  Clear Cart
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
