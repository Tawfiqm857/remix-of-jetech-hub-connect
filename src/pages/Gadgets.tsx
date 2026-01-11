import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, RefreshCw, Smartphone, Monitor, Package, Plus, Loader2 } from "lucide-react";
import { GadgetsGridSkeleton } from "@/components/skeletons/GadgetCardSkeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { SEOHead, FAQSchema, BreadcrumbSchema, BUSINESS_INFO } from "@/components/seo";

interface Gadget {
  id: string;
  name: string;
  description: string;
  category: "Phone" | "PC" | "Other";
  price: number;
  image_url: string;
  in_stock: boolean;
  swap_available: boolean;
}

const Gadgets = () => {
  const [gadgets, setGadgets] = useState<Gadget[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Modal states
  const [selectedGadget, setSelectedGadget] = useState<Gadget | null>(null);
  const [modalType, setModalType] = useState<"buy" | "swap" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    deviceToSwap: "",
    deviceCondition: "",
    additionalInfo: "",
  });

  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGadgets();
  }, []);

  const fetchGadgets = async () => {
    const { data, error } = await supabase
      .from("gadgets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching gadgets:", error);
      setGadgets([]);
    } else {
      setGadgets(data as Gadget[]);
    }
    setLoading(false);
  };

  const openModal = (gadget: Gadget, type: "buy" | "swap") => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: `Please sign in to ${type === "buy" ? "purchase" : "apply for swap"}.`,
      });
      navigate("/auth");
      return;
    }
    setSelectedGadget(gadget);
    setModalType(type);
    setFormData({
      name: "",
      email: user.email || "",
      phone: "",
      address: "",
      deviceToSwap: "",
      deviceCondition: "",
      additionalInfo: "",
    });
  };

  const closeModal = () => {
    setSelectedGadget(null);
    setModalType(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGadget || !user) return;

    setIsSubmitting(true);

    if (modalType === "buy") {
      const { error } = await supabase.from("orders").insert({
        user_id: user.id,
        gadget_id: selectedGadget.id,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        delivery_address: formData.address,
        total_price: selectedGadget.price,
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to place order. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Order placed!",
          description: "We'll contact you soon to confirm your order.",
        });
        closeModal();
      }
    } else {
      const { error } = await supabase.from("swaps").insert({
        user_id: user.id,
        gadget_id: selectedGadget.id,
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
        closeModal();
      }
    }

    setIsSubmitting(false);
  };

  const categories = ["all", "Phone", "PC", "Other"];

  const filteredGadgets = gadgets.filter((gadget) => {
    const matchesSearch =
      gadget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gadget.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeTab === "all" || gadget.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Gadgets page FAQs
  const gadgetFaqs = [
    {
      question: "Where can I buy phones in Gwagwalada?",
      answer: "Joe Express Tech Hub in Gwagwalada, Abuja sells quality phones, laptops, and gadgets at competitive prices. Visit our store at Suit 4, Along Doma Fueling Station."
    },
    {
      question: "Can I swap my old phone for a new one in Gwagwalada?",
      answer: "Yes! We offer gadget swapping services at our Gwagwalada location. Bring your old device for assessment and get an upgrade at a discounted price."
    },
    {
      question: "Do you sell laptops in Gwagwalada?",
      answer: "Yes, we sell quality laptops for personal and business use at Joe Express Tech Hub, Gwagwalada. We offer competitive prices and warranty on all devices."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept cash, bank transfers, and installment payments for gadget purchases at our Gwagwalada store. Contact us for flexible payment options."
    }
  ];

  return (
    <Layout>
      {/* SEO */}
      <SEOHead
        title="Buy Phones & Laptops in Gwagwalada, Abuja | Gadget Sales, Swap & Repairs"
        description="Buy quality phones, laptops, and gadgets at Joe Express Tech Hub in Gwagwalada, Abuja. Best prices, gadget swapping available, and warranty on all devices. Visit our store today!"
        keywords="buy phones Gwagwalada, laptop sales Abuja, gadgets Gwagwalada, phone swap Abuja, buy laptops Gwagwalada, phone shop Gwagwalada, gadget store Abuja"
        canonical="https://jetechhub.com/gadgets"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://jetechhub.com" },
        { name: "Gadgets", url: "https://jetechhub.com/gadgets" }
      ]} />
      <FAQSchema faqs={gadgetFaqs} />

      {/* Hero Section */}
      <section className="relative hero-gradient text-primary-foreground overflow-hidden" aria-label="Quality Gadgets in Gwagwalada">
        <div className="absolute inset-0 african-pattern opacity-10" />
        <div className="absolute inset-0 glow-effect" />
        
        {/* Hero Image Overlay */}
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1920&h=800&fit=crop"
            alt="Phones and gadgets for sale in Gwagwalada"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
        
        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-heading font-bold mb-4 animate-fade-up">
              Buy Phones & Gadgets in Gwagwalada, Abuja
            </h1>
            <p className="text-lg text-primary-foreground/90 animate-fade-up stagger-1">
              Quality phones, laptops, and gadgets at competitive prices. Swap your old device for an upgrade at Joe Express Tech Hub!
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Category Tabs & Search */}
      <section className="py-6 bg-background border-b border-border">
        <div className="container mx-auto px-4 space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-md mx-auto">
              <TabsTrigger value="all" className="gap-2">
                <Package className="h-4 w-4 hidden sm:inline" />
                All
              </TabsTrigger>
              <TabsTrigger value="Phone" className="gap-2">
                <Smartphone className="h-4 w-4 hidden sm:inline" />
                Phones
              </TabsTrigger>
              <TabsTrigger value="PC" className="gap-2">
                <Monitor className="h-4 w-4 hidden sm:inline" />
                PCs
              </TabsTrigger>
              <TabsTrigger value="Other" className="gap-2">
                <Package className="h-4 w-4 hidden sm:inline" />
                Other
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search gadgets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Gadgets Grid */}
      <section className="py-12 md:py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          {loading ? (
            <GadgetsGridSkeleton count={6} />
          ) : filteredGadgets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No gadgets found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGadgets.map((gadget, index) => (
                <Card 
                  key={gadget.id} 
                  className="border-border/50 bg-card hover-lift hover-glow overflow-hidden flex flex-col group animate-fade-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Link to={`/gadgets/${gadget.id}`} className="block">
                    <div className="aspect-square relative overflow-hidden bg-muted">
                      <img
                        src={gadget.image_url || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800"}
                        alt={gadget.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                        {gadget.category}
                      </Badge>
                      {gadget.swap_available && (
                        <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Swap Available
                        </Badge>
                      )}
                      {!gadget.in_stock && (
                        <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                          <Badge variant="destructive">Out of Stock</Badge>
                        </div>
                      )}
                    </div>
                  </Link>
                  <CardContent className="p-6 flex-1">
                    <Link to={`/gadgets/${gadget.id}`} className="block">
                      <h3 className="font-heading font-semibold text-lg text-foreground mb-2 hover:text-accent transition-colors">
                        {gadget.name}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
                      {gadget.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {gadget.category}
                      </Badge>
                      {gadget.in_stock ? (
                        <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600 dark:text-green-400">
                          In Stock
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs bg-red-500/10 text-red-600 dark:text-red-400">
                          Out of Stock
                        </Badge>
                      )}
                      {gadget.swap_available && (
                        <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Swap OK
                        </Badge>
                      )}
                    </div>
                    <p className="font-heading font-bold text-2xl text-accent">
                      {formatPrice(gadget.price)}
                    </p>
                  </CardContent>
                  <CardFooter className="p-6 pt-0 flex gap-2">
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        if (!user) {
                          toast({ title: "Sign in required", description: "Please sign in to add items to cart" });
                          navigate("/auth");
                          return;
                        }
                        addToCart(gadget.id);
                      }}
                      className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-300 hover:scale-[1.02]"
                      disabled={!gadget.in_stock}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {gadget.in_stock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                    {gadget.swap_available && (
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          openModal(gadget, "swap");
                        }}
                        variant="outline"
                        className="flex-1 transition-all duration-300 hover:scale-[1.02]"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Swap
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Buy Modal */}
      <Dialog open={modalType === "buy"} onOpenChange={() => closeModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Order {selectedGadget?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Delivery Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>
            <div className="pt-2">
              <p className="text-sm text-muted-foreground">
                Total: <span className="font-bold text-foreground">{selectedGadget && formatPrice(selectedGadget.price)}</span>
              </p>
            </div>
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Place Order"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Swap Modal */}
      <Dialog open={modalType === "swap"} onOpenChange={() => closeModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Swap for {selectedGadget?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
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

export default Gadgets;