import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { GeneralTable } from "@/components/ui/tableCustom";
import { TableColumn } from "@/components/ui/tableCustom";
import { GetCustomers, GetCustomersNumbers } from "@/services/userService";
import { Users } from "@/components/interfaces/Interfaces";
import Eye from "@/assets/icons/eye.svg";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export default function MarketersPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [Customers, setCustomer] = useState([] as Users[]);
  const [CustomerNumbers, setCustomerNumbers] = useState({
    activecustomers: 0,
    blockedCustomer: 0,
    inactiveCustomers: 0,
    totalCustomers: 0,
  } as any);
  const [loading, setLoading] = useState(false);

  const fetchCustomerData = async () => {
    try {
      console.log("statusFilter:", statusFilter);
      setLoading(true);
      const response = await GetCustomers({
        page,
        per_page: perPage,
        searchTerm: searchTerm || undefined,
        filter: statusFilter !== "all" ? { status: statusFilter } : undefined
      });
      const Customerpage = response as any;
      const CustomerData = response.data as Users[];
      setCustomer(CustomerData);
      setPage(Customerpage.meta.current_page);
      setPerPage(Customerpage.meta.per_page);
      setTotalItems(Customerpage.meta.total);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerNumbers = async () => {
    try {
      const response = await GetCustomersNumbers();
      const CustomerData = response.data as any;
      setCustomerNumbers(CustomerData);
    } catch (error) {
      console.error("Error fetching country data:", error);
    }
  };

  useEffect(() => {
    fetchCustomerData();
    fetchCustomerNumbers();
  }, [page, perPage, searchTerm, statusFilter]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(1);
  };


  const marketersColumns: TableColumn[] = [
    {
      key: "name",
      header: "المسوق",
      render: (marketer) => (
        <div>
          <div className="font-medium">{marketer.name}</div>
          <div className="text-sm text-muted-foreground">
            انضم في {marketer.joinDate}
          </div>
        </div>
      ),
    },
    {
      key: "country",
      header: "الدولة",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.country}</div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "معلومات التواصل",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.phone}</div>
        </div>
      ),
    },
    {
      key: "gender",
      header: "الجنس",
      render: (marketer) => (
        <div className="font-medium">
          {marketer.gender === "female" ? "أنثى" : "ذكر"}
        </div>
      ),
    },
    {
      key: "discountCodeCount",
      header: "عدد أكواد الخصم",
      render: (marketer) => (
        <div className="font-medium">{marketer.discountCodeCount}</div>
      ),
    },
    {
      key: "referralLinkCount",
      header: "عدد روابط الإحالة",
      render: (marketer) => (
        <div className="font-medium">{marketer.referralLinkCount}</div>
      ),
    },
    {
      key: "totalEarning",
      header: "العمولة",
      render: (marketer) => (
        <div className="font-medium text-success">{marketer.totalEarning}</div>
      ),
    },
    {
      key: "status",
      header: "الحالة",
      render: (marketer) => (
        <Badge
          className={
            marketer.status === "verified"
              ? "status-active"
              : marketer.status === "not_verified"
              ? "status-pending"
              : marketer.status === "blocked"
              ? "status-inactive"
              : "status-inactive"
          }
        >
          {marketer.status === "verified"
            ? "موثق"
            : marketer.status === "not_verified"
            ? "غير موثق"
            : marketer.status === "blocked"
            ? "محظور"
            : "لايوجد حالة"}
        </Badge>
      ),
    },
        {
      key: "id",
      header: "اجراءات",
      render: (marketer) => (
        <div className="font-medium ps-5 gap-2 flex">
          <button
            onClick={() => navigate(`/marketers/${marketer.id}`)}
            className="text-muted-foreground hover:text-destructive"
          >
            <img src={Eye} alt="view" />
          </button>
         
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">إدارة المسوقين</h1>
          <p className="text-muted-foreground mt-1">
            قائمة بجميع المسوقين المسجلين في التطبيق
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="dashboard-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {CustomerNumbers.totalCustomers}
            </div>
            <p className="text-muted-foreground text-sm">إجمالي المسوقين</p>
          </CardContent>
        </Card>
        <Card
          className="dashboard-card cursor-pointer hover:bg-muted/50"
          onClick={() => setStatusFilter("verified")}
        >
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">
              {CustomerNumbers.activecustomers}
            </div>
            <p className="text-muted-foreground text-sm">المسوقين الموثقين</p>
          </CardContent>
        </Card>
        <Card
          className="dashboard-card cursor-pointer hover:bg-muted/50"
          onClick={() => setStatusFilter("not_verified")}
        >
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">
              {CustomerNumbers.inactiveCustomers}
            </div>
            <p className="text-muted-foreground text-sm">
              المسوقين غير الموثقين
            </p>
          </CardContent>
        </Card>
        <Card
          className="dashboard-card cursor-pointer hover:bg-muted/50"
          onClick={() => setStatusFilter("blocked")}
        >
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">
              {CustomerNumbers.blockedCustomer}
            </div>
            <p className="text-muted-foreground text-sm">المسوقين المحظورين</p>
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
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="verified">موثق</SelectItem>
                <SelectItem value="not_verified">غير موثق</SelectItem>
                <SelectItem value="blocked">محظور</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>قائمة المسوقين </CardTitle>
        </CardHeader>
        <GeneralTable
          data={Customers}
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