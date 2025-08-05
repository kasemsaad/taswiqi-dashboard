import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Role } from "../../redux/resourcesSlice";
import logo from "@/assets/logo.svg";

import { 
  Users, 
  Building, 
  UserPlus, 
  Banknote, 
  Award, 
  Link, 
  Shield, 
  Settings,
  Menu,
  Bell,
  User,
  Moon,
  Sun,
  Megaphone,
  HeadphonesIcon,
  Home,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  { name: "الروابط و الأكواد", href: "/LinksCodes", icon: Link },
  { name: "الشركات", href: "/companies", icon: Building },
  { name: "طلبات المسوقين", href: "/requests", icon: UserPlus },
  { name: "طلبات السحب", href: "/requsetWithdrawal", icon: Banknote },
  { name: "الشارات والإنجازات", href: "/badges", icon: Award },
  { name: "التحقق من الهوية", href: "/verification", icon: Shield },
  { name: "الإشعارات", href: "/notification", icon: Megaphone },
  { name: "الدعم", href: "/support", icon: HeadphonesIcon },
  { name: "الإعدادات العامة", href: "/settings", icon: Settings },
];

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    localStorage.clear();
    dispatch(Role(""));
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="lg:hidden"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10">
                <img src={logo} alt="logo" className="w-full h-full" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold whitespace-nowrap">تسويقي - لوحة التحكم</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="sm" onClick={toggleDarkMode} className="hidden sm:flex">
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
              <PopoverContent className="w-72 sm:w-80 p-0" align="end">
                <div className="p-3 sm:p-4 border-b">
                  <h3 className="font-semibold text-sm sm:text-base">الاشعارات</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={cn(
                        "p-3 sm:p-4 border-b hover:bg-muted/50 cursor-pointer transition-colors",
                        notification.unread && "bg-muted/30"
                      )}
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className={cn(
                          "h-2 w-2 rounded-full mt-2 flex-shrink-0",
                          notification.unread ? "bg-primary" : "bg-muted"
                        )} />
                        <div className="flex-1">
                          <h4 className="font-medium text-xs sm:text-sm">{notification.title}</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 sm:mt-2">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 sm:p-3 border-t">
                  <Button variant="ghost" className="w-full text-xs sm:text-sm">
                    عرض جميع الاشعارات
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden sm:flex">
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

            {/* Mobile user dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="sm:hidden">
                  <User className="h-5 w-5" />
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
          "bg-sidebar border-l border-sidebar-border  transition-all duration-300 ease-in-out",
          "h-[calc(100vh-4rem)] fixed lg:sticky top-16 z-40",
          "overflow-y-auto ",
          isSidebarOpen ? "w-64" : "w-0",
          "lg:w-64",
          isMobile && !isSidebarOpen ? "hidden" : "block"
        )}>
          <nav className="p-2 sm:p-4 space-y-1 sm:space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => isMobile && setIsSidebarOpen(false)}
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
                <span className="truncate">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && isMobile && (
          <div 
            className="fixed  inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className={cn(
          "flex-1 w-full transition-all duration-300 ease-in-out",
          "min-h-[calc(100vh-4rem)] bg-background",
          isSidebarOpen && !isMobile ? "lg:ml-0" : "lg:ml-0"
        )}>
          <div className="p-4 sm:p-6  ">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}