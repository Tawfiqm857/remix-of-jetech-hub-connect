import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Award,
  ShoppingBag,
  RefreshCw,
  Loader2,
  Clock,
  CheckCircle,
  XCircle,
  Wrench,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Enrollment {
  id: string;
  status: string;
  progress: number;
  enrolled_at: string;
  courses: {
    title: string;
    category: string;
  };
}

interface Certificate {
  id: string;
  certificate_number: string;
  issued_at: string;
  courses: {
    title: string;
  };
}

interface Order {
  id: string;
  status: string;
  total_price: number;
  created_at: string;
  gadgets: {
    name: string;
  };
}

interface Swap {
  id: string;
  status: string;
  device_to_swap: string;
  created_at: string;
  gadgets: {
    name: string;
  };
}

interface ServiceRequest {
  id: string;
  status: string;
  created_at: string;
  services: {
    name: string;
  };
}

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    const [enrollmentsRes, certificatesRes, ordersRes, swapsRes, serviceRequestsRes] = await Promise.all([
      supabase
        .from("enrollments")
        .select("*, courses(title, category)")
        .eq("user_id", user.id)
        .order("enrolled_at", { ascending: false }),
      supabase
        .from("certificates")
        .select("*, courses(title)")
        .eq("user_id", user.id)
        .order("issued_at", { ascending: false }),
      supabase
        .from("orders")
        .select("*, gadgets(name)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("swaps")
        .select("*, gadgets(name)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("service_requests")
        .select("*, services(name)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

    setEnrollments((enrollmentsRes.data as unknown as Enrollment[]) || []);
    setCertificates((certificatesRes.data as unknown as Certificate[]) || []);
    setOrders((ordersRes.data as unknown as Order[]) || []);
    setSwaps((swapsRes.data as unknown as Swap[]) || []);
    setServiceRequests((serviceRequestsRes.data as unknown as ServiceRequest[]) || []);
    setLoading(false);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
      enrolled: { variant: "secondary", icon: <Clock className="w-3 h-3" /> },
      in_progress: { variant: "default", icon: <BookOpen className="w-3 h-3" /> },
      completed: { variant: "default", icon: <CheckCircle className="w-3 h-3" /> },
      pending: { variant: "secondary", icon: <Clock className="w-3 h-3" /> },
      confirmed: { variant: "default", icon: <CheckCircle className="w-3 h-3" /> },
      shipped: { variant: "default", icon: <ShoppingBag className="w-3 h-3" /> },
      delivered: { variant: "default", icon: <CheckCircle className="w-3 h-3" /> },
      approved: { variant: "default", icon: <CheckCircle className="w-3 h-3" /> },
      rejected: { variant: "destructive", icon: <XCircle className="w-3 h-3" /> },
      cancelled: { variant: "destructive", icon: <XCircle className="w-3 h-3" /> },
    };

    const { variant, icon } = variants[status] || { variant: "outline", icon: null };

    return (
      <Badge variant={variant} className="capitalize gap-1">
        {icon}
        {status.replace("_", " ")}
      </Badge>
    );
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-4xl font-heading font-bold mb-2">
            Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}!
          </h1>
          <p className="text-primary-foreground/80">
            Manage your courses, certificates, and orders
          </p>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-8 md:py-12 bg-background">
        <div className="container mx-auto px-4">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-border/50">
              <CardContent className="p-4 text-center">
                <BookOpen className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-2xl font-heading font-bold text-foreground">
                  {enrollments.length}
                </p>
                <p className="text-muted-foreground text-sm">Courses Enrolled</p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4 text-center">
                <Award className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-2xl font-heading font-bold text-foreground">
                  {certificates.length}
                </p>
                <p className="text-muted-foreground text-sm">Certificates</p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4 text-center">
                <ShoppingBag className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-2xl font-heading font-bold text-foreground">
                  {orders.length}
                </p>
                <p className="text-muted-foreground text-sm">Orders</p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4 text-center">
                <RefreshCw className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-2xl font-heading font-bold text-foreground">
                  {swaps.length}
                </p>
                <p className="text-muted-foreground text-sm">Swap Applications</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="courses" className="w-full">
            <TabsList className="w-full md:w-auto mb-6">
              <TabsTrigger value="courses" className="flex-1 md:flex-none">
                Courses
              </TabsTrigger>
              <TabsTrigger value="certificates" className="flex-1 md:flex-none">
                Certificates
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex-1 md:flex-none">
                Orders
              </TabsTrigger>
              <TabsTrigger value="swaps" className="flex-1 md:flex-none">
                Swaps
              </TabsTrigger>
            </TabsList>

            {/* Courses Tab */}
            <TabsContent value="courses">
              {enrollments.length === 0 ? (
                <Card className="border-border/50">
                  <CardContent className="p-8 text-center">
                    <BookOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                      No courses yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Start learning by enrolling in a course
                    </p>
                    <Button
                      onClick={() => navigate("/courses")}
                      className="bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      Browse Courses
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {enrollments.map((enrollment) => (
                    <Card key={enrollment.id} className="border-border/50">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-heading font-semibold text-foreground">
                              {enrollment.courses?.title}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              {enrollment.courses?.category}
                            </p>
                          </div>
                          {getStatusBadge(enrollment.status)}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Enrolled: {formatDate(enrollment.enrolled_at)}
                          </span>
                          <span className="text-foreground font-medium">
                            {enrollment.progress}% complete
                          </span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2 mt-2">
                          <div
                            className="bg-accent rounded-full h-2 transition-all"
                            style={{ width: `${enrollment.progress}%` }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Certificates Tab */}
            <TabsContent value="certificates">
              {certificates.length === 0 ? (
                <Card className="border-border/50">
                  <CardContent className="p-8 text-center">
                    <Award className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                      No certificates yet
                    </h3>
                    <p className="text-muted-foreground">
                      Complete a course to earn your first certificate
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {certificates.map((cert) => (
                    <Card key={cert.id} className="border-border/50">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center">
                            <Award className="w-7 h-7 text-accent" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-heading font-semibold text-foreground">
                              {cert.courses?.title}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              Certificate #{cert.certificate_number}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              Issued: {formatDate(cert.issued_at)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              {orders.length === 0 ? (
                <Card className="border-border/50">
                  <CardContent className="p-8 text-center">
                    <ShoppingBag className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                      No orders yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Browse our gadgets and place your first order
                    </p>
                    <Button
                      onClick={() => navigate("/gadgets")}
                      className="bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      Browse Gadgets
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="border-border/50">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h3 className="font-heading font-semibold text-foreground">
                              {order.gadgets?.name}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              Ordered: {formatDate(order.created_at)}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-heading font-bold text-accent">
                              {formatPrice(order.total_price)}
                            </span>
                            {getStatusBadge(order.status)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Swaps Tab */}
            <TabsContent value="swaps">
              {swaps.length === 0 ? (
                <Card className="border-border/50">
                  <CardContent className="p-8 text-center">
                    <RefreshCw className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                      No swap applications yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Trade in your old device for an upgrade
                    </p>
                    <Button
                      onClick={() => navigate("/gadgets")}
                      className="bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      Browse Gadgets
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {swaps.map((swap) => (
                    <Card key={swap.id} className="border-border/50">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h3 className="font-heading font-semibold text-foreground">
                              Swap for: {swap.gadgets?.name}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              Trading: {swap.device_to_swap}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              Applied: {formatDate(swap.created_at)}
                            </p>
                          </div>
                          {getStatusBadge(swap.status)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;