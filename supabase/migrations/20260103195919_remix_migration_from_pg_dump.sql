CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
BEGIN;

--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'admin',
    'moderator',
    'user'
);


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


--
-- Name: validate_contact_submission(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.validate_contact_submission() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $_$
BEGIN
  -- Validate name length (max 100 characters)
  IF length(NEW.name) > 100 THEN
    RAISE EXCEPTION 'Name must be 100 characters or less';
  END IF;
  
  IF length(NEW.name) < 2 THEN
    RAISE EXCEPTION 'Name must be at least 2 characters';
  END IF;
  
  -- Validate email length (max 255 characters)
  IF length(NEW.email) > 255 THEN
    RAISE EXCEPTION 'Email must be 255 characters or less';
  END IF;
  
  -- Validate email format using regex
  IF NEW.email !~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Validate message length (max 5000 characters)
  IF length(NEW.message) > 5000 THEN
    RAISE EXCEPTION 'Message must be 5000 characters or less';
  END IF;
  
  IF length(NEW.message) < 10 THEN
    RAISE EXCEPTION 'Message must be at least 10 characters';
  END IF;
  
  -- Trim whitespace from inputs
  NEW.name := trim(NEW.name);
  NEW.email := trim(lower(NEW.email));
  NEW.message := trim(NEW.message);
  
  RETURN NEW;
END;
$_$;


--
-- Name: validate_order_price(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.validate_order_price() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  actual_price DECIMAL;
BEGIN
  -- Fetch the actual price from gadgets table
  SELECT price INTO actual_price FROM gadgets WHERE id = NEW.gadget_id;
  
  -- If gadget not found, reject the insert
  IF actual_price IS NULL THEN
    RAISE EXCEPTION 'Invalid gadget_id: gadget not found';
  END IF;
  
  -- Set the correct price based on server-side lookup
  NEW.total_price := actual_price * COALESCE(NEW.quantity, 1);
  
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    gadget_id uuid NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: certificates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.certificates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    course_id uuid NOT NULL,
    certificate_number text NOT NULL,
    issued_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: contacts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contacts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    message text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: courses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.courses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    category text NOT NULL,
    level text DEFAULT 'Beginner'::text,
    duration text,
    price numeric(10,2) DEFAULT 0,
    image_url text,
    certificate_available boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: enrollments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.enrollments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    course_id uuid NOT NULL,
    status text DEFAULT 'enrolled'::text,
    progress integer DEFAULT 0,
    enrolled_at timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone,
    CONSTRAINT enrollments_status_check CHECK ((status = ANY (ARRAY['enrolled'::text, 'in_progress'::text, 'completed'::text])))
);


--
-- Name: gadgets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gadgets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    category text NOT NULL,
    price numeric(10,2) NOT NULL,
    image_url text,
    in_stock boolean DEFAULT true,
    swap_available boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT gadgets_category_check CHECK ((category = ANY (ARRAY['Phone'::text, 'PC'::text, 'Other'::text])))
);


--
-- Name: newsletter_subscribers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.newsletter_subscribers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    subscribed_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    gadget_id uuid,
    gadget_name text NOT NULL,
    gadget_price numeric NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    gadget_id uuid NOT NULL,
    customer_name text NOT NULL,
    customer_email text NOT NULL,
    customer_phone text NOT NULL,
    delivery_address text NOT NULL,
    quantity integer DEFAULT 1,
    total_price numeric(10,2) NOT NULL,
    status text DEFAULT 'pending'::text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT orders_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'shipped'::text, 'delivered'::text, 'cancelled'::text])))
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    full_name text,
    phone text,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: service_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    service_id uuid NOT NULL,
    customer_name text NOT NULL,
    customer_email text NOT NULL,
    customer_phone text NOT NULL,
    message text,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    icon text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: swaps; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.swaps (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    gadget_id uuid NOT NULL,
    customer_name text NOT NULL,
    customer_email text NOT NULL,
    customer_phone text NOT NULL,
    device_to_swap text NOT NULL,
    device_condition text NOT NULL,
    additional_info text,
    status text DEFAULT 'pending'::text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT swaps_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text, 'completed'::text])))
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: cart_items cart_items_user_id_gadget_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_user_id_gadget_id_key UNIQUE (user_id, gadget_id);


--
-- Name: certificates certificates_certificate_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_certificate_number_key UNIQUE (certificate_number);


--
-- Name: certificates certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_pkey PRIMARY KEY (id);


--
-- Name: certificates certificates_user_id_course_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_user_id_course_id_key UNIQUE (user_id, course_id);


--
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: enrollments enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_pkey PRIMARY KEY (id);


--
-- Name: enrollments enrollments_user_id_course_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_user_id_course_id_key UNIQUE (user_id, course_id);


