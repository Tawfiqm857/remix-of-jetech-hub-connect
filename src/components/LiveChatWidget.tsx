import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const LiveChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"intro" | "form" | "success">("intro");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase.from("contacts").insert({
      name: formData.name,
      email: formData.email,
      message: `[Live Chat] ${formData.message}`,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } else {
      setStep("success");
      setFormData({ name: "", email: "", message: "" });
    }

    setIsSubmitting(false);
  };

  const resetChat = () => {
    setStep("intro");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-accent p-4 text-primary-foreground">
              <h3 className="font-heading font-semibold text-lg">Live Support</h3>
              <p className="text-sm text-primary-foreground/80">We typically reply within minutes</p>
            </div>

            {/* Content */}
            <div className="p-4 min-h-[300px] max-h-[400px] overflow-y-auto">
              <AnimatePresence mode="wait">
                {step === "intro" && (
                  <motion.div
                    key="intro"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <p className="text-foreground text-sm">
                        👋 Hi there! Welcome to JE Tech Hub. How can we help you today?
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left h-auto py-3"
                        onClick={() => setStep("form")}
                      >
                        💬 Start a conversation
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left h-auto py-3"
                        onClick={() => {
                          setFormData({ ...formData, message: "I have a question about courses" });
                          setStep("form");
                        }}
                      >
                        📚 Ask about courses
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left h-auto py-3"
                        onClick={() => {
                          setFormData({ ...formData, message: "I need help with gadgets" });
                          setStep("form");
                        }}
                      >
                        📱 Gadget inquiries
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === "form" && (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <div className="bg-secondary/50 rounded-lg p-3">
                      <p className="text-foreground text-sm">
                        Please share your details and we'll get back to you shortly.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <Input
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="h-10"
                      />
                      <Input
                        type="email"
                        placeholder="Your email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="h-10"
                      />
                      <Textarea
                        placeholder="How can we help?"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        className="min-h-[80px] resize-none"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </motion.form>
                )}

                {step === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                      className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                    <h4 className="font-heading font-semibold text-foreground mb-2">Message Sent!</h4>
                    <p className="text-muted-foreground text-sm mb-4">
                      We'll get back to you shortly via email.
                    </p>
                    <Button variant="outline" onClick={resetChat}>
                      Start New Chat
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LiveChatWidget;
