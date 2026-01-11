import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/JE_Techhub_logo.png";
export const Footer = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {
    toast
  } = useToast();
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    const {
      error
    } = await supabase.from("newsletter_subscribers").insert({
      email
    });
    if (error) {
      if (error.code === "23505") {
        toast({
          title: "Already subscribed",
          description: "This email is already subscribed to our newsletter."
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to subscribe. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to our newsletter."
      });
      setEmail("");
    }
    setIsLoading(false);
  };
  return <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img src={logo} alt="Joe Express Tech Hub - Gwagwalada, Abuja" className="h-14 w-auto brightness-0 invert" />
            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Joe Express Tech Hub - Empowering Gwagwalada and Abuja with tech skills and quality gadgets. Learn, grow, and succeed with us.
            </p>
            <div className="flex gap-3">
              
              
              
              
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[{
              name: "Home",
              path: "/"
            }, {
              name: "About Us",
              path: "/about"
            }, {
              name: "Courses",
              path: "/courses"
            }, {
              name: "Gadgets",
              path: "/gadgets"
            }, {
              name: "Contact",
              path: "/contact"
            }].map(link => <li key={link.path}>
                  <Link to={link.path} className="text-primary-foreground/80 hover:text-accent transition-colors">
                    {link.name}
                  </Link>
                </li>)}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 text-accent" />
                <span className="text-primary-foreground/80 text-sm">
                 Suit 4,Along Doma Fueling Station,Gwagwalada,Abuja,Nigeria
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent" />
                <span className="text-primary-foreground/80 text-sm">+234 810 794 1349</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent" />
                <span className="text-primary-foreground/80 text-sm">​Jetechhub@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Newsletter</h4>
            <p className="text-primary-foreground/80 text-sm mb-4">
              Subscribe to get updates on new courses and gadget deals.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <Input type="email" placeholder="Your email" value={email} onChange={e => setEmail(e.target.value)} className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50" />
              <Button type="submit" size="icon" disabled={isLoading} className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-10 pt-6 text-center">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} JE Tech Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>;
};
