import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import {
  Truck,
  Wrench,
  Globe,
  Palette,
  Layout as LayoutIcon,
  TrendingUp,
  MessageCircle,
  Loader2,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ImageCarousel from "@/components/ImageCarousel";

const WHATSAPP_NUMBER = "2348107941349";

const iconMap: Record<string, React.ReactNode> = {
  Truck: <Truck className="h-8 w-8" />,
  Wrench: <Wrench className="h-8 w-8" />,
  Globe: <Globe className="h-8 w-8" />,
  Palette: <Palette className="h-8 w-8" />,
  Layout: <LayoutIcon className="h-8 w-8" />,
  TrendingUp: <TrendingUp className="h-8 w-8" />,
};

interface ServiceImage {
  image_url: string;
  display_order: number;
}

interface Service {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  service_images: ServiceImage[];
}

interface Profile {
  full_name: string | null;
  phone: string | null;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestingService, setRequestingService] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from("services")
      .select(`
        *,
        service_images (
          image_url,
          display_order
        )
      `)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching services:", error);
    } else {
      // Sort service_images by display_order
      const servicesWithSortedImages = (data || []).map(service => ({
        ...service,
        service_images: (service.service_images || []).sort(
          (a: ServiceImage, b: ServiceImage) => a.display_order - b.display_order
        )
      }));
      setServices(servicesWithSortedImages);
    }
    setLoading(false);
  };

  const handleRequestService = async (service: Service) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to request a service",
      });
      navigate("/auth");
      return;
    }

    setRequestingService(service.id);

    try {
      // Fetch user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("user_id", user.id)
        .maybeSingle();

      const userName = profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Customer";
      const userEmail = user.email || "";
      const userPhone = profile?.phone || "Not provided";

      // Create service request record
      const { error: insertError } = await supabase.from("service_requests").insert({
        user_id: user.id,
        service_id: service.id,
        customer_name: userName,
        customer_email: userEmail,
        customer_phone: userPhone,
        status: "pending",
      });

      if (insertError) throw insertError;

      // Generate WhatsApp message
      const message = `Hello JE Tech Hub 👋

I would like to request the following service:

Service: ${service.name}
Name: ${userName}
Email: ${userEmail}
Phone: ${userPhone}

Please let me know how to proceed.`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

      toast({
        title: "Request submitted!",
        description: "Redirecting you to WhatsApp...",
      });

      // Open WhatsApp
      window.open(whatsappUrl, "_blank");
    } catch (error) {
      console.error("Error requesting service:", error);
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRequestingService(null);
    }
  };

  const benefits = [
    "Expert technicians with years of experience",
    "Fast turnaround time on all services",
    "Competitive and transparent pricing",
    "Quality guarantee on all work",
  ];

  // Get images for carousel
  const getServiceImages = (service: Service): string[] => {
    if (service.service_images && service.service_images.length > 0) {
      return service.service_images.map(img => img.image_url);
    }
    // Fallback to default image
    return ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop"];
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1920&h=1080&fit=crop"
            alt="Professional tech services"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
        </div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl floating-element" />
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl floating-element" style={{ animationDelay: '-3s' }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 opacity-0 animate-fade-up border border-primary/20">
                <Wrench className="h-4 w-4" />
                <span className="text-sm font-medium">Professional Services</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 opacity-0 animate-fade-up stagger-1 leading-[1.1]">
                Expert Tech{" "}
                <span className="text-primary">Services</span>{" "}
                <span className="text-accent">For You</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 opacity-0 animate-fade-up stagger-2 leading-relaxed">
                From gadget repairs to digital solutions, our professional team delivers quality services tailored to your needs.
              </p>
              
              {/* Benefits List */}
              <div className="space-y-3 mb-8 opacity-0 animate-fade-up stagger-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 justify-center lg:justify-start">
                    <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start opacity-0 animate-fade-up stagger-4">
                <Button
                  size="lg"
                  className="text-lg px-8 h-14 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    const message = encodeURIComponent("Hello JE Tech Hub 👋\n\nI would like to inquire about your services.");
                    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
                  }}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Chat on WhatsApp
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 h-14 hover:-translate-y-0.5 transition-all duration-300 border-2"
                  onClick={() => document.getElementById('services-grid')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View Services
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Hero Stats Cards */}
            <div className="hidden lg:block opacity-0 animate-fade-up stagger-2">
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <Card className="bg-card/80 backdrop-blur-sm border-border/50 p-6 hover-lift">
                      <div className="text-3xl font-bold text-primary mb-2">
                        <AnimatedCounter value={500} suffix="+" duration={2} />
                      </div>
                      <div className="text-muted-foreground text-sm">Devices Repaired</div>
                    </Card>
                    <Card className="bg-card/80 backdrop-blur-sm border-border/50 p-6 hover-lift">
                      <div className="text-3xl font-bold text-accent mb-2">
                        <AnimatedCounter value={98} suffix="%" duration={2} />
                      </div>
                      <div className="text-muted-foreground text-sm">Customer Satisfaction</div>
                    </Card>
                  </div>
                  <div className="space-y-4 mt-8">
                    <Card className="bg-card/80 backdrop-blur-sm border-border/50 p-6 hover-lift">
                      <div className="text-3xl font-bold text-primary mb-2">
                        <AnimatedCounter value={24} suffix="hr" duration={2} />
                      </div>
                      <div className="text-muted-foreground text-sm">Fast Turnaround</div>
                    </Card>
                    <Card className="bg-card/80 backdrop-blur-sm border-border/50 p-6 hover-lift">
                      <div className="text-3xl font-bold text-accent mb-2">
                        <AnimatedCounter value={5} suffix="+" duration={2} />
                      </div>
                      <div className="text-muted-foreground text-sm">Years Experience</div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Services Grid */}
      <section id="services-grid" className="py-20 md:py-28 bg-background relative">
        <div className="absolute inset-0 glow-effect opacity-30" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-accent font-medium text-sm uppercase tracking-wider mb-2 block">What We Offer</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
              Our Professional Services
            </h2>
            <p className="text-muted-foreground text-lg">
              Choose from our wide range of tech services designed to meet your needs
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No services available at the moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card
                  key={service.id}
                  className="border-border/50 bg-card hover-lift hover-glow flex flex-col group animate-fade-up overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Service Image Carousel */}
                  <div className="relative">
                    <ImageCarousel
                      images={getServiceImages(service)}
                      alt={service.name}
                      autoPlayInterval={3000}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10 pointer-events-none" />
                    <div className="absolute bottom-4 left-4 z-20">
                      <div className="w-14 h-14 rounded-xl bg-accent/90 flex items-center justify-center text-accent-foreground shadow-lg">
                        {service.icon && iconMap[service.icon]
                          ? iconMap[service.icon]
                          : <Globe className="h-8 w-8" />}
                      </div>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="font-heading text-xl text-foreground group-hover:text-primary transition-colors">
                      {service.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                  </CardContent>
                  <CardFooter className="pt-4">
                    <Button
                      onClick={() => handleRequestService(service)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base"
                      disabled={requestingService === service.id}
                    >
                      {requestingService === service.id ? (
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      ) : (
                        <MessageCircle className="h-5 w-5 mr-2" />
                      )}
                      Request Service
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 md:py-28 bg-secondary/30 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary font-medium text-sm uppercase tracking-wider mb-2 block">How It Works</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
              Simple Process
            </h2>
            <p className="text-muted-foreground text-lg">
              Get started with our services in just a few easy steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: "01", title: "Choose a Service", description: "Browse our services and select the one that fits your needs", icon: CheckCircle },
              { step: "02", title: "Contact Us", description: "Reach out via WhatsApp or submit a request through our platform", icon: MessageCircle },
              { step: "03", title: "Get It Done", description: "Our expert team delivers quality results with fast turnaround", icon: ArrowRight },
            ].map((item, index) => (
              <div key={index} className="text-center opacity-0 animate-fade-up" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto border-2 border-primary/20">
                    <span className="text-3xl font-bold text-primary">{item.step}</span>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
                  )}
                </div>
                <h3 className="text-xl font-heading font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&h=800&fit=crop"
            alt="Team collaboration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-accent/90" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4 animate-fade-up">
                Need a Custom Solution?
              </h2>
              <p className="text-primary-foreground/90 text-lg mb-8 animate-fade-up stagger-1">
                Our team is ready to discuss your specific requirements and provide tailored solutions for your tech needs.
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 h-14 animate-fade-up stagger-2"
                onClick={() => {
                  const message = encodeURIComponent("Hello JE Tech Hub 👋\n\nI would like to discuss a custom solution for my tech needs.");
                  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
                }}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Let's Talk
              </Button>
            </div>
            
            <div className="hidden lg:block">
              <Card className="bg-card/95 backdrop-blur-sm p-8 animate-fade-up stagger-2">
                <h3 className="text-xl font-heading font-semibold text-foreground mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium text-foreground">+234 810 794 1349</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-foreground">contact@jetechhub.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Working Hours</p>
                      <p className="font-medium text-foreground">Mon - Sat: 9AM - 6PM</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;