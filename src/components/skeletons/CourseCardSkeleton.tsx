import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const Shimmer = ({ className }: { className?: string }) => (
  <div className={cn("rounded-md bg-muted animate-shimmer", className)} />
);

export const CourseCardSkeleton = ({ index = 0 }: { index?: number }) => {
  const staggerClass = `skeleton-stagger-${(index % 6) + 1}`;
  
  return (
    <Card className="border-border/50 bg-card overflow-hidden flex flex-col animate-fade-up" style={{ animationDelay: `${index * 0.08}s` }}>
      {/* Image skeleton */}
      <Shimmer className={cn("aspect-video w-full", staggerClass)} />
      
      <CardContent className="p-6 flex-1 space-y-3">
        {/* Badges */}
        <div className="flex items-center gap-2">
          <Shimmer className={cn("h-5 w-24 rounded-full", staggerClass)} />
          <Shimmer className={cn("h-5 w-16 rounded-full skeleton-stagger-2")} />
        </div>
        
        {/* Title */}
        <Shimmer className={cn("h-6 w-3/4 skeleton-stagger-3")} />
        
        {/* Description lines */}
        <div className="space-y-2">
          <Shimmer className="h-4 w-full skeleton-stagger-4" />
          <Shimmer className="h-4 w-full skeleton-stagger-5" />
          <Shimmer className="h-4 w-2/3 skeleton-stagger-6" />
        </div>
        
        {/* Duration */}
        <Shimmer className="h-4 w-24 mt-4 skeleton-stagger-3" />
      </CardContent>
      
      <CardFooter className="p-6 pt-0 flex items-center justify-between">
        {/* Price */}
        <Shimmer className="h-6 w-24 skeleton-stagger-4" />
        
        {/* Buttons */}
        <div className="flex gap-2">
          <Shimmer className="h-9 w-28 rounded-md skeleton-stagger-5" />
          <Shimmer className="h-9 w-16 rounded-md skeleton-stagger-6" />
        </div>
      </CardFooter>
    </Card>
  );
};

export const CoursesGridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <CourseCardSkeleton key={index} index={index} />
      ))}
    </div>
  );
};
