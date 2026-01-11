import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { Target, Eye, Users, Award, BookOpen, Lightbulb, Heart, Rocket, CheckCircle2, ArrowRight, Briefcase, GraduationCap, Globe } from "lucide-react";
import { SEOHead, BreadcrumbSchema, BUSINESS_INFO } from "@/components/seo";
const values = [{
  icon: BookOpen,
  title: "Hands-On Learning",
  description: "We believe in learning by doing. Every course includes practical projects and real-world applications.",
  color: "bg-blue-500/10 text-blue-500"
}, {
  icon: Lightbulb,
  title: "Innovation",
  description: "We stay current with the latest industry trends and technologies to give you relevant skills.",
  color: "bg-amber-500/10 text-amber-500"
}, {
  icon: Heart,
  title: "Community",
  description: "Our supportive community of learners and mentors helps you grow and succeed together.",
  color: "bg-rose-500/10 text-rose-500"
}, {
  icon: Rocket,
  title: "Excellence",
  description: "We are committed to delivering high-quality education that meets international standards.",
  color: "bg-emerald-500/10 text-emerald-500"
}];
const milestones = [{
  value: 5000,
  suffix: "+",
  label: "Students Trained",
  icon: GraduationCap
}, {
  value: 95,
  suffix: "%",
  label: "Job Placement Rate",
  icon: Briefcase
}, {
  value: 50,
  suffix: "+",
  label: "Industry Partners",
  icon: Globe
}, {
  value: 6,
  suffix: "",
  label: "Tech Programs",
  icon: BookOpen
}];
const teamMembers = [{
  name: "Joseph Emmanuel",
  role: "Founder & CEO",
  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
  bio: "Former software engineer with 10+ years experience building tech talent."
}, {
  name: "Adaeze Okonkwo",
  role: "Head of Training",
  image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&h=300&fit=crop&crop=face",
  bio: "Passionate educator specializing in UI/UX and frontend development."
}, {
  name: "Chinedu Eze",
  role: "Technical Director",
  image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face",
  bio: "Full-stack developer and mentor with expertise in modern web technologies."
}];
const achievements = ["Best Tech Training Center - Lagos Tech Awards 2023", "Top 10 EdTech Startups in Nigeria - TechCabal", "Google Developer Community Partner", "Microsoft Certified Training Partner"];
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
const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};
const About = () => {
  return <Layout>
      {/* SEO */}
      <SEOHead
        title="About Joe Express Tech Hub | Tech Training Center in Gwagwalada, Abuja"
        description="Learn about Joe Express Tech Hub, the leading tech training center and gadget store in Gwagwalada, Abuja, Nigeria. Since 2018, we've trained 5000+ students in Software Development, Data Analysis, UI/UX Design. Visit our Gwagwalada location today!"
        keywords="about Joe Express Tech Hub, tech hub Gwagwalada, tech training center Abuja, tech education Nigeria, JE Tech Hub history, tech school Gwagwalada"
        canonical="https://jetechhub.com/about"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://jetechhub.com" },
        { name: "About", url: "https://jetechhub.com/about" }
      ]} />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden" aria-label="About Joe Express Tech Hub">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop" alt="Joe Express Tech Hub team in Gwagwalada" className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70" />
          <div className="absolute inset-0 african-pattern opacity-5" />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -30
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.6
          }}>
              <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent rounded-full text-sm font-medium mb-6">
                About Joe Express Tech Hub
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 leading-tight">
                Empowering Gwagwalada's
                <span className="text-accent"> Tech Future</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
                Since 2018, Joe Express Tech Hub in Gwagwalada, Abuja has been on a mission to transform lives through quality tech education. Join 5000+ students who've launched successful careers with us.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/courses">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2">
                    Explore Courses
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div className="hidden lg:grid grid-cols-2 gap-4" variants={staggerContainer} initial="initial" animate="animate">
              {milestones.map((milestone, index) => <motion.div key={milestone.label} variants={fadeInUp} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                  <milestone.icon className="w-8 h-8 text-accent mb-3" />
                  <p className="text-3xl font-heading font-bold text-white mb-1">
                    <AnimatedCounter value={milestone.value} suffix={milestone.suffix} duration={2} />
                  </p>
                  <p className="text-white/70 text-sm">{milestone.label}</p>
                </motion.div>)}
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
            {milestones.map(milestone => <Card key={milestone.label} className="border-border/50">
                <CardContent className="p-4 text-center">
                  <milestone.icon className="w-6 h-6 text-accent mx-auto mb-2" />
                  <p className="text-2xl font-heading font-bold text-foreground">
                    <AnimatedCounter value={milestone.value} suffix={milestone.suffix} duration={2} />
                  </p>
                  <p className="text-muted-foreground text-xs">{milestone.label}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Our Story */}
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
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
                From Small Beginnings to
                <span className="text-primary"> Big Impact</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  JE TechHub was founded in 2018 with a simple yet powerful mission: to make quality tech education accessible to every Nigerian, regardless of background or location.
                </p>
                <p>
                  What started as a small training center in Lagos has grown into one of Nigeria's most respected tech education institutions. We've trained thousands of students who now work at leading companies across Africa and globally.
                </p>
                <p>
                  Our approach is different. We don't just teach theory—we focus on hands-on, project-based learning that prepares you for real-world challenges. Every course includes practical projects, mentorship, and career support.
                </p>
              </div>

              {/* Achievements List */}
              <div className="mt-8 space-y-3">
                {achievements.map(achievement => <div key={achievement} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                    <span className="text-foreground text-sm font-medium">{achievement}</span>
                  </div>)}
              </div>
            </motion.div>

            {/* Image Collage */}
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden shadow-elevated">
                    <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=300&fit=crop" alt="Students learning" className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-elevated">
                    <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=400&fit=crop" alt="Team collaboration" className="w-full h-56 object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl overflow-hidden shadow-elevated">
                    <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop" alt="Group discussion" className="w-full h-56 object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-elevated">
                    <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop" alt="Presentation" className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground rounded-2xl p-4 shadow-elevated">
                <p className="text-3xl font-heading font-bold">6+</p>
                <p className="text-sm">Years of Excellence</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 md:py-28 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              Our Purpose
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              Mission & Vision
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5
          }}>
              <Card className="h-full border-none bg-gradient-to-br from-primary to-primary/80 text-white overflow-hidden relative group">
                <div className="absolute inset-0 african-pattern opacity-5" />
                <CardContent className="p-8 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold mb-4">
                    Our Mission
                  </h3>
                  <p className="text-white/85 leading-relaxed">
                    To equip Nigerians with practical, in-demand tech skills through hands-on training, mentorship, and community support. We bridge the digital skills gap and create pathways to meaningful careers in technology.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: 0.1
          }}>
              <Card className="h-full border-none bg-gradient-to-br from-accent to-accent/80 text-white overflow-hidden relative group">
                <div className="absolute inset-0 african-pattern opacity-5" />
                <CardContent className="p-8 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold mb-4">
                    Our Vision
                  </h3>
                  <p className="text-white/85 leading-relaxed">
                    To be Africa's leading tech education hub, producing world-class tech professionals who drive innovation and economic growth across the continent. A Nigeria where everyone has access to quality tech education.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              What Drives Us
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              These principles guide everything we do at JE TechHub
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => <motion.div key={value.title} initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: index * 0.1
          }}>
                <Card className="h-full border-border/50 bg-card hover:shadow-elevated transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-2xl ${value.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      <value.icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-heading font-bold text-lg text-foreground mb-3">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 md:py-28 bg-secondary/30">
        
      </section>

      {/* Certificates Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="relative bg-gradient-to-br from-primary via-primary to-primary/90 rounded-3xl p-8 md:p-16 overflow-hidden">
            <div className="absolute inset-0 african-pattern opacity-5" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

            <div className="relative grid lg:grid-cols-2 gap-12 items-center">
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
                <Award className="w-16 h-16 text-accent mb-6" />
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
                  Earn Industry-Recognized Certificates
                </h2>
                <p className="text-white/80 text-lg leading-relaxed mb-8">
                  Every course you complete at JE TechHub comes with an official, verified certificate. Our certificates are recognized by employers across Nigeria and internationally.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/courses">
                    <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2">
                      View Courses
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
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
            }} className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="bg-white/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                    <Award className="w-12 h-12 text-accent" />
                  </div>
                  <p className="text-white font-heading font-bold text-xl mb-2">
                    JE TechHub Certificate
                  </p>
                  <p className="text-white/70 text-sm mb-4">
                    of Professional Achievement
                  </p>
                  <div className="flex justify-center gap-2 text-xs text-white/60">
                    <span className="px-2 py-1 bg-white/10 rounded">Verified</span>
                    <span className="px-2 py-1 bg-white/10 rounded">Industry-Ready</span>
                    <span className="px-2 py-1 bg-white/10 rounded">Professional</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }} className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
              Ready to Start Your
              <span className="text-primary"> Tech Journey?</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of successful graduates who've transformed their careers with JE TechHub. Your future in tech starts here.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/courses">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2">
                  Explore Courses
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="font-semibold">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>;
};
export default About;