-- Create course_images table for multiple images per course
CREATE TABLE public.course_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create service_images table for multiple images per service
CREATE TABLE public.service_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.course_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_images ENABLE ROW LEVEL SECURITY;

-- Public read access for course images
CREATE POLICY "Anyone can view course images"
ON public.course_images
FOR SELECT
USING (true);

-- Admin management for course images
CREATE POLICY "Admins can manage course images"
ON public.course_images
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Public read access for service images
CREATE POLICY "Anyone can view service images"
ON public.service_images
FOR SELECT
USING (true);

-- Admin management for service images
CREATE POLICY "Admins can manage service images"
ON public.service_images
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for performance
CREATE INDEX idx_course_images_course_id ON public.course_images(course_id);
CREATE INDEX idx_course_images_display_order ON public.course_images(course_id, display_order);
CREATE INDEX idx_service_images_service_id ON public.service_images(service_id);
CREATE INDEX idx_service_images_display_order ON public.service_images(service_id, display_order);

-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public) VALUES ('course-images', 'course-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('service-images', 'service-images', true);

-- Storage policies for course-images bucket
CREATE POLICY "Course images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'course-images');

CREATE POLICY "Admins can upload course images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'course-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update course images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'course-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete course images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'course-images' AND has_role(auth.uid(), 'admin'::app_role));

-- Storage policies for service-images bucket
CREATE POLICY "Service images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'service-images');

CREATE POLICY "Admins can upload service images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'service-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update service images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'service-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete service images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'service-images' AND has_role(auth.uid(), 'admin'::app_role));