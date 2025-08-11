import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { useFormik } from "formik";
// import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
import { ArrowRight, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  // CreateRequest,
  GetWithdrawRequestsById,
  WithdrawStatus,
} from "@/services/userService";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import {
//   Command,
//   CommandInput,
//   CommandList,
//   CommandEmpty,
//   CommandGroup,
// } from "@/components/ui/command";

// const validationSchema = Yup.object().shape({
//   discount_code_id: Yup.string().required("كود خصم مطلوب"),
// });

const InfoRequestPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  // const [codes, setCodeData] = useState<any[]>([]);
  const [requestData, setRequestData] = useState<any>(null);
  // const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // const [searchTerm, setSearchTerm] = useState("");
  // const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  // useEffect(() => {
  //   const handler = setTimeout(() => {
  //     setDebouncedSearchTerm(searchTerm);
  //   }, 300);

  //   return () => {
  //     clearTimeout(handler);
  //   };
  // }, [searchTerm]);

  const fetchRequestData = async (id: string) => {
    try {
      const response = await GetWithdrawRequestsById(id);
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
          onClick={() => navigate("/requsetWithdrawal")}
          className="gap-2"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          العوده طلبات السحب{" "}
        </Button>
        <h1 className="text-2xl font-bold">تفاصيل طلب السحب </h1>
      </div>

      <form className="space-y-6">
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
                <Input value={requestData.customer} disabled />
              </div>
              <div className="space-y-2">
                <Label>المبلغ المطلوب</Label>
                <Input value={requestData.total + "Rs"} disabled />
              </div>
              <div className="space-y-2">
                <Label>وسيلة السحب</Label>
                <Input value={requestData.type} disabled />
              </div>
              <div className="space-y-2">
                <Label>تاريخ الطلب</Label>
                <Input value={requestData.created_at} disabled />
              </div>
              <div className="space-y-2">
                <Label>الحالة الحالية</Label>
                <Input
                  className={
                    requestData.status == "approved"
                      ? "status-active"
                      : requestData.status == "rejected"
                      ? "status-inactive"
                      : "status-pending"
                  }
                  value={requestData.status}
                  disabled
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* <Separator /> */}

        {requestData?.status == "pending" && (
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              className="bg-red-600 text-white"
              variant="outline"
              onClick={() => {
                WithdrawStatus(requestData?.id, "rejected"),
                  toast({
                    title: "تم رفض الطلب",
                    description: " بنجاح تم رفض الطلب",
                    variant: "destructive",
                  });

                setTimeout(() => {
                  navigate("/requsetWithdrawal");
                }, 1000);
              }}
            >
              رفضل الطلب{" "}
            </Button>
            <Button
              className="bg-green-600 gap-2"
              onClick={() => {
                WithdrawStatus(requestData?.id, "approved");
                toast({
                  title: "تم الموافقة علي الطلب",
                  description: " بنجاح تم الموافقة الطلب",
                  variant: "success",
                });
                navigate("/requsetWithdrawal");
                setTimeout(() => {
                }, 1000);
              }}
            >
              <Save className="w-4 h-4" />
              الموافقة على الطلب{" "}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default InfoRequestPage;
