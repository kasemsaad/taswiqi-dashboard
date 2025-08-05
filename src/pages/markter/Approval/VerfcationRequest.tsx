import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  EditApproval,
  GetApprovalById,
} from "@/services/userService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const InfoRequestPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [requestData, setRequestData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reason, setReason] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchRequestData = async (id: string) => {
    try {
      const response = await GetApprovalById(id);
      setRequestData(response.data);
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

  const handleApprove = async (e) => {
      e.preventDefault(); // Add this

    try {
      const data = {
        new_status: "approved",
        _method: "put"
      };
      await EditApproval(requestData?.id, data);
      toast({
        title: "تم الموافقة علي الطلب",
        description: "بنجاح تم الموافقة على الطلب",
        variant: "success",
      });
      // Refresh the data after approval
      await fetchRequestData(requestData?.id);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الموافقة على الطلب",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (e) => {
      e.preventDefault(); // Add this

    if (!reason) {
      toast({
        title: "خطأ",
        description: "يجب إدخال سبب الرفض",
        variant: "destructive",
      });
      return;
    }

    try {
      const data = {
        new_status: "rejected",
        reason: reason,
        _method: "put"
      };
      await EditApproval(requestData?.id, data);
      toast({
        title: "تم رفض الطلب",
        description: "بنجاح تم رفض الطلب",
        variant: "destructive",
      });
      // Close the dialog and refresh the data
      setIsDialogOpen(false);
      await fetchRequestData(requestData?.id);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء رفض الطلب",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (id) {
      fetchRequestData(id);
    }
  }, [id]);

  if (isLoading) {
    return <div className="container mx-auto p-6">جاري التحميل...</div>;
  }

  if (!requestData) {
    return <div className="container mx-auto p-6">لا يوجد بيانات للطلب</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="md:flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/verification")}
          className="gap-2"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          العوده تحقق من الهوية{" "}
        </Button>
        <h1 className="text-2xl font-bold">تفاصيل تحقق من الهوية </h1>
      </div>

      <form className="space-y-6" >
        <Card>
          <CardHeader>
            <CardTitle>معلومات الطلب</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الرقم المرجعي</Label>
                <Input value={requestData.id} disabled />
              </div>
              <div className="space-y-2">
                <Label>أسم المسوّق</Label>
                <Input value={requestData.name_in_request || requestData.name} disabled />
              </div>  
              <div className="space-y-2">
                <Label>البلد</Label>
                <Input value={requestData.country} disabled />
              </div>
              <div className="space-y-2">
                <Label>البريد الإلكتروني</Label>
                <Input value={requestData.email} disabled />
              </div>
              <div className="space-y-2">
                <Label>الهاتف</Label>
                <Input value={`+${requestData.code} ${requestData.phone}`} disabled />
              </div>
              <div className="space-y-2">
                <Label>نوع الطلب</Label>
                <Input value={requestData.type === "id" ? "الهوية" : requestData.type} disabled />
              </div>
              <div className="space-y-2">
                <Label>تاريخ الطلب</Label>
                <Input value={requestData.created_at} disabled />
              </div>
              <div className="space-y-2">
                <Label>الحالة الحالية</Label>
                <Input
                  className={
                    requestData.status === "approved"
                      ? "status-active"
                      : requestData.status === "rejected"
                      ? "status-inactive"
                      : "status-pending"
                  }
                  value={
                    requestData.status === "approved"
                      ? "مقبول"
                      : requestData.status === "rejected"
                      ? "مرفوض"
                      : "قيد الانتظار"
                  }
                  disabled
                />
              </div>
              {requestData.front_image && (
                <div className="space-y-2">
                  <Label>صورة الهوية (الوجه الأمامي)</Label>
                  <img 
                    src={requestData.front_image} 
                    alt="Front ID" 
                    className="w-full h-auto rounded border"
                  />
                </div>
              )}
              {requestData.back_image && (
                <div className="space-y-2">
                  <Label>صورة الهوية (الوجه الخلفي)</Label>
                  <img 
                    src={requestData.back_image} 
                    alt="Back ID" 
                    className="w-full h-auto rounded border"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {requestData?.status === "pending" && (
          <div className="flex justify-end gap-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  رفض الطلب
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>سبب الرفض</DialogTitle>
                  <DialogDescription>
                    الرجاء إدخال سبب رفض هذا الطلب
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="reason">سبب الرفض</Label>
                    <Input
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="أدخل سبب الرفض"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    إلغاء
                  </Button>
                  <Button
                    className="bg-red-600 text-white hover:bg-red-700"
                    onClick={handleReject}
                  >
                    تأكيد الرفض
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              className="bg-green-600 gap-2 hover:bg-green-700"
              onClick={handleApprove}
            >
              <Save className="w-4 h-4" />
              الموافقة على الطلب
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default InfoRequestPage;