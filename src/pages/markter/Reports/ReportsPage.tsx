import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GetAllReports } from "@/services/userService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Building,
  Banknote,
  Loader2
} from "lucide-react";

export default function ReportsPage() {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("this_week"); // ✅ الفلتر الافتراضي

  // ✅ النصوص المقابلة لكل فلتر
  const filterTextMap: Record<string, string> = {
    today: "من اليوم",
    this_week: "من الأسبوع الماضي",
    this_month: "من الشهر الماضي",
    this_year: "من السنة الماضية"
  };

  const filterLabel = useMemo(() => filterTextMap[timeFilter] || "", [timeFilter]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await GetAllReports({
          filter: timeFilter // ✅ API يستقبل القيمة الصحيحة
        });
        if (response.status) {
          setReportData(response.data);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [timeFilter]);

  if (loading && !reportData) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!reportData) {
    return <div className="text-center py-10">No report data available</div>;
  }

  const statsCards = [
    {
      title: "إجمالي المسوقيين",
      value: reportData.totalCustomers?.number || 0,
      unit: "مسوق",
      change: reportData.totalCustomers?.change || 0,
      changeType: (reportData.totalCustomers?.change || 0) >= 0 ? "increase" : "decrease",
      icon: Users,
      gradient: "bg-gradient-to-r from-blue-500 to-blue-600"
    },
    {
      title: "المسوقيين النشطين",
      value: reportData.activeCustomers?.number || 0,
      unit: "مسوق",
      change: reportData.activeCustomers?.change || 0,
      changeType: (reportData.activeCustomers?.change || 0) >= 0 ? "increase" : "decrease",
      icon: Users,
      gradient: "bg-gradient-to-r from-green-500 to-green-600"
    },
    {
      title: "إجمالي الأرباح",
      value: reportData.totalEarnings?.number || 0,
      unit: "ريال",
      change: reportData.totalEarnings?.change || 0,
      changeType: (reportData.totalEarnings?.change || 0) >= 0 ? "increase" : "decrease",
      icon: Banknote,
      gradient: "bg-gradient-to-r from-yellow-500 to-yellow-600"
    },
    {
      title: "الشركات المشاركة",
      value: reportData.totalBrands?.number || 0,
      unit: "شركة",
      change: reportData.totalBrands?.change || 0,
      changeType: (reportData.totalBrands?.change || 0) >= 0 ? "increase" : "decrease",
      icon: Building,
      gradient: "bg-gradient-to-r from-purple-500 to-purple-600"
    }
  ];

  // const handleExport = () => {
  // };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">التقارير والإحصائيات</h1>
          <p className="text-muted-foreground mt-1">نظرة شاملة على أداء تطبيق تسويقي</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex gap-3 w-full sm:w-auto">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">اليوم</SelectItem>
                <SelectItem value="this_week">هذا الأسبوع</SelectItem>
                <SelectItem value="this_month">هذا الشهر</SelectItem>
                <SelectItem value="this_year">هذا العام</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* <Button 
            variant="outline" 
            onClick={handleExport}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            تصدير التقرير
          </Button> */}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((stat, index) => (
              <Card key={index} className="dashboard-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.gradient}`}>
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <span className="text-sm text-muted-foreground">{stat.unit}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.changeType === "increase" ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      stat.changeType === "increase" ? "text-green-500" : "text-red-500"
                    }`}>
                      {Math.abs(stat.change)}%
                    </span>
                    <span className="text-sm text-muted-foreground">{filterLabel}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Customers */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  أفضل مسوقيين
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.topCustomers?.map((customer: any, index: number) => (
                    <div key={index} className="flex items-center gap-4 p-2 hover:bg-muted/50 rounded-lg transition-colors">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                        {customer.image && customer.image !== "default.png" ? (
                          <img 
                            src={customer.image} 
                            alt={customer.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary text-white">
                            {customer.name?.charAt(0) || "?"}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{customer.name || "غير معروف"}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>العملاء: {customer.total_clients || 0}</span>
                          <span>الأرباح: {customer.total_earnings || 0} ريال</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Last Withdraw Requests */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Banknote className="h-5 w-5" />
                  آخر طلبات السحب
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.lastWithdrawRequests?.map((request: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{request.name || "غير معروف"}</p>
                        <p className="text-sm text-muted-foreground">{request.email || "بريد غير معروف"}</p>
                        <p className="text-xs text-muted-foreground">{request.created_at || "تاريخ غير معروف"}</p>
                      </div>
                      <div className="text-left space-y-1">
                        <p className="font-bold">{request.amount || 0} ريال</p>
                        <Badge 
                          variant={request.status === "pending" ? "secondary" : "default"}
                          className={request.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}
                        >
                          {request.status === "pending" ? "قيد الانتظار" : "مكتمل"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
