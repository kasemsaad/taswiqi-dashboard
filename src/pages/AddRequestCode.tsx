import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  CreateRequest,
  GetAllCodes,
  GetReferralRequestById,
} from "@/services/userService";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup } from "@/components/ui/command";

const validationSchema = Yup.object().shape({
  discount_code_id: Yup.string().required("كود خصم مطلوب"),
});

const AddCodePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [codes, setCodeData] = useState<any[]>([]);
  const [requestData, setRequestData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const fetchRequestData = async (id: string) => {
    try {
      const response = await GetReferralRequestById(id);
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

  const fetchCodeList = async (search: string) => {
    try {
      const response = await GetAllCodes({
        searchTerm: search || undefined,
      });
      const CodeData = Array.isArray(response?.data) ? response.data : [];
      setCodeData(CodeData);
    } catch (error) {
      console.error("Error fetching CodeData:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب بيانات الروابط",
        variant: "destructive",
      });
      setCodeData([]);
    }
  };

  const formik = useFormik({
    initialValues: {
      type: "discount_code",
      referral_request_id: id,
      discount_code_id: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await CreateRequest(values);
        toast({
          title: "تم بنجاح",
          description: "تم إسناد كود خصم بنجاح",
          variant: "success",
        });
        navigate("/requests");
      } catch (error) {
        toast({
          title: "خطأ",
          description: "كود الخصم محجوز",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (id) {
      fetchRequestData(id);
    }
    fetchCodeList("");
  }, [id]);

  useEffect(() => {
    fetchCodeList(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  if (isLoading) {
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
          onClick={() => navigate("/requests")}
          className="gap-2"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          العوده طلبات المسوقين{" "}
        </Button>
        <h1 className="text-2xl font-bold">تفاصيل الطلب </h1>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>معلومات الطلب</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>النوع</Label>
                <Input
                  value={
                    requestData.type == "referral_link"
                      ? "رابط إحالة"
                      : "كود الخصم"
                  }
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label>الشركة</Label>
                <Input value={requestData.brand} disabled />
              </div>
              <div className="space-y-2">
                <Label>المستخدم</Label>
                <Input value={requestData.user} disabled />
              </div>
              <div className="space-y-2">
                <Label>تاريخ الإنشاء</Label>
                <Input value={requestData.created_at} disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>إسناد كود خصم</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discount_code_id">كود خصم *</Label>
                <Select
                  value={formik.values.discount_code_id}
                  onValueChange={(value) => {
                    formik.setFieldValue("discount_code_id", value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر كود خصم" />
                  </SelectTrigger>
                  <SelectContent>
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="ابحث عن كود..."
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                      />
                      <CommandList>
                        <CommandEmpty>لا توجد نتائج</CommandEmpty>
                        <CommandGroup>
                          {codes.map((code) => (
                            <SelectItem key={code.id} value={code.id}>
                              {code.code}
                            </SelectItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </SelectContent>
                </Select>
                {formik.touched.discount_code_id &&
                  formik.errors.discount_code_id && (
                    <div className="text-sm text-red-500">
                      {formik.errors.discount_code_id}
                    </div>
                  )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/requests")}
          >
            إلغاء
          </Button>
          <Button type="submit" className="gap-2" disabled={isSubmitting}>
            <Save className="w-4 h-4" />
            إسناد كود خصم
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddCodePage;