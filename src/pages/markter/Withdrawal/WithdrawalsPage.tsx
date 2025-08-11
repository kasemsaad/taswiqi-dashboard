import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Search, CheckCircle, XCircle, CreditCard, Building } from "lucide-react";

const withdrawalsData = [
  {
    id: 1001,
    marketerName: "أحمد محمد العلي",
    marketerEmail: "ahmed.ali@example.com",
    amount: "5,430 ريال",
    paymentMethod: "حوالة بنكية",
    bankDetails: "البنك الأهلي السعودي - رقم الحساب: 1234567890 - اسم المستفيد: أحمد محمد العلي",
    paypalAccount: "",
    requestDate: "2024-01-20",
    requestTime: "14:30",
    status: "قيد المراجعة",
    priority: "عادي",
    notes: "طلب سحب عادي",
    totalPreviousTransfers: "15,780 ريال",
    lastTransfers: [
      { amount: "3,200 ريال", operationNumber: "TXN-20231215-001", date: "2023-12-15", time: "10:20" },
      { amount: "2,100 ريال", operationNumber: "TXN-20231201-025", date: "2023-12-01", time: "16:45" }
    ]
  },
  {
    id: 1002,
    marketerName: "فاطمة خالد السعد",
    marketerEmail: "fatima.saad@example.com",
    amount: "3,280 ريال",
    paymentMethod: "باي بال",
    bankDetails: "",
    paypalAccount: "fatima.saad@paypal.com",
    requestDate: "2024-01-19",
    requestTime: "09:15",
    status: "تم التحويل",
    priority: "عادي",
    notes: "تم التحويل بنجاح",
    totalPreviousTransfers: "8,650 ريال",
    lastTransfers: [
      { amount: "2,890 ريال", operationNumber: "PP-20231220-045", date: "2023-12-20", time: "14:30" }
    ]
  },
  {
    id: 1003,
    marketerName: "عبدالله صالح القحطاني",
    marketerEmail: "abdullah.q@example.com",
    amount: "2,100 ريال",
    paymentMethod: "حوالة بنكية",
    bankDetails: "بنك الراجحي - رقم الحساب: 9876543210 - اسم المستفيد: عبدالله صالح القحطاني - رقم الآيبان: SA1234567890123456789012",
    paypalAccount: "",
    requestDate: "2024-01-18",
    requestTime: "11:45",
    status: "تم التحويل",
    priority: "عادي",
    notes: "تم التحويل للحساب البنكي",
    totalPreviousTransfers: "12,450 ريال",
    lastTransfers: [
      { amount: "4,200 ريال", operationNumber: "TXN-20231218-089", date: "2023-12-18", time: "13:15" },
      { amount: "1,950 ريال", operationNumber: "TXN-20231205-034", date: "2023-12-05", time: "09:30" }
    ]
  },
  {
    id: 1004,
    marketerName: "نورا عبدالرحمن",
    marketerEmail: "nora.abd@example.com",
    amount: "4,567 ريال",
    paymentMethod: "باي بال",
    bankDetails: "",
    paypalAccount: "nora.abdulrahman@paypal.com",
    requestDate: "2024-01-17",
    requestTime: "16:20",
    status: "مرفوض",
    priority: "عادي",
    notes: "معلومات الحساب غير صحيحة",
    totalPreviousTransfers: "6,890 ريال",
    lastTransfers: [
      { amount: "3,450 ريال", operationNumber: "PP-20231210-078", date: "2023-12-10", time: "11:20" }
    ]
  },
  {
    id: 1005,
    marketerName: "محمد أحمد الشهري",
    marketerEmail: "mohamed.shahri@example.com",
    amount: "1,890 ريال",
    paymentMethod: "حوالة بنكية",
    bankDetails: "بنك الرياض - رقم الحساب: 2345678901 - اسم المستفيد: محمد أحمد الشهري",
    paypalAccount: "",
    requestDate: "2024-01-16",
    requestTime: "13:10",
    status: "قيد المراجعة",
    priority: "عالي",
    notes: "طلب سحب عاجل",
    totalPreviousTransfers: "23,120 ريال",
    lastTransfers: [
      { amount: "5,670 ريال", operationNumber: "TXN-20231222-156", date: "2023-12-22", time: "15:45" },
      { amount: "3,200 ريال", operationNumber: "TXN-20231208-089", date: "2023-12-08", time: "10:15" },
      { amount: "2,890 ريال", operationNumber: "TXN-20231125-045", date: "2023-11-25", time: "14:30" }
    ]
  }
];

