import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const Shimmer = ({ className }: { className?: string }) => (
  <div className={cn("rounded-md bg-muted animate-shimmer", className)} />
);

export const GadgetCardSkeleton = ({ index = 0 }: { index?: number }) => {
  const staggerClass = `skeleton-stagger-${(index % 6) + 1}`;
  
  return (
    <Card className="border-border/50 bg-card overflow-hidden flex flex-col animate-fade-up" style={{ animationDelay: `${index * 0.05}s` }}>
      {/* Square image skeleton */}
      <Shimmer className={cn("aspect-square w-full", staggerClass)} />
      
      <CardContent className="p-6 flex-1 space-y-3">
        {/* Title */}
        <Shimmer className="h-6 w-3/4 skeleton-stagger-2" />
        
        {/* Description */}
        <div className="space-y-2">
          <Shimmer className="h-4 w-full skeleton-stagger-3" />
          <Shimmer className="h-4 w-2/3 skeleton-stagger-4" />
        </div>
        
        {/* Price */}
        <Shimmer className="h-8 w-28 mt-4 skeleton-stagger-5" />
      </CardContent>
      
      <CardFooter className="p-6 pt-0 flex gap-2">
        <Shimmer className="h-10 flex-1 rounded-md skeleton-stagger-5" />
        <Shimmer className="h-10 flex-1 rounded-md skeleton-stagger-6" />
      </CardFooter>
    </Card>
  );
};

export const GadgetsGridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <GadgetCardSkeleton key={index} index={index} />
      ))}
    </div>
  );
};
