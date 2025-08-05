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
  GetAllBrandsnoMeta,
  GetcodeById,
  UpdateCode
} from "@/services/userService";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const validationSchema = Yup.object().shape({
  brand_id: Yup.string().required("الشركة مطلوبة"),
  earning_precentage: Yup.number()
    .min(1, "يجب أن تكون النسبة بين 1 و 100")
    .max(100, "يجب أن تكون النسبة بين 1 و 100")
    .required("نسبة الربح مطلوبة"),
  code: Yup.string().required("كود الخصم مطلوب"),
});

const EditReferralPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [brands, setBrands] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchBrands = async () => {
    try {
      const response = await GetAllBrandsnoMeta();
      const BrandData = Array.isArray(response?.data) ? response.data : [];
      setBrands(BrandData);
    } catch (error) {
      console.error("Error fetching brands:", error);
      setBrands([]);
    }
  };

  type ReferralLink = {
    id: string;
    earning_precentage:  string;
    code: string;
  };

  const fetchReferralLink = async (id: string) => {
    try {
      const response = await GetcodeById(id);
      const linkData = response.data as ReferralLink;
      formik.setValues({
        brand_id: linkData.id,
        earning_precentage: linkData.earning_precentage,
        code: linkData.code,
      });
      setIsEditMode(true);
    } catch (error) {
      console.error("Error fetching referral link:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      brand_id: "",
      earning_precentage: "",
      code: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        if (isEditMode && id) {
          // Edit existing link
          await UpdateCode(id, {
            ...values,
            _method: "put"
          });
        }
        toast({
          title: "تم التعديل بنجاح",
          description: "تم تعديل  كود الخصم بنجاح",
          variant: "success",
        });
        // navigate("/LinksCodes");
      } catch (error) {
        toast({
          title: "خطأ",
          description: isEditMode 
            ? "حدث خطأ أثناء تعديل رابط الإحالة"
            : "حدث خطأ أثناء إضافة رابط الإحالة",
          variant: "destructive",
        });
        console.error("Error submitting referral link:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    fetchBrands();
    if (id) {
      fetchReferralLink(id);
    }
  }, [id]);

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="md:flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/LinksCodes")}
          className="gap-2"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          العودة إلى  اكواد الخصم
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditMode ? "عرض وتعديل اكواد الخصم" : "إضافة رابط إحالة جديد"}
        </h1>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>معلومات اكواد الخصم</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
         

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand_id">الشركة *</Label>
                <Select
                
                  value={formik.values.brand_id}
                  onValueChange={(value) => {
                    formik.setFieldValue("brand_id", value);
                    formik.setFieldTouched("brand_id", true, false);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الشركة" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id.toString()}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.touched.brand_id && formik.errors.brand_id && (
                  <div className="text-sm text-red-500">
                    {formik.errors.brand_id}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="earning_precentage">نسبة الربح (%) *</Label>
                <Input
                  id="earning_precentage"
                  name="earning_precentage"
                  type="number"
                  min="1"
                  max="100"
                  value={formik.values.earning_precentage}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="15"
                />
                {formik.touched.earning_precentage &&
                  formik.errors.earning_precentage && (
                    <div className="text-sm text-red-500">
                      {formik.errors.earning_precentage}
                    </div>
                  )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">كود الخصم *</Label>
                <Input
                  id="code"
                  name="code"
                  value={formik.values.code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="123asa"
                />
                {formik.touched.code && formik.errors.code && (
                  <div className="text-sm text-red-500">
                    {formik.errors.code}
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
            onClick={() => navigate("/LinksCodes")}
          >
            إلغاء
          </Button>
          <Button type="submit" className="gap-2" disabled={isSubmitting}>
            <Save className="w-4 h-4" />
            {isEditMode ? "حفظ التعديلات" : "حفظ رابط الإحالة"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditReferralPage;