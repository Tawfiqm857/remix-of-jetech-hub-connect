-- Create storage bucket for certificate passport images
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificate-images', 'certificate-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for the bucket
CREATE POLICY "Anyone can view certificate images"
ON storage.objects FOR SELECT
USING (bucket_id = 'certificate-images');

CREATE POLICY "Admins can upload certificate images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'certificate-images' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "Admins can update certificate images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'certificate-images' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete certificate images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'certificate-images' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);