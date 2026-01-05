import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ShoppingBag,
  BookOpen,
  Wrench,
  Users,
  Loader2,
  Trash2,
  RefreshCw,
  Package,
  Plus,
  Edit,
  Award,
  GraduationCap,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  status: string;
  total_price: number;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  gadgets: { name: string } | null;
}

interface ServiceRequest {
  id: string;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  created_at: string;
  services: { name: string } | null;
}

interface Enrollment {
  id: string;
  status: string;
  progress: number;
  enrolled_at: string;
  courses: { title: string } | null;
  user_id: string;
}

interface Gadget {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string | null;
  image_url: string | null;
  in_stock: boolean;
  swap_available: boolean;
}

interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  price: number | null;
  level: string | null;
  duration: string | null;
  image_url: string | null;
  certificate_available: boolean | null;
}

interface StudentAchievement {
  id: string;
  user_id: string;
  enrollment_id: string | null;
  achievement_type: string;
  title: string;
  description: string | null;
  grade: string | null;
  score: number | null;
  awarded_at: string;
}

const Admin = () => {
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [gadgets, setGadgets] = useState<Gadget[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [achievements, setAchievements] = useState<StudentAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  // Product Form State
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingGadget, setEditingGadget] = useState<Gadget | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image_url: "",
    in_stock: true,
    swap_available: false,
  });

  // Achievement Form State
  const [achievementDialogOpen, setAchievementDialogOpen] = useState(false);
  const [achievementForm, setAchievementForm] = useState({
    user_id: "",
    enrollment_id: "",
    achievement_type: "grade",
    title: "",
    description: "",
    grade: "",
    score: "",
  });

  // Course Form State
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    level: "Beginner",
    duration: "",
    image_url: "",
    certificate_available: true,
  });

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchAllData();
    }
  }, [isAdmin]);

  const fetchAllData = async () => {
    setLoading(true);
    const [ordersRes, serviceRequestsRes, enrollmentsRes, gadgetsRes, coursesRes, achievementsRes] =
      await Promise.all([
        supabase
          .from("orders")
          .select("*, gadgets(name)")
          .order("created_at", { ascending: false }),
        supabase
          .from("service_requests")
          .select("*, services(name)")
          .order("created_at", { ascending: false }),
        supabase
          .from("enrollments")
          .select("*, courses(title)")
          .order("enrolled_at", { ascending: false }),
        supabase
          .from("gadgets")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("courses")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("student_achievements")
          .select("*")
          .order("awarded_at", { ascending: false }),
      ]);

    setOrders((ordersRes.data as unknown as Order[]) || []);
    setServiceRequests((serviceRequestsRes.data as unknown as ServiceRequest[]) || []);
    setEnrollments((enrollmentsRes.data as unknown as Enrollment[]) || []);
    setGadgets((gadgetsRes.data as unknown as Gadget[]) || []);
    setCourses((coursesRes.data as unknown as Course[]) || []);
    setAchievements((achievementsRes.data as unknown as StudentAchievement[]) || []);
    setLoading(false);
  };

  // Product Management Functions
  const openAddProduct = () => {
    setEditingGadget(null);
    setProductForm({
      name: "",
      price: "",
      category: "",
      description: "",
      image_url: "",
      in_stock: true,
      swap_available: false,
    });
    setProductDialogOpen(true);
  };

  const openEditProduct = (gadget: Gadget) => {
    setEditingGadget(gadget);
    setProductForm({
      name: gadget.name,
      price: gadget.price.toString(),
      category: gadget.category,
      description: gadget.description || "",
      image_url: gadget.image_url || "",
      in_stock: gadget.in_stock,
      swap_available: gadget.swap_available,
    });
    setProductDialogOpen(true);
  };

  const handleSaveProduct = async () => {
    const productData = {
      name: productForm.name,
      price: parseFloat(productForm.price),
      category: productForm.category,
      description: productForm.description || null,
      image_url: productForm.image_url || null,
      in_stock: productForm.in_stock,
      swap_available: productForm.swap_available,
    };

    if (editingGadget) {
      const { error } = await supabase
        .from("gadgets")
        .update(productData)
        .eq("id", editingGadget.id);

      if (error) {
        toast({ title: "Error", description: "Failed to update product", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Product updated successfully" });
        fetchAllData();
      }
    } else {
      const { error } = await supabase.from("gadgets").insert([productData]);

      if (error) {
        toast({ title: "Error", description: "Failed to add product", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Product added successfully" });
        fetchAllData();
      }
    }
    setProductDialogOpen(false);
  };

  const toggleGadgetStock = async (gadgetId: string, inStock: boolean) => {
    const { error } = await supabase
      .from("gadgets")
      .update({ in_stock: inStock })
      .eq("id", gadgetId);

    if (error) {
      toast({ title: "Error", description: "Failed to update stock status", variant: "destructive" });
    } else {
      setGadgets((prev) =>
        prev.map((g) => (g.id === gadgetId ? { ...g, in_stock: inStock } : g))
      );
      toast({ title: "Updated", description: `Product marked as ${inStock ? "In Stock" : "Sold"}` });
    }
  };

  const toggleSwapAvailable = async (gadgetId: string, swapAvailable: boolean) => {
    const { error } = await supabase
      .from("gadgets")
      .update({ swap_available: swapAvailable })
      .eq("id", gadgetId);

    if (error) {
      toast({ title: "Error", description: "Failed to update swap status", variant: "destructive" });
    } else {
      setGadgets((prev) =>
        prev.map((g) => (g.id === gadgetId ? { ...g, swap_available: swapAvailable } : g))
      );
      toast({ title: "Updated", description: `Swap ${swapAvailable ? "enabled" : "disabled"}` });
    }
  };

  const deleteGadget = async (gadgetId: string) => {
    const { error } = await supabase.from("gadgets").delete().eq("id", gadgetId);

    if (error) {
      toast({ title: "Error", description: "Failed to delete product", variant: "destructive" });
    } else {
      setGadgets((prev) => prev.filter((g) => g.id !== gadgetId));
      toast({ title: "Deleted", description: "Product deleted successfully" });
    }
  };

  // Achievement/Grade Management Functions
  const handleSaveAchievement = async () => {
    const achievementData = {
      user_id: achievementForm.user_id,
      enrollment_id: achievementForm.enrollment_id || null,
      achievement_type: achievementForm.achievement_type,
      title: achievementForm.title,
      description: achievementForm.description || null,
      grade: achievementForm.grade || null,
      score: achievementForm.score ? parseInt(achievementForm.score) : null,
    };

    const { error } = await supabase.from("student_achievements").insert([achievementData]);

    if (error) {
      toast({ title: "Error", description: "Failed to add achievement. Make sure User ID is valid.", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Achievement added successfully" });
      setAchievementDialogOpen(false);
      setAchievementForm({
        user_id: "",
        enrollment_id: "",
        achievement_type: "grade",
        title: "",
        description: "",
        grade: "",
        score: "",
      });
      fetchAllData();
    }
  };

  const deleteAchievement = async (achievementId: string) => {
    const { error } = await supabase.from("student_achievements").delete().eq("id", achievementId);

    if (error) {
      toast({ title: "Error", description: "Failed to delete achievement", variant: "destructive" });
    } else {
      setAchievements((prev) => prev.filter((a) => a.id !== achievementId));
      toast({ title: "Deleted", description: "Achievement deleted successfully" });
    }
  };

  // Course Management Functions
  const openAddCourse = () => {
    setEditingCourse(null);
    setCourseForm({
      title: "",
      category: "",
      description: "",
      price: "",
      level: "Beginner",
      duration: "",
      image_url: "",
      certificate_available: true,
    });
    setCourseDialogOpen(true);
  };

  const openEditCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      category: course.category,
      description: course.description,
      price: course.price?.toString() || "",
      level: course.level || "Beginner",
      duration: course.duration || "",
      image_url: course.image_url || "",
      certificate_available: course.certificate_available ?? true,
    });
    setCourseDialogOpen(true);
  };

  const handleSaveCourse = async () => {
    const courseData = {
      title: courseForm.title,
      category: courseForm.category,
      description: courseForm.description,
      price: courseForm.price ? parseFloat(courseForm.price) : 0,
      level: courseForm.level,
      duration: courseForm.duration || null,
      image_url: courseForm.image_url || null,
      certificate_available: courseForm.certificate_available,
    };

    if (editingCourse) {
      const { error } = await supabase
        .from("courses")
        .update(courseData)
        .eq("id", editingCourse.id);

      if (error) {
        toast({ title: "Error", description: "Failed to update course", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Course updated successfully" });
        fetchAllData();
      }
    } else {
      const { error } = await supabase.from("courses").insert([courseData]);

      if (error) {
        toast({ title: "Error", description: "Failed to add course", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Course added successfully" });
        fetchAllData();
      }
    }
    setCourseDialogOpen(false);
  };

  const deleteCourse = async (courseId: string) => {
    const { error } = await supabase.from("courses").delete().eq("id", courseId);

    if (error) {
      toast({ title: "Error", description: "Failed to delete course. It may have enrollments.", variant: "destructive" });
    } else {
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
      toast({ title: "Deleted", description: "Course deleted successfully" });
    }
  };

  // Order & Service Request Functions
  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      toast({ title: "Error", description: "Failed to update order status", variant: "destructive" });
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
      toast({ title: "Updated", description: "Order status updated successfully" });
    }
  };

  const updateServiceRequestStatus = async (requestId: string, status: string) => {
    const { error } = await supabase
      .from("service_requests")
      .update({ status })
      .eq("id", requestId);

    if (error) {
      toast({ title: "Error", description: "Failed to update request status", variant: "destructive" });
    } else {
      setServiceRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status } : r))
      );
      toast({ title: "Updated", description: "Request status updated successfully" });
    }
  };

  const deleteOrder = async (orderId: string) => {
    const { error } = await supabase.from("orders").delete().eq("id", orderId);

    if (error) {
      toast({ title: "Error", description: "Failed to delete order", variant: "destructive" });
    } else {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      toast({ title: "Deleted", description: "Order deleted successfully" });
    }
  };

  const deleteServiceRequest = async (requestId: string) => {
    const { error } = await supabase.from("service_requests").delete().eq("id", requestId);

    if (error) {
      toast({ title: "Error", description: "Failed to delete request", variant: "destructive" });
    } else {
      setServiceRequests((prev) => prev.filter((r) => r.id !== requestId));
      toast({ title: "Deleted", description: "Service request deleted successfully" });
    }
  };

  // Enrollment Management
  const updateEnrollmentProgress = async (enrollmentId: string, progress: number) => {
    const status = progress >= 100 ? "completed" : "enrolled";
    const { error } = await supabase
      .from("enrollments")
      .update({ progress, status })
      .eq("id", enrollmentId);

    if (error) {
      toast({ title: "Error", description: "Failed to update progress", variant: "destructive" });
    } else {
      setEnrollments((prev) =>
        prev.map((e) => (e.id === enrollmentId ? { ...e, progress, status } : e))
      );
      toast({ title: "Updated", description: "Student progress updated" });
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "completed":
      case "resolved":
      case "delivered":
        return "default";
      case "cancelled":
      case "rejected":
        return "destructive";
      case "pending":
      case "requested_whatsapp":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (adminLoading || loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Layout>
      {/* Header */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground py-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-heading font-bold mb-2">
                Admin Dashboard
              </h1>
              <p className="text-primary-foreground/80">
                Manage orders, products, students, and more
              </p>
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={fetchAllData}
              className="w-fit"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh All Data
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-6 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="border-border/50 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold">{orders.length}</p>
                    <p className="text-muted-foreground text-xs">Orders</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold">{serviceRequests.length}</p>
                    <p className="text-muted-foreground text-xs">Requests</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold">{enrollments.length}</p>
                    <p className="text-muted-foreground text-xs">Students</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold">{gadgets.length}</p>
                    <p className="text-muted-foreground text-xs">Products</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-rose-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold">{courses.length}</p>
                    <p className="text-muted-foreground text-xs">Courses</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold">{achievements.length}</p>
                    <p className="text-muted-foreground text-xs">Awards</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="w-full md:w-auto mb-6 flex-wrap h-auto gap-1">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="service-requests">Services</TabsTrigger>
              <TabsTrigger value="enrollments">Students</TabsTrigger>
              <TabsTrigger value="gadgets">Products</TabsTrigger>
              <TabsTrigger value="achievements">Grades</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>WhatsApp Orders</CardTitle>
                  <Button variant="outline" size="sm" onClick={fetchAllData}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Gadget</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="text-sm">
                              {formatDate(order.created_at)}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{order.customer_name}</p>
                                <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                              </div>
                            </TableCell>
                            <TableCell>{order.gadgets?.name || "N/A"}</TableCell>
                            <TableCell className="font-semibold">
                              {formatPrice(order.total_price)}
                            </TableCell>
                            <TableCell>
                              <Select
                                value={order.status}
                                onValueChange={(value) => updateOrderStatus(order.id, value)}
                              >
                                <SelectTrigger className="w-40">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="requested_whatsapp">Requested</SelectItem>
                                  <SelectItem value="contacted">Contacted</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Order?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteOrder(order.id)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {orders.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">No orders yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Service Requests Tab */}
            <TabsContent value="service-requests">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Service Requests</CardTitle>
                  <Button variant="outline" size="sm" onClick={fetchAllData}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {serviceRequests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell className="text-sm">
                              {formatDate(request.created_at)}
                            </TableCell>
                            <TableCell>
                              <p className="font-medium">{request.customer_name}</p>
                            </TableCell>
                            <TableCell>{request.services?.name || "N/A"}</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <p>{request.customer_email}</p>
                                <p className="text-muted-foreground">{request.customer_phone}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={request.status}
                                onValueChange={(value) =>
                                  updateServiceRequestStatus(request.id, value)
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="contacted">Contacted</SelectItem>
                                  <SelectItem value="resolved">Resolved</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Request?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteServiceRequest(request.id)}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {serviceRequests.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        No service requests yet
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enrollments Tab */}
            <TabsContent value="enrollments">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Student Enrollments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Student ID</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {enrollments.map((enrollment) => (
                          <TableRow key={enrollment.id}>
                            <TableCell className="text-sm">
                              {formatDate(enrollment.enrolled_at)}
                            </TableCell>
                            <TableCell>{enrollment.courses?.title || "N/A"}</TableCell>
                            <TableCell className="font-mono text-xs">
                              {enrollment.user_id.slice(0, 8)}...
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-24 bg-secondary rounded-full h-2">
                                  <div
                                    className="bg-accent rounded-full h-2"
                                    style={{ width: `${enrollment.progress}%` }}
                                  />
                                </div>
                                <span className="text-sm">{enrollment.progress}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(enrollment.status)}>
                                {enrollment.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Select
                                  value={enrollment.progress.toString()}
                                  onValueChange={(value) =>
                                    updateEnrollmentProgress(enrollment.id, parseInt(value))
                                  }
                                >
                                  <SelectTrigger className="w-24">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {[0, 25, 50, 75, 100].map((p) => (
                                      <SelectItem key={p} value={p.toString()}>
                                        {p}%
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {enrollments.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        No enrollments yet
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Gadgets/Products Tab */}
            <TabsContent value="gadgets">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Products Management
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={fetchAllData}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                    <Button size="sm" onClick={openAddProduct}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                    <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>
                            {editingGadget ? "Edit Product" : "Add New Product"}
                          </DialogTitle>
                          <DialogDescription>
                            {editingGadget
                              ? "Update product details below"
                              : "Fill in the details for the new product"}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="name">Product Name</Label>
                            <Input
                              id="name"
                              value={productForm.name}
                              onChange={(e) =>
                                setProductForm({ ...productForm, name: e.target.value })
                              }
                              placeholder="iPhone 15 Pro Max"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="price">Price (₦)</Label>
                              <Input
                                id="price"
                                type="number"
                                value={productForm.price}
                                onChange={(e) =>
                                  setProductForm({ ...productForm, price: e.target.value })
                                }
                                placeholder="850000"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="category">Category</Label>
                              <Select
                                value={productForm.category}
                                onValueChange={(value) =>
                                  setProductForm({ ...productForm, category: value })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Phones">Phones</SelectItem>
                                  <SelectItem value="Laptops">Laptops</SelectItem>
                                  <SelectItem value="Accessories">Accessories</SelectItem>
                                  <SelectItem value="Tablets">Tablets</SelectItem>
                                  <SelectItem value="Audio">Audio</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              value={productForm.description}
                              onChange={(e) =>
                                setProductForm({ ...productForm, description: e.target.value })
                              }
                              placeholder="Product description..."
                              rows={3}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="image_url">Image URL</Label>
                            <Input
                              id="image_url"
                              value={productForm.image_url}
                              onChange={(e) =>
                                setProductForm({ ...productForm, image_url: e.target.value })
                              }
                              placeholder="https://..."
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="in_stock"
                                checked={productForm.in_stock}
                                onCheckedChange={(checked) =>
                                  setProductForm({ ...productForm, in_stock: checked })
                                }
                              />
                              <Label htmlFor="in_stock">In Stock</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="swap_available"
                                checked={productForm.swap_available}
                                onCheckedChange={(checked) =>
                                  setProductForm({ ...productForm, swap_available: checked })
                                }
                              />
                              <Label htmlFor="swap_available">Swap Available</Label>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setProductDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSaveProduct}>
                            {editingGadget ? "Update" : "Add"} Product
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Swap</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {gadgets.map((gadget) => (
                          <TableRow key={gadget.id}>
                            <TableCell className="font-medium">{gadget.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{gadget.category}</Badge>
                            </TableCell>
                            <TableCell className="font-semibold">
                              {formatPrice(gadget.price)}
                            </TableCell>
                            <TableCell>
                              <Switch
                                checked={gadget.in_stock}
                                onCheckedChange={(checked) =>
                                  toggleGadgetStock(gadget.id, checked)
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Switch
                                checked={gadget.swap_available}
                                onCheckedChange={(checked) =>
                                  toggleSwapAvailable(gadget.id, checked)
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEditProduct(gadget)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => deleteGadget(gadget.id)}
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {gadgets.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">No products yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Achievements/Grades Tab */}
            <TabsContent value="achievements">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Student Grades & Achievements
                  </CardTitle>
                  <Dialog open={achievementDialogOpen} onOpenChange={setAchievementDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Achievement
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add Student Achievement</DialogTitle>
                        <DialogDescription>
                          Award a grade, certificate, or achievement to a student
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="user_id">Student User ID</Label>
                          <Input
                            id="user_id"
                            value={achievementForm.user_id}
                            onChange={(e) =>
                              setAchievementForm({ ...achievementForm, user_id: e.target.value })
                            }
                            placeholder="Enter student's user ID"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="achievement_type">Type</Label>
                          <Select
                            value={achievementForm.achievement_type}
                            onValueChange={(value) =>
                              setAchievementForm({ ...achievementForm, achievement_type: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="grade">Grade</SelectItem>
                              <SelectItem value="certificate">Certificate</SelectItem>
                              <SelectItem value="badge">Badge</SelectItem>
                              <SelectItem value="milestone">Milestone</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={achievementForm.title}
                            onChange={(e) =>
                              setAchievementForm({ ...achievementForm, title: e.target.value })
                            }
                            placeholder="e.g., Web Development Final Grade"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="grade">Grade</Label>
                            <Select
                              value={achievementForm.grade}
                              onValueChange={(value) =>
                                setAchievementForm({ ...achievementForm, grade: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="A">A (Excellent)</SelectItem>
                                <SelectItem value="B">B (Good)</SelectItem>
                                <SelectItem value="C">C (Average)</SelectItem>
                                <SelectItem value="D">D (Below Average)</SelectItem>
                                <SelectItem value="F">F (Fail)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="score">Score (0-100)</Label>
                            <Input
                              id="score"
                              type="number"
                              min="0"
                              max="100"
                              value={achievementForm.score}
                              onChange={(e) =>
                                setAchievementForm({ ...achievementForm, score: e.target.value })
                              }
                              placeholder="85"
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={achievementForm.description}
                            onChange={(e) =>
                              setAchievementForm({ ...achievementForm, description: e.target.value })
                            }
                            placeholder="Additional notes..."
                            rows={2}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setAchievementDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleSaveAchievement}>Add Achievement</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Student ID</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Grade</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {achievements.map((achievement) => (
                          <TableRow key={achievement.id}>
                            <TableCell className="text-sm">
                              {formatDate(achievement.awarded_at)}
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {achievement.user_id.slice(0, 8)}...
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {achievement.achievement_type}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">{achievement.title}</TableCell>
                            <TableCell>
                              {achievement.grade && (
                                <Badge
                                  variant={
                                    achievement.grade === "A"
                                      ? "default"
                                      : achievement.grade === "F"
                                      ? "destructive"
                                      : "secondary"
                                  }
                                >
                                  {achievement.grade}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {achievement.score !== null ? `${achievement.score}%` : "-"}
                            </TableCell>
                            <TableCell>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Achievement?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteAchievement(achievement.id)}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {achievements.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        No achievements yet. Add grades and achievements for students.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Courses Tab */}
            <TabsContent value="courses">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Course Management
                  </CardTitle>
                  <Dialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" onClick={openAddCourse}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Course
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {editingCourse ? "Edit Course" : "Add New Course"}
                        </DialogTitle>
                        <DialogDescription>
                          {editingCourse ? "Update course details" : "Create a new course for students"}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="course_title">Course Title</Label>
                          <Input
                            id="course_title"
                            value={courseForm.title}
                            onChange={(e) =>
                              setCourseForm({ ...courseForm, title: e.target.value })
                            }
                            placeholder="e.g., Web Development Fundamentals"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="course_category">Category</Label>
                            <Select
                              value={courseForm.category}
                              onValueChange={(value) =>
                                setCourseForm({ ...courseForm, category: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Web Development">Web Development</SelectItem>
                                <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                                <SelectItem value="Data Science">Data Science</SelectItem>
                                <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                                <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                                <SelectItem value="Cloud Computing">Cloud Computing</SelectItem>
                                <SelectItem value="AI/ML">AI/ML</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="course_level">Level</Label>
                            <Select
                              value={courseForm.level}
                              onValueChange={(value) =>
                                setCourseForm({ ...courseForm, level: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Beginner">Beginner</SelectItem>
                                <SelectItem value="Intermediate">Intermediate</SelectItem>
                                <SelectItem value="Advanced">Advanced</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="course_description">Description</Label>
                          <Textarea
                            id="course_description"
                            value={courseForm.description}
                            onChange={(e) =>
                              setCourseForm({ ...courseForm, description: e.target.value })
                            }
                            placeholder="Describe what students will learn..."
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="course_price">Price (₦)</Label>
                            <Input
                              id="course_price"
                              type="number"
                              min="0"
                              value={courseForm.price}
                              onChange={(e) =>
                                setCourseForm({ ...courseForm, price: e.target.value })
                              }
                              placeholder="0 for free"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="course_duration">Duration</Label>
                            <Input
                              id="course_duration"
                              value={courseForm.duration}
                              onChange={(e) =>
                                setCourseForm({ ...courseForm, duration: e.target.value })
                              }
                              placeholder="e.g., 8 weeks"
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="course_image">Image URL</Label>
                          <Input
                            id="course_image"
                            value={courseForm.image_url}
                            onChange={(e) =>
                              setCourseForm({ ...courseForm, image_url: e.target.value })
                            }
                            placeholder="https://..."
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="certificate_available">Certificate Available</Label>
                          <Switch
                            id="certificate_available"
                            checked={courseForm.certificate_available}
                            onCheckedChange={(checked) =>
                              setCourseForm({ ...courseForm, certificate_available: checked })
                            }
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setCourseDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleSaveCourse}>
                          {editingCourse ? "Update Course" : "Add Course"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Level</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Certificate</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {courses.map((course) => (
                          <TableRow key={course.id}>
                            <TableCell className="font-medium">{course.title}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{course.category}</Badge>
                            </TableCell>
                            <TableCell>{course.level}</TableCell>
                            <TableCell>{course.duration || "-"}</TableCell>
                            <TableCell className="font-semibold">
                              {course.price ? formatPrice(course.price) : "Free"}
                            </TableCell>
                            <TableCell>
                              <Badge variant={course.certificate_available ? "default" : "secondary"}>
                                {course.certificate_available ? "Yes" : "No"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEditCourse(course)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Course?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete the course. This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => deleteCourse(course.id)}
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {courses.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        No courses yet. Add your first course!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Admin;
