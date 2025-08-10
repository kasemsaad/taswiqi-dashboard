import { useState, useEffect } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { Role } from "../../redux/resourcesSlice";
// import logo from "@/assets/logo.svg";
import {
  Users,
  Building,
  UserPlus,
  Banknote,
  Award,
  Link as LinkIcon,
  Shield,
  Settings,
  Menu,
  ScanQrCode,
  Bell,
  User,
  Moon,
  Sun,
  Megaphone,
  HeadphonesIcon,
  Home,
  X,
  ChevronLeft,
  ChevronRight,
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
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/redux/store";
import { messaging, onMessage } from "@/hooks/firebase copy";
import { toast } from "sonner";
import {
  GetAllNotifications,
  GetNotificationsUnReadedCount,
  GetAllSettings,
} from "@/services/userService";

interface Notification {
  id: number;
  title: string;
  body: string;
  time: string;
  type: string;
  unread: boolean;
  image: string | null;
  created_at?: string;
}

// interface NotificationsResponse {
//   data: Notification[];
//   meta: {
//     total: number;
//     current_page: number;
//     per_page: number;
//     last_page: number;
//   };
// }

const navigation = [
  { name: "الرئيسية", href: "/", icon: Home },
  { name: "المسوقين", href: "/marketers", icon: Users },
  { name: "الروابط و الأكواد", href: "/LinksCodes", icon: LinkIcon },
  { name: "الشركات", href: "/companies", icon: Building },
  { name: "طلبات المسوقين", href: "/requests", icon: UserPlus },
  { name: "طلبات السحب", href: "/requsetWithdrawal", icon: Banknote },
  { name: "الشارات والإنجازات", href: "/badges", icon: Award },
  { name: "التحقق من الهوية", href: "/verification", icon: Shield },
  { name: "الإشعارات", href: "/notification", icon: Megaphone },
  { name: "الدعم", href: "/support", icon: HeadphonesIcon },
  { name: "واتساب", href: "/qr", icon: ScanQrCode },
  { name: "الإعدادات العامة", href: "/settings", icon: Settings },
];

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [count, setIscount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [liveNotifications, setLiveNotifications] = useState<Notification[]>(
    []
  );
  const [logo, setlogo] = useState("");
  const [Name, setName] = useState("");

  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 5,
    total: 0,
    lastPage: 1,
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const fetchcount = async () => {
    try {
      const response = await GetNotificationsUnReadedCount();
      if (response.status) {
        const data = response.data as any;
        setIscount(data.count);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };
  const fetchLogo = async () => {
    try {
      const response = await GetAllSettings();
      const dataArray = Array.isArray(response?.data) ? response.data : [];

      // Find the "logo" key and get its value
      const logoItem = dataArray.find((item) => item.key === "logo");
      const valueLogo = logoItem ? logoItem.value : null;
      const site_name_ar = dataArray.find((item) => item.key === "site_name_ar");
      const valuename_ar = site_name_ar ? site_name_ar.value : null;

      setlogo(valueLogo);
      setName(valuename_ar);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } 
  };
  const fetchNotifications = async (page = 1, perPage = 5) => {
    try {
      const response = await GetAllNotifications({
        page,
        perPage,
      });

      if (response && response.data) {
        const formattedNotifications = response.data.map((notification: any) => ({
          id: notification.id,
          title: notification.title,
          body: notification.body,
          time: notification.created_at ?? "",
          type: notification.type,
          unread: (notification as any).read_at === undefined || (notification as any).read_at === null,
          image: notification.image,
        }));

        setLiveNotifications(formattedNotifications);
        setPagination({
          currentPage: response.meta.current_page,
          perPage: response.meta.per_page,
          total: response.meta.total,
          lastPage: response.meta.last_page,
        });
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.lastPage) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
      fetchNotifications(newPage, pagination.perPage);
    }
  };

  // const handlePerPageChange = (newPerPage: number) => {
  //   setPagination((prev) => ({ ...prev, perPage: newPerPage, currentPage: 1 }));
  //   fetchNotifications(1, newPerPage);
  // };

  useEffect(() => {
    fetchcount();
    fetchNotifications(pagination.currentPage, pagination.perPage);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      setIsSidebarOpen(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchLogo();
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("📥 إشعار FCM وارد:", payload);
      const { title, body } = payload.notification ?? {};

      toast(`${title}\n${body}`);

      const newNotification = {
        id: Date.now(),
        title: title || "إشعار جديد",
        body: body || "",
        time: "الآن",
        type: "firebase",
        unread: true,
        image: null,
      };

      setLiveNotifications((prev) => [newNotification, ...prev]);
      setIscount((prev) => prev + 1);
    });

    return () => unsubscribe();
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    localStorage.clear();
    dispatch(Role(""));
    navigate("/login");
  };

  // const viewAllNotifications = () => {
  //   navigate("/notification");
  // };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden"
            >
              {isSidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10">
                <img src={logo} alt="logo" className="w-full h-full" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold whitespace-nowrap">
                {Name} - لوحة التحكم
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="hidden sm:flex"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={() => {
                    fetchNotifications(
                      pagination.currentPage,
                      pagination.perPage
                    );
                    fetchcount();
                  }}
                  size="sm"
                  className="relative"
                >
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-destructive">
                    {count}
                  </Badge>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 sm:w-96 p-0" align="end">
                <div className="p-3 sm:p-4 border-b">
                  <h3 className="font-semibold text-sm sm:text-base">
                    الاشعارات
                  </h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {liveNotifications.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      لا توجد إشعارات
                    </div>
                  ) : (
                    liveNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "p-3 sm:p-4 border-b hover:bg-muted/50 cursor-pointer transition-colors",
                          notification.unread && "bg-muted/30"
                        )}
                      >
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div
                            className={cn(
                              "h-2 w-2 rounded-full mt-2 flex-shrink-0",
                              notification.unread ? "bg-primary" : "bg-muted"
                            )}
                          />
                          {notification.image && (
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                src={notification.image}
                                alt={notification.title}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium text-xs sm:text-sm">
                              {notification.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                              {notification.body}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 sm:mt-2">
                              {notification.time || notification.created_at}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-2 sm:p-3 border-t flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    {/* Pagination */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        الصفحة:
                      </span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          disabled={pagination.currentPage === 1}
                          onClick={() => {
                            handlePageChange(pagination.currentPage - 1),
                              fetchcount();
                          }}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <span className="text-xs">
                          {pagination.currentPage} / {pagination.lastPage}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          disabled={
                            pagination.currentPage === pagination.lastPage
                          }
                          onClick={() => {
                            handlePageChange(pagination.currentPage + 1),
                              fetchcount();
                          }}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {/* Per page */}
                    {/* <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">لكل صفحة:</span>
                      <select
                        value={pagination.perPage}
                        onChange={(e) => handlePerPageChange(Number(e.target.value))}
                        className="text-xs bg-background border rounded p-1"
                      >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                      </select>
                    </div> */}
                  </div>
                  {/* <Button
                    variant="ghost"
                    className="w-full text-xs sm:text-sm"
                    onClick={viewAllNotifications}
                  >
                    عرض جميع الاشعارات
                  </Button> */}
                </div>
              </PopoverContent>
            </Popover>

            {/* Profile menu */}
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
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={handleLogout}
                >
                  تسجيل خروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "bg-sidebar border-l border-sidebar-border transition-all duration-300 ease-in-out",
            "h-[calc(100vh-4rem)] fixed lg:sticky top-16 z-40 overflow-y-auto",
            isSidebarOpen ? "w-64" : "w-0",
            "lg:w-64",
            isMobile && !isSidebarOpen ? "hidden" : "block"
          )}
        >
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

        {/* Content */}
        {isSidebarOpen && isMobile && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <main
          className={cn(
            "flex-1 w-full transition-all duration-300 ease-in-out",
            "min-h-[calc(100vh-4rem)] bg-background",
            isSidebarOpen && !isMobile ? "lg:ml-0" : "lg:ml-0"
          )}
        >
          <div className="p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
