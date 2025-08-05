import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Delete from "../../../assets/icons/delete.svg";
import { Input } from "@/components/ui/input";
import { GeneralTable } from "@/components/ui/tableCustom";
import { TableColumn } from "@/components/ui/tableCustom";
import {
  // deleteDiscountCode,
  // deleteApprovalLink,
  GetAllApproval,
  DeleteApproval,

  // GetNumbersApprovalLinks,
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
import info from "@/assets/icons/info.svg";
// import Eye from "@/assets/icons/eye.svg";
// import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent } from "@/components/ui/tabs";

export default function MarketersPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Separate pagination states for Approval links
  const [ApprovalPage, setApprovalPage] = useState(1);
  const [ApprovalPerPage, setApprovalPerPage] = useState(10);
  const [ApprovalTotalItems, setApprovalTotalItems] = useState(0);

  // Separate pagination states for discount codes
  const [codesPage, setCodesPage] = useState(1);

  const [Approval, setApproval] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  // Fetch Approval links data
  const fetchApproval = async () => {
    try {
      setLoading(true);
      const response = await GetAllApproval({
        page: ApprovalPage,
        per_page: ApprovalPerPage,
        searchTerm: searchTerm || undefined,
        filter: statusFilter !== "all" ? { status: statusFilter } : undefined,
      });

      setApproval(response.data);
      if (response.meta) {
        setApprovalTotalItems(response.meta.total);
      }
    } catch (error) {
      console.error("Error fetching Approval data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch discount codes data


  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setApprovalPage(1);
    setCodesPage(1);
  };


  // Fetch data when pagination or filters change
  useEffect(() => {
      fetchApproval();
  }, [
    ApprovalPage,
    ApprovalPerPage,
    codesPage,
    searchTerm,
    statusFilter,
  ]);

  // Columns for discount codes table
  const requestColumns: TableColumn[] = [
    {
      key: "id",
      header: "الرقم المرجعي",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.id}</div>
        </div>
      ),
    },
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
      key: "admin",
      header: "أسم المحرر",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.admin}</div>
        </div>
      ),
    },
    {
      key: "reason",
      header: "السبب",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.reason}</div>
        </div>
      ),
    },
    {
      key: "type",
      header: "نوع الهويه",
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
            onClick={() => navigate(`edit/${marketer.id}`)}
            className="text-muted-foreground hover:text-destructive"
          >
            <img src={info} alt="info" />
          </button>
          <button
            onClick={() => DeleteApproval(marketer.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <img src={Delete} alt="delete" />
          </button>
        </div>
      ),
    },
  ];
  //  Columns for Approval links table
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="md:flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-foreground"> طلبات التحقق من الهوية  </h1>
          <p className="text-muted-foreground mt-1">قائمة بجميع طلبات التحقق من الهوية  </p>
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
          <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setApprovalPage(1);
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
          </div>
        </CardContent>
      </Card>

      {/* Tabs for switching between tables */}
      <Tabs  className="space-y-4" dir="rtl">
        {/* Approval Links Table */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle> طلبات التحقق من الهوية </CardTitle>
            </CardHeader>
            <GeneralTable
              data={Approval}
              columns={requestColumns}
              loading={loading}
              pagination={{
                page: ApprovalPage,
                perPage: ApprovalPerPage,
                total: ApprovalTotalItems,
                onPageChange: (newPage) => setApprovalPage(newPage),
                onPerPageChange: (newPerPage) => {
                  setApprovalPerPage(newPerPage);
                  setApprovalPage(1);
                },
              }}
            />
          </Card>

      
      </Tabs>
    </div>
  );
}
