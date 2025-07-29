import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, CheckCircle, XCircle, Clock, Eye } from "lucide-react";

// Available discount codes and referral links data
const companiesData = [
  {
    id: 1,
    name: "شركة الأزياء الراقية",
    discountCodes: ["FASHION20", "STYLE25", "WINTER30"],
    referralLinks: ["https://fashion.com/ref/link1", "https://fashion.com/ref/link2"]
  },
  {
    id: 2,
    name: "متجر الإلكترونيات الحديث",
    discountCodes: ["TECH15", "GADGET20"],
    referralLinks: ["https://electronics.com/ref/link1"]
  },
  {
    id: 3,
    name: "شركة المنتجات المنزلية",
    discountCodes: [],
    referralLinks: ["https://home.com/ref/link1", "https://home.com/ref/link2", "https://home.com/ref/link3"]
  }
];

const requestsData = [
  {
    id: 1001,
    marketerName: "أحمد محمد العلي",
    marketerEmail: "ahmed.ali@example.com",
    type: "طلب كود خصم",
    description: "شركة الأزياء الراقية",
    details: "طلب الحصول على كود خصم لشركة الأزياء الراقية لبيع منتجاتها عبر منصات التواصل الاجتماعي",
    status: "قيد المراجعة",
    priority: "متوسط",
    submitDate: "2024-01-20",
    submitTime: "14:30",
    lastUpdate: "منذ ساعة",
    companyId: 1,
    availableItems: companiesData[0].discountCodes,
    requestType: "discount"
  },
  {
    id: 1002,
    marketerName: "فاطمة خالد السعد",
    marketerEmail: "fatima.saad@example.com",
    type: "رابط إحالة",
    description: "متجر الإلكترونيات الحديث",
    details: "طلب رابط إحالة لمتجر الإلكترونيات الحديث لترويج المنتجات التقنية",
    status: "موافق عليه",
    priority: "منخفض",
    submitDate: "2024-01-18",
    submitTime: "09:15",
    lastUpdate: "منذ يوم",
    companyId: 2,
    availableItems: companiesData[1].referralLinks,
    requestType: "referral"
  },
  {
    id: 1003,
    marketerName: "عبدالله صالح القحطاني",
    marketerEmail: "abdullah.q@example.com",
    type: "طلب كود خصم",
    description: "شركة المنتجات المنزلية",
    details: "طلب كود خصم لشركة المنتجات المنزلية لاستهداف العائلات والمنازل",
    status: "انتظار",
    priority: "عالي",
    submitDate: "2024-01-19",
    submitTime: "16:45",
    lastUpdate: "منذ 3 ساعات",
    companyId: 3,
    availableItems: companiesData[2].discountCodes,
    requestType: "discount"
  },
  {
    id: 1004,
    marketerName: "نورا عبدالرحمن",
    marketerEmail: "nora.abd@example.com",
    type: "رابط إحالة",
    description: "شركة المنتجات المنزلية",
    details: "طلب رابط إحالة لشركة المنتجات المنزلية لتسويق منتجات المطبخ والحمام",
    status: "مكتمل",
    priority: "منخفض",
    submitDate: "2024-01-17",
    submitTime: "11:20",
    lastUpdate: "منذ 3 أيام",
    companyId: 3,
    availableItems: companiesData[2].referralLinks,
    requestType: "referral"
  },
  {
    id: 1005,
    marketerName: "محمد أحمد الشهري",
    marketerEmail: "mohamed.shahri@example.com",
    type: "طلب كود خصم",
    description: "شركة الأزياء الراقية",
    details: "طلب كود خصم لشركة الأزياء الراقية لاستهداف فئة الشباب",
    status: "مرفوض",
    priority: "عالي",
    submitDate: "2024-01-15",
    submitTime: "08:30",
    lastUpdate: "منذ 5 أيام",
    companyId: 1,
    availableItems: companiesData[0].discountCodes,
    requestType: "discount"
  }
];