--
-- Name: gadgets gadgets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gadgets
    ADD CONSTRAINT gadgets_pkey PRIMARY KEY (id);


--
-- Name: newsletter_subscribers newsletter_subscribers_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_email_key UNIQUE (email);


--
-- Name: newsletter_subscribers newsletter_subscribers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);


--
-- Name: service_requests service_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_requests
    ADD CONSTRAINT service_requests_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: swaps swaps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.swaps
    ADD CONSTRAINT swaps_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: orders ensure_correct_order_price; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER ensure_correct_order_price BEFORE INSERT OR UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.validate_order_price();


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: service_requests update_service_requests_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON public.service_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: contacts validate_contact_before_insert; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER validate_contact_before_insert BEFORE INSERT ON public.contacts FOR EACH ROW EXECUTE FUNCTION public.validate_contact_submission();


--
-- Name: cart_items cart_items_gadget_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_gadget_id_fkey FOREIGN KEY (gadget_id) REFERENCES public.gadgets(id) ON DELETE CASCADE;


--
-- Name: cart_items cart_items_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: certificates certificates_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: certificates certificates_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: enrollments enrollments_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: enrollments enrollments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_gadget_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_gadget_id_fkey FOREIGN KEY (gadget_id) REFERENCES public.gadgets(id) ON DELETE SET NULL;


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: orders orders_gadget_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_gadget_id_fkey FOREIGN KEY (gadget_id) REFERENCES public.gadgets(id) ON DELETE CASCADE;


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: service_requests service_requests_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_requests
    ADD CONSTRAINT service_requests_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: service_requests service_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_requests
    ADD CONSTRAINT service_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: swaps swaps_gadget_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.swaps
    ADD CONSTRAINT swaps_gadget_id_fkey FOREIGN KEY (gadget_id) REFERENCES public.gadgets(id) ON DELETE CASCADE;


--
-- Name: swaps swaps_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.swaps
    ADD CONSTRAINT swaps_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: enrollments Admins can manage all enrollments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all enrollments" ON public.enrollments USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: order_items Admins can manage all order items; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all order items" ON public.order_items USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: orders Admins can manage all orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all orders" ON public.orders USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can manage all roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all roles" ON public.user_roles USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: service_requests Admins can manage all service requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all service requests" ON public.service_requests USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: courses Admins can manage courses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage courses" ON public.courses USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: gadgets Admins can manage gadgets; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage gadgets" ON public.gadgets USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: services Admins can manage services; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage services" ON public.services USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: certificates Admins can view all certificates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all certificates" ON public.certificates USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: swaps Admins can view all swaps; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all swaps" ON public.swaps USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: contacts Admins can view contacts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view contacts" ON public.contacts FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: contacts Anyone can submit contact; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can submit contact" ON public.contacts FOR INSERT WITH CHECK (true);


--
-- Name: newsletter_subscribers Anyone can subscribe; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);


--
-- Name: courses Anyone can view courses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view courses" ON public.courses FOR SELECT USING (true);


--
-- Name: gadgets Anyone can view gadgets; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view gadgets" ON public.gadgets FOR SELECT USING (true);


--
-- Name: services Anyone can view services; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view services" ON public.services FOR SELECT USING (true);


--
-- Name: orders Users can create orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: service_requests Users can create service requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create service requests" ON public.service_requests FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: swaps Users can create swaps; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create swaps" ON public.swaps FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: enrollments Users can enroll in courses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can enroll in courses" ON public.enrollments FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: profiles Users can insert their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: cart_items Users can manage their own cart; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can manage their own cart" ON public.cart_items USING ((auth.uid() = user_id));


--
-- Name: enrollments Users can update their enrollments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their enrollments" ON public.enrollments FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: certificates Users can view their certificates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their certificates" ON public.certificates FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: enrollments Users can view their enrollments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their enrollments" ON public.enrollments FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: orders Users can view their orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their orders" ON public.orders FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: cart_items Users can view their own cart; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own cart" ON public.cart_items FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: order_items Users can view their own order items; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own order items" ON public.order_items FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.orders
  WHERE ((orders.id = order_items.order_id) AND (orders.user_id = auth.uid())))));


--
-- Name: profiles Users can view their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_roles Users can view their own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: service_requests Users can view their own service requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own service requests" ON public.service_requests FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: swaps Users can view their swaps; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their swaps" ON public.swaps FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: cart_items; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

--
-- Name: certificates; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

--
-- Name: contacts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

--
-- Name: courses; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

--
-- Name: enrollments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

--
-- Name: gadgets; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.gadgets ENABLE ROW LEVEL SECURITY;

--
-- Name: newsletter_subscribers; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

--
-- Name: order_items; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

--
-- Name: orders; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: service_requests; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

--
-- Name: services; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

--
-- Name: swaps; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.swaps ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--




COMMIT;