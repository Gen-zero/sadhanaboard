-- Create user role enum
CREATE TYPE public.app_role AS ENUM ('guru', 'shishya');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  experience_level TEXT,
  traditions TEXT[] DEFAULT '{}',
  location TEXT,
  available_for_guidance BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create mentorship_relationships table
CREATE TABLE public.mentorship_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guru_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  shishya_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'ended')),
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Add partial unique constraint for active relationships
CREATE UNIQUE INDEX unique_active_shishya 
ON public.mentorship_relationships (shishya_id) 
WHERE status = 'active';

-- Enable RLS on mentorship_relationships
ALTER TABLE public.mentorship_relationships ENABLE ROW LEVEL SECURITY;

-- Create sadhanas table (migrate from localStorage)
CREATE TABLE public.sadhanas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT false,
  category TEXT DEFAULT 'daily' CHECK (category IN ('daily', 'goal')),
  due_date DATE,
  due_time TIME,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  tags TEXT[] DEFAULT '{}',
  reflection TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on sadhanas
ALTER TABLE public.sadhanas ENABLE ROW LEVEL SECURITY;

-- Create sadhana_progress table
CREATE TABLE public.sadhana_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sadhana_id UUID REFERENCES public.sadhanas(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  progress_date DATE DEFAULT CURRENT_DATE,
  completed BOOLEAN DEFAULT false,
  notes TEXT,
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(sadhana_id, progress_date)
);

-- Enable RLS on sadhana_progress
ALTER TABLE public.sadhana_progress ENABLE ROW LEVEL SECURITY;

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mentorship_id UUID REFERENCES public.mentorship_relationships(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'guidance', 'feedback')),
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sadhanas_updated_at
  BEFORE UPDATE ON public.sadhanas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" 
  ON public.user_roles FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own roles" 
  ON public.user_roles FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for mentorship_relationships
CREATE POLICY "Users can view their mentorship relationships" 
  ON public.mentorship_relationships FOR SELECT 
  USING (auth.uid() = guru_id OR auth.uid() = shishya_id);

CREATE POLICY "Shishyas can create mentorship requests" 
  ON public.mentorship_relationships FOR INSERT 
  WITH CHECK (auth.uid() = shishya_id AND status = 'pending');

CREATE POLICY "Gurus can update mentorship relationships" 
  ON public.mentorship_relationships FOR UPDATE 
  USING (auth.uid() = guru_id);

-- RLS Policies for sadhanas
CREATE POLICY "Users can view their own sadhanas" 
  ON public.sadhanas FOR SELECT 
  USING (auth.uid() = user_id OR auth.uid() = assigned_by);

CREATE POLICY "Users can create their own sadhanas" 
  ON public.sadhanas FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'guru'));

CREATE POLICY "Users can update their own sadhanas" 
  ON public.sadhanas FOR UPDATE 
  USING (auth.uid() = user_id OR auth.uid() = assigned_by);

CREATE POLICY "Users can delete their own sadhanas" 
  ON public.sadhanas FOR DELETE 
  USING (auth.uid() = user_id OR auth.uid() = assigned_by);

-- RLS Policies for sadhana_progress
CREATE POLICY "Users can view their own progress" 
  ON public.sadhana_progress FOR SELECT 
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.sadhanas s 
    WHERE s.id = sadhana_id AND s.assigned_by = auth.uid()
  ));

CREATE POLICY "Users can manage their own progress" 
  ON public.sadhana_progress FOR ALL 
  USING (auth.uid() = user_id);

-- RLS Policies for messages
CREATE POLICY "Users can view their own messages" 
  ON public.messages FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages" 
  ON public.messages FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their received messages" 
  ON public.messages FOR UPDATE 
  USING (auth.uid() = recipient_id);

-- Create indexes for better performance
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_mentorship_guru_id ON public.mentorship_relationships(guru_id);
CREATE INDEX idx_mentorship_shishya_id ON public.mentorship_relationships(shishya_id);
CREATE INDEX idx_mentorship_status ON public.mentorship_relationships(status);
CREATE INDEX idx_sadhanas_user_id ON public.sadhanas(user_id);
CREATE INDEX idx_sadhanas_assigned_by ON public.sadhanas(assigned_by);
CREATE INDEX idx_sadhana_progress_user_id ON public.sadhana_progress(user_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON public.messages(recipient_id);