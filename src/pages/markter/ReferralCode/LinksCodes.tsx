import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";
import { Input } from "@/components/ui/input";
import { GeneralTable } from "@/components/ui/tableCustom";
import { TableColumn } from "@/components/ui/tableCustom";
import {
  deleteDiscountCode,
  deleteReferralLink,
  GetAllReferralLinkspage,
  GetAllCodespage,
  GetNumbersReferralLinks,
  GetNumbersCodes,
} from "@/services/userService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Delete from "@/assets/icons/delete.svg";
import Eye from "@/assets/icons/eye.svg";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function MarketersPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  // Separate pagination states for referral links
  const [referralPage, setReferralPage] = useState(1);
  const [referralPerPage, setReferralPerPage] = useState(10);
  const [referralTotalItems, setReferralTotalItems] = useState(0);
  
  // Separate pagination states for discount codes
  const [codesPage, setCodesPage] = useState(1);
  const [codesPerPage, setCodesPerPage] = useState(10);
  const [codesTotalItems, setCodesTotalItems] = useState(0);
  
  const [Referral, setReferral] = useState<any>(null);
  const [Codes, setCodes] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"links" | "codes">("links");

  const [ReferralNumbers, setReferralNumbers] = useState({
    referral_links_count: 0,
    used_referral_links_count: 0,
    not_used_referral_links_count: 0,
    inactive_referral_links_count: 0,
    used_referral_links_this_month_count: 0,
  });

  const [CodesNumbers, setCodesNumbers] = useState({
    discount_codes_count: 0,
    used_discount_codes_count: 0,
    not_used_discount_codes_count: 0,
    inactive_discount_codes_count: 0,
    used_discount_codes_this_month_count: 0,
  });

  const [loading, setLoading] = useState(false);

  // Fetch statistics for both tables
  const fetchStats = async () => {
    try {
      const [referralRes, codesRes] = await Promise.all([
        GetNumbersReferralLinks(),
        GetNumbersCodes()
      ]);
      setReferralNumbers(referralRes.data as {
        referral_links_count: number;
        used_referral_links_count: number;
        not_used_referral_links_count: number;
        inactive_referral_links_count: number;
        used_referral_links_this_month_count: number;
      });
      setCodesNumbers(codesRes.data as {
        discount_codes_count: number;
        used_discount_codes_count: number;
        not_used_discount_codes_count: number;
        inactive_discount_codes_count: number;
        used_discount_codes_this_month_count: number;
      });
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  // Delete a referral link
  const deleteReferral = async (id) => {
    try {
      await deleteReferralLink(id);
      fetchReferral();
      toast({
        title: "تم الحذف",
        description: "تم حذف رابط الإحالة بنجاح",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء حذف رابط الإحالة",
        variant: "destructive",
      });
    }
  };

  // Delete a discount code
  const deleteCode = async (id) => {
    try {
      await deleteDiscountCode(id);
      fetchCodes();
      toast({
        title: "تم الحذف",
        description: "تم حذف كود الخصم بنجاح",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء حذف كود الخصم",
        variant: "destructive",
      });
    }
  };

  // Fetch referral links data
  const fetchReferral = async () => {
    try {
      setLoading(true);
      const response = await GetAllReferralLinkspage({
        page: referralPage,
        per_page: referralPerPage,
        searchTerm: searchTerm || undefined,
        filter: statusFilter !== "all" ? { status: statusFilter } : undefined,
      });

      setReferral(response.data);
      if (response.meta) {
        setReferralTotalItems(response.meta.total);
      }
    } catch (error) {
      console.error("Error fetching referral data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch discount codes data
  const fetchCodes = async () => {
    try {
      setLoading(true);
      const response = await GetAllCodespage({
        page: codesPage,
        per_page: codesPerPage,
        searchTerm: searchTerm || undefined,
        filter: statusFilter !== "all" ? { status: statusFilter } : undefined,
      });

      setCodes(response.data);
      if (response.meta) {
        setCodesTotalItems(response.meta.total);
      }
    } catch (error) {
      console.error("Error fetching codes data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setReferralPage(1);
    setCodesPage(1);
  };

  // Initial data fetch
  useEffect(() => {
    fetchStats();
  }, []);

  // Fetch data when pagination or filters change
  useEffect(() => {
    if (activeTab === "links") {
      fetchReferral();
    } else {
      fetchCodes();
    }
  }, [referralPage, referralPerPage, codesPage, codesPerPage, searchTerm, statusFilter, activeTab]);

  // Columns for referral links table
  const ReferralColumns: TableColumn[] = [
    {
      key: "link",
      header: "الرابط",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.link}</div>
        </div>
      ),
    },
    {
      key: "brand",
      header: "الشركة",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.brand}</div>
        </div>
      ),
    },
    {
      key: "for_user",
      header: "مخصّص ل",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.for_user}</div>
        </div>
      ),
    },
    {
      key: "created_at",
      header: "تاريخ الإضافة",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.created_at}</div>
        </div>
      ),
    },
    {
      key: "usered_at",
      header: "تاريخ آخر استخدام",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.usered_at}</div>
        </div>
      ),
    },
    {
      key: "total_clients",
      header: "عدد الإحالات",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.total_clients}</div>
        </div>
      ),
    },
    {
      key: "status",
      header: "الحالة",
      render: (marketer) => (
        <Badge
          className={
            marketer.status == "active"
              ? "status-active"
              : marketer.status == "expired"
              ? "status-inactive"
              : "status-pending"
          }
        >
          {marketer.status == "active"
            ? "نشط"
            : marketer.status == "expired"
            ? "منتهي"
            : "معطل"}
        </Badge>
      ),
    },
    {
      key: "id",
      header: "اجراءات",
      render: (marketer) => (
        <div className="font-medium ps-5 gap-2 flex">
          <button
            onClick={() => navigate(`editReferral/${marketer.id}`)}
            className="text-muted-foreground hover:text-destructive"
          >
            <img src={Eye} alt="view" />
          </button>
          <button
            onClick={() => deleteReferral(marketer.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <img src={Delete} alt="delete" />
          </button>
        </div>
      ),
    },
  ];

  // Columns for discount codes table
  const CodeColumns: TableColumn[] = [
    {
      key: "code",
      header: "الكود",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.code}</div>
        </div>
      ),
    },
    {
      key: "brand",
      header: "الشركة",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.brand}</div>
        </div>
      ),
    },
    {
      key: "for_user",
      header: "مخصّص ل",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.for_user}</div>
        </div>
      ),
    },
    {
      key: "created_at",
      header: "تاريخ الإضافة",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.created_at}</div>
        </div>
      ),
    },
    {
      key: "usered_at",
      header: "تاريخ آخر استخدام",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.usered_at}</div>
        </div>
      ),
    },
    {
      key: "total_clients",
      header: "عدد الإحالات",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.total_clients}</div>
        </div>
      ),
    },
    {
      key: "status",
      header: "الحالة",
      render: (marketer) => (
        <Badge
          className={
            marketer.status == "active"
              ? "status-active"
              : marketer.status == "expired"
              ? "status-inactive"
              : "status-pending"
          }
        >
          {marketer.status == "active"
            ? "نشط"
            : marketer.status == "expired"
            ? "منتهي"
            : "معطل"}
        </Badge>
      ),
    },
    {
      key: "id",
      header: "اجراءات",
      render: (marketer) => (
        <div className="font-medium ps-5 flex gap-2">
          <button
            onClick={() => navigate(`editCode/${marketer.id}`)}
            className="text-muted-foreground hover:text-destructive"
          >
            <img src={Eye} alt="view" />
          </button>
          <button
            onClick={() => deleteCode(marketer.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <img src={Delete} alt="delete" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">الروابط و الأكواد</h1>
          <p className="text-muted-foreground mt-1">قائمة بجميع الروابط و الأكواد</p>
        </div>
      
        {activeTab === "links" ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Building className="h-4 w-4 ml-2" />
                إضافة رابط جديد
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <Link to="/LinksCodes/addReferral">يدوي</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/LinksCodes/UploadExcelReferral">رفع ملف</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Building className="h-4 w-4 ml-2" />
                إضافة كود جديد
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <Link to="/LinksCodes/addCode">يدوي</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/LinksCodes/UploadExcelCode">رفع ملف</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Stats Summary */}
      {activeTab === "links" ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="dashboard-card">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {ReferralNumbers?.referral_links_count}
              </div>
              <p className="text-muted-foreground text-sm">إجمالي عدد الروابط</p>
            </CardContent>
          </Card>
          <Card className="dashboard-card">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-success">
                {ReferralNumbers?.used_referral_links_count}
              </div>
              <p className="text-muted-foreground text-sm">عدد الروابط المخصّصة</p>
            </CardContent>
          </Card>
          <Card className="dashboard-card">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-destructive">
                {ReferralNumbers?.not_used_referral_links_count}
              </div>
              <p className="text-muted-foreground text-sm">عدد الروابط الغير مخصّصة</p>
            </CardContent>
          </Card>
          <Card className="dashboard-card">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-destructive">
                {ReferralNumbers?.inactive_referral_links_count}
              </div>
              <p className="text-muted-foreground text-sm">عدد الروابط المنتهية</p>
            </CardContent>
          </Card>
          <Card className="dashboard-card">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-warning">
                {ReferralNumbers?.used_referral_links_this_month_count}
              </div>
              <p className="text-muted-foreground text-sm">الروابط المخصّصة هذا الشهر</p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="dashboard-card">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {CodesNumbers?.discount_codes_count}
              </div>
              <p className="text-muted-foreground text-sm">إجمالي عدد الأكواد</p>
            </CardContent>
          </Card>
          <Card className="dashboard-card">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-success">
                {CodesNumbers?.used_discount_codes_count}
              </div>
              <p className="text-muted-foreground text-sm">عدد الأكواد المخصّصة</p>
            </CardContent>
          </Card>
          <Card className="dashboard-card">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-destructive">
                {CodesNumbers?.not_used_discount_codes_count}
              </div>
              <p className="text-muted-foreground text-sm">عدد الأكواد الغير مخصّصة</p>
            </CardContent>
          </Card>
          <Card className="dashboard-card">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-destructive">
                {CodesNumbers?.inactive_discount_codes_count}
              </div>
              <p className="text-muted-foreground text-sm">عدد الأكواد المنتهية</p>
            </CardContent>
          </Card>
          <Card className="dashboard-card">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-warning">
                {CodesNumbers?.used_discount_codes_this_month_count}
              </div>
              <p className="text-muted-foreground text-sm">الأكواد المخصّصة هذا الشهر</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filter */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>البحث والتصفية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="البحث..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pr-9"
                />
              </div>
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setReferralPage(1);
                setCodesPage(1);
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="تصفية حسب الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الحالات</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="expired">منتهي</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for switching between tables */}
      <Tabs value={activeTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-8" dir="rtl">
          <TabsTrigger
            value="links"
            onClick={() => setActiveTab("links")}
          >
            روابط الإحالة
          </TabsTrigger>
          <TabsTrigger
            value="codes"
            onClick={() => setActiveTab("codes")}
          >
            أكواد الخصم
          </TabsTrigger>
        </TabsList>
        
        {/* Referral Links Table */}
        <TabsContent value="links" className="space-y-4" dir="rtl">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>روابط الإحالة</CardTitle>
            </CardHeader>
            <GeneralTable
              data={Referral}
              columns={ReferralColumns}
              loading={loading}
              pagination={{
                page: referralPage,
                perPage: referralPerPage,
                total: referralTotalItems,
                onPageChange: (newPage) => setReferralPage(newPage),
                onPerPageChange: (newPerPage) => {
                  setReferralPerPage(newPerPage);
                  setReferralPage(1);
                },
              }}
            />
          </Card>
        </TabsContent>

        {/* Discount Codes Table */}
        <TabsContent value="codes" className="space-y-4" dir="rtl">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>أكواد الخصم</CardTitle>
            </CardHeader>
            <GeneralTable
              data={Codes}
              columns={CodeColumns}
              loading={loading}
              pagination={{
                page: codesPage,
                perPage: codesPerPage,
                total: codesTotalItems,
                onPageChange: (newPage) => setCodesPage(newPage),
                onPerPageChange: (newPerPage) => {
                  setCodesPerPage(newPerPage);
                  setCodesPage(1);
                },
              }}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}