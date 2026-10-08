// Khung giao diện sau khi đăng nhập: thanh trên cùng + menu ☰ + chuông + tài khoản
import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Menu, Plus, Moon, Sun, Home, User, Shield, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useMe } from "@/hooks/use-me";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "./UserName";
import { TickBadge } from "./TickBadge";
import { PostComposer } from "./PostComposer";
import { SECTIONS, timeAgo, tickLabel } from "@/lib/forum";

export function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => { setDark(document.documentElement.classList.contains("dark")); }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };
  return { dark, toggle };
}

export function AppShell({ children }: { children: ReactNode }) {
  const { data: me } = useMe();
  const [menu, setMenu] = useState(false);
  const [compose, setCompose] = useState(false);
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: pending = 0 } = useQuery({
    queryKey: ["pending-count"],
    enabled: !!me?.isAdmin,
    queryFn: async () => {
      const { count } = await supabase.from("tick_requests").select("id", { count: "exact", head: true }).eq("status", "pending");
      return count ?? 0;
    },
  });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/dang-nhap", replace: true });
  }

  const p = me?.profile;
  const nav = [
    { to: "/bang-tin", label: "Trang chủ", icon: <Home className="h-5 w-5" /> },
    { to: "/thong-bao", label: `${SECTIONS.announce.emoji} ${SECTIONS.announce.title}` },
    { to: "/dien-dan-gv", label: `${SECTIONS.teachers.emoji} ${SECTIONS.teachers.title}` },
    { to: "/goc-update", label: `${SECTIONS.update.emoji} ${SECTIONS.update.title}` },
    { to: "/gioi-thieu", label: "Tìm hiểu thêm", icon: <Info className="h-5 w-5" /> },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-2 px-3">
          <button onClick={() => setMenu(true)} className="rounded-full p-2 hover:bg-muted" aria-label="Mở menu">
            <Menu className="h-6 w-6" />
          </button>
          <Link to="/bang-tin" className="flex-1 truncate text-center font-display text-sm font-extrabold leading-tight text-primary sm:text-base">
            DIỄN ĐÀN THCS TÂY NHA TRANG <span className="hidden sm:inline">– PH2</span>
          </Link>
          <button onClick={() => setCompose(true)} className="rounded-full bg-muted p-2 hover:bg-muted/70" aria-label="Đăng bài">
            <Plus className="h-5 w-5" />
          </button>
          <NotificationBell userId={me?.userId} />
          {p && (
            <DropdownMenu>
              <DropdownMenuTrigger aria-label="Tài khoản" className="rounded-full"><Avatar p={p} size={34} /></DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex items-center gap-1">{p.full_name} {p.tick && <TickBadge color={p.tick} label={tickLabel(p)} size={14} />}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: "/ca-nhan/$username", params: { username: p.username } })}>Trang cá nhân</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/doi-mat-khau" })}>Đổi mật khẩu</DropdownMenuItem>
                <DropdownMenuItem onClick={toggle}>{dark ? "Chế độ sáng" : "Chế độ tối"}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={signOut}>Đăng xuất</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      <Sheet open={menu} onOpenChange={setMenu}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="border-b p-4 text-left">
            <SheetTitle className="text-base text-primary">Diễn đàn THCS Tây Nha Trang – PH2</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col p-2">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setMenu(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 font-medium hover:bg-muted"
                activeProps={{ className: "bg-secondary text-secondary-foreground" }}>
                {"icon" in n && n.icon}{n.label}
              </Link>
            ))}
            {p && (
              <Link to="/ca-nhan/$username" params={{ username: p.username }} onClick={() => setMenu(false)} className="flex items-center gap-3 rounded-lg px-3 py-3 font-medium hover:bg-muted">
                <User className="h-5 w-5" /> Trang cá nhân
              </Link>
            )}
            {me?.isAdmin && (
              <Link to="/quan-tri" onClick={() => setMenu(false)} className="flex items-center gap-3 rounded-lg px-3 py-3 font-medium hover:bg-muted">
                <Shield className="h-5 w-5 text-tick-red" /> Quản trị
                {pending > 0 && <span className="ml-auto rounded-full bg-destructive px-2 text-xs font-bold text-destructive-foreground">{pending}</span>}
              </Link>
            )}
            <button onClick={toggle} className="flex items-center gap-3 rounded-lg px-3 py-3 text-left font-medium hover:bg-muted">
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />} {dark ? "Chế độ sáng" : "Chế độ tối"}
            </button>
          </nav>
        </SheetContent>
      </Sheet>

      <main className="mx-auto max-w-2xl px-3 py-4">{children}</main>
      <PostComposer open={compose} onOpenChange={setCompose} />
    </div>
  );
}

function NotificationBell({ userId }: { userId?: string }) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { data: items = [] } = useQuery({
    queryKey: ["notifications"],
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(30);
      return data ?? [];
    },
  });
  useEffect(() => {
    if (!userId) return;
    const ch = supabase
      .channel(`notif-${userId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
        () => { qc.invalidateQueries({ queryKey: ["notifications"] }); qc.invalidateQueries({ queryKey: ["pending-count"] }); qc.invalidateQueries({ queryKey: ["me"] }); })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [userId, qc]);
  const unread = items.filter((n) => !n.is_read).length;

  async function markAll() {
    if (!userId || unread === 0) return;
    await supabase.from("notifications").update({ is_read: true }).eq("user_id", userId).eq("is_read", false);
    qc.invalidateQueries({ queryKey: ["notifications"] });
  }
  return (
    <Popover onOpenChange={(o) => { if (!o) markAll(); }}>
      <PopoverTrigger className="relative rounded-full bg-muted p-2 hover:bg-muted/70" aria-label="Thông báo">
        <Bell className="h-5 w-5" />
        {unread > 0 && <span className="absolute -right-0.5 -top-0.5 min-w-5 rounded-full bg-destructive px-1 text-center text-[11px] font-bold text-destructive-foreground">{unread > 9 ? "9+" : unread}</span>}
      </PopoverTrigger>
      <PopoverContent align="end" className="max-h-[70vh] w-80 overflow-y-auto p-0">
        <div className="border-b px-4 py-3 font-semibold">Thông báo</div>
        {items.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">Chưa có thông báo nào</p>}
        {items.map((n) => (
          <button key={n.id} onClick={() => { if (n.link) navigate({ to: n.link }); }}
            className={`block w-full border-b px-4 py-3 text-left text-sm hover:bg-muted ${n.is_read ? "" : "bg-secondary/50"}`}>
            <p>{n.message}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{timeAgo(n.created_at)}</p>
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
