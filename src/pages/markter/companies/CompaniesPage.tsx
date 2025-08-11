import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building,
 
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { GeneralTable } from "@/components/ui/tableCustom";
import { TableColumn } from "@/components/ui/tableCustom";
import { GetBrands, GetNumbersComanies,GetAllCategories, deleteBrands } from "@/services/userService";
import { Users } from "@/components/interfaces/Interfaces";
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
import company from "@/assets/icons/companies.svg";
import Delete from "@/assets/icons/delete.svg";
import { toast } from "@/hooks/use-toast";

export default function MarketersPage() {
  // const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [Brand, setBrand] = useState([] as Users[]);
 const [CategoriesRequests, setCategoriesRequests] = useState<any>(null);

  const [BrandNumbers, setBrandNumbers] = useState({
    activeBrand: 0,
    blockedBrand: 0,
    inactiveBrand: 0,
    totalBrand: 0,
  } as any);
  const [loading, setLoading] = useState(false);

  const fetchBrandData = async () => {
    try {
      setLoading(true);
      const response = await GetBrands({
        page,
        per_page: perPage,
        searchTerm: searchTerm || undefined,
        filter: statusFilter !== "all"||categoryFilter !== "all" ? { is_active: statusFilter ??null,category_id: categoryFilter ??null} : undefined,
      });
      const Brandpage = response as any;
      const BrandData = response.data as Users[];
      setBrand(BrandData);
      setPage(Brandpage.meta.current_page);
      setPerPage(Brandpage.meta.per_page);
      setTotalItems(Brandpage.meta.total);
    } catch (error) {
      console.error("Error fetching Brand data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrandNumbers = async () => {
    try {
      const response = await GetNumbersComanies();
      const BrandData = response.data as any;
      setBrandNumbers(BrandData);
    } catch (error) {
      console.error("Error fetching country data:", error);
    }
  };
 const fetchCategories = async () => {
    try {
      const response = await GetAllCategories();
      setCategoriesRequests(response.data || []);
    } catch (error) {
      console.error("Error fetching Categories:", error);
    }
  };
 const deleteBrandsFunction = async (id) => {
    try {
      await deleteBrands(id);
          fetchBrandData();

     toast({
        title:   " الحذف تم",
        description:
          "تم حذف الشركة بنجاح",
        variant:
         "destructive",
      });    } catch (error) {
         toast({
        title:   "خطأ في الحذف",
        description:
          "حدث خطأ أثناء حذف الشركة",
          
        variant:
         "destructive",
      }); 
      console.error("Error fetching Categories:", error);
    }
  };
  useEffect(() => {
    fetchBrandData();
    fetchBrandNumbers();
    fetchCategories();
  }, [page, perPage, searchTerm, statusFilter,categoryFilter  ]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(1);
  };

  // const handleViewProfile = (marketer: any) => {
  //   navigate(`/marketers/${marketer.id}`);
  // };

  const marketersColumns: TableColumn[] = [
      {
    key: "logo_column",  // Changed from "logo" to be more specific
    header: "الشعار",
    render: (marketer) => (
      <div>
        <div className="font-medium">
          <a href={`/companies/${marketer.id}`}>
            <img width={70} height={70} src={marketer.logo} alt="company" />
          </a>
        </div>
      </div>
    ),
  },
    {
      key: "name",
      header: "أسم الشركة",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.name}</div>
        </div>
      ),
    },
    {
      key: "category",
      header: "المجال",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.category}</div>
        </div>
      ),
    },
    {
      key: "highest_referral_link",
      header: "عمولة روابط الإحالة",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.highest_referral_link+" %"}</div>
        </div>
      ),
    },
    {
      key: "highest_discount_code",
      header: "عمولة أكواد الخصم",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.highest_discount_code+" %"}</div>
        </div>
      ),
    },
    {
      key: "ReferralLinkCount",
      header: "عدد روابط الإحالة",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.ReferralLinkCount}</div>
        </div>
      ),
    },
    {
      key: "DiscountCodeCount",
      header: "عدد أكواد الخصم",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.DiscountCodeCount}</div>
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
      key: "is_active",
      header: "الحالة",
      render: (marketer) => (
        <Badge
          className={marketer.is_active ? "status-active" : "status-inactive"}
        >
          {marketer.is_active 
            ? "نشط"
            : "غير نشط"}
        </Badge>
      ),
    },
       {
    key: "company_profile_column",  // Changed from "id"
    header: "ملف الشركة",
    render: (marketer) => (
      <div className="font-medium ps-5">
        <Link to={`/companies/edit/${marketer.id}`}>
          <img src={company} alt="company" />
        </Link>
      </div>
    ),
  },
  {
    key: "actions_column",  // Changed from "id"
    header: "اجراءات",
    render: (marketer) => (
      <div className="font-medium ps-5">
        <button 
          onClick={() => { deleteBrandsFunction(marketer.id) }} 
          className="text-muted-foreground hover:text-destructive"
        >
          <img src={Delete} alt="company" />
        </button>
      </div>
    ),
  },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="md:flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-foreground">إدارة الشركات</h1>
            قائمة بجميع الشركات الشريكة في التطبيق
          
        </div>
        <Link to="/companies/add" className="">
          <Button>
            <Building className="h-4 w-4 ml-2" />
            إضافة شركة جديدة
          </Button>
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="dashboard-card">
          <CardContent className="pt-6"           onClick={() => setStatusFilter("")}
>
            <div className="text-2xl font-bold">
              {BrandNumbers?.totalBrands}
            </div>
            <p className="text-muted-foreground text-sm">إجمالي الشركات</p>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="pt-6"  onClick={() => setStatusFilter("true")}>
            <div className="text-2xl font-bold text-success">
              {BrandNumbers?.activeBrands}
            </div>
            <p className="text-muted-foreground text-sm" >الشركات النشطة</p>
          </CardContent>
        </Card>
        <Card className="dashboard-card" onClick={() => setStatusFilter("false")}>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">
              {BrandNumbers?.inactiveBrands}
            </div>
            <p className="text-muted-foreground text-sm">الشركات موقوفة</p>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">
              {BrandNumbers?.brandsLastMounth}
            </div>
            <p className="text-muted-foreground text-sm">
              {" "}
              الشركات المضافة هذا الشهر
            </p>
          </CardContent>
        </Card>
      </div>

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
                setPage(1);
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="تصفية حسب الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الحالات</SelectItem>
                <SelectItem value="true">نشط</SelectItem>
                <SelectItem value="false">غير نشط</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={categoryFilter}
              onValueChange={(value) => {
                setCategoryFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="تصفية حسب المجالات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">المجالات</SelectItem>
               {   CategoriesRequests?.map((category: any) => (
                <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>قائمة الشركات</CardTitle>
        </CardHeader>
        <GeneralTable
          data={Brand}
          columns={marketersColumns}
          loading={loading}
          // actions={{
          //   view: handleViewProfile,
          // }}
          pagination={{
            page,
            perPage,
            total: totalItems,
            onPageChange: setPage,
            onPerPageChange: (newPerPage) => {
              setPerPage(newPerPage);
              setPage(1);
            },
          }}
        />
      </Card>
    </div>
  );
}
