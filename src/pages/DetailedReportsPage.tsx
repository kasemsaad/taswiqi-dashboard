// import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  BarChart,
  Download,
  Users,
  Building,
  Percent,
  Link,
  Banknote,
  Award,
  MessageSquare,
  Mail,
  Shield,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar
} from "lucide-react";

const reportsData = [
  {
    title: "أكواد الخصم",
    icon: Percent,
    description: "تقرير شامل عن أكواد الخصم والاستخدام",
    stats: {
      total: "1,234",
      active: "987",
      used: "456",
      trend: "+12%"
    },
    color: "bg-blue-500"
  },
  {
    title: "روابط الإحالة",
    icon: Link,
    description: "إحصائيات روابط الإحالة والنقرات",
    stats: {
      total: "2,456",
      active: "2,123",
      clicks: "15,678",
      trend: "+8%"
    },
    color: "bg-green-500"
  },
  {
    title: "المسوقين",
    icon: Users,
    description: "تقرير أداء المسوقين والمبيعات",
    stats: {
      total: "567",
      active: "234",
      topPerformers: "12",
      trend: "+15%"
    },
    color: "bg-purple-500"
  },
  {
    title: "السحب",
    icon: Banknote,
    description: "طلبات السحب والمدفوعات",
    stats: {
      totalAmount: "125,000 ريال",
      pending: "45",
      completed: "234",
      trend: "+7%"
    },
    color: "bg-orange-500"
  },
  {
    title: "العمولات",
    icon: TrendingUp,
    description: "إجمالي العمولات المدفوعة والمستحقة",
    stats: {
      totalPaid: "89,500 ريال",
      pending: "23,400 ريال",
      thisMonth: "12,300 ريال",
      trend: "+22%"
    },
    color: "bg-emerald-500"
  },
  {
    title: "الشركات",
    icon: Building,
    description: "تقرير الشركات المسجلة والنشطة",
    stats: {
      total: "89",
      active: "67",
      newThisMonth: "5",
      trend: "+3%"
    },
    color: "bg-indigo-500"
  },
  {
    title: "الشارات والإنجازات",
    icon: Award,
    description: "الشارات الممنوحة والإنجازات المحققة",
    stats: {
      totalBadges: "234",
      awarded: "156",
      topAchievers: "23",
      trend: "+18%"
    },
    color: "bg-yellow-500"
  },
  {
    title: "المحادثات والدعم",
    icon: MessageSquare,
    description: "رسائل الدعم ومعدل الاستجابة",
    stats: {
      totalTickets: "345",
      resolved: "312",
      pending: "33",
      responseTime: "2.5 ساعة"
    },
    color: "bg-pink-500"
  },
  {
    title: "طلبات المسوقين",
    icon: Mail,
    description: "طلبات الانضمام والموافقات",
    stats: {
      total: "789",
      approved: "567",
      pending: "45",
      rejected: "177"
    },
    color: "bg-cyan-500"
  },
  {
    title: "التوثيق والتحقق",
    icon: Shield,
    description: "حالة التحقق من هوية المسوقين",
    stats: {
      verified: "456",
      pending: "89",
      rejected: "23",
      completion: "85%"
    },
    color: "bg-teal-500"
  },
  {
    title: "المجتمع والنشر",
    icon: MessageSquare,
    description: "منشورات المجتمع والتفاعل",
    stats: {
      totalPosts: "1,234",
      thisWeek: "67",
      engagement: "78%",
      reports: "12"
    },
    color: "bg-red-500"
  },
  {
    title: "البلاغات والمخالفات",
    icon: AlertTriangle,
    description: "البلاغات المقدمة والإجراءات المتخذة",
    stats: {
      total: "45",
      resolved: "34",
      pending: "11",
      warnings: "23"
    },
    color: "bg-amber-500"
  }
];

