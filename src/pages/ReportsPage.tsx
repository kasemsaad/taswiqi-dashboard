import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  ShoppingBag,
  Calendar,
  Download
} from "lucide-react";

const statsCards = [
  {
    title: "إجمالي العمولات المدفوعة",
    value: "245,680",
    unit: "ريال",
    change: "+12.5%",
    changeType: "increase",
    icon: Banknote,
    gradient: "gradient-success"
  },
  {
    title: "أكواد الخصم المستخدمة",
    value: "1,847",
    unit: "كود",
    change: "+8.2%",
    changeType: "increase", 
    icon: ShoppingBag,
    gradient: "gradient-warning"
  },
  {
    title: "المسوقين النشطين",
    value: "342",
    unit: "مسوق",
    change: "+15.3%",
    changeType: "increase",
    icon: Users,
    gradient: "gradient-primary"
  },
  {
    title: "الشركات المشاركة",
    value: "89",
    unit: "شركة",
    change: "+5.1%",
    changeType: "increase",
    icon: Building,
    gradient: "gradient-primary"
  }
];

const recentTransactions = [
  {
    id: 1,
    marketer: "أحمد محمد العلي",
    company: "متجر الأزياء الراقية",
    commission: "1,250 ريال",
    date: "منذ ساعة",
    status: "مكتملة"
  },
  {
    id: 2,
    marketer: "فاطمة خالد السعد",
    company: "إلكترونيات المستقبل",
    commission: "890 ريال",
    date: "منذ 3 ساعات",
    status: "قيد المراجعة"
  },
  {
    id: 3,
    marketer: "عبدالله صالح القحطاني",
    company: "مطعم الذوق الأصيل",
    commission: "450 ريال",
    date: "منذ 5 ساعات",
    status: "مكتملة"
  },
  {
    id: 4,
    marketer: "نورا عبدالرحمن",
    company: "صيدلية الشفاء",
    commission: "320 ريال",
    date: "اليوم",
    status: "مكتملة"
  }
];

const topMarketers = [
  { name: "أحمد محمد العلي", sales: "89,450 ريال", orders: 156, rank: 1 },
  { name: "فاطمة خالد السعد", sales: "67,890 ريال", orders: 134, rank: 2 },
  { name: "عبدالله صالح القحطاني", sales: "54,320 ريال", orders: 98, rank: 3 },
  { name: "نورا عبدالرحمن", sales: "45,670 ريال", orders: 87, rank: 4 },
  { name: "محمد أحمد الشهري", sales: "42,100 ريال", orders: 76, rank: 5 }
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">التقارير والإحصائيات</h1>
          <p className="text-muted-foreground mt-1">نظرة شاملة على أداء تطبيق تسويقي</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="week">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">اليوم</SelectItem>
              <SelectItem value="week">هذا الأسبوع</SelectItem>
              <SelectItem value="month">هذا الشهر</SelectItem>
              <SelectItem value="year">هذا العام</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 ml-2" />
            تصدير التقرير
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
                <span className={`text-sm font-medium ${
                  stat.changeType === "increase" ? "text-success" : "text-destructive"
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-muted-foreground">من الشهر الماضي</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              المعاملات الأخيرة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{transaction.marketer}</p>
                    <p className="text-sm text-muted-foreground">{transaction.company}</p>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                  </div>
                  <div className="text-left space-y-1">
                    <p className="font-bold text-success">{transaction.commission}</p>
                    <Badge 
                      className={transaction.status === "مكتملة" ? "status-active" : "status-pending"}
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Marketers */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              أفضل المسوقين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topMarketers.map((marketer) => (
                <div key={marketer.rank} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                    marketer.rank === 1 ? 'bg-yellow-500' :
                    marketer.rank === 2 ? 'bg-gray-400' :
                    marketer.rank === 3 ? 'bg-amber-600' : 'bg-primary'
                  }`}>
                    {marketer.rank}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{marketer.name}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>المبيعات: {marketer.sales}</span>
                      <span>الطلبات: {marketer.orders}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}