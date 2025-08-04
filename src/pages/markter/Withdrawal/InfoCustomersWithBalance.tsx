import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Save, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  GetCustomersWalletTransactions,
  WithdrawStatus,
} from "@/services/userService";
import { GeneralTable } from "@/components/ui/tableCustom";
import { TableColumn } from "@/components/ui/tableCustom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const InfoRequestPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [requestData, setRequestData] = useState<any>(null);
  const [transactionsData, setTransactionsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(1); // Reset to first page when searching
  };

  const marketersColumns: TableColumn[] = [
    {
      key: "code",
      header: "الرقم المرجعي",
      render: (marketer) => (
        <div>
          <div className="font-medium">{marketer.code}</div>
        </div>
      ),
    },
    {
      key: "created_at",
      header: "التاريخ",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="font-medium">{marketer.created_at}</div>
        </div>
      ),
    },
    {
      key: "type",
      header: "نوع العملية",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">
            {marketer.type === "withdraw" 
              ? "سحب" 
              : marketer.type === "referral_link_earnings" 
                ? "عمولة رابط إحاله" 
                : "عمولة كود خصم"}
          </div>
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
      key: "withdraw_method",
      header: "وسيلة السحب",
      render: (marketer) => (
        <div className="font-medium">{marketer.withdraw_method || "-"}</div>
      ),
    }, 
  ];

  interface WalletTransactionsResponse {
    data: {
      customer_info: any;
      transactions_data: {
        transactions: any[];
        meta: {
          current_page: number;
          per_page: number;
          total: number;
          last_page: number;
        };
      };
    };
  }

  const fetchRequestData = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const response = await GetCustomersWalletTransactions(
        id as string,
        {
          page,
          per_page: perPage,
          searchTerm: searchTerm || undefined,
          type: statusFilter !== "all" ? statusFilter : undefined
        }
      ) as WalletTransactionsResponse;

      setRequestData(response.data.customer_info);
      setTransactionsData(response.data.transactions_data.transactions);
      
      const { meta } = response.data.transactions_data;
      setPage(meta.current_page);
      setPerPage(meta.per_page);
      setTotalItems(meta.total);
      
    } catch (error) {
      console.error("Error fetching request data:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب بيانات الطلب",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestData();
  }, [id, page, perPage, searchTerm, statusFilter]);

  if (isLoading && !requestData) {
    return <div className="container mx-auto p-6">جاري التحميل...</div>;
  }

  if (!requestData) {
    return <div className="container mx-auto p-6">لا يوجد بيانات للطلب</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/requsetWithdrawal")}
          className="gap-2"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          العوده طلبات السحب
        </Button>
        <h1 className="text-2xl font-bold">تفاصيل كشف حساب</h1>
      </div>

      <form className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>معلومات {requestData.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>أسم المسوّق</Label>
                <Input value={requestData.name} disabled />
              </div>
              <div className="space-y-2">
                <Label>إجمالي الأرباح</Label>
                <Input value={`${requestData.totalEarnings} Rs`} disabled />
              </div>
              <div className="space-y-2">
                <Label>سحب سابقًا</Label>
                <Input value={`${requestData.withdrawn_amount} Rs`} disabled />
              </div>
              <div className="space-y-2">
                <Label>المتبقي له</Label>
                <Input value={`${requestData.total_balance} Rs`} disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        {requestData?.status === "pending" && (
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              className="bg-red-600 text-white"
              variant="outline"
              onClick={() => {
                WithdrawStatus(requestData?.id, "rejected");
                toast({
                  title: "تم رفض الطلب",
                  description: "بنجاح تم رفض الطلب",
                  variant: "destructive",
                });
                setTimeout(() => {
                  navigate("/requsetWithdrawal");
                }, 1000);
              }}
            >
              رفض الطلب
            </Button>
            <Button
              className="bg-green-600 gap-2"
              onClick={() => {
                WithdrawStatus(requestData?.id, "approved");
                toast({
                  title: "تم الموافقة علي الطلب",
                  description: "بنجاح تم الموافقة الطلب",
                  variant: "success",
                });
                setTimeout(() => {
                  navigate("/requsetWithdrawal");
                }, 1000);
              }}
            >
              <Save className="w-4 h-4" />
              الموافقة على الطلب
            </Button>
          </div>
        )}
      </form>

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
                <SelectValue placeholder="تصفية حسب نوع العملية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع أنوع العمليات</SelectItem>
                <SelectItem value="withdraw">سحب</SelectItem>
                <SelectItem value="referral_link_earnings">عمولة رابط إحاله</SelectItem>
                <SelectItem value="discount_code_earnings">عمولة كود الخصم</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>كشف الحساب</CardTitle>
        </CardHeader>
        <GeneralTable
          data={transactionsData}
          columns={marketersColumns}
          loading={isLoading}
          pagination={{
            page,
            perPage,
            total: totalItems,
            onPageChange: setPage,
            onPerPageChange: (newPerPage) => {
              setPerPage(newPerPage);
              setPage(1); // Reset to first page when changing page size
            },
          }}
        />
      </Card>
    </div>
  );
};

export default InfoRequestPage;