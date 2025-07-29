import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Shield, CheckCircle, XCircle, Eye, FileText, CreditCard, User } from "lucide-react";
import { useState } from "react";

const verificationsData = [
  {
    id: 1,
    marketerName: "أحمد محمد العلي",
    marketerEmail: "ahmed.ali@example.com",
    idType: "هوية وطنية",
    idNumber: "1234567890",
    documentsSubmitted: ["الهوية الوطنية", "صورة شخصية", "إثبات العنوان"],
    submitDate: "2024-01-20",
    status: "قيد المراجعة",
    reviewedBy: null,
    notes: "وثائق واضحة ومقروءة"
  },
  {
    id: 2,
    marketerName: "فاطمة خالد السعد",
    marketerEmail: "fatima.saad@example.com",
    idType: "جواز سفر",
    idNumber: "A12345678",
    documentsSubmitted: ["جواز السفر", "صورة شخصية"],
    submitDate: "2024-01-19",
    status: "موثق",
    reviewedBy: "المراجع الرئيسي",
    notes: "تم التوثيق بنجاح"
  },
  {
    id: 3,
    marketerName: "عبدالله صالح القحطاني",
    marketerEmail: "abdullah.q@example.com",
    idType: "هوية وطنية",
    idNumber: "9876543210",
    documentsSubmitted: ["الهوية الوطنية", "صورة شخصية"],
    submitDate: "2024-01-18",
    status: "مرفوض",
    reviewedBy: "المراجع الثانوي",
    notes: "الصورة غير واضحة - يرجى إعادة الرفع"
  },
  {
    id: 4,
    marketerName: "نورا عبدالرحمن",
    marketerEmail: "nora.abd@example.com",
    idType: "هوية إقامة",
    idNumber: "2345678901",
    documentsSubmitted: ["هوية الإقامة", "صورة شخصية", "إثبات العنوان", "كشف حساب بنكي"],
    submitDate: "2024-01-17",
    status: "قيد المراجعة",
    reviewedBy: null,
    notes: "وثائق كاملة - في انتظار المراجعة"
  }
];

export default function VerificationPage() {
  const [selectedVerification, setSelectedVerification] = useState<typeof verificationsData[0] | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleViewVerification = (verification: typeof verificationsData[0]) => {
    setSelectedVerification(verification);
    setIsViewDialogOpen(true);
  };

  const handleApprove = () => {
    if (selectedVerification) {
      // Handle approve logic
      setIsViewDialogOpen(false);
    }
  };

  const handleReject = () => {
    if (selectedVerification) {
      // Handle reject logic
      setIsViewDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">التحقق من الهوية</h1>
          <p className="text-muted-foreground mt-1">مراجعة وتوثيق هويات المسوقين المسجلين</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="dashboard-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">287</div>
                <p className="text-muted-foreground text-sm">إجمالي الطلبات</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">23</div>
                <p className="text-muted-foreground text-sm">قيد المراجعة</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">248</div>
                <p className="text-muted-foreground text-sm">موثقة</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">16</div>
                <p className="text-muted-foreground text-sm">مرفوضة</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Requests Table */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>طلبات التحقق من الهوية ({verificationsData.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="rtl-table">
              <TableHeader>
                <TableRow>
                  <TableHead>المسوق</TableHead>
                  <TableHead>نوع الهوية</TableHead>
                  <TableHead>رقم الهوية</TableHead>
                  <TableHead>الوثائق المرفقة</TableHead>
                  <TableHead>تاريخ التقديم</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>المراجع</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {verificationsData.map((verification) => (
                  <TableRow key={verification.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{verification.marketerName}</div>
                        <div className="text-sm text-muted-foreground">{verification.marketerEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-primary" />
                        <span className="text-sm">{verification.idType}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{verification.idNumber}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {verification.documentsSubmitted.map((doc, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {doc}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{verification.submitDate}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        verification.status === "موثق" ? "status-active" :
                        verification.status === "مرفوض" ? "status-inactive" : "status-pending"
                      }>
                        {verification.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {verification.reviewedBy || "غير محدد"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewVerification(verification)}
                      >
                        <Eye className="h-4 w-4 ml-2" />
                        مراجعة
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Verification Review Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>مراجعة طلب التحقق من الهوية</DialogTitle>
            <DialogDescription>
              مراجعة الوثائق المقدمة واتخاذ قرار التوثيق
            </DialogDescription>
          </DialogHeader>
          {selectedVerification && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">الاسم الثلاثي</label>
                    <p className="text-lg font-bold text-foreground">{selectedVerification.marketerName}</p>
                    <label className="text-sm font-medium text-muted-foreground">اسم المستخدم</label>
                    <p className="text-base text-muted-foreground">@{selectedVerification.marketerEmail.split('@')[0]}</p>
                  </div>
                </div>
              </div>

              {/* Identity Documents */}
              <div>
                <label className="text-lg font-medium mb-4 block text-foreground">وثائق الهوية</label>
                {selectedVerification.idType === "جواز سفر" ? (
                  <div className="grid grid-cols-1 gap-4">
                     <div className="border border-border rounded-lg p-4">
                       <div className="flex items-center gap-3 mb-3">
                         <CreditCard className="h-5 w-5 text-primary" />
                         <span className="font-medium text-foreground">صورة الجواز</span>
                         <Badge variant="outline" className="text-xs">جواز سفر</Badge>
                       </div>
                       <div className="bg-muted/50 rounded-md h-64 flex items-center justify-center">
                         <img 
                           src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=250&fit=crop&crop=center" 
                           alt="صورة الجواز"
                           className="w-full h-full object-cover rounded-md"
                         />
                       </div>
                     </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                     <div className="border border-border rounded-lg p-4">
                       <div className="flex items-center gap-3 mb-3">
                         <CreditCard className="h-5 w-5 text-primary" />
                         <span className="font-medium text-foreground">بطاقة الهوية - الوجه الأمامي</span>
                         <Badge variant="outline" className="text-xs">بطاقة هوية</Badge>
                       </div>
                       <div className="bg-muted/50 rounded-md h-64 flex items-center justify-center">
                         <img 
                           src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop&crop=center" 
                           alt="الوجه الأمامي للهوية"
                           className="w-full h-full object-cover rounded-md"
                         />
                       </div>
                     </div>
                     <div className="border border-border rounded-lg p-4">
                       <div className="flex items-center gap-3 mb-3">
                         <CreditCard className="h-5 w-5 text-primary" />
                         <span className="font-medium text-foreground">بطاقة الهوية - الوجه الخلفي</span>
                         <Badge variant="outline" className="text-xs">بطاقة هوية</Badge>
                       </div>
                       <div className="bg-muted/50 rounded-md h-64 flex items-center justify-center">
                         <img 
                           src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop&crop=center" 
                           alt="الوجه الخلفي للهوية"
                           className="w-full h-full object-cover rounded-md"
                         />
                       </div>
                     </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              <XCircle className="h-4 w-4 ml-2" />
              رفض التوثيق
            </Button>
            <Button onClick={handleApprove}>
              <CheckCircle className="h-4 w-4 ml-2" />
              توثيق الحساب
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}