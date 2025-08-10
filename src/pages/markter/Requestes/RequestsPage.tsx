import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Building } from "lucide-react";

import { Input } from "@/components/ui/input";
import { GeneralTable } from "@/components/ui/tableCustom";
import { TableColumn } from "@/components/ui/tableCustom";
import {
  GetRequests,
  GetNumbersRequstes,
  // GetAllCategories,
} from "@/services/userService";
import { Users } from "@/components/interfaces/Interfaces";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Search } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import company from "@/assets/icons/companies.svg";
import Linka from "@/assets/icons/link.svg";
// import { toast } from "@/hooks/use-toast";

export default function MarketersPage() {
  // const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  // const [statusFilter, setStatusFilter] = useState("");
  // const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [Request, setRequest] = useState([] as Users[]);
  // const [CategoriesRequests, setCategoriesRequests] = useState<any>(null);

  const [RequestNumbers, setRequestNumbers] = useState({
    activeRequest: 0,
    blockedRequest: 0,
    inactiveRequest: 0,
    totalRequest: 0,
  } as any);
  const [loading, setLoading] = useState(false);

  const fetchRequestData = async () => {
    try {
      // console.log("statusFilter:", statusFilter);
      // console.log("categoryFilter:", categoryFilter);
      setLoading(true);
      const response = await GetRequests({
        page,
        per_page: perPage,
        searchTerm: searchTerm || undefined,
        // filter:
        //   statusFilter !== "all" || categoryFilter !== "all"
        //     ? {
        //         is_active: statusFilter ?? null,
        //         category_id: categoryFilter ?? null,
        //       }
        //     : undefined,
      });
      const Requestpage = response as any;
      const RequestData = response.data as Users[];
      setRequest(RequestData);
      setPage(Requestpage.meta.current_page);
      setPerPage(Requestpage.meta.per_page);
      setTotalItems(Requestpage.meta.total);
    } catch (error) {
      console.error("Error fetching Request data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequstesNumbers = async () => {
    try {
      const response = await GetNumbersRequstes();
      const RequestData = response.data as any;
      setRequestNumbers(RequestData);
    } catch (error) {
      console.error("Error fetching country data:", error);
    }
  };
  // const fetchCategories = async () => {
  //   try {
  //     // const response = await GetAllCategories();
  //     // setCategoriesRequests(response.data || []);
  //   } catch (error) {
  //     console.error("Error fetching Categories:", error);
  //   }
  // };
 
  useEffect(() => {
    fetchRequestData();
    fetchRequstesNumbers();
    // fetchCategories();
  }, [page, perPage, searchTerm, ]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(1);
  };


  const marketersColumns: TableColumn[] = [
     {
    key: "id_column",  // Changed from "id" to make it unique
    header: "الرقم المرجعي",
    render: (marketer) => (
      <div className="space-y-1">
        <div className="text-sm">{marketer.id}</div>
      </div>
    ),
  },
    {
      key: "user",
      header: "أسم المسوّق",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.user}</div>
        </div>
      ),
    },
    {
      key: "type",
      header: "نوع الطلب",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">  {marketer.type=="referral_link"?"رابط إحاله":"كود خصم"}</div>
        </div>
      ),
    },
    {
      key: "brand",
      header: "أسم الشركة ",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.brand}</div>
        </div>
      ),
    },
    {
      key: "created_at",
      header: "تاريخ الطلب",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.created_at}</div>
        </div>
      ),
    },

     {
    key: "assignment_column",  // Changed from "id" to make it unique
    header: "إسناد",
    render: (marketer) => (
      <div className="font-medium ps-5">
        <Link
          to={marketer.type=="referral_link"?`/requests/addReferral/${marketer.id}`:`/requests/addCode/${marketer.id}`}
          className="text-muted-foreground hover:text-destructive"
        >
          <img src={Linka} alt="Link" />
        </Link>
      </div>
    ),
  },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="md:flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-foreground">طلبات المسوقين</h1>
          <p className="text-muted-foreground mt-1">
            إدارة ومراجعة جميع طلبات المسوقين
          </p>
        </div>
        {/* <Link to="/companies/add" className="">
          <Button>
            <Building className="h-4 w-4 ml-2" />
            إضافة شركة جديدة
          </Button>
        </Link> */}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="dashboard-card">
          <CardContent className="pt-6" 
          >
            <div className="text-2xl font-bold">
              {RequestNumbers?.totalCount}
            </div>
            <p className="text-muted-foreground text-sm"> إجمالي عدد الطلبات	</p>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="pt-6" 
          >
            <div className="text-2xl font-bold text-success">
              {RequestNumbers?.referralLinkRequestsCount}
            </div>
            <p className="text-muted-foreground text-sm"> عدد طلبات روابط الإحالة</p>
          </CardContent>
        </Card>
        <Card
          className="dashboard-card"
        >
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">
              {RequestNumbers?.discountCodeRequestsCount}
            </div>
            <p className="text-muted-foreground text-sm">عدد طلبات أكواد الخصم</p>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">
              {RequestNumbers?.topBrandLinks}
            </div>
            <p className="text-muted-foreground text-sm">
              {" "}
الشركة الأكثر طلبًا للروابط            </p>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">
              {RequestNumbers?.topBrandCodes}
            </div>
            <p className="text-muted-foreground text-sm">
              {" "}
الشركة الأكثر طلبًا للأكواد            </p>
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
       
          </div>
        </CardContent>
      </Card>

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>قائمة الطلبات </CardTitle>
        </CardHeader>
        <GeneralTable
          data={Request}
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
