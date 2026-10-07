CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');
CREATE TYPE public.tick_color AS ENUM ('blue','gold','pink','red');
CREATE TYPE public.post_section AS ENUM ('home','announce','teachers','update');
CREATE TYPE public.request_status AS ENUM ('pending','approved','rejected');
CREATE TYPE public.teacher_position AS ENUM ('principal','tpt','subject');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  username text NOT NULL UNIQUE,
  full_name text NOT NULL,
  class_name text,
  is_teacher boolean NOT NULL DEFAULT false,
  tick public.tick_color,
  subject text,
  bio text,
  avatar_url text,
  locked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
CREATE OR REPLACE FUNCTION public.is_admin(_uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(_uid, 'admin')
$$;
CREATE OR REPLACE FUNCTION public.get_tick(_uid uuid)
RETURNS public.tick_color LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT tick FROM public.profiles WHERE id = _uid
$$;
CREATE OR REPLACE FUNCTION public.can_post(_uid uuid, _section public.post_section)
RETURNS boolean LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE t public.tick_color; lk boolean;
BEGIN
  SELECT tick, locked INTO t, lk FROM public.profiles WHERE id = _uid;
  IF NOT FOUND OR lk THEN RETURN false; END IF;
  IF public.is_admin(_uid) THEN RETURN true; END IF;
  RETURN CASE _section
    WHEN 'home' THEN true
    WHEN 'announce' THEN coalesce(t IN ('gold','pink','red'), false)
    WHEN 'teachers' THEN t IS NOT NULL
    WHEN 'update' THEN coalesce(t = 'red', false)
  END;
END $$;

CREATE POLICY "Đọc vai trò" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Xem hồ sơ" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Sửa hồ sơ" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_admin(auth.uid()))
  WITH CHECK (id = auth.uid() OR public.is_admin(auth.uid()));

CREATE OR REPLACE FUNCTION public.protect_profile_columns()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    NEW.tick := OLD.tick; NEW.subject := OLD.subject; NEW.locked := OLD.locked;
    NEW.username := OLD.username; NEW.is_teacher := OLD.is_teacher; NEW.id := OLD.id;
  END IF;
  NEW.full_name := left(trim(NEW.full_name), 80);
  NEW.bio := left(NEW.bio, 300);
  RETURN NEW;
END $$;
CREATE TRIGGER trg_protect_profile BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_columns();

CREATE TABLE public.private_info (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  email text,
  zalo text
);
GRANT SELECT, UPDATE ON public.private_info TO authenticated;
GRANT ALL ON public.private_info TO service_role;
ALTER TABLE public.private_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Chủ hoặc admin xem" ON public.private_info FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "Chủ sửa" ON public.private_info FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.tick_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  position public.teacher_position NOT NULL,
  subject text,
  full_name text NOT NULL,
  username text NOT NULL,
  zalo text NOT NULL,
  email text,
  status public.request_status NOT NULL DEFAULT 'pending',
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz
);
GRANT SELECT ON public.tick_requests TO authenticated;
GRANT ALL ON public.tick_requests TO service_role;
ALTER TABLE public.tick_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Xem yêu cầu tick" ON public.tick_requests FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  link text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Xem thông báo" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Đọc thông báo" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Xoá thông báo" ON public.notifications FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.notify(_uid uuid, _msg text, _link text)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  INSERT INTO public.notifications(user_id, message, link) VALUES (_uid, _msg, _link)
$$;
REVOKE EXECUTE ON FUNCTION public.notify(uuid,text,text) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.censor(_t text)
RETURNS text LANGUAGE plpgsql IMMUTABLE SET search_path = public AS $$
DECLARE w text; r text := _t;
BEGIN
  IF r IS NULL THEN RETURN NULL; END IF;
  FOREACH w IN ARRAY ARRAY['địt','đụ','lồn','cặc','buồi','đéo','đmm','đm','dmm','vcl','vkl','óc chó','fuck','shit','bitch','dm','vl','cc'] LOOP
    r := regexp_replace(r, '(^|[^[:alnum:]])' || w || '(?=[^[:alnum:]]|$)', '\1***', 'gi');
  END LOOP;
  RETURN r;
END $$;

CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  section public.post_section NOT NULL DEFAULT 'home',
  content text NOT NULL DEFAULT '',
  attachments jsonb NOT NULL DEFAULT '[]'::jsonb,
  tag_subject text,
  tag_class text,
  pinned boolean NOT NULL DEFAULT false,
  hidden boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX posts_section_created_idx ON public.posts(section, pinned DESC, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT ALL ON public.posts TO service_role;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Xem bài" ON public.posts FOR SELECT TO authenticated
  USING (NOT hidden OR author_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "Đăng bài theo quyền" ON public.posts FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid() AND public.can_post(auth.uid(), section));
CREATE POLICY "Sửa bài" ON public.posts FOR UPDATE TO authenticated
  USING (author_id = auth.uid() OR public.is_admin(auth.uid()))
  WITH CHECK (author_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "Xoá bài" ON public.posts FOR DELETE TO authenticated
  USING (author_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE OR REPLACE FUNCTION public.posts_guard()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE can_pin boolean;
BEGIN
  IF length(NEW.content) > 5000 THEN RAISE EXCEPTION 'Nội dung quá dài (tối đa 5000 ký tự)'; END IF;
  IF jsonb_array_length(NEW.attachments) > 10 THEN RAISE EXCEPTION 'Tối đa 10 tệp đính kèm'; END IF;
  NEW.content := public.censor(NEW.content);
  can_pin := public.is_admin(auth.uid()) OR (NEW.section = 'announce' AND coalesce(public.get_tick(auth.uid()) IN ('gold','pink'), false));
  IF TG_OP = 'INSERT' THEN
    IF NOT public.is_admin(auth.uid()) AND (SELECT count(*) FROM public.posts WHERE author_id = NEW.author_id AND created_at > now() - interval '1 minute') >= 3 THEN
      RAISE EXCEPTION 'Bạn đăng quá nhanh, vui lòng chờ 1 phút';
    END IF;
    NEW.hidden := false;
    IF NOT can_pin THEN NEW.pinned := false; END IF;
  ELSE
    IF NOT public.is_admin(auth.uid()) THEN
      NEW.hidden := OLD.hidden; NEW.section := OLD.section; NEW.author_id := OLD.author_id;
      IF NOT can_pin THEN NEW.pinned := OLD.pinned; END IF;
    END IF;
    NEW.updated_at := now();
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_posts_guard BEFORE INSERT OR UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.posts_guard();

CREATE TABLE public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES public.comments(id) ON DELETE CASCADE,
  content text NOT NULL,
  hidden boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX comments_post_idx ON public.comments(post_id, created_at);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.comments TO authenticated;
GRANT ALL ON public.comments TO service_role;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Xem bình luận" ON public.comments FOR SELECT TO authenticated
  USING (NOT hidden OR author_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "Viết bình luận" ON public.comments FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid() AND NOT coalesce((SELECT locked FROM public.profiles WHERE id = auth.uid()), true));
CREATE POLICY "Sửa bình luận" ON public.comments FOR UPDATE TO authenticated
  USING (author_id = auth.uid() OR public.is_admin(auth.uid())) WITH CHECK (author_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "Xoá bình luận" ON public.comments FOR DELETE TO authenticated
  USING (author_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE OR REPLACE FUNCTION public.comments_guard()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF length(trim(NEW.content)) = 0 OR length(NEW.content) > 2000 THEN RAISE EXCEPTION 'Bình luận phải từ 1 đến 2000 ký tự'; END IF;
  NEW.content := public.censor(NEW.content);
  IF TG_OP = 'INSERT' THEN
    IF (SELECT count(*) FROM public.comments WHERE author_id = NEW.author_id AND created_at > now() - interval '1 minute') >= 10 THEN
      RAISE EXCEPTION 'Bạn bình luận quá nhanh, vui lòng chờ một chút';
    END IF;
    NEW.hidden := false;
  ELSIF NOT public.is_admin(auth.uid()) THEN
    NEW.hidden := OLD.hidden; NEW.post_id := OLD.post_id; NEW.author_id := OLD.author_id;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_comments_guard BEFORE INSERT OR UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.comments_guard();

CREATE OR REPLACE FUNCTION public.comments_notify()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE pa uuid; ca uuid; nm text;
BEGIN
  SELECT full_name INTO nm FROM public.profiles WHERE id = NEW.author_id;
  SELECT author_id INTO pa FROM public.posts WHERE id = NEW.post_id;
  IF pa IS NOT NULL AND pa <> NEW.author_id THEN
    PERFORM public.notify(pa, nm || ' đã bình luận bài viết của bạn', '/bai-viet/' || NEW.post_id);
  END IF;
  IF NEW.parent_id IS NOT NULL THEN
    SELECT author_id INTO ca FROM public.comments WHERE id = NEW.parent_id;
    IF ca IS NOT NULL AND ca <> NEW.author_id AND ca IS DISTINCT FROM pa THEN
      PERFORM public.notify(ca, nm || ' đã trả lời bình luận của bạn', '/bai-viet/' || NEW.post_id);
    END IF;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_comments_notify AFTER INSERT ON public.comments FOR EACH ROW EXECUTE FUNCTION public.comments_notify();

CREATE TABLE public.reactions (
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('like','love','haha','wow','sad')),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reactions TO authenticated;
GRANT ALL ON public.reactions TO service_role;
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Xem cảm xúc" ON public.reactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Thả cảm xúc" ON public.reactions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Đổi cảm xúc" ON public.reactions FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Bỏ cảm xúc" ON public.reactions FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES public.comments(id) ON DELETE CASCADE,
  reason text NOT NULL CHECK (length(reason) BETWEEN 1 AND 500),
  resolved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reports TO authenticated;
GRANT ALL ON public.reports TO service_role;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Gửi báo cáo" ON public.reports FOR INSERT TO authenticated WITH CHECK (reporter_id = auth.uid() AND resolved = false);
CREATE POLICY "Admin xem báo cáo" ON public.reports FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin xử lý báo cáo" ON public.reports FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admin xoá báo cáo" ON public.reports FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

CREATE OR REPLACE FUNCTION public.reports_notify()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE a uuid;
BEGIN
  FOR a IN SELECT user_id FROM public.user_roles WHERE role = 'admin' LOOP
    PERFORM public.notify(a, 'Có báo cáo vi phạm mới cần xử lý', '/quan-tri');
  END LOOP;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_reports_notify AFTER INSERT ON public.reports FOR EACH ROW EXECUTE FUNCTION public.reports_notify();

CREATE OR REPLACE FUNCTION public.username_available(_username text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT NOT EXISTS (SELECT 1 FROM public.profiles WHERE username = lower(_username))
$$;
GRANT EXECUTE ON FUNCTION public.username_available(text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.complete_signup(
  _full_name text, _class_name text, _kind text,
  _position public.teacher_position, _subject text, _zalo text, _email text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); uname text; a uuid;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Chưa đăng nhập'; END IF;
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = uid) THEN RETURN; END IF;
  uname := lower(split_part(auth.jwt() ->> 'email', '@', 1));
  IF uname !~ '^[a-z0-9_.]{3,30}$' THEN RAISE EXCEPTION 'Tên đăng nhập không hợp lệ'; END IF;
  IF length(trim(coalesce(_full_name,''))) < 2 OR length(_full_name) > 80 THEN RAISE EXCEPTION 'Họ tên không hợp lệ'; END IF;
  IF coalesce(_email,'') <> '' AND _email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN RAISE EXCEPTION 'Email không hợp lệ'; END IF;

  IF _kind = 'teacher' THEN
    IF _position IS NULL THEN RAISE EXCEPTION 'Chưa chọn chức vụ'; END IF;
    IF coalesce(_zalo,'') !~ '^(0|\+84)(3|5|7|8|9)[0-9]{8}$' THEN RAISE EXCEPTION 'Số điện thoại Zalo không hợp lệ'; END IF;
    IF _position = 'subject' AND coalesce(trim(_subject),'') = '' THEN RAISE EXCEPTION 'Chưa chọn môn dạy'; END IF;
    INSERT INTO public.profiles(id, username, full_name, is_teacher) VALUES (uid, uname, trim(_full_name), true);
    INSERT INTO public.private_info(user_id, email, zalo) VALUES (uid, nullif(_email,''), _zalo);
    INSERT INTO public.tick_requests(user_id, position, subject, full_name, username, zalo, email)
      VALUES (uid, _position, CASE WHEN _position = 'subject' THEN left(_subject, 40) END, trim(_full_name), uname, _zalo, nullif(_email,''));
    FOR a IN SELECT user_id FROM public.user_roles WHERE role = 'admin' LOOP
      PERFORM public.notify(a, 'Yêu cầu duyệt tick mới từ ' || trim(_full_name), '/quan-tri');
    END LOOP;
  ELSE
    IF coalesce(_class_name,'') !~ '^[6-9]A[0-9]{1,2}$' THEN RAISE EXCEPTION 'Lớp không hợp lệ'; END IF;
    INSERT INTO public.profiles(id, username, full_name, class_name) VALUES (uid, uname, trim(_full_name), _class_name);
    INSERT INTO public.private_info(user_id, email) VALUES (uid, nullif(_email,''));
  END IF;
END $$;
REVOKE EXECUTE ON FUNCTION public.complete_signup FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.complete_signup TO authenticated;

CREATE OR REPLACE FUNCTION public.resubmit_tick_request(_position public.teacher_position, _subject text, _zalo text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); p public.profiles; a uuid;
BEGIN
  SELECT * INTO p FROM public.profiles WHERE id = uid;
  IF NOT FOUND OR NOT p.is_teacher THEN RAISE EXCEPTION 'Chỉ tài khoản giáo viên mới gửi được yêu cầu'; END IF;
  IF p.tick IS NOT NULL THEN RAISE EXCEPTION 'Bạn đã có tick'; END IF;
  IF EXISTS (SELECT 1 FROM public.tick_requests WHERE user_id = uid AND status = 'pending') THEN RAISE EXCEPTION 'Bạn đang có yêu cầu chờ duyệt'; END IF;
  IF (SELECT count(*) FROM public.tick_requests WHERE user_id = uid AND created_at > now() - interval '1 day') >= 3 THEN
    RAISE EXCEPTION 'Bạn đã gửi quá 3 yêu cầu trong 24 giờ, vui lòng thử lại sau';
  END IF;
  IF coalesce(_zalo,'') !~ '^(0|\+84)(3|5|7|8|9)[0-9]{8}$' THEN RAISE EXCEPTION 'Số điện thoại Zalo không hợp lệ'; END IF;
  IF _position = 'subject' AND coalesce(trim(_subject),'') = '' THEN RAISE EXCEPTION 'Chưa chọn môn dạy'; END IF;
  INSERT INTO public.tick_requests(user_id, position, subject, full_name, username, zalo, email)
    VALUES (uid, _position, CASE WHEN _position = 'subject' THEN left(_subject,40) END, p.full_name, p.username, _zalo,
            (SELECT email FROM public.private_info WHERE user_id = uid));
  UPDATE public.private_info SET zalo = _zalo WHERE user_id = uid;
  FOR a IN SELECT user_id FROM public.user_roles WHERE role = 'admin' LOOP
    PERFORM public.notify(a, 'Yêu cầu duyệt tick mới từ ' || p.full_name, '/quan-tri');
  END LOOP;
END $$;
REVOKE EXECUTE ON FUNCTION public.resubmit_tick_request FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.resubmit_tick_request TO authenticated;

CREATE OR REPLACE FUNCTION public.review_tick_request(_id uuid, _approve boolean, _reason text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r public.tick_requests; t public.tick_color;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN RAISE EXCEPTION 'Không có quyền'; END IF;
  SELECT * INTO r FROM public.tick_requests WHERE id = _id FOR UPDATE;
  IF NOT FOUND OR r.status <> 'pending' THEN RAISE EXCEPTION 'Yêu cầu không còn chờ duyệt'; END IF;
  IF _approve THEN
    t := CASE r.position WHEN 'principal' THEN 'gold'::public.tick_color WHEN 'tpt' THEN 'pink'::public.tick_color ELSE 'blue'::public.tick_color END;
    UPDATE public.profiles SET tick = t, subject = r.subject WHERE id = r.user_id;
    UPDATE public.tick_requests SET status = 'approved', reviewed_at = now() WHERE id = _id;
    PERFORM public.notify(r.user_id, '🎉 Yêu cầu xác minh của bạn đã được duyệt. Bạn đã được cấp tick!', '/ca-nhan/' || r.username);
  ELSE
    IF coalesce(trim(_reason),'') = '' THEN RAISE EXCEPTION 'Vui lòng nhập lý do từ chối'; END IF;
    UPDATE public.tick_requests SET status = 'rejected', reason = left(_reason, 300), reviewed_at = now() WHERE id = _id;
    PERFORM public.notify(r.user_id, 'Yêu cầu xác minh bị từ chối: ' || left(_reason, 200), '/ca-nhan/' || r.username);
  END IF;
END $$;
REVOKE EXECUTE ON FUNCTION public.review_tick_request FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.review_tick_request TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_set_tick(_uid uuid, _tick public.tick_color, _subject text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN RAISE EXCEPTION 'Không có quyền'; END IF;
  IF _tick = 'red' THEN RAISE EXCEPTION 'Không thể cấp tick đỏ'; END IF;
  IF public.is_admin(_uid) THEN RAISE EXCEPTION 'Không thể thay đổi tick của quản trị viên'; END IF;
  UPDATE public.profiles SET tick = _tick, subject = CASE WHEN _tick = 'blue' THEN left(_subject,40) END WHERE id = _uid;
  PERFORM public.notify(_uid, CASE WHEN _tick IS NULL THEN 'Tick của bạn đã bị thu hồi' ELSE 'Bạn vừa được quản trị viên cấp tick' END, NULL);
END $$;
REVOKE EXECUTE ON FUNCTION public.admin_set_tick FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_set_tick TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_set_locked(_uid uuid, _locked boolean)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN RAISE EXCEPTION 'Không có quyền'; END IF;
  IF public.is_admin(_uid) THEN RAISE EXCEPTION 'Không thể khoá quản trị viên'; END IF;
  UPDATE public.profiles SET locked = _locked WHERE id = _uid;
END $$;
REVOKE EXECUTE ON FUNCTION public.admin_set_locked FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_set_locked TO authenticated;

ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;

CREATE POLICY "Xem tệp diễn đàn" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'uploads');
CREATE POLICY "Tải tệp vào thư mục của mình" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'uploads' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Xoá tệp của mình" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'uploads' AND (storage.foldername(name))[1] = auth.uid()::text);