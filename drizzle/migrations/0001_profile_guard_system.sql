CREATE OR REPLACE FUNCTION public.protect_profile_columns()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  -- auth.uid() NULL = hệ thống/máy chủ (người dùng ẩn danh không có quyền UPDATE)
  IF auth.uid() IS NOT NULL AND NOT public.is_admin(auth.uid()) THEN
    NEW.tick := OLD.tick; NEW.subject := OLD.subject; NEW.locked := OLD.locked;
    NEW.username := OLD.username; NEW.is_teacher := OLD.is_teacher; NEW.id := OLD.id;
  END IF;
  NEW.full_name := left(trim(NEW.full_name), 80);
  NEW.bio := left(NEW.bio, 300);
  RETURN NEW;
END $$;