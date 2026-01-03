import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { 
  GraduationCap, 
  Smartphone, 
  ArrowRight, 
  Users, 
  Award, 
  Zap, 
  RefreshCw, 
  CheckCircle, 
  Star, 
  Play,
  Briefcase,
  Globe,
  BookOpen,
  ShieldCheck,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { data: courses } = useQuery({
    queryKey: ['featured-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .limit(3);
      if (error) throw error;
      return data;
    }
  });

  const { data: gadgets } = useQuery({
    queryKey: ['featured-gadgets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gadgets')
        .select('*')
        .eq('in_stock', true)
        .limit(4);
      if (error) throw error;
      return data;
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const testimonials = [
    {
      name: "Adaeze Okonkwo",
      role: "Frontend Developer at Paystack",
      content: "JE Tech Hub transformed my career. The hands-on approach and mentorship helped me land my dream job within 3 months of completing the course.",
      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop",
    },
    {
      name: "Emeka Nnamdi",
      role: "UI/UX Designer at Andela",
      content: "The UI/UX Design Masterclass gave me practical skills that I use every day. The certificate opened doors I never thought possible.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
    {
      name: "Fatima Ibrahim",
      role: "Data Analyst at MTN",
      content: "From zero coding experience to a data analyst role - JE Tech Hub made it possible. The community support was incredible throughout my journey.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
    },
  ];

  const features = [
    { icon: Award, title: "Industry Certificates", description: "Earn credentials recognized by top employers", color: "bg-amber-500/10 text-amber-500" },
    { icon: Users, title: "Expert Mentors", description: "Learn from professionals with real experience", color: "bg-blue-500/10 text-blue-500" },
    { icon: Briefcase, title: "Job Placement", description: "95% of graduates employed within 6 months", color: "bg-emerald-500/10 text-emerald-500" },
    { icon: Play, title: "Hands-On Projects", description: "Build portfolio-worthy projects as you learn", color: "bg-rose-500/10 text-rose-500" },
  ];

  const stats = [
    { value: 5000, suffix: "+", label: "Students Trained", icon: Users },
    { value: 95, suffix: "%", label: "Job Placement", icon: Briefcase },
    { value: 50, suffix: "+", label: "Industry Partners", icon: Globe },
    { value: 6, suffix: "", label: "Tech Programs", icon: BookOpen },
  ];

  const benefits = [
    { icon: ShieldCheck, title: "Verified Certificates", description: "Our certificates are recognized by leading tech companies across Nigeria and globally." },
    { icon: TrendingUp, title: "Career Growth", description: "Get personalized career coaching and job placement assistance after graduation." },
    { icon: Clock, title: "Flexible Learning", description: "Learn at your own pace with 24/7 access to course materials and resources." },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop"
            alt="Tech education"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
          <div className="absolute inset-0 african-pattern opacity-5" />
        </div>
        
        {/* Floating Orbs */}
        <motion.div 
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white mb-8 backdrop-blur-sm border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Zap className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">Nigeria's #1 Tech Education Hub</span>
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-white mb-8 leading-[1.1]">
                Learn Tech Skills.
                <br />
                <span className="text-accent">Get Certified.</span>
                <br />
                <span className="text-white/90">Build Your Future.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-lg leading-relaxed">
                Join 5,000+ Nigerians who've launched successful tech careers with our hands-on training, expert mentorship, and industry-recognized certificates.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 h-14 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 gap-2">
                  <Link to="/courses">
                    <GraduationCap className="h-5 w-5" />
                    Explore Courses
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 h-14 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 gap-2">
                  <Link to="/gadgets">
                    <Smartphone className="h-5 w-5" />
                    Shop Gadgets
                  </Link>
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-6 text-white/70 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Verified Certificates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Job Placement Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Expert Instructors</span>
                </div>
              </div>
            </motion.div>
            
            {/* Stats Cards */}
            <motion.div 
              className="hidden lg:grid grid-cols-2 gap-4"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 group"
                >
                  <stat.icon className="w-8 h-8 text-accent mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <p className="text-3xl font-heading font-bold text-white mb-1">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={2} />
                  </p>
                  <p className="text-white/70 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Mobile Stats */}
      <section className="lg:hidden py-8 bg-background -mt-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-border/50">
                <CardContent className="p-4 text-center">
                  <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-heading font-bold text-foreground">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={2} />
                  </p>
                  <p className="text-muted-foreground text-xs">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.span 
              className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Why Choose Us
            </motion.span>
            <motion.h2 
              className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Transform Your Career With
              <span className="text-primary"> JE TechHub</span>
            </motion.h2>
            <motion.p 
              className="text-muted-foreground text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Join thousands of successful graduates who have launched their tech careers
            </motion.p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-border/50 bg-card hover:shadow-elevated transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-heading font-bold text-lg text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 md:py-28 bg-secondary/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
            <div>
              <motion.span 
                className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Education
              </motion.span>
              <motion.h2 
                className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Featured Courses
              </motion.h2>
              <motion.p 
                className="text-muted-foreground text-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Start your tech journey with our most popular courses
              </motion.p>
            </div>
            <Button asChild variant="outline" className="mt-6 md:mt-0 group gap-2">
              <Link to="/courses">
                View All Courses
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses?.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/courses/${course.id}`} className="block group h-full">
                  <Card className="overflow-hidden h-full border-border/50 hover:shadow-elevated transition-all duration-300">
                    <div className="aspect-video overflow-hidden relative">
                      <img 
                        src={course.image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'} 
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      {course.certificate_available && (
                        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-medium shadow-lg">
                          <Award className="h-3.5 w-3.5" />
                          Certificate
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                          {course.category}
                        </span>
                        {course.level && (
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground">
                            {course.level}
                          </span>
                        )}
                      </div>
                      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors duration-300 text-xl">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-primary">
                            {course.price === 0 ? 'Free' : formatPrice(course.price || 0)}
                          </span>
                          {course.duration && (
                            <span className="text-sm text-muted-foreground ml-2">• {course.duration}</span>
                          )}
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
                Why Students Love Us
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
                Everything You Need to
                <span className="text-accent"> Succeed in Tech</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                We provide more than just courses—we offer a complete ecosystem for your tech career success, from learning to landing your dream job.
              </p>

              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-lg text-foreground mb-1">{benefit.title}</h3>
                      <p className="text-muted-foreground text-sm">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop"
                  alt="Students learning"
                  className="relative rounded-3xl shadow-2xl w-full object-cover aspect-[4/3]"
                />
                
                {/* Floating Card */}
                <motion.div 
                  className="absolute -bottom-6 -left-6 bg-card p-6 rounded-2xl shadow-elevated border border-border/50"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center">
                      <Award className="w-7 h-7 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="text-2xl font-heading font-bold text-foreground">95%</p>
                      <p className="text-muted-foreground text-sm">Employment Rate</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Gadgets */}
      <section className="py-20 md:py-28 bg-secondary/30 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
            <div>
              <motion.span 
                className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Shop
              </motion.span>
              <motion.h2 
                className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Latest Gadgets
              </motion.h2>
              <motion.p 
                className="text-muted-foreground text-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Quality devices at competitive prices
              </motion.p>
            </div>
            <Button asChild variant="outline" className="mt-6 md:mt-0 group gap-2">
              <Link to="/gadgets">
                View All Gadgets
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {gadgets?.map((gadget, index) => (
              <motion.div
                key={gadget.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/gadgets/${gadget.id}`} className="block group h-full">
                  <Card className="overflow-hidden h-full border-border/50 hover:shadow-elevated transition-all duration-300">
                    <div className="aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/50 relative">
                      <img 
                        src={gadget.image_url || 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800'} 
                        alt={gadget.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {gadget.swap_available && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium shadow-lg">
                          <RefreshCw className="h-3 w-3" />
                          Swap
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary inline-block mb-2">
                        {gadget.category}
                      </span>
                      <h3 className="font-heading font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-300 mb-2">
                        {gadget.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-primary">{formatPrice(gadget.price)}</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.span 
              className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Testimonials
            </motion.span>
            <motion.h2 
              className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              What Our Students Say
            </motion.h2>
            <motion.p 
              className="text-muted-foreground text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Hear from graduates who transformed their careers with JE TechHub
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-border/50 bg-card hover:shadow-elevated transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>
                    <div className="flex items-center gap-3">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-border"
                      />
                      <div>
                        <p className="font-heading font-bold text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div 
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/90 p-10 md:p-16 lg:p-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            <div className="absolute inset-0 african-pattern opacity-5" />
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-6 leading-tight">
                  Ready to Start Your
                  <span className="text-accent"> Tech Journey?</span>
                </h2>
                <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed">
                  Join thousands of students who have transformed their careers with JE TechHub. Get certified, get skilled, get ahead.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg h-14 px-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 gap-2">
                    <Link to="/auth">
                      Create Free Account
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="text-lg h-14 px-8 border-2 border-white/30 text-white bg-transparent hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                    <Link to="/contact">Contact Us</Link>
                  </Button>
                </div>
              </div>
              
              <div className="hidden lg:block">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                  alt="Students learning together"
                  className="rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
