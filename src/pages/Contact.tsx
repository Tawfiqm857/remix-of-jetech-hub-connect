import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, Send, Loader2, MessageCircle, Headphones, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import LiveChatWidget from "@/components/LiveChatWidget";
import { z } from "zod";
import { SEOHead, FAQSchema, LocalBusinessSchema, BreadcrumbSchema, BUSINESS_INFO } from "@/components/seo";

// Validation schema matching database trigger constraints
const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be 100 characters or less" }),
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be 255 characters or less" }),
  message: z
    .string()
    .trim()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(5000, { message: "Message must be 5000 characters or less" }),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Client-side validation
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof ContactFormData;
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    
    setIsSubmitting(true);

    const { error } = await supabase.from("contacts").insert({
      name: result.data.name,
      email: result.data.email.toLowerCase(),
      message: result.data.message,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      setFormData({ name: "", email: "", message: "" });
    }

    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Address",
      content: "Suit 4, Along Doma Fueling Station, Gwagwalada, Abuja, Nigeria",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+234 903 456 7890",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Mail,
      title: "Email",
      content: "info@jetechhub.ng",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Mon - Fri: 9AM - 6PM\nSat: 10AM - 4PM",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  const features = [
    {
      icon: MessageCircle,
      title: "Quick Response",
      description: "We respond to all inquiries within 24 hours",
    },
    {
      icon: Headphones,
      title: "Expert Support",
      description: "Get help from our experienced tech team",
    },
    {
      icon: Users,
      title: "Personal Touch",
      description: "Dedicated support for all your needs",
    },
  ];

  // Contact page FAQs
  const contactFaqs = [
    {
      question: "Where is Joe Express Tech Hub located?",
      answer: "We are located at Suit 4, Along Doma Fueling Station, Gwagwalada, Abuja, Nigeria. Easy to find and accessible by public transport."
    },
    {
      question: "What are your business hours?",
      answer: "We are open Monday to Friday 9AM-6PM and Saturday 10AM-4PM. Closed on Sundays. You can always reach us via WhatsApp."
    },
    {
      question: "How can I contact Joe Express Tech Hub?",
      answer: "You can call us at +234 810 794 1349, email Jetechhub@gmail.com, or visit our Gwagwalada office. We also respond quickly on WhatsApp."
    },
    {
      question: "Do you offer free consultations?",
      answer: "Yes! We offer free consultations for all our services. Visit our Gwagwalada location or contact us online to schedule a consultation."
    }
  ];

  return (
    <Layout>
      {/* SEO */}
      <SEOHead
        title="Contact Joe Express Tech Hub | Visit Us in Gwagwalada, Abuja"
        description="Contact Joe Express Tech Hub in Gwagwalada, Abuja. Visit our office at Suit 4, Along Doma Fueling Station. Call +234 810 794 1349 or email Jetechhub@gmail.com. We're here to help with tech training, gadget sales, and services!"
        keywords="contact Joe Express Tech Hub, tech hub Gwagwalada address, phone number JE Tech Hub, email JE Tech Hub, visit tech hub Abuja, Gwagwalada tech center location"
        canonical="https://www.joexpresstechhub.com/contact"
      />
      <LocalBusinessSchema />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://www.joexpresstechhub.com" },
        { name: "Contact", url: "https://www.joexpresstechhub.com/contact" }
      ]} />
      <FAQSchema faqs={contactFaqs} />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden" aria-label="Contact Joe Express Tech Hub">
        {/* Animated Background */}
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 african-pattern opacity-5" />
        
        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 left-[10%] w-72 h-72 bg-primary/20 rounded-full blur-3xl"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-[10%] w-96 h-96 bg-accent/20 rounded-full blur-3xl"
          animate={{
            y: [0, 30, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm border border-accent/30 rounded-full px-4 py-2 mb-6"
            >
              <Mail className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">Get In Touch</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-primary-foreground mb-6">
              Let's Start a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
                Conversation
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Have questions about our courses, gadgets, or services? We're here to help you navigate your tech journey.
            </p>
          </motion.div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
          </svg>
        </div>
      </section>

      {/* Features Strip */}
      <section className="py-12 bg-background border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-background relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
                Send Us a Message
              </h2>
              <p className="text-muted-foreground mb-8">
                Fill out the form below and we'll get back to you promptly.
              </p>
              
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-foreground font-medium">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: undefined });
                        }}
                        placeholder="Enter your name"
                        maxLength={100}
                        className={`h-12 bg-background/50 border-border/50 focus:border-primary transition-colors ${errors.name ? 'border-destructive' : ''}`}
                      />
                      {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: undefined });
                        }}
                        placeholder="Enter your email"
                        maxLength={255}
                        className={`h-12 bg-background/50 border-border/50 focus:border-primary transition-colors ${errors.email ? 'border-destructive' : ''}`}
                      />
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="message" className="text-foreground font-medium">Message</Label>
                        <span className="text-xs text-muted-foreground">{formData.message.length}/5000</span>
                      </div>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => {
                          setFormData({ ...formData, message: e.target.value });
                          if (errors.message) setErrors({ ...errors, message: undefined });
                        }}
                        placeholder="How can we help you?"
                        maxLength={5000}
                        className={`min-h-[150px] bg-background/50 border-border/50 focus:border-primary transition-colors resize-none ${errors.message ? 'border-destructive' : ''}`}
                      />
                      {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold shadow-lg shadow-primary/25 transition-all duration-300"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      ) : (
                        <Send className="w-5 h-5 mr-2" />
                      )}
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
                Contact Information
              </h2>
              <p className="text-muted-foreground mb-8">
                Reach out through any of these channels.
              </p>
              
              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
                      <CardContent className="p-6 flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-2xl ${item.bgColor} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                          <item.icon className={`w-7 h-7 ${item.color}`} />
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold text-foreground mb-1 text-lg">
                            {item.title}
                          </h3>
                          <p className="text-muted-foreground whitespace-pre-line">
                            {item.content}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Google Map */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-6"
              >
                <Card className="border-border/50 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31512.881853849344!2d7.0701!3d8.9478!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e744de46e9e47%3A0x9e3c6e00d73df2e5!2sGwagwalada%2C%20Federal%20Capital%20Territory%2C%20Nigeria!5e0!3m2!1sen!2sus!4v1704067200000!5m2!1sen!2sus"
                        width="100%"
                        height="250"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="JE Tech Hub Location"
                        className="grayscale hover:grayscale-0 transition-all duration-500"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-card to-transparent p-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-primary" />
                          <span className="text-sm font-medium text-foreground">Gwagwalada, Abuja, Nigeria</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-secondary/30 relative overflow-hidden">
        {/* Background Elements */}
        <motion.div
          className="absolute top-10 right-[5%] w-64 h-64 bg-primary/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Frequently Asked{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Questions
              </span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Can't find what you're looking for? Check our FAQ or send us a message above.
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { q: "How long are the courses?", a: "Courses range from 6-16 weeks depending on the program.", icon: Clock },
              { q: "Do I get a certificate?", a: "Yes! All courses include official JE Tech Hub certificates.", icon: Mail },
              { q: "Can I pay in installments?", a: "Yes, we offer flexible payment plans for all courses.", icon: Users },
            ].map((faq, index) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border-border/50 bg-card/80 backdrop-blur-sm h-full hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <faq.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="font-heading font-semibold text-foreground mb-2">{faq.q}</h4>
                    <p className="text-muted-foreground text-sm">{faq.a}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Chat Widget */}
      <LiveChatWidget />
    </Layout>
  );
};

export default Contact;