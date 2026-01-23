import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { GraduationCap, Smartphone, ArrowRight, Users, Award, Zap, RefreshCw, CheckCircle, Star, Play, Briefcase, Globe, BookOpen, ShieldCheck, TrendingUp, Clock, Wrench, MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import heroBackground from "@/assets/hero-background.jpg";
import ImageCarousel from "@/components/ImageCarousel";
import { SEOHead, LocalBusinessSchema, OrganizationSchema, FAQSchema, BUSINESS_INFO } from "@/components/seo";

interface CourseImage {
  image_url: string;
  display_order: number;
}

interface ServiceImage {
  image_url: string;
  display_order: number;
}

const Index = () => {
  const {
    data: courses
  } = useQuery({
    queryKey: ['featured-courses'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('courses').select(`
        *,
        course_images (
          image_url,
          display_order
        )
      `).limit(3);
      if (error) throw error;
      // Sort course_images by display_order
      return (data || []).map(course => ({
        ...course,
        course_images: (course.course_images || []).sort(
          (a: CourseImage, b: CourseImage) => a.display_order - b.display_order
        )
      }));
    }
  });
  const {
    data: gadgets
  } = useQuery({
    queryKey: ['featured-gadgets'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('gadgets').select('*').eq('in_stock', true).limit(4);
      if (error) throw error;
      return data;
    }
  });
  const {
    data: services
  } = useQuery({
    queryKey: ['featured-services'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('services').select(`
        *,
        service_images (
          image_url,
          display_order
        )
      `).limit(6);
      if (error) throw error;
      // Sort service_images by display_order
      return (data || []).map(service => ({
        ...service,
        service_images: (service.service_images || []).sort(
          (a: ServiceImage, b: ServiceImage) => a.display_order - b.display_order
        )
      }));
    }
  });
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);
  };
  const testimonials = [{
    name: "Adaeze Okonkwo",
    role: "Software Developer",
    content: "JE Tech Hub transformed my career. The hands-on approach and expert mentorship helped me build real-world skills that employers value.",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop"
  }, {
    name: "Emeka Nnamdi",
    role: "UI/UX Designer",
    content: "The practical training at JE Tech Hub gave me confidence and competence. I now work on projects that make a real difference.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
  }, {
    name: "Fatima Ibrahim",
    role: "Data Analyst",
    content: "From beginner to professional - JE Tech Hub made it possible. The community support and quality training exceeded my expectations.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop"
  }];
  const features = [{
    icon: Award,
    title: "Verified Certificates",
    description: "Earn credentials recognized by employers across Nigeria",
    color: "bg-amber-500/10 text-amber-500"
  }, {
    icon: Users,
    title: "Expert Mentors",
    description: "Learn from experienced trainers with industry knowledge",
    color: "bg-blue-500/10 text-blue-500"
  }, {
    icon: Briefcase,
    title: "Real-World Impact",
    description: "Practical projects that prepare you for actual careers",
    color: "bg-emerald-500/10 text-emerald-500"
  }, {
    icon: Play,
    title: "Hands-On Learning",
    description: "Build portfolio-worthy projects as you learn",
    color: "bg-rose-500/10 text-rose-500"
  }];
  const stats = [{
    value: 1400,
    suffix: "+",
    label: "Individuals Trained",
    icon: Users
  }, {
    value: 30,
    suffix: "+",
    label: "Skilled Graduates",
    icon: Briefcase
  }, {
    icon: Globe,
    value: 5,
    suffix: "+",
    label: "Years Experience",
  }, {
    value: 6,
    suffix: "",
    label: "Tech Programs",
    icon: BookOpen
  }];
  const benefits = [{
    icon: ShieldCheck,
    title: "Verified Certificates",
    description: "Our certificates are recognized by leading tech companies across Nigeria and globally."
  }, {
    icon: TrendingUp,
    title: "Career Growth",
    description: "Get personalized career coaching and mentorship to help you succeed."
  }, {
    icon: Clock,
    title: "Practical Training",
    description: "Hands-on learning with real-world tools and industry-relevant projects."
  }];
  const fadeInUp = {
    initial: {
      opacity: 0,
      y: 30
    },
    animate: {
      opacity: 1,
      y: 0
    },
    transition: {
      duration: 0.6
    }
  };
  const serviceIcons: Record<string, React.ElementType> = {
    Truck: Wrench,
    Wrench: Wrench,
    Globe: Globe,
    Palette: Star,
    Layout: BookOpen,
    TrendingUp: TrendingUp
  };
  // Homepage FAQs for Schema
  const homeFaqs = [
    {
      question: "Where is JE Tech Hub located?",
      answer: "JE Tech Hub is located at Suit 4, Along Doma Fueling Station, Gwagwalada, Abuja, Nigeria. We are easily accessible and open Monday to Friday 9AM-6PM and Saturday 10AM-4PM."
    },
    {
      question: "What tech courses do you offer?",
      answer: "We offer professional training in Software Development, Data Analysis, UI/UX Design, Graphics Design, and AI Content Creation. All courses include hands-on projects and verified certificates."
    },
    {
      question: "Do you offer phone repair services?",
      answer: "Yes! We provide professional diagnostics and repair services for smartphones and electronic gadgets at competitive prices."
    },
    {
      question: "Can beginners enroll in your courses?",
      answer: "Absolutely! Our courses cater to all skill levels from complete beginners to advanced learners. Our expert instructors will guide you through every step."
    }
  ];

  return <Layout>
      {/* SEO Meta Tags */}
      <SEOHead
        title="JE Tech Hub | Technology Training & Professional Services in Nigeria"
        description="JE Tech Hub is a leading technology and innovation hub in Nigeria. We offer hands-on training in Software Development, Data Analysis, UI/UX Design, plus professional tech services. Empowering individuals and businesses with cutting-edge technology solutions."
        keywords="tech hub Nigeria, technology training Nigeria, software development training, data analysis course, UI UX design Nigeria, tech services Nigeria, IT skills training, digital education Nigeria, innovation hub"
        canonical="https://www.joexpresstechhub.com/"
      />
      <LocalBusinessSchema />
      <OrganizationSchema />
      <FAQSchema faqs={homeFaqs} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden" aria-label="Welcome to Joe Express Tech Hub">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <img src={heroBackground} alt="Tech Education" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-primary/30" />
        </div>
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />
        
        {/* Animated Floating Elements */}
        <motion.div className="absolute top-20 right-20 w-72 h-72 bg-accent/30 rounded-full blur-3xl" animate={{
        scale: [1, 1.3, 1],
        x: [0, 30, 0],
        opacity: [0.3, 0.5, 0.3]
      }} transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }} />
        <motion.div className="absolute bottom-40 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" animate={{
        scale: [1.2, 1, 1.2],
        y: [0, -40, 0],
        opacity: [0.2, 0.4, 0.2]
      }} transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }} />
        <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" animate={{
        scale: [1, 1.1, 1],
        opacity: [0.1, 0.2, 0.1]
      }} transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut"
      }} />
        
        {/* Floating Icons */}
        <motion.div className="absolute top-1/4 right-1/3 text-accent/40" animate={{
        y: [0, -20, 0],
        rotate: [0, 10, 0]
      }} transition={{
        duration: 5,
        repeat: Infinity
      }}>
          <GraduationCap className="w-12 h-12" />
        </motion.div>
        <motion.div className="absolute bottom-1/3 right-1/4 text-white/20" animate={{
        y: [0, 15, 0],
        rotate: [0, -10, 0]
      }} transition={{
        duration: 4,
        repeat: Infinity,
        delay: 1
      }}>
          <Smartphone className="w-10 h-10" />
        </motion.div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -50
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.8
          }}>
              {/* Badge */}
              <motion.div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/15 text-white mb-8 backdrop-blur-md border border-white/25 shadow-lg" initial={{
              opacity: 0,
              scale: 0.8
            }} animate={{
              opacity: 1,
              scale: 1
            }} transition={{
              delay: 0.3
            }}>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                </span>
                <span className="text-sm font-semibold tracking-wide">🇳🇬 Nigeria's Premier Tech & Innovation Hub</span>
              </motion.div>
              
              {/* Main Headline - H1 for SEO */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-white mb-8 leading-[1.05]">
                <motion.span className="block" initial={{
                opacity: 0,
                y: 30
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: 0.4
              }}>
                  We Provide Services
                </motion.span>
                <motion.span className="block text-accent drop-shadow-lg" initial={{
                opacity: 0,
                y: 30
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: 0.5
              }}>
                  You Can Trust
                </motion.span>
              </h1>
              
              {/* Subheadline */}
              <motion.p className="text-lg md:text-xl text-white/85 mb-10 max-w-xl leading-relaxed font-medium" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.7
            }}>
                Empowering individuals and businesses with cutting-edge technology solutions through practical education and professional services. From beginners to professionals, we provide practical solutions that create real impact.
              </motion.p>
              
              {/* CTA Buttons */}
              <motion.div className="flex flex-col sm:flex-row gap-4 mb-12" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.8
            }}>
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-10 h-16 shadow-2xl shadow-accent/30 hover:shadow-accent/50 hover:-translate-y-2 transition-all duration-300 gap-3 font-bold rounded-xl">
                  <Link to="/courses">
                    <GraduationCap className="h-6 w-6" />
                    Start Learning Free
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-10 h-16 bg-white/10 border-2 border-white/40 text-white hover:bg-white/20 hover:border-white/60 hover:-translate-y-2 transition-all duration-300 gap-3 font-bold rounded-xl backdrop-blur-sm">
                  <Link to="/gadgets">
                    <Smartphone className="h-6 w-6" />
                    Shop Gadgets
                  </Link>
                </Button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div className="flex flex-wrap items-center gap-6" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.9
            }}>
                <div className="flex items-center gap-2 text-white/90">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-sm font-medium">Verified Certificates</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-sm font-medium">1,400+ Trained</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <Star className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-sm font-medium">Trusted by Learners</span>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Stats Cards with Enhanced Design */}
            <motion.div className="hidden lg:grid grid-cols-2 gap-5" initial={{
            opacity: 0,
            x: 50
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.8,
            delay: 0.3
          }}>
              {stats.map((stat, index) => <motion.div key={stat.label} initial={{
              opacity: 0,
              y: 30,
              scale: 0.9
            }} animate={{
              opacity: 1,
              y: 0,
              scale: 1
            }} transition={{
              delay: 0.5 + index * 0.15
            }} whileHover={{
              scale: 1.05,
              y: -5
            }} className="bg-white/15 backdrop-blur-xl border border-white/25 rounded-3xl p-7 hover:bg-white/20 transition-all duration-500 group shadow-xl">
                  <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center mb-4 group-hover:bg-accent/30 transition-colors duration-300">
                    <stat.icon className="w-7 h-7 text-accent" />
                  </div>
                  <p className="text-4xl font-heading font-bold text-white mb-2">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={2.5} />
                  </p>
                  <p className="text-white/75 text-sm font-medium">{stat.label}</p>
                </motion.div>)}
            </motion.div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div className="absolute bottom-32 left-1/2 -translate-x-1/2" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 1.5
      }}>
          <motion.div animate={{
          y: [0, 10, 0]
        }} transition={{
          duration: 2,
          repeat: Infinity
        }} className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <motion.div animate={{
            opacity: [1, 0, 1],
            y: [0, 8, 0]
          }} transition={{
            duration: 2,
            repeat: Infinity
          }} className="w-1.5 h-3 rounded-full bg-white/60" />
          </motion.div>
        </motion.div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 50C480 40 600 50 720 55C840 60 960 60 1080 65C1200 70 1320 80 1380 85L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Mobile Stats */}
      <section className="lg:hidden py-8 bg-background -mt-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-4">
            {stats.map(stat => <Card key={stat.label} className="border-border/50">
                <CardContent className="p-4 text-center">
                  <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-heading font-bold text-foreground">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={2} />
                  </p>
                  <p className="text-muted-foreground text-xs">{stat.label}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }}>
              Bridging Education & Technology
            </motion.span>
            <motion.h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.1
          }}>
              Technology Education That
              <span className="text-primary"> Creates Impact</span>
            </motion.h2>
            <motion.p className="text-muted-foreground text-lg" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.2
          }}>
              We believe technology education should be accessible, practical, and transformative. Our modern learning environment encourages creativity, collaboration, and problem-solving.
            </motion.p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => <motion.div key={feature.title} initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1
          }}>
                <Card className="h-full border-border/50 bg-card hover:shadow-elevated transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-heading font-bold text-lg text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 md:py-28 bg-secondary/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
            <div>
              <motion.span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4" initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }}>
                Education
              </motion.span>
              <motion.h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-3" initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: 0.1
            }}>
                Featured Courses
              </motion.h2>
              <motion.p className="text-muted-foreground text-lg" initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: 0.2
            }}>
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
            {courses?.map((course, index) => {
              const courseImages = course.course_images?.length > 0 
                ? course.course_images.map((img: CourseImage) => img.image_url)
                : course.image_url ? [course.image_url] : [];
              
              return (
                <motion.div key={course.id} initial={{
                  opacity: 0,
                  y: 30
                }} whileInView={{
                  opacity: 1,
                  y: 0
                }} viewport={{
                  once: true
                }} transition={{
                  delay: index * 0.1
                }}>
                  <Link to={`/courses/${course.id}`} className="block group h-full">
                    <Card className="overflow-hidden h-full border-border/50 hover:shadow-elevated transition-all duration-300">
                      <div className="relative">
                        <ImageCarousel
                          images={courseImages}
                          alt={course.title}
                          autoPlayInterval={3000}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-10" />
                        {course.certificate_available && <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-medium shadow-lg">
                            <Award className="h-3.5 w-3.5" />
                            Certificate
                          </div>}
                      </div>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                            {course.category}
                          </span>
                          {course.level && <span className="px-3 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground">
                              {course.level}
                            </span>}
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
                            {course.duration && <span className="text-sm text-muted-foreground ml-2">• {course.duration}</span>}
                          </div>
                          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }}>
              <span className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
                Our Impact
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
                Building Skills That
                <span className="text-accent"> Drive Innovation</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                We deliver technology education and professional services designed to meet real-world needs, helping individuals and businesses grow through innovation.
              </p>

              <div className="space-y-6">
                {benefits.map((benefit, index) => <motion.div key={benefit.title} initial={{
                opacity: 0,
                x: -20
              }} whileInView={{
                opacity: 1,
                x: 0
              }} viewport={{
                once: true
              }} transition={{
                delay: index * 0.1
              }} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-lg text-foreground mb-1">{benefit.title}</h3>
                      <p className="text-muted-foreground text-sm">{benefit.description}</p>
                    </div>
                  </motion.div>)}
              </div>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            x: 30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }} className="relative">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
                <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop" alt="Students learning" className="relative rounded-3xl shadow-2xl w-full object-cover aspect-[4/3]" />
                
                {/* Floating Card */}
                <motion.div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-2xl shadow-elevated border border-border/50" initial={{
                opacity: 0,
                y: 20
              }} whileInView={{
                opacity: 1,
                y: 0
              }} viewport={{
                once: true
              }} transition={{
                delay: 0.3
              }}>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center">
                      <Award className="w-7 h-7 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="text-2xl font-heading font-bold text-foreground">30+</p>
                      <p className="text-muted-foreground text-sm">Skilled Graduates</p>
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
              <motion.span className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4" initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }}>
                Shop
              </motion.span>
              <motion.h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-3" initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: 0.1
            }}>
                Latest Gadgets
              </motion.h2>
              <motion.p className="text-muted-foreground text-lg" initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: 0.2
            }}>
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
            {gadgets?.map((gadget, index) => <motion.div key={gadget.id} initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1
          }}>
                <Link to={`/gadgets/${gadget.id}`} className="block group h-full">
                  <Card className="overflow-hidden h-full border-border/50 hover:shadow-elevated transition-all duration-300">
                    <div className="aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/50 relative">
                      <img src={gadget.image_url || 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800'} alt={gadget.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      {gadget.swap_available && <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium shadow-lg">
                          <RefreshCw className="h-3 w-3" />
                          Swap
                        </div>}
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
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 md:py-28 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
            <div>
              <motion.span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4" initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }}>
                Services
              </motion.span>
              <motion.h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-3" initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: 0.1
            }}>
                Professional Tech Services
              </motion.h2>
              <motion.p className="text-muted-foreground text-lg" initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: 0.2
            }}>
                Expert solutions for all your tech needs
              </motion.p>
            </div>
            <Button asChild variant="outline" className="mt-6 md:mt-0 group gap-2">
              <Link to="/services">
                View All Services
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services?.map((service, index) => {
              const IconComponent = serviceIcons[service.icon || ''] || Wrench;
              const serviceImages = service.service_images?.length > 0 
                ? service.service_images.map((img: ServiceImage) => img.image_url)
                : [];
              
              return (
                <motion.div key={service.id} initial={{
                  opacity: 0,
                  y: 30
                }} whileInView={{
                  opacity: 1,
                  y: 0
                }} viewport={{
                  once: true
                }} transition={{
                  delay: index * 0.1
                }}>
                  <Link to="/services" className="block group h-full">
                    <Card className="overflow-hidden h-full border-border/50 hover:shadow-elevated transition-all duration-300">
                      {serviceImages.length > 0 && (
                        <div className="relative">
                          <ImageCarousel
                            images={serviceImages}
                            alt={service.name}
                            autoPlayInterval={3000}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none z-10" />
                          <div className="absolute bottom-4 left-4 z-20">
                            <div className="w-12 h-12 rounded-xl bg-primary/90 flex items-center justify-center shadow-lg">
                              <IconComponent className="w-6 h-6 text-primary-foreground" />
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="p-6">
                        {serviceImages.length === 0 && (
                          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                            <IconComponent className="w-7 h-7 text-primary" />
                          </div>
                        )}
                        <h3 className="font-heading font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                          {service.name}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {service.description}
                        </p>
                        <div className="flex items-center gap-2 mt-4 text-primary font-medium text-sm">
                          <MessageCircle className="h-4 w-4" />
                          Request Service
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.span className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }}>
              Testimonials
            </motion.span>
            <motion.h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.1
          }}>
              What Our Learners Say
            </motion.h2>
            <motion.p className="text-muted-foreground text-lg" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.2
          }}>
              Trusted by learners, professionals, and organizations across Nigeria
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => <motion.div key={testimonial.name} initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1
          }}>
                <Card className="h-full border-border/50 bg-card hover:shadow-elevated transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-accent text-accent" />)}
                    </div>
                    <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>
                    <div className="flex items-center gap-3">
                      
                      <div>
                        <p className="font-heading font-bold text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/90 p-10 md:p-16 lg:p-20" initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            <div className="absolute inset-0 african-pattern opacity-5" />
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-6 leading-tight">
                  Ready to Get
                  <span className="text-accent"> Started?</span>
                </h2>
                <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed">
                  Join a thriving community of learners and professionals. Let JE Tech Hub help you build skills, scale ideas, and achieve success in the digital economy.
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
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop" alt="Students learning together" className="rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>;
};
export default Index;