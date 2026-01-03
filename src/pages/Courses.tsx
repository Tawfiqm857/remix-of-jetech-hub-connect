import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Award, Clock, Search, ArrowRight, Loader2 } from "lucide-react";
import { CoursesGridSkeleton } from "@/components/skeletons/CourseCardSkeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  price: number;
  image_url: string;
  certificate_available: boolean;
}

// Placeholder courses for demo
const placeholderCourses: Course[] = [
  {
    id: "1",
    title: "Full-Stack Web Development",
    description: "Master the art of building complete web applications from frontend to backend. Learn HTML, CSS, JavaScript, React, Node.js, and databases. This comprehensive course takes you from beginner to job-ready developer with hands-on projects that simulate real workplace scenarios.\n\nBy the end of this course, you'll have built multiple portfolio-worthy projects including an e-commerce platform, a social media app, and a business management system. Our industry-experienced instructors guide you every step of the way.",
    category: "Web Development",
    level: "Beginner",
    duration: "16 weeks",
    price: 150000,
    image_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
    certificate_available: true,
  },
  {
    id: "2",
    title: "UI/UX Design Masterclass",
    description: "Transform your creative ideas into stunning digital experiences. Learn design thinking, wireframing, prototyping with Figma, and user research methods. This course covers the entire design process from concept to final product.\n\nYou'll work on real client projects, building a strong portfolio that showcases your ability to create beautiful, user-centered designs. Perfect for aspiring designers and anyone looking to enhance their design skills.",
    category: "UI/UX Design",
    level: "Beginner",
    duration: "12 weeks",
    price: 120000,
    image_url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
    certificate_available: true,
  },
  {
    id: "3",
    title: "Data Analysis with Python & Excel",
    description: "Become a data-driven decision maker. Learn to collect, analyze, and visualize data using Python, Excel, SQL, and powerful visualization tools. This course is designed for anyone who wants to leverage data in their career.\n\nFrom cleaning messy datasets to creating compelling dashboards, you'll gain practical skills that are in high demand across industries. Real Nigerian business datasets are used throughout the course for relevant, practical experience.",
    category: "Data Analysis",
    level: "Intermediate",
    duration: "10 weeks",
    price: 100000,
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    certificate_available: true,
  },
  {
    id: "4",
    title: "Professional Graphics Design",
    description: "Create stunning visuals that capture attention and communicate effectively. Master Adobe Photoshop, Illustrator, and InDesign. Learn branding, logo design, social media graphics, and print design fundamentals.\n\nThis course equips you with the skills to work as a freelance designer or join a design agency. You'll complete projects for real businesses, building both your skills and professional network in Nigeria's creative industry.",
    category: "Graphics Design",
    level: "Beginner",
    duration: "8 weeks",
    price: 80000,
    image_url: "https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=800",
    certificate_available: true,
  },
  {
    id: "5",
    title: "Professional Video Editing",
    description: "Master the art of video storytelling. Learn Adobe Premiere Pro, After Effects, and DaVinci Resolve. From basic cuts to advanced motion graphics, this course covers everything you need to create professional-quality videos.\n\nPerfect for content creators, aspiring filmmakers, and marketing professionals. You'll edit music videos, commercials, documentaries, and social media content, building a versatile portfolio that opens doors in Nigeria's booming creative industry.",
    category: "Video Editing",
    level: "Beginner",
    duration: "10 weeks",
    price: 90000,
    image_url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800",
    certificate_available: true,
  },
  {
    id: "6",
    title: "Forex Trading Fundamentals",
    description: "Learn to trade the world's largest financial market. Understand currency pairs, technical analysis, risk management, and trading psychology. This course provides a solid foundation for anyone interested in forex trading.\n\nOur experienced traders share proven strategies and help you develop a trading plan that suits your lifestyle. You'll practice on demo accounts before risking real money, ensuring you're fully prepared for the markets.",
    category: "Forex Trading",
    level: "Beginner",
    duration: "6 weeks",
    price: 75000,
    image_url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
    certificate_available: true,
  },
];

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching courses:", error);
      // Use placeholder courses if database is empty
      setCourses(placeholderCourses);
    } else {
      setCourses(data.length > 0 ? data : placeholderCourses);
    }
    setLoading(false);
  };

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to enroll in courses.",
      });
      navigate("/auth");
      return;
    }

    setEnrollingId(courseId);

    const { error } = await supabase.from("enrollments").insert({
      user_id: user.id,
      course_id: courseId,
    });

    if (error) {
      if (error.code === "23505") {
        toast({
          title: "Already enrolled",
          description: "You are already enrolled in this course.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to enroll. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Enrolled successfully!",
        description: "You have been enrolled in this course.",
      });
    }

    setEnrollingId(null);
  };

  const categories = ["all", ...new Set(courses.map((c) => c.category))];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || course.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative hero-gradient text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 african-pattern opacity-10" />
        <div className="absolute inset-0 glow-effect" />
        
        {/* Hero Image Overlay */}
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920&h=800&fit=crop"
            alt="Programming and coding"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-heading font-bold mb-4 animate-fade-up">
              Our Courses
            </h1>
            <p className="text-lg text-primary-foreground/90 animate-fade-up stagger-1">
              Practical, hands-on training to launch your tech career. All courses include verified certificates.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Filters */}
      <section className="py-8 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12 md:py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          {loading ? (
            <CoursesGridSkeleton count={6} />
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No courses found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course, index) => (
                <Card 
                  key={course.id} 
                  className="border-border/50 bg-card hover-lift hover-glow overflow-hidden flex flex-col group animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    <img
                      src={course.image_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {course.certificate_available && (
                      <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
                        <Award className="w-3 h-3 mr-1" />
                        Certificate
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-6 flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {course.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {course.level}
                      </Badge>
                    </div>
                    <h3 className="font-heading font-semibold text-lg text-foreground mb-3">
                      {course.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-4 whitespace-pre-line">
                      {course.description}
                    </p>
                    <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0 flex items-center justify-end">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link to={`/courses/${course.id}`}>
                          View Details
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      </Button>
                      <Button
                        onClick={() => handleEnroll(course.id)}
                        disabled={enrollingId === course.id}
                        size="sm"
                        className="bg-accent hover:bg-accent/90 text-accent-foreground"
                      >
                        {enrollingId === course.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Enroll"
                        )}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Certificate CTA */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-2xl p-8 md:p-12 text-center relative overflow-hidden animate-fade-up hover-glow transition-all duration-500">
            <div className="absolute inset-0 african-pattern opacity-5" />
            <div className="absolute inset-0 glow-effect" />
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4 animate-bounce-subtle">
                <Award className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary-foreground mb-4">
                Complete Courses & Earn Verified Certificates
              </h2>
              <p className="text-primary-foreground/80 max-w-xl mx-auto">
                All our courses come with official JE Tech Hub certificates upon completion. Showcase your skills to employers and stand out in the job market.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Courses;