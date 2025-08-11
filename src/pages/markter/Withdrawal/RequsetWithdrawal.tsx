import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Building } from "lucide-react";
import { Input } from "@/components/ui/input";
import { GeneralTable } from "@/components/ui/tableCustom";
import { TableColumn } from "@/components/ui/tableCustom";
import {
  // deleteDiscountCode,
  // deleteWithdrawRequestsLink,
  GetAllWithdrawRequests,
  GetCustomersWithBalance,
  // GetNumbersWithdrawRequestsLinks,
  // GetNumbersCodes,
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
// import { Button } from "@/components/ui/button";
import right from "@/assets/icons/right.svg";
import refused from "@/assets/icons/refused.svg";
import info from "@/assets/icons/info.svg";
// import Eye from "@/assets/icons/eye.svg";
// import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MarketersPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Separate pagination states for WithdrawRequests links
  const [WithdrawRequestsPage, setWithdrawRequestsPage] = useState(1);
  const [WithdrawRequestsPerPage, setWithdrawRequestsPerPage] = useState(10);
  const [WithdrawRequestsTotalItems, setWithdrawRequestsTotalItems] =
    useState(0);

  // Separate pagination states for discount codes
  const [codesPage, setCodesPage] = useState(1);
  const [codesPerPage, setCodesPerPage] = useState(10);
  const [codesTotalItems, setCodesTotalItems] = useState(0);

  const [WithdrawRequests, setWithdrawRequests] = useState<any>(null);
  const [Codes, setCodes] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"requestes" | "accountDetection">(
    "requestes"
  );
  const [loading, setLoading] = useState(false);

  // Fetch WithdrawRequests links data
  const fetchWithdrawRequests = async () => {
    try {
      setLoading(true);
      const response = await GetAllWithdrawRequests({
        page: WithdrawRequestsPage,
        per_page: WithdrawRequestsPerPage,
        searchTerm: searchTerm || undefined,
        filter: statusFilter !== "all" ? { status: statusFilter } : undefined,
      });

      setWithdrawRequests(response.data);
      if (response.meta) {
        setWithdrawRequestsTotalItems(response.meta.total);
      }
    } catch (error) {
      console.error("Error fetching WithdrawRequests data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch discount codes data
  const fetchCustomersWithBalance = async () => {
    try {
      setLoading(true);
      const response = await GetCustomersWithBalance({
        page: codesPage,
        per_page: codesPerPage,
        searchTerm: searchTerm || undefined,
        payment_status: statusFilter,
      });

      setCodes(response.data);
      if (response.meta) {
        setCodesTotalItems(response.meta.total);
      }
    } catch (error) {
      console.error("Error fetching accountDetection data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setWithdrawRequestsPage(1);
    setCodesPage(1);
  };

  // Fetch data when pagination or filters change
  useEffect(() => {
    if (activeTab === "requestes") {
      fetchWithdrawRequests();
    } else {
      fetchCustomersWithBalance();
    }
  }, [
    WithdrawRequestsPage,
    WithdrawRequestsPerPage,
    codesPage,
    codesPerPage,
    searchTerm,
    statusFilter,
    activeTab,
  ]);

  // Columns for discount codes table
  const requestColumns: TableColumn[] = [
    {
      key: "id_column",
      header: "الرقم المرجعي",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.id}</div>
        </div>
      ),
    },
    {
      key: "customer",
      header: "أسم المسوّق",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.customer}</div>
        </div>
      ),
    },
    {
      key: "total",
      header: "المبلغ",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.total}</div>
        </div>
      ),
    },
    {
      key: "type",
      header: "وسيلة السحب",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.type}</div>
        </div>
      ),
    },
    {
      key: "created_at",
      header: "تاريخ الطلب ",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.created_at}</div>
        </div>
      ),
    },
    {
      key: "status",
      header: "الحالة",
      render: (marketer) => (
        <Badge
          className={
            marketer.status == "approved"
              ? "status-active"
              : marketer.status == "rejected"
              ? "status-inactive"
              : "status-pending"
          }
        >
          {marketer.status == "approved"
            ? "ناجحة"
            : marketer.status == "rejected"
            ? "مرفوضة"
            : "قيد الإنتظار"}
        </Badge>
      ),
    },
    {
      key: "id",
      header: "التفاصيل",
      render: (marketer) => (
        <div className="font-medium ps-5 flex gap-2">
          <button
            onClick={() => navigate(`info/${marketer.id}`)}
            className="text-muted-foreground hover:text-destructive"
          >
            <img src={info} alt="info" />
          </button>
        </div>
      ),
    },
  ];
  //  Columns for WithdrawRequests links table
  const accountDetectionColumns: TableColumn[] = [
    {
      key: "name",
      header: "أسم المسوّق",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.name}</div>
        </div>
      ),
    },
    {
      key: "total_earnings",
      header: "إجمالي الأرباح",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.total_earnings}</div>
        </div>
      ),
    },
    {
      key: "withdrawn_amount",
      header: "سحب سابقًا",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.withdrawn_amount}</div>
        </div>
      ),
    },
    {
      key: "total_balance",
      header: "المتبقي له",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.total_balance}</div>
        </div>
      ),
    },
    {
      key: "can_withdraw",
      header: "مؤهل للسحب؟",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">
            {marketer.can_withdraw ? (
              <img src={right} alt="right" />
            ) : (
              <img src={refused} alt="refused" />
            )}
          </div>
        </div>
      ),
    },
    {
      key: "id",
      header: "كشف حساب",
      render: (marketer) => (
        <div className="font-medium ps-5 flex gap-2">
          <button
            onClick={() => navigate(`infoCustomers/${marketer.id}`)}
            className="text-muted-foreground hover:text-destructive"
          >
            <img src={info} alt="info" />
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
          <h1 className="text-xl md:text-3xl font-bold text-foreground">
            {" "}
            طلبات السحب
          </h1>
          <p className="text-muted-foreground mt-1">قائمة بجميع طلبات السحب </p>
        </div>
      </div>
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
            {activeTab == "requestes" && (
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setWithdrawRequestsPage(1);
                  setCodesPage(1);
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="تصفية حسب الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الحالات</SelectItem>
                  <SelectItem value="approved">ناجحة</SelectItem>
                  <SelectItem value="rejected">مرفوضة</SelectItem>
                  <SelectItem value="pending">قيد الإنتظار</SelectItem>
                </SelectContent>
              </Select>
            )}
            {activeTab == "accountDetection" && (
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setWithdrawRequestsPage(1);
                  setCodesPage(1);
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="تصفية حسب المؤهل " />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">المؤهلات</SelectItem>
                  <SelectItem value="qualified">مؤهل</SelectItem>
                  <SelectItem value="Disqualified">غير مؤهل</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs for switching between tables */}
      <Tabs value={activeTab}>
        <div className="relative" dir="rtl">
          <TabsList
            className="flex w-full flex-wrap justify-end" // justify-end for RTL
            dir="rtl"
          >
            <TabsTrigger
              value="requestes"
              onClick={() => setActiveTab("requestes")}
              className="flex-1 min-w-[120px] text-center"
            >
              طلبات السحب{" "}
            </TabsTrigger>
            <TabsTrigger
              value="accountDetection"
              onClick={() => setActiveTab("accountDetection")}
              className="flex-1 min-w-[120px] text-center"
            >
              كشف حساب المسوّقين{" "}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* WithdrawRequests Links Table */}
        <TabsContent value="requestes" className="space-y-4" dir="rtl">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>طلبات السحب </CardTitle>
            </CardHeader>
            <GeneralTable
              data={WithdrawRequests}
              columns={requestColumns}
              loading={loading}
              pagination={{
                page: WithdrawRequestsPage,
                perPage: WithdrawRequestsPerPage,
                total: WithdrawRequestsTotalItems,
                onPageChange: (newPage) => setWithdrawRequestsPage(newPage),
                onPerPageChange: (newPerPage) => {
                  setWithdrawRequestsPerPage(newPerPage);
                  setWithdrawRequestsPage(1);
                },
              }}
            />
          </Card>
        </TabsContent>

        {/* Discount Codes Table */}
        <TabsContent value="accountDetection" className="space-y-4" dir="rtl">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle> كشف حساب المسوّقين </CardTitle>
            </CardHeader>
            <GeneralTable
              data={Codes}
              columns={accountDetectionColumns}
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