export default function RequestsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<typeof requestsData[0] | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [response, setResponse] = useState("");
  const [selectedItem, setSelectedItem] = useState("");

  const filteredRequests = requestsData.filter(request => {
    const matchesSearch = request.marketerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesType = typeFilter === "all" || request.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleViewRequest = (request: typeof requestsData[0]) => {
    setSelectedRequest(request);
    setIsViewDialogOpen(true);
  };

  const handleStatusChange = (newStatus: string) => {
    if (selectedRequest) {
      // Handle status change logic
      console.log(`Changing status to: ${newStatus}`, { request: selectedRequest, selectedItem, response });
      setIsViewDialogOpen(false);
      setResponse("");
      setSelectedItem("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">طلبات المسوقين</h1>
          <p className="text-muted-foreground mt-1">إدارة ومراجعة جميع طلبات المسوقين</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="dashboard-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">247</div>
            <p className="text-muted-foreground text-sm">إجمالي الطلبات</p>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">38</div>
            <p className="text-muted-foreground text-sm">قيد المراجعة</p>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">156</div>
            <p className="text-muted-foreground text-sm">موافق عليها</p>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">53</div>
            <p className="text-muted-foreground text-sm">مرفوضة</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
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
                  placeholder="البحث بالاسم أو نوع الطلب..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="تصفية حسب الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="قيد المراجعة">قيد المراجعة</SelectItem>
                <SelectItem value="موافق عليه">موافق عليه</SelectItem>
                <SelectItem value="مرفوض">مرفوض</SelectItem>
                <SelectItem value="مكتمل">مكتمل</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="تصفية حسب النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="طلب كود خصم">طلب كود خصم</SelectItem>
                <SelectItem value="رابط إحالة">رابط إحالة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>قائمة الطلبات ({filteredRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="rtl-table">
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الطلب</TableHead>
                  <TableHead>المسوق</TableHead>
                  <TableHead>نوع الطلب</TableHead>
                  <TableHead>الشركة</TableHead>
                  <TableHead>المتوفر للاختيار</TableHead>
                  <TableHead>الأولوية</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ التقديم</TableHead>
                  <TableHead>آخر تحديث</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="font-medium">#{request.id}</div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.marketerName}</div>
                        <div className="text-sm text-muted-foreground">{request.marketerEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{request.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{request.description}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {request.availableItems.length > 0 ? (
                          <Badge variant="secondary">
                            {request.availableItems.length} متوفر
                          </Badge>
                        ) : (
                          <Badge variant="destructive">لا يوجد مخزون</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        request.priority === "عالي" ? "bg-red-100 text-red-800" :
                        request.priority === "متوسط" ? "bg-yellow-100 text-yellow-800" :
                        "bg-green-100 text-green-800"
                      }>
                        {request.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        request.status === "موافق عليه" || request.status === "مكتمل" ? "status-active" :
                        request.status === "مرفوض" ? "status-inactive" : "status-pending"
                      }>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{request.submitDate}</div>
                      <div className="text-xs text-muted-foreground">{request.submitTime}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">{request.lastUpdate}</div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewRequest(request)}
                      >
                        <Eye className="h-4 w-4 ml-2" />
                        عرض
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Request Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تفاصيل الطلب</DialogTitle>
            <DialogDescription>
              مراجعة تفاصيل الطلب واتخاذ الإجراء المناسب
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">رقم الطلب</label>
                  <p className="text-sm text-muted-foreground">#{selectedRequest.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">اسم المسوق</label>
                  <p className="text-sm text-muted-foreground">{selectedRequest.marketerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">البريد الإلكتروني</label>
                  <p className="text-sm text-muted-foreground">{selectedRequest.marketerEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">نوع الطلب</label>
                  <p className="text-sm text-muted-foreground">{selectedRequest.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">الشركة المطلوبة</label>
                  <p className="text-sm text-muted-foreground">{selectedRequest.description}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">الأولوية</label>
                  <Badge className={
                    selectedRequest.priority === "عالي" ? "bg-red-100 text-red-800" :
                    selectedRequest.priority === "متوسط" ? "bg-yellow-100 text-yellow-800" :
                    "bg-green-100 text-green-800"
                  }>
                    {selectedRequest.priority}
                  </Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">التفاصيل</label>
                <p className="text-sm text-muted-foreground mt-1">{selectedRequest.details}</p>
              </div>

              {selectedRequest.availableItems.length > 0 ? (
                <div>
                  <label className="text-sm font-medium">
                    اختيار {selectedRequest.requestType === 'discount' ? 'كود الخصم' : 'رابط الإحالة'}
                  </label>
                  <Select value={selectedItem} onValueChange={setSelectedItem}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={`اختر ${selectedRequest.requestType === 'discount' ? 'كود الخصم' : 'رابط الإحالة'}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedRequest.availableItems.map((item, index) => (
                        <SelectItem key={index} value={item}>{item}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive font-medium">لا يوجد مخزون متاح</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    لا توجد {selectedRequest.requestType === 'discount' ? 'أكواد خصم' : 'روابط إحالة'} متاحة لهذه الشركة حالياً
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium">الرد على الطلب</label>
                <Textarea 
                  placeholder="اكتب ردك هنا..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={() => handleStatusChange("مرفوض")}>
              <XCircle className="h-4 w-4 ml-2" />
              رفض
            </Button>
            <Button variant="outline" onClick={() => handleStatusChange("انتظار")}>
              <Clock className="h-4 w-4 ml-2" />
              انتظار
            </Button>
            <Button variant="secondary" onClick={() => handleStatusChange("قيد المعالجة")}>
              قيد المعالجة
            </Button>
            <Button variant="default" onClick={() => handleStatusChange("موافقة")}>
              <CheckCircle className="h-4 w-4 ml-2" />
              موافقة
            </Button>
            <Button variant="default" onClick={() => handleStatusChange("مكتمل")}>
              مكتمل
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}