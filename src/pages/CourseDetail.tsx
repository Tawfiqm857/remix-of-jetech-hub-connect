import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Award, Clock, Users, BookOpen, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

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

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // Check if ID is a valid UUID before fetching
      if (!isValidUUID(id)) {
        toast({
          title: "Course not found",
          description: "The requested course does not exist.",
          variant: "destructive",
        });
        navigate("/courses");
        return;
      }
      fetchCourse();
      if (user) {
        checkEnrollment();
      }
    }
  }, [id, user]);

  const fetchCourse = async () => {
    if (!id || !isValidUUID(id)) {
      setLoading(false);
      return;
    }
    
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      console.error("Error fetching course:", error);
      navigate("/courses");
      return;
    }
    
    setCourse(data);
    setLoading(false);
  };

  const checkEnrollment = async () => {
    if (!user || !id || !isValidUUID(id)) return;
    
    const { data } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", id)
      .maybeSingle();
    
    setIsEnrolled(!!data);
  };

  const handleEnroll = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to enroll in this course.",
      });
      navigate("/auth");
      return;
    }

    if (!course) return;

    setEnrolling(true);

    const { error } = await supabase.from("enrollments").insert({
      user_id: user.id,
      course_id: course.id,
    });

    if (error) {
      if (error.code === "23505") {
        toast({
          title: "Already enrolled",
          description: "You are already enrolled in this course.",
        });
        setIsEnrolled(true);
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
        description: "You have been enrolled in this course. Check your dashboard for details.",
      });
      setIsEnrolled(true);
    }

    setEnrolling(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Course not found</h1>
          <Button asChild>
            <Link to="/courses">Back to Courses</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const courseHighlights = [
    "Hands-on practical projects",
    "Industry-experienced instructors",
    "Lifetime access to materials",
    "Community support",
    "Job placement assistance",
    "Real-world case studies",
  ];

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link to="/courses">
              <ArrowLeft className="h-4 w-4" />
              Back to Courses
            </Link>
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Course Image */}
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl">
              <img
                src={course.image_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              {course.certificate_available && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-accent text-accent-foreground text-sm px-3 py-1">
                    <Award className="w-4 h-4 mr-1" />
                    Certificate Included
                  </Badge>
                </div>
              )}
            </div>

            {/* Course Info */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="text-sm">
                  {course.category}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {course.level}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                {course.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>500+ enrolled</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span>12 modules</span>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Pricing Card */}
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-end justify-between mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Course Fee</p>
                      <p className="text-4xl font-display font-bold text-primary">
                        {course.price === 0 ? "Free" : formatPrice(course.price)}
                      </p>
                    </div>
                    {course.certificate_available && (
                      <div className="text-right">
                        <Award className="h-8 w-8 text-accent mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground">Verified Certificate</p>
                      </div>
                    )}
                  </div>

                  {isEnrolled ? (
                    <div className="space-y-3">
                      <Button className="w-full" size="lg" asChild>
                        <Link to="/dashboard">Go to Dashboard</Link>
                      </Button>
                      <p className="text-sm text-center text-muted-foreground">
                        You're already enrolled in this course
                      </p>
                    </div>
                  ) : (
                    <Button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                      size="lg"
                    >
                      {enrolling ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        "Enroll Now"
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Course Details */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  About This Course
                </h2>
                <div className="prose prose-muted max-w-none">
                  <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-6">
                  What You'll Learn
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {courseHighlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <h3 className="font-display font-semibold text-lg text-foreground mb-4">
                    This course includes
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-muted-foreground">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <span>{course.duration} of content</span>
                    </li>
                    <li className="flex items-center gap-3 text-muted-foreground">
                      <Users className="h-5 w-5 text-primary" />
                      <span>Community access</span>
                    </li>
                    <li className="flex items-center gap-3 text-muted-foreground">
                      <Clock className="h-5 w-5 text-primary" />
                      <span>Lifetime access</span>
                    </li>
                    {course.certificate_available && (
                      <li className="flex items-center gap-3 text-muted-foreground">
                        <Award className="h-5 w-5 text-accent" />
                        <span>Certificate of completion</span>
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-primary text-primary-foreground border-0">
                <CardContent className="p-6 text-center">
                  <h3 className="font-display font-semibold text-lg mb-2">
                    Need Help Deciding?
                  </h3>
                  <p className="text-primary-foreground/80 text-sm mb-4">
                    Our team is here to help you choose the right course
                  </p>
                  <Button variant="secondary" size="sm" asChild>
                    <Link to="/contact">Contact Us</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CourseDetail;
