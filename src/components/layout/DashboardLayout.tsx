import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Role } from "../../redux/resourcesSlice";
import  logo  from "@/assets/logo.svg";

import { 
  // BarChart3, 
  Users, 
  Building, 
  UserPlus, 
  Banknote, 
  MessageSquare, 
  Award, 
  Shield, 
  Settings,
  Menu,
  Bell,
  User,
  Moon,
  Sun,
  HeadphonesIcon,
  BarChart,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/redux/store";

const notifications = [
  {
    id: 1,
    title: "طلب كود خصم جديد",
    message: "أحمد محمد طلب كود خصم لشركة نون",
    time: "منذ دقيقتين",
    type: "request",
    unread: true
  },
  {
    id: 2,
    title: "طلب سحب عمولة",
    message: "سارة أحمد طلبت سحب عمولة بقيمة 500 ريال",
    time: "منذ 10 دقائق",
    type: "withdrawal",
    unread: true
  },
  {
    id: 3,
    title: "إنجاز جديد",
    message: "محمد علي حقق أعلى مبيعات هذا الشهر",
    time: "منذ ساعة",
    type: "achievement",
    unread: true
  },
  {
    id: 4,
    title: "رسالة دعم",
    message: "فاطمة عبدالله أرسلت رسالة دعم جديدة",
    time: "منذ ساعتين",
    type: "support",
    unread: false
  },
  {
    id: 5,
    title: "تحقق من الهوية",
    message: "خالد أحمد أرسل وثائق التحقق من الهوية",
    time: "أمس",
    type: "verification",
    unread: false
  }
];

const navigation = [
  { name: "الرئيسية", href: "/", icon: Home },
  { name: "المسوقين", href: "/marketers", icon: Users },
  { name: "الروابط و الأكواد", href: "/LinksCodes", icon: BarChart },
  // { name: "التقارير المفصلة", href: "/reports", icon: BarChart },
  { name: "الشركات", href: "/companies", icon: Building },
  { name: "طلبات المسوقين", href: "/requests", icon: UserPlus },
  { name: "طلبات السحب", href: "/withdrawals", icon: Banknote },
  { name: "المجتمع", href: "/community", icon: MessageSquare },
  { name: "الشارات والإنجازات", href: "/achievements", icon: Award },
  { name: "التحقق من الهوية", href: "/verification", icon: Shield },
  { name: "الدعم", href: "/support", icon: HeadphonesIcon },
  { name: "الإعدادات العامة", href: "/settings", icon: Settings },
];

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    localStorage.clear();
    dispatch(Role(""));
    navigate("/login");
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10">
                {/* <span className="text-white font-bold text-sm">ت</span> */}
                <img src={logo} alt="logo" />
              </div>
              <h1 className="text-xl font-bold">تسويقي - لوحة التحكم</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={toggleDarkMode}>
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-destructive">
                    {notifications.filter(n => n.unread).length}
                  </Badge>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">الاشعارات</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={cn(
                        "p-4 border-b hover:bg-muted/50 cursor-pointer transition-colors",
                        notification.unread && "bg-muted/30"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "h-2 w-2 rounded-full mt-2 flex-shrink-0",
                          notification.unread ? "bg-primary" : "bg-muted"
                        )} />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t">
                  <Button variant="ghost" className="w-full text-sm">
                    عرض جميع الاشعارات
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <User className="h-5 w-5" />
                  <span className="hidden md:block">المشرف العام</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>الملف الشخصي</DropdownMenuItem>
                <DropdownMenuItem>الإعدادات</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={handleLogout}>تسجيل خروج</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "bg-sidebar border-l border-sidebar-border transition-all duration-300 ease-in-out",
          isSidebarOpen ? "w-64" : "w-0 lg:w-16",
          "h-[calc(100vh-4rem)] sticky top-16 overflow-hidden"
        )}>
          <nav className="p-4 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive 
                      ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                      : "text-sidebar-foreground"
                  )
                }
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {isSidebarOpen && <span className="truncate">{item.name}</span>}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          "min-h-[calc(100vh-4rem)] bg-background"
        )}>
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}