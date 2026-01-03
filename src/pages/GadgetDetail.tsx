import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Loader2,
  ShoppingCart,
  RefreshCw,
  MessageCircle,
  CheckCircle,
  Shield,
  Truck,
  Headphones,
  Package,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface Gadget {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  image_url: string | null;
  in_stock: boolean | null;
  swap_available: boolean | null;
}

const WHATSAPP_NUMBER = "2348107941349";

const GadgetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [gadget, setGadget] = useState<Gadget | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    deviceToSwap: "",
    deviceCondition: "",
    additionalInfo: "",
  });

  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchGadget();
    }
  }, [id]);

  const fetchGadget = async () => {
    const { data, error } = await supabase
      .from("gadgets")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      console.error("Error fetching gadget:", error);
      navigate("/gadgets");
      return;
    }

    setGadget(data);
    setLoading(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to cart",
      });
      navigate("/auth");
      return;
    }
    if (gadget) {
      addToCart(gadget.id);
    }
  };

  const handleRequestOnWhatsApp = () => {
    if (!gadget) return;

    const message = `Hello JE Tech Hub 👋

I'm interested in purchasing:

Product: ${gadget.name}
Price: ${formatPrice(gadget.price)}
${gadget.swap_available ? "(Swap option available)" : ""}

Please let me know how to proceed with the order.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleSwapSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gadget || !user) return;

    setIsSubmitting(true);

    const { error } = await supabase.from("swaps").insert({
      user_id: user.id,
      gadget_id: gadget.id,
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone,
      device_to_swap: formData.deviceToSwap,
      device_condition: formData.deviceCondition,
      additional_info: formData.additionalInfo,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit swap application. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Swap application submitted!",
        description: "We'll review your application and contact you soon.",
      });
      setShowSwapModal(false);
    }

    setIsSubmitting(false);
  };

  const openSwapModal = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to apply for swap.",
      });
      navigate("/auth");
      return;
    }
    setFormData({
      name: "",
      email: user.email || "",
      phone: "",
      deviceToSwap: "",
      deviceCondition: "",
      additionalInfo: "",
    });
    setShowSwapModal(true);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!gadget) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Gadget not found</h1>
          <Button asChild>
            <Link to="/gadgets">Back to Gadgets</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const features = [
    { icon: Shield, text: "Quality Guaranteed" },
    { icon: Truck, text: "Fast Delivery" },
    { icon: Headphones, text: "24/7 Support" },
    { icon: RefreshCw, text: "Easy Returns" },
  ];

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link to="/gadgets">
              <ArrowLeft className="h-4 w-4" />
              Back to Gadgets
            </Link>
          </Button>
        </div>
      </div>

      {/* Product Details */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Product Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl bg-muted animate-fade-in">
              <img
                src={gadget.image_url || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800"}
                alt={gadget.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <Badge className="bg-primary text-primary-foreground">
                  {gadget.category}
                </Badge>
                {gadget.swap_available && (
                  <Badge className="bg-accent text-accent-foreground">
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Swap Available
                  </Badge>
                )}
              </div>
              {!gadget.in_stock && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <Badge variant="destructive" className="text-lg px-4 py-2">
                    Out of Stock
                  </Badge>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="animate-slide-in-right">
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                {gadget.name}
              </h1>

              <div className="flex items-center gap-2 mb-6">
                {gadget.in_stock ? (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-destructive border-destructive">
                    Out of Stock
                  </Badge>
                )}
              </div>

              <Separator className="my-6" />

              {/* Price Card */}
              <Card className="bg-card border-border mb-6">
                <CardContent className="p-6">
                  <div className="flex items-end justify-between mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Price</p>
                      <p className="text-4xl font-heading font-bold text-accent">
                        {formatPrice(gadget.price)}
                      </p>
                    </div>
                    {gadget.swap_available && (
                      <div className="text-right">
                        <RefreshCw className="h-8 w-8 text-primary mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground">Swap & Save</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={handleAddToCart}
                      disabled={!gadget.in_stock}
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-300 hover:scale-[1.02]"
                      size="lg"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      {gadget.in_stock ? "Add to Cart" : "Out of Stock"}
                    </Button>

                    <Button
                      onClick={handleRequestOnWhatsApp}
                      variant="outline"
                      className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300"
                      size="lg"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Request on WhatsApp
                    </Button>

                    {gadget.swap_available && (
                      <Button
                        onClick={openSwapModal}
                        variant="secondary"
                        className="w-full transition-all duration-300 hover:scale-[1.02]"
                        size="lg"
                      >
                        <RefreshCw className="w-5 h-5 mr-2" />
                        Apply for Swap
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 transition-all duration-300 hover:bg-muted"
                  >
                    <feature.icon className="h-5 w-5 text-primary" />
                    <span className="text-sm text-foreground">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
              Product Description
            </h2>
            <div className="prose prose-muted max-w-none">
              <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                {gadget.description || `The ${gadget.name} is a high-quality ${gadget.category.toLowerCase()} designed to meet your needs. At JE Tech Hub, we ensure all our gadgets are thoroughly tested and come with our quality guarantee.

Whether you're upgrading your current device or getting a new one, this ${gadget.category.toLowerCase()} offers excellent value for money with features that rival more expensive alternatives.

Key Features:
• Premium build quality
• Latest specifications
• Competitive pricing
• Full warranty included

Contact us on WhatsApp for more details about specifications, availability, and delivery options.`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Buy From Us */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-heading font-bold text-foreground mb-8 text-center">
            Why Buy From JE Tech Hub?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card border-border text-center hover-lift">
              <CardContent className="p-6">
                <Package className="h-10 w-10 text-accent mx-auto mb-4" />
                <h3 className="font-heading font-semibold text-foreground mb-2">
                  Quality Products
                </h3>
                <p className="text-sm text-muted-foreground">
                  All gadgets are thoroughly tested and verified before sale
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border text-center hover-lift">
              <CardContent className="p-6">
                <Truck className="h-10 w-10 text-accent mx-auto mb-4" />
                <h3 className="font-heading font-semibold text-foreground mb-2">
                  Fast Delivery
                </h3>
                <p className="text-sm text-muted-foreground">
                  Quick and reliable delivery across Abuja
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border text-center hover-lift">
              <CardContent className="p-6">
                <RefreshCw className="h-10 w-10 text-accent mx-auto mb-4" />
                <h3 className="font-heading font-semibold text-foreground mb-2">
                  Swap Available
                </h3>
                <p className="text-sm text-muted-foreground">
                  Trade in your old device and upgrade for less
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border text-center hover-lift">
              <CardContent className="p-6">
                <Headphones className="h-10 w-10 text-accent mx-auto mb-4" />
                <h3 className="font-heading font-semibold text-foreground mb-2">
                  24/7 Support
                </h3>
                <p className="text-sm text-muted-foreground">
                  Reach us anytime via WhatsApp for assistance
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Swap Modal */}
      <Dialog open={showSwapModal} onOpenChange={setShowSwapModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Swap for {gadget?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSwapSubmit} className="space-y-4">
            <div>
              <Label htmlFor="swap-name">Full Name</Label>
              <Input
                id="swap-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="swap-email">Email</Label>
              <Input
                id="swap-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="swap-phone">Phone Number</Label>
              <Input
                id="swap-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="device">Device to Swap</Label>
              <Input
                id="device"
                placeholder="e.g., iPhone 12, Samsung S21"
                value={formData.deviceToSwap}
                onChange={(e) => setFormData({ ...formData, deviceToSwap: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="condition">Device Condition</Label>
              <Select
                value={formData.deviceCondition}
                onValueChange={(value) => setFormData({ ...formData, deviceCondition: value })}
              >
                <SelectTrigger id="condition">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent - Like New</SelectItem>
                  <SelectItem value="good">Good - Minor Wear</SelectItem>
                  <SelectItem value="fair">Fair - Visible Wear</SelectItem>
                  <SelectItem value="poor">Poor - Significant Damage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="info">Additional Information</Label>
              <Textarea
                id="info"
                placeholder="Any other details about your device..."
                value={formData.additionalInfo}
                onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={isSubmitting || !formData.deviceCondition}
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Swap Application"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default GadgetDetail;