export default function WithdrawalsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<typeof withdrawalsData[0] | null>(null);
  const [isProcessDialogOpen, setIsProcessDialogOpen] = useState(false);

  const filteredWithdrawals = withdrawalsData.filter(withdrawal => {
    const matchesSearch = withdrawal.marketerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         withdrawal.marketerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || withdrawal.status === statusFilter;
    const matchesPaymentMethod = paymentMethodFilter === "all" || withdrawal.paymentMethod === paymentMethodFilter;
    return matchesSearch && matchesStatus && matchesPaymentMethod;
  });

  const handleProcessWithdrawal = (withdrawal: typeof withdrawalsData[0]) => {
    setSelectedWithdrawal(withdrawal);
    setIsProcessDialogOpen(true);
  };

  const handleStatusChange = (status: string) => {
    if (selectedWithdrawal) {
      // Handle status change logic
      setIsProcessDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">طلبات السحب</h1>
          <p className="text-muted-foreground mt-1">إدارة ومعالجة طلبات سحب أموال المسوقين</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="dashboard-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">156</div>
            <p className="text-muted-foreground text-sm">إجمالي الطلبات</p>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">23</div>
            <p className="text-muted-foreground text-sm">قيد المراجعة</p>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">8</div>
            <p className="text-muted-foreground text-sm">قيد التحويل</p>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">118</div>
            <p className="text-muted-foreground text-sm">مكتملة</p>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">7</div>
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
                  placeholder="البحث بالاسم أو البريد الإلكتروني..."
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
                <SelectItem value="قيد التحويل">قيد التحويل</SelectItem>
                <SelectItem value="مكتمل">مكتمل</SelectItem>
                <SelectItem value="مرفوض">مرفوض</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="طريقة الدفع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الطرق</SelectItem>
                <SelectItem value="حوالة بنكية">حوالة بنكية</SelectItem>
                <SelectItem value="باي بال">باي بال</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawals Table */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>طلبات السحب ({filteredWithdrawals.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="rtl-table">
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الطلب</TableHead>
                  <TableHead>المسوق</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>طريقة الدفع</TableHead>
                  <TableHead>التاريخ والوقت</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWithdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell>
                      <div className="font-bold text-primary">#{withdrawal.id}</div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{withdrawal.marketerName}</div>
                        <div className="text-sm text-muted-foreground">{withdrawal.marketerEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-primary text-lg">{withdrawal.amount}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {withdrawal.paymentMethod === "حوالة بنكية" ? (
                          <Building className="h-4 w-4 text-primary" />
                        ) : (
                          <CreditCard className="h-4 w-4 text-success" />
                        )}
                        <span className="text-sm">{withdrawal.paymentMethod}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{withdrawal.requestDate}</div>
                        <div className="text-muted-foreground">{withdrawal.requestTime}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        withdrawal.status === "تم التحويل" ? "status-active" :
                        withdrawal.status === "مرفوض" ? "status-inactive" : "status-pending"
                      }>
                        {withdrawal.status}
                      </Badge>
                      {withdrawal.priority === "عالي" && (
                        <Badge className="bg-red-100 text-red-800 text-xs mt-1">
                          عالي الأولوية
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleProcessWithdrawal(withdrawal)}
                      >
                        معالجة طلب السحب
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Process Withdrawal Dialog */}
      <Dialog open={isProcessDialogOpen} onOpenChange={setIsProcessDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>معالجة طلب السحب</DialogTitle>
            <DialogDescription>
              مراجعة تفاصيل طلب السحب واتخاذ الإجراء المناسب
            </DialogDescription>
          </DialogHeader>
          {selectedWithdrawal && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">رقم الطلب</label>
                  <p className="text-lg font-bold text-primary">#{selectedWithdrawal.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">اسم المسوق</label>
                  <p className="text-sm text-muted-foreground">{selectedWithdrawal.marketerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">البريد الإلكتروني</label>
                  <p className="text-sm text-muted-foreground">{selectedWithdrawal.marketerEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">المبلغ المطلوب</label>
                  <p className="text-xl font-bold text-primary">{selectedWithdrawal.amount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">طريقة الدفع</label>
                  <p className="text-sm text-muted-foreground">{selectedWithdrawal.paymentMethod}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">تاريخ ووقت الطلب</label>
                  <p className="text-sm text-muted-foreground">{selectedWithdrawal.requestDate} - {selectedWithdrawal.requestTime}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">تفاصيل الحساب</label>
                <div className="bg-muted/50 p-3 rounded-lg mt-2">
                  {selectedWithdrawal.paymentMethod === "حوالة بنكية" ? (
                    <p className="text-sm">{selectedWithdrawal.bankDetails}</p>
                  ) : (
                    <p className="text-sm">حساب PayPal: {selectedWithdrawal.paypalAccount}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">إجمالي المبالغ المحولة سابقاً</label>
                <p className="text-lg font-bold text-success mt-1">{selectedWithdrawal.totalPreviousTransfers}</p>
              </div>

              <div>
                <label className="text-sm font-medium">آخر عمليات التحويل</label>
                <div className="mt-2 space-y-2">
                  {selectedWithdrawal.lastTransfers.map((transfer, index) => (
                    <div key={index} className="bg-muted/30 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-primary">{transfer.amount}</p>
                          <p className="text-xs text-muted-foreground">رقم العملية: {transfer.operationNumber}</p>
                        </div>
                        <div className="text-left">
                          <p className="text-sm">{transfer.date}</p>
                          <p className="text-xs text-muted-foreground">{transfer.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">الملاحظات</label>
                <p className="text-sm text-muted-foreground mt-1">{selectedWithdrawal.notes}</p>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setIsProcessDialogOpen(false)}>
              إلغاء
            </Button>
            <Button variant="secondary" onClick={() => handleStatusChange('قيد المراجعة')}>
              قيد المراجعة
            </Button>
            <Button variant="default" onClick={() => handleStatusChange('تم التحويل')}>
              <CheckCircle className="h-4 w-4 ml-2" />
              تم التحويل
            </Button>
            <Button variant="destructive" onClick={() => handleStatusChange('مرفوض')}>
              <XCircle className="h-4 w-4 ml-2" />
              رفض الطلب
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}