export default function DetailedReportsPage() {
  // const [selectedReport, setSelectedReport] = useState<any>(null);

  // const handleViewDetails = (report: any) => {
  const handleViewDetails = () => {
    // setSelectedReport(report);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">التقارير المفصلة</h1>
          <p className="text-muted-foreground mt-1">تقارير شاملة لجميع أقسام النظام</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 ml-2" />
            تحديد الفترة
          </Button>
          <Button>
            <Download className="h-4 w-4 ml-2" />
            تصدير التقارير
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportsData.map((report, index) => {
          const Icon = report.icon;
          const isPositiveTrend = report.stats.trend?.startsWith('+');
          
          return (
            <Card key={index} className="dashboard-card hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${report.color} bg-opacity-10`}>
                    <Icon className={`h-5 w-5 text-${report.color.split('-')[1]}-600`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{report.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(report.stats).map(([key, value]) => {
                    if (key === 'trend') return null;
                    
                    let label = '';
                    switch (key) {
                      case 'total': label = 'المجموع'; break;
                      case 'active': label = 'النشط'; break;
                      case 'used': label = 'المستخدم'; break;
                      case 'clicks': label = 'النقرات'; break;
                      case 'topPerformers': label = 'المتميزون'; break;
                      case 'totalAmount': label = 'المبلغ الكلي'; break;
                      case 'pending': label = 'معلق'; break;
                      case 'completed': label = 'مكتمل'; break;
                      case 'totalPaid': label = 'مدفوع'; break;
                      case 'thisMonth': label = 'هذا الشهر'; break;
                      case 'newThisMonth': label = 'جديد'; break;
                      case 'totalBadges': label = 'الشارات'; break;
                      case 'awarded': label = 'ممنوح'; break;
                      case 'topAchievers': label = 'المتفوقون'; break;
                      case 'totalTickets': label = 'التذاكر'; break;
                      case 'resolved': label = 'محلول'; break;
                      case 'responseTime': label = 'وقت الرد'; break;
                      case 'approved': label = 'موافق'; break;
                      case 'rejected': label = 'مرفوض'; break;
                      case 'verified': label = 'محقق'; break;
                      case 'completion': label = 'الإكمال'; break;
                      case 'totalPosts': label = 'المنشورات'; break;
                      case 'thisWeek': label = 'هذا الأسبوع'; break;
                      case 'engagement': label = 'التفاعل'; break;
                      case 'reports': label = 'البلاغات'; break;
                      case 'warnings': label = 'التحذيرات'; break;
                      default: label = key;
                    }
                    
                    return (
                      <div key={key} className="text-center">
                        <p className="text-2xl font-bold text-foreground">{value}</p>
                        <p className="text-xs text-muted-foreground">{label}</p>
                      </div>
                    );
                  })}
                </div>
                
                {report.stats.trend && (
                  <div className="flex items-center justify-center pt-2 border-t">
                    <Badge 
                      variant="secondary"
                      className={`flex items-center gap-1 ${
                        isPositiveTrend 
                          ? 'text-green-700 bg-green-100' 
                          : 'text-red-700 bg-red-100'
                      }`}
                    >
                      {isPositiveTrend ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {report.stats.trend}
                    </Badge>
                  </div>
                )}
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => handleViewDetails()}
                    >
                      <BarChart className="h-4 w-4 ml-2" />
                      عرض التفاصيل
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Icon className="h-5 w-5" />
                        تفاصيل تقرير {report.title}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
                      {Object.entries(report.stats).map(([key, value]) => {
                        if (key === 'trend') return null;
                        
                        let label = '';
                        let description = '';
                        switch (key) {
                          case 'total': 
                            label = 'المجموع الكلي'; 
                            description = 'العدد الإجمالي للعناصر';
                            break;
                          case 'active': 
                            label = 'النشط حالياً'; 
                            description = 'العناصر النشطة والفعالة';
                            break;
                          case 'used': 
                            label = 'المستخدم'; 
                            description = 'العناصر التي تم استخدامها';
                            break;
                          case 'clicks': 
                            label = 'إجمالي النقرات'; 
                            description = 'عدد النقرات الكلي';
                            break;
                          case 'topPerformers': 
                            label = 'المتميزون'; 
                            description = 'أفضل الأداءات';
                            break;
                          case 'totalAmount': 
                            label = 'المبلغ الإجمالي'; 
                            description = 'قيمة المبلغ الكلي';
                            break;
                          case 'pending': 
                            label = 'في الانتظار'; 
                            description = 'العناصر المعلقة';
                            break;
                          case 'completed': 
                            label = 'مكتمل'; 
                            description = 'العناصر المكتملة';
                            break;
                          case 'totalPaid': 
                            label = 'المدفوع'; 
                            description = 'المبلغ المدفوع';
                            break;
                          case 'thisMonth': 
                            label = 'هذا الشهر'; 
                            description = 'إحصائيات الشهر الحالي';
                            break;
                          case 'newThisMonth': 
                            label = 'الجديد هذا الشهر'; 
                            description = 'العناصر الجديدة';
                            break;
                          case 'totalBadges': 
                            label = 'إجمالي الشارات'; 
                            description = 'عدد الشارات الكلي';
                            break;
                          case 'awarded': 
                            label = 'تم منحها'; 
                            description = 'الشارات الممنوحة';
                            break;
                          case 'topAchievers': 
                            label = 'أفضل المتحققين'; 
                            description = 'أعلى الإنجازات';
                            break;
                          case 'totalTickets': 
                            label = 'إجمالي التذاكر'; 
                            description = 'عدد تذاكر الدعم';
                            break;
                          case 'resolved': 
                            label = 'تم حلها'; 
                            description = 'التذاكر المحلولة';
                            break;
                          case 'responseTime': 
                            label = 'متوسط وقت الرد'; 
                            description = 'الوقت المستغرق للرد';
                            break;
                          case 'approved': 
                            label = 'تمت الموافقة'; 
                            description = 'الطلبات المعتمدة';
                            break;
                          case 'rejected': 
                            label = 'مرفوض'; 
                            description = 'الطلبات المرفوضة';
                            break;
                          case 'verified': 
                            label = 'تم التحقق'; 
                            description = 'الحسابات المحققة';
                            break;
                          case 'completion': 
                            label = 'نسبة الإكمال'; 
                            description = 'معدل إكمال العملية';
                            break;
                          case 'totalPosts': 
                            label = 'إجمالي المنشورات'; 
                            description = 'عدد المنشورات الكلي';
                            break;
                          case 'thisWeek': 
                            label = 'هذا الأسبوع'; 
                            description = 'إحصائيات الأسبوع';
                            break;
                          case 'engagement': 
                            label = 'معدل التفاعل'; 
                            description = 'نسبة التفاعل مع المحتوى';
                            break;
                          case 'reports': 
                            label = 'البلاغات'; 
                            description = 'عدد البلاغات المقدمة';
                            break;
                          case 'warnings': 
                            label = 'التحذيرات'; 
                            description = 'عدد التحذيرات الصادرة';
                            break;
                          default: 
                            label = key;
                            description = 'معلومات إضافية';
                        }
                        
                        return (
                          <Card key={key} className="p-4">
                            <div className="text-center space-y-2">
                              <p className="text-3xl font-bold text-primary">{value}</p>
                              <p className="font-medium text-foreground">{label}</p>
                              <p className="text-xs text-muted-foreground">{description}</p>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                    {report.stats.trend && (
                      <div className="text-center py-4 border-t">
                        <Badge 
                          variant="secondary"
                          className={`flex items-center gap-2 justify-center text-base py-2 px-4 ${
                            report.stats.trend.startsWith('+') 
                              ? 'text-green-700 bg-green-100' 
                              : 'text-red-700 bg-red-100'
                          }`}
                        >
                          {report.stats.trend.startsWith('+') ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          اتجاه التغيير: {report.stats.trend}
                        </Badge>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}