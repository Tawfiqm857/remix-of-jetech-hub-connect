import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: "order" | "enrollment" | "service_request";
  message: string;
  timestamp: Date;
}

export const AdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Subscribe to real-time updates
    const ordersChannel = supabase
      .channel("admin-orders")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          const newOrder = payload.new as { id: string; customer_name: string };
          const notification: Notification = {
            id: `order-${newOrder.id}`,
            type: "order",
            message: `New order from ${newOrder.customer_name}`,
            timestamp: new Date(),
          };
          setNotifications((prev) => [notification, ...prev.slice(0, 9)]);
          toast({
            title: "New Order",
            description: notification.message,
          });
        }
      )
      .subscribe();

    const enrollmentsChannel = supabase
      .channel("admin-enrollments")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "enrollments" },
        (payload) => {
          const newEnrollment = payload.new as { id: string };
          const notification: Notification = {
            id: `enrollment-${newEnrollment.id}`,
            type: "enrollment",
            message: "New student enrollment",
            timestamp: new Date(),
          };
          setNotifications((prev) => [notification, ...prev.slice(0, 9)]);
          toast({
            title: "New Enrollment",
            description: notification.message,
          });
        }
      )
      .subscribe();

    const serviceRequestsChannel = supabase
      .channel("admin-service-requests")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "service_requests" },
        (payload) => {
          const newRequest = payload.new as { id: string; customer_name: string };
          const notification: Notification = {
            id: `service-${newRequest.id}`,
            type: "service_request",
            message: `New service request from ${newRequest.customer_name}`,
            timestamp: new Date(),
          };
          setNotifications((prev) => [notification, ...prev.slice(0, 9)]);
          toast({
            title: "New Service Request",
            description: notification.message,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(enrollmentsChannel);
      supabase.removeChannel(serviceRequestsChannel);
    };
  }, [toast]);

  const clearNotifications = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "order":
        return "🛒";
      case "enrollment":
        return "📚";
      case "service_request":
        return "🔧";
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {notifications.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
              onClick={clearNotifications}
            >
              Clear all
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground text-sm">
            No new notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex items-start gap-3 py-3 cursor-default"
            >
              <span className="text-lg">{getNotificationIcon(notification.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{notification.message}</p>
                <p className="text-xs text-muted-foreground">
                  {formatTime(notification.timestamp)}
                </p>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
