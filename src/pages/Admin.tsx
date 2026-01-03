import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  ShoppingBag,
  BookOpen,
  Wrench,
  Users,
  Loader2,
  Trash2,
  RefreshCw,
  Package,
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
  in_stock: boolean;
}

interface Course {
  id: string;
  title: string;
  category: string;
  price: number;
  level: string;
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
  const [loading, setLoading] = useState(true);

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
    const [ordersRes, serviceRequestsRes, enrollmentsRes, gadgetsRes, coursesRes] =
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
          .select("id, name, price, category, in_stock")
          .order("created_at", { ascending: false }),
        supabase
          .from("courses")
          .select("id, title, category, price, level")
          .order("created_at", { ascending: false }),
      ]);

    setOrders((ordersRes.data as unknown as Order[]) || []);
    setServiceRequests((serviceRequestsRes.data as unknown as ServiceRequest[]) || []);
    setEnrollments((enrollmentsRes.data as unknown as Enrollment[]) || []);
    setGadgets((gadgetsRes.data as unknown as Gadget[]) || []);
    setCourses((coursesRes.data as unknown as Course[]) || []);
    setLoading(false);
  };

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
      <section className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-4xl font-heading font-bold mb-2">
            Admin Dashboard
          </h1>
          <p className="text-primary-foreground/80">
            Manage orders, service requests, courses, and gadgets
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-6 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="border-border/50">
              <CardContent className="p-4 text-center">
                <ShoppingBag className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="text-xl font-heading font-bold">{orders.length}</p>
                <p className="text-muted-foreground text-sm">Orders</p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4 text-center">
                <Wrench className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="text-xl font-heading font-bold">{serviceRequests.length}</p>
                <p className="text-muted-foreground text-sm">Service Requests</p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4 text-center">
                <Users className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="text-xl font-heading font-bold">{enrollments.length}</p>
                <p className="text-muted-foreground text-sm">Enrollments</p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4 text-center">
                <Package className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="text-xl font-heading font-bold">{gadgets.length}</p>
                <p className="text-muted-foreground text-sm">Gadgets</p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4 text-center">
                <BookOpen className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="text-xl font-heading font-bold">{courses.length}</p>
                <p className="text-muted-foreground text-sm">Courses</p>
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
              <TabsTrigger value="service-requests">Service Requests</TabsTrigger>
              <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
              <TabsTrigger value="gadgets">Gadgets</TabsTrigger>
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
                  <CardTitle>Course Enrollments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {enrollments.map((enrollment) => (
                          <TableRow key={enrollment.id}>
                            <TableCell className="text-sm">
                              {formatDate(enrollment.enrolled_at)}
                            </TableCell>
                            <TableCell>{enrollment.courses?.title || "N/A"}</TableCell>
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

            {/* Gadgets Tab */}
            <TabsContent value="gadgets">
              <Card>
                <CardHeader>
                  <CardTitle>Gadgets Inventory</CardTitle>
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
                              <Badge variant={gadget.in_stock ? "default" : "destructive"}>
                                {gadget.in_stock ? "In Stock" : "Out of Stock"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {gadgets.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">No gadgets yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Courses Tab */}
            <TabsContent value="courses">
              <Card>
                <CardHeader>
                  <CardTitle>Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Level</TableHead>
                          <TableHead>Price</TableHead>
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
                            <TableCell className="font-semibold">
                              {course.price ? formatPrice(course.price) : "Free"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {courses.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">No courses yet</p>
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
