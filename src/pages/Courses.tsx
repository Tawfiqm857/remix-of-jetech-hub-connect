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

// Helper to check if string is valid UUID
const isValidUUID = (str: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

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
      setCourses([]);
    } else {
      setCourses(data || []);
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

    // Check if courseId is a valid UUID before making DB call
    if (!isValidUUID(courseId)) {
      toast({
        title: "Invalid course",
        description: "This course is not available for enrollment.",
        variant: "destructive",
      });
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