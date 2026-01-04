-- Create student_achievements table for tracking grades and achievements
CREATE TABLE public.student_achievements (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    enrollment_id UUID REFERENCES public.enrollments(id) ON DELETE CASCADE,
    achievement_type TEXT NOT NULL CHECK (achievement_type IN ('grade', 'certificate', 'badge', 'milestone')),
    title TEXT NOT NULL,
    description TEXT,
    grade TEXT,
    score INTEGER CHECK (score >= 0 AND score <= 100),
    awarded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.student_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage all achievements" 
ON public.student_achievements 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own achievements" 
ON public.student_achievements 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_student_achievements_updated_at
BEFORE UPDATE ON public.student_achievements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();