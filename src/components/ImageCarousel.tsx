import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  autoPlayInterval?: number;
  className?: string;
  aspectRatio?: "video" | "square";
}

const ImageCarousel = ({
  images,
  alt,
  autoPlayInterval = 3000,
  className,
  aspectRatio = "video",
}: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoaded, setIsLoaded] = useState<boolean[]>([]);

  // Filter out empty/null images and provide fallback
  const validImages = images.filter((img) => img && img.trim() !== "");
  const displayImages =
    validImages.length > 0
      ? validImages
      : ["https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop"];

  // Initialize loaded state
  useEffect(() => {
    setIsLoaded(new Array(displayImages.length).fill(false));
  }, [displayImages.length]);

  // Auto-rotate images
  useEffect(() => {
    if (displayImages.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayImages.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [displayImages.length, autoPlayInterval, isPaused]);

  // Preload next image
  useEffect(() => {
    if (displayImages.length <= 1) return;

    const nextIndex = (currentIndex + 1) % displayImages.length;
    const img = new Image();
    img.src = displayImages[nextIndex];
  }, [currentIndex, displayImages]);

  const handleImageLoad = useCallback((index: number) => {
    setIsLoaded((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted",
        aspectRatio === "video" ? "aspect-video" : "aspect-square",
        className
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Images */}
      {displayImages.map((image, index) => (
        <div
          key={`${image}-${index}`}
          className={cn(
            "absolute inset-0 transition-opacity duration-500 ease-in-out will-change-opacity",
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          {/* Skeleton placeholder */}
          {!isLoaded[index] && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          <img
            src={image}
            alt={`${alt} - Image ${index + 1}`}
            loading={index === 0 ? "eager" : "lazy"}
            onLoad={() => handleImageLoad(index)}
            className={cn(
              "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110",
              !isLoaded[index] && "opacity-0"
            )}
          />
        </div>
      ))}

      {/* Dot Indicators */}
      {displayImages.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
          {displayImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentIndex
                  ? "bg-white w-4"
                  : "bg-white/50 hover:bg-white/80"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